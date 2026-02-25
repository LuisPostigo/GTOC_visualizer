"use client";

import React, { useRef, useMemo, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Body } from "@/components/gtoc/utils/dataLoader";
import { keplerToPositionAU } from "@/components/gtoc/KeplerSolver";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";

/* ---------- reusable scratch objects (module-level, never GC'd) ---------- */
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _color = new THREE.Color();
const _scale = new THREE.Vector3(1, 1, 1);
const _quat = new THREE.Quaternion();

/* ---------- Body tooltip (rendered only for hovered/pinned body) ---------- */
function BodyTooltip({
    body,
    position,
    pinned,
    onTogglePin,
    onCenter,
    onPointerEnter,
    onPointerLeave,
}: {
    body: Body;
    position: THREE.Vector3;
    pinned: boolean;
    onTogglePin: () => void;
    onCenter: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
}) {
    const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;
    const bodyColor = body.color ?? "#ffffff";
    const { camera } = useThree();
    const distance = camera.position.length();
    const opacity = Math.max(0.6, 1 - distance / 20);

    const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;
    const e = Number.isFinite(body.e) ? body.e : 0;
    const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
    const i = Number.isFinite(body.inc) ? body.inc : 0;
    const ω = Number.isFinite(body.omega) ? body.omega : 0;
    const M0 = Number.isFinite(body.M0) ? body.M0 : 0;

    return (
        <Html position={position.clone().add(new THREE.Vector3(0, 0.025, 0))} style={{ pointerEvents: "none" }}>
            <div
                onMouseEnter={onPointerEnter}
                onMouseLeave={onPointerLeave}
                className="pointer-events-auto relative p-2 rounded-lg text-[11px] leading-tight text-white backdrop-blur-md bg-black/80 border border-white/20 shadow-lg whitespace-nowrap select-none group"
                style={{ minWidth: "120px", transform: "translate(-50%, -100%)", marginTop: "-10px" }}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                    className={`absolute top-1 right-1 p-1 rounded-md transition-colors ${pinned ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10"}`}
                    title={pinned ? "Unpin" : "Pin"}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z" />
                        <circle cx="9" cy="9" r="2" />
                    </svg>
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onCenter(); }}
                    className="absolute top-1 right-6 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Set as Center"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                </button>

                <div className="font-semibold text-[#ffd500] pr-6">{displayName}</div>
                <div className="text-gray-300">{body.type}</div>

                <div className="mt-1 text-[10px] text-gray-400">
                    a={a_AU.toFixed(3)} AU<br />
                    e={e.toFixed(3)}<br />
                    i={((i * 180) / Math.PI).toFixed(2)}°<br />
                    Ω={((Ω * 180) / Math.PI).toFixed(2)}°<br />
                    ω={((ω * 180) / Math.PI).toFixed(2)}°<br />
                    M₀={((M0 * 180) / Math.PI).toFixed(2)}°
                </div>
            </div>
        </Html>
    );
}

/* ---------- Small label (planet name / selected body label) ---------- */
function BodyLabel({
    body,
    position,
    isSelected,
}: {
    body: Body;
    position: THREE.Vector3;
    isSelected: boolean;
}) {
    const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;
    const bodyColor = body.color ?? "#ffffff";
    const { camera } = useThree();
    const distance = camera.position.length();
    const opacity = Math.max(0.6, 1 - distance / 20);

    return (
        <Html center position={position.clone().add(new THREE.Vector3(0, 0.07, 0))} style={{ pointerEvents: "none" }}>
            <div
                className="rounded-md font-semibold select-none"
                style={{
                    padding: "3px 6px",
                    fontSize: isSelected ? "18px" : "11px",
                    color: isSelected ? bodyColor : "#eee",
                    background: isSelected ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    textShadow: `0 0 10px ${bodyColor}88`,
                    backdropFilter: "blur(6px)",
                    opacity,
                }}
            >
                {displayName}
            </div>
        </Html>
    );
}

