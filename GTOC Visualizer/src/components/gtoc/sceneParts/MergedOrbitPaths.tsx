"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { type Body } from "@/components/gtoc/utils/dataLoader";
import { AU_KM, TYPE_COLORS } from "@/components/gtoc/utils/constants";

const SEGMENTS = 256;

/**
 * Computes orbit points for a single body (pure function, no React).
 * Returns null if the orbit is invalid (e.g. hyperbolic, degenerate).
 */
function computeOrbitPoints(body: Body, segments: number): Float32Array | null {
    const a = body.a_AU;
    const e = body.e;
    if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(e) || e >= 1) return null;

    const a_km = a * AU_KM;

    const cO = Math.cos(body.Omega),
        sO = Math.sin(body.Omega),
        ci = Math.cos(body.inc),
        si = Math.sin(body.inc),
        co = Math.cos(body.omega),
        so = Math.sin(body.omega);

    const R11 = cO * co - sO * so * ci;
    const R12 = -cO * so - sO * co * ci;
    const R21 = sO * co + cO * so * ci;
    const R22 = -sO * so + cO * co * ci;
    const R31 = so * si;
    const R32 = co * si;

    // +1 to close the loop
    const out = new Float32Array((segments + 1) * 3);
    let valid = 0;

    for (let k = 0; k <= segments; k++) {
        const f = (2 * Math.PI * k) / segments;
        const denom = 1 + e * Math.cos(f);
        if (Math.abs(denom) < 1e-9) continue;

        const r_km = (a_km * (1 - e ** 2)) / denom;
        const x_peri = r_km * Math.cos(f);
        const y_peri = r_km * Math.sin(f);

        const x = (R11 * x_peri + R12 * y_peri) / AU_KM;
        const y = (R21 * x_peri + R22 * y_peri) / AU_KM;
        const z = (R31 * x_peri + R32 * y_peri) / AU_KM;

        if (Number.isFinite(x + y + z)) {
            out[valid * 3] = x;
            out[valid * 3 + 1] = y;
            out[valid * 3 + 2] = z;
            valid++;
        }
    }

    return valid >= 2 ? out.slice(0, valid * 3) : null;
}

/**
 * Renders ALL visible orbit paths as a single LineSegments draw call.
 * Uses vertex colors for per-orbit coloring.
 */
export default function MergedOrbitPaths({
    bodies,
    selectedBodies,
    showOrbits,
    colorMap,
}: {
    bodies: Body[];
    selectedBodies: string[];
    showOrbits: boolean;
    colorMap: Map<string, string>;
}) {
    const groupRef = useRef<THREE.Group>(null!);

    const selectedSet = useMemo(() => new Set(selectedBodies), [selectedBodies]);

    // Determine which bodies should have orbits visible
    const visibleBodies = useMemo(() => {
        if (!showOrbits) return [];
        return bodies.filter((b) => {
            const idKey = String(b.name && b.name !== "None" ? b.name : b.id);
            return b.type === "Planet" || selectedSet.has(idKey);
        });
    }, [bodies, showOrbits, selectedSet]);

    // Build merged geometry
    const geometry = useMemo(() => {
        if (visibleBodies.length === 0) return null;

        // Pre-compute all orbits
        const orbits: { points: Float32Array; color: THREE.Color; lineWidth: number }[] = [];

        for (const b of visibleBodies) {
            const pts = computeOrbitPoints(b, SEGMENTS);
            if (!pts) continue;

            const idKey = String(b.id);
            const isSelected = selectedSet.has(String(b.name && b.name !== "None" ? b.name : b.id));
            const activeColor = colorMap.get(idKey) ?? b.color ?? TYPE_COLORS[b.type] ?? "#ffffff";
            const color = new THREE.Color(activeColor);

            orbits.push({ points: pts, color, lineWidth: isSelected ? 2.5 : 1 });
        }

        if (orbits.length === 0) return null;

        // Convert closed polylines to line-segment pairs for LineSegments
        // Each orbit of N vertices → (N-1) line segments → (N-1)*2 vertices
        let totalVertices = 0;
        for (const o of orbits) {
            const nPts = o.points.length / 3;
            totalVertices += (nPts - 1) * 2;
        }

        const positions = new Float32Array(totalVertices * 3);
        const colors = new Float32Array(totalVertices * 3);
        let offset = 0;

        for (const o of orbits) {
            const nPts = o.points.length / 3;
            const r = o.color.r, g = o.color.g, b = o.color.b;

            for (let k = 0; k < nPts - 1; k++) {
                const i0 = k * 3;
                const i1 = (k + 1) * 3;

                // Start vertex
                positions[offset * 3] = o.points[i0];
                positions[offset * 3 + 1] = o.points[i0 + 1];
                positions[offset * 3 + 2] = o.points[i0 + 2];
                colors[offset * 3] = r;
                colors[offset * 3 + 1] = g;
                colors[offset * 3 + 2] = b;
                offset++;

                // End vertex
                positions[offset * 3] = o.points[i1];
                positions[offset * 3 + 1] = o.points[i1 + 1];
                positions[offset * 3 + 2] = o.points[i1 + 2];
                colors[offset * 3] = r;
                colors[offset * 3 + 1] = g;
                colors[offset * 3 + 2] = b;
                offset++;
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [visibleBodies, colorMap, selectedSet]);

    if (!geometry) return null;

    return (
        <group ref={groupRef}>
            <lineSegments geometry={geometry} frustumCulled={false}>
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={0.7}
                    depthWrite={false}
                    toneMapped={false}
                />
            </lineSegments>
        </group>
    );
}
