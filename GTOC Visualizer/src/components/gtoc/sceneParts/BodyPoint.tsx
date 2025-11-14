"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Body } from "@/components/gtoc/utils/dataLoader";

import {
  JD_EPOCH_0,
  AU_KM,
  ALTAIRA_GM,
  SECONDS_PER_DAY,
} from "@/components/gtoc/utils/constants";

import { usePlanetStore } from "@/components/gtoc/stores/planetStore";

/* ================================================================
   Rotation matrix: perifocal frame (PQW) → inertial frame (IJK)
================================================================ */
function pqwToIJK(Ω: number, i: number, ω: number) {
  const cO = Math.cos(Ω), sO = Math.sin(Ω);
  const ci = Math.cos(i), si = Math.sin(i);
  const cw = Math.cos(ω), sw = Math.sin(ω);

  return new THREE.Matrix3().set(
    cO * cw - sO * sw * ci,
    -cO * sw - sO * cw * ci,
    sO * si,
    sO * cw + cO * sw * ci,
    -sO * sw + cO * cw * ci,
    -cO * si,
    sw * si,
    cw * si,
    ci
  );
}

/* ================================================================
   Kepler solver: solve E from M
================================================================ */
function solveE(M: number, e: number) {
  let E = M;
  for (let k = 0; k < 12; k++) {
    E = M + e * Math.sin(E);
  }
  return E;
}

/* ================================================================
   MAIN COMPONENT — Correct GTOC planetary propagation
================================================================ */
export default function BodyPoint({
  body,
  jd,
  showLabel = false,
}: {
  body: Body;
  jd: number;
  showLabel?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);

  /* ---------- Selected UI logic ---------- */
  const { selectedBodies } = usePlanetStore.getState();
  const idOrName = String(body.name && body.name !== "None" ? body.name : body.id);
  const isSelected = selectedBodies.includes(idOrName);

  const displayName =
    body.name && body.name !== "None" ? body.name : `#${body.id}`;

  /* ---------- Orbital elements ---------- */
  const e = Number.isFinite(body.e) ? body.e : 0;
  const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;

  // Convert a from AU → km for Kepler physics
  const a_km = a_AU * AU_KM;

  const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
  const i = Number.isFinite(body.inc) ? body.inc : 0;
  const ω = Number.isFinite(body.omega) ? body.omega : 0;

  // Mean anomaly M0 is defined at t = 0 (GTOC reference epoch)
  const M0 = Number.isFinite(body.M0) ? body.M0 : 0;

  const R = useMemo(() => pqwToIJK(Ω, i, ω), [Ω, i, ω]);

  /* ================================================================
     Precompute an entire orbit curve (AU)
  ================================================================ */
  const orbitGeom = useMemo(() => {
    if (e >= 1) return null;

    const segments = 256;
    const pts: THREE.Vector3[] = [];

    for (let k = 0; k <= segments; k++) {
      const M = (2 * Math.PI * k) / segments;
      const E = solveE(M, e);

      const r_km = a_km * (1 - e * Math.cos(E));
      const r_AU = r_km / AU_KM;

      const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
      const sinν =
        (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));

      const v = new THREE.Vector3(r_AU * cosν, r_AU * sinν, 0).applyMatrix3(R);
      pts.push(v);
    }

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [a_km, e, R]);

  /* ================================================================
     POSITION UPDATE — GTOC13 Accurate Propagation (AU)
  ================================================================ */
  useFrame(() => {
    if (!meshRef.current) return;

    // time (seconds) since GTOC epoch t = 0
    const t = (jd - JD_EPOCH_0) * SECONDS_PER_DAY;

    // mean motion n = sqrt(μ / a^3)  (rad/s)
    const n = Math.sqrt(ALTAIRA_GM / (a_km * a_km * a_km));

    // mean anomaly at time t
    const M = M0 + n * t;

    // solve Kepler
    const E = solveE(M, e);

    // distance in km
    const r_km = a_km * (1 - e * Math.cos(E));

    // convert to AU for rendering
    const r_AU = r_km / AU_KM;

    // true anomaly
    const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
    const sinν =
      (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));

    // inertial position
    const pos = new THREE.Vector3(r_AU * cosν, r_AU * sinν, 0).applyMatrix3(R);

    meshRef.current.position.copy(pos);
  });

  /* ---------- UI styling ---------- */
  const distance = camera.position.length();
  const opacity = Math.max(0.6, 1 - distance / 20);
  const bodyColor = body.color ?? "#ffffff";

  /* ================================================================ */
  /*                         RENDER                                     */
  /* ================================================================ */
  return (
    <>
      {/* Orbit path (shown on hover) */}
      {hovered && orbitGeom && (
        <primitive
          object={
            new THREE.Line(
              orbitGeom,
              new THREE.LineBasicMaterial({
                color: bodyColor,
                transparent: true,
                opacity: 0.7,
              })
            )
          }
          frustumCulled={false}
        />
      )}

      {/* Planet marker */}
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh frustumCulled={false}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial
            color={isSelected ? "#ffd500" : bodyColor}
            emissive={isSelected ? "#ffd500" : hovered ? bodyColor : "#000"}
            emissiveIntensity={isSelected ? 0.7 : hovered ? 0.4 : 0}
          />
        </mesh>

        {/* Always-visible label for selected bodies */}
        {(showLabel && body.type === "Planet") || isSelected ? (
          <Html center position={[0, 0.07, 0]} style={{ pointerEvents: "none" }}>
            <div
              className="rounded-md font-semibold select-none"
              style={{
                padding: "3px 6px",
                fontSize: isSelected ? "18px" : "11px",
                color: isSelected ? bodyColor : "#eee",
                background: isSelected
                  ? "rgba(0,0,0,0.45)"
                  : "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                textShadow: `0 0 10px ${bodyColor}88`,
                backdropFilter: "blur(6px)",
                opacity,
              }}
            >
              {displayName}
            </div>
          </Html>
        ) : null}

        {/* Hover info popup */}
        {hovered && (
          <Html center position={[0, 0.1, 0]}>
            <div
              className="p-2 rounded-lg text-[11px] leading-tight text-white 
                         backdrop-blur-md bg-black/60 border border-white/10 
                         shadow-lg whitespace-nowrap select-none"
            >
              <div className="font-semibold text-[#ffd500]">
                {displayName}
              </div>
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
        )}
      </group>
    </>
  );
}