/* ========================================================================== */
/*  Main component: renders ALL bodies as a single InstancedMesh              */
/* ========================================================================== */

export default function InstancedBodies({
    bodies,
    jd,
}: {
    bodies: Body[];
    jd: number;
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const { raycaster, camera, pointer } = useThree();

    const selectedBodies = usePlanetStore((s) => s.selectedBodies);
    const setCenterBody = usePlanetStore((s) => s.setCenterBody);
    const setHoveredContext = usePlanetStore((s) => s.setHoveredContext);

    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [pinnedIdx, setPinnedIdx] = useState<number | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Per-body position cache (updated every frame in useFrame)
    const positionsRef = useRef<Float32Array>(new Float32Array(0));

    // Keep positions buffer sized correctly
    useEffect(() => {
        if (bodies.length * 3 !== positionsRef.current.length) {
            positionsRef.current = new Float32Array(bodies.length * 3);
        }
    }, [bodies.length]);

    // Body index → selection set (for O(1) lookup)
    const selectedSet = useMemo(() => {
        const set = new Set<string>();
        for (const id of selectedBodies) set.add(id);
        return set;
    }, [selectedBodies]);

    // Set per-instance colors once (or when bodies/colors change)
    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh || bodies.length === 0) return;

        for (let i = 0; i < bodies.length; i++) {
            const b = bodies[i];
            const idKey = String(b.id);
            const isSelected = selectedSet.has(idKey) || selectedSet.has(b.name);
            _color.set(b.color ?? "#ffffff");

            // Emissive-like boost for selected
            if (isSelected) {
                _color.lerp(new THREE.Color("#ffd500"), 0.4);
            }

            mesh.setColorAt(i, _color);
        }

        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [bodies, selectedSet]);

    // Main per-frame loop: update all instance matrices from Kepler
    useFrame(() => {
        const mesh = meshRef.current;
        if (!mesh || bodies.length === 0) return;

        const positions = positionsRef.current;

        for (let i = 0; i < bodies.length; i++) {
            keplerToPositionAU(bodies[i], jd, _pos);

            // Store position for tooltip/label lookups
            positions[i * 3] = _pos.x;
            positions[i * 3 + 1] = _pos.y;
            positions[i * 3 + 2] = _pos.z;

            _mat4.compose(_pos, _quat, _scale);
            mesh.setMatrixAt(i, _mat4);
        }

        mesh.instanceMatrix.needsUpdate = true;
    });

    const togglePlanet = usePlanetStore((s) => s.togglePlanet);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Click handler
    const handleClick = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            const idx = e.instanceId;
            if (idx == null || idx >= bodies.length) return;

            const b = bodies[idx];

            if (clickTimeoutRef.current) {
                // Double click detected
                clearTimeout(clickTimeoutRef.current);
                clickTimeoutRef.current = null;

                // Double click action: Center camera and ensure selected/pinned
                setCenterBody(b.id);
                setPinnedIdx(idx);
                // Ensure orbit is visible (force select if not already)
                if (!selectedBodies.includes(String(b.id)) && !selectedBodies.includes(b.name)) {
                    togglePlanet(b.id);
                }
            } else {
                // First click - wait for potential second click
                clickTimeoutRef.current = setTimeout(() => {
                    clickTimeoutRef.current = null;

                    // Single click action: Toggle selection and pin
                    togglePlanet(b.id);

                    if (pinnedIdx === idx) {
                        setPinnedIdx(null);
                    } else {
                        setPinnedIdx(idx);
                    }
                }, 250);
            }
        },
        [bodies, pinnedIdx, setCenterBody, togglePlanet, selectedBodies]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        };
    }, []);

    const handlePointerOver = useCallback(
        (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            const idx = e.instanceId;
            if (idx == null || idx >= bodies.length) return;

            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }

            setHoveredIdx(idx);
            const b = bodies[idx];
            setHoveredContext({
                id: String(b.id),
                name: b.name || `Body ${b.id}`,
                type: "planet",
            });
        },
        [bodies, setHoveredContext]
    );

    const handlePointerOut = useCallback(
        (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (pinnedIdx != null) return;
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredIdx(null);
                setHoveredContext(null);
            }, 2000);
        },
        [pinnedIdx, setHoveredContext]
    );

    // Helper to get current position for a body index
    const getBodyPos = useCallback(
        (idx: number) => {
            const p = positionsRef.current;
            return new THREE.Vector3(p[idx * 3], p[idx * 3 + 1], p[idx * 3 + 2]);
        },
        []
    );

    // Determine which bodies need tooltips (hovered, pinned, OR selected)
    const tooltipIndices = useMemo(() => {
        const indices = new Set<number>();
        if (hoveredIdx != null) indices.add(hoveredIdx);
        if (pinnedIdx != null) indices.add(pinnedIdx);

        // Add all selected bodies
        for (let i = 0; i < bodies.length; i++) {
            const b = bodies[i];
            const idKey = String(b.id);
            if (selectedSet.has(idKey) || selectedSet.has(b.name)) {
                indices.add(i);
            }
        }
        return Array.from(indices);
    }, [hoveredIdx, pinnedIdx, bodies, selectedSet]);

    // Determine which bodies need name labels (planets, but NOT the ones showing tooltip)
    const labelIndices = useMemo(() => {
        const out: number[] = [];
        const tooltipSet = new Set(tooltipIndices);

        for (let i = 0; i < bodies.length; i++) {
            if (tooltipSet.has(i)) continue; // Skip if showing full tooltip

            const b = bodies[i];
            const showLabel = b.type === "Planet";
            if (showLabel) out.push(i);
        }
        return out;
    }, [bodies, tooltipIndices]);

    return (
        <>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, bodies.length]}
                frustumCulled={false}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <sphereGeometry args={[0.015, 12, 12]} />
                <meshBasicMaterial
                    color="#ffffff"
                    toneMapped={false}
                />
            </instancedMesh>

            {/* Tooltips for hovered/pinned/selected bodies */}
            {tooltipIndices.map((idx) => (
                <BodyTooltip
                    key={`tooltip-${bodies[idx].id}`}
                    body={bodies[idx]}
                    position={getBodyPos(idx)}
                    pinned={pinnedIdx === idx || selectedSet.has(String(bodies[idx].id)) || selectedSet.has(bodies[idx].name)}
                    onTogglePin={() => {
                        // Check if currently selected or pinned
                        const isPinned = pinnedIdx === idx;
                        const isSelected = selectedSet.has(String(bodies[idx].id)) || selectedSet.has(bodies[idx].name);

                        // Toggle: If active (pinned/selected) -> Deactivate (Unselect/Unpin)
                        //         If inactive -> Activate (Select/Pin)
                        if (isPinned || isSelected) {
                            if (isPinned) setPinnedIdx(null);
                            if (isSelected) togglePlanet(bodies[idx].id);
                        } else {
                            togglePlanet(bodies[idx].id);
                            // Optionally set pinnedIdx too if desired, but selection is enough to show box
                            setPinnedIdx(idx);
                            setCenterBody(bodies[idx].id);
                        }
                    }}
                    onCenter={() => setCenterBody(bodies[idx].id)}
                    onPointerEnter={() => {
                        if (hoverTimeoutRef.current) {
                            clearTimeout(hoverTimeoutRef.current);
                            hoverTimeoutRef.current = null;
                        }
                    }}
                    onPointerLeave={() => {
                        if (pinnedIdx != null) return;
                        hoverTimeoutRef.current = setTimeout(() => {
                            setHoveredIdx(null);
                            setHoveredContext(null);
                        }, 2000);
                    }}
                />
            ))}

            {/* Name labels for planets (excluding those with tooltips) */}
            {labelIndices.map((idx) => (
                <BodyLabel
                    key={bodies[idx].id}
                    body={bodies[idx]}
                    position={getBodyPos(idx)}
                    isSelected={false} // Never selected here, as selected ones get tooltips
                />
            ))}

        </>
    );
}
