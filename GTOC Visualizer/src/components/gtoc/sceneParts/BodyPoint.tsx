"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Body } from "@/components/gtoc/utils/dataLoader";
import { JD_EPOCH_0 } from "@/components/gtoc/utils/constants";

/**
 * Builds rotation matrix from perifocal (PQW) to inertial coordinates given Ω, i, ω [rad].
 * R = Rz(Ω) * Rx(i) * Rz(ω)
 */
function pqwToIJK(Ω: number, i: number, ω: number) {
  const cO = Math.cos(Ω),
    sO = Math.sin(Ω);
  const ci = Math.cos(i),
    si = Math.sin(i);
  const cw = Math.cos(ω),
    sw = Math.sin(ω);

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

/**
 * Solves Kepler’s equation M = E − e·sinE for 0 ≤ e < 1 using fixed-point iteration.
 */
function solveE(M: number, e: number) {
  const Mp = Math.atan2(Math.sin(M), Math.cos(M));
  let E = Mp;
  for (let k = 0; k < 8; k++) E = Mp + e * Math.sin(E);
  return E;
}

/**
 * Renders a single celestial body with live orbital propagation and optional label.
 * Shows hover info and highlights orbit when selected.
 */
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
  const [isHovered, setHovered] = useState(false);

  const displayName = body.name && body.name !== "None" ? body.name : `#${body.id}`;

  const e = Number.isFinite(body.e) ? body.e : 0;
  const a_AU = Number.isFinite(body.a_AU) ? Math.max(1e-6, body.a_AU) : 1;
  const Ω = Number.isFinite(body.Omega) ? body.Omega : 0;
  const i = Number.isFinite(body.inc) ? body.inc : 0;
  const ω = Number.isFinite(body.omega) ? body.omega : 0;
  const M0 = Number.isFinite(body.M0) ? body.M0 : 0;
  const epochJD = Number.isFinite((body as any).epoch_JD) ? (body as any).epoch_JD : JD_EPOCH_0;

  const R = useMemo(() => pqwToIJK(Ω, i, ω), [Ω, i, ω]);

  const orbitGeom = useMemo(() => {
    if (e >= 1) return null;
    const segments = 256;
    const pts: THREE.Vector3[] = [];

    for (let k = 0; k <= segments; k++) {
      const M = (2 * Math.PI * k) / segments;
      const E = solveE(M, e);
      const r = a_AU * (1 - e * Math.cos(E));
      const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
      const sinν = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
      const x_p = r * cosν;
      const y_p = r * sinν;
      const v = new THREE.Vector3(x_p, y_p, 0).applyMatrix3(R);
      pts.push(v);
    }

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [a_AU, e, R]);

  useFrame(() => {
    if (!meshRef.current) return;
    const n = (2 * Math.PI) / (Math.sqrt(a_AU ** 3) * 365.25); // mean motion [rad/day]
    const M = M0 + n * (jd - epochJD);
    const E = solveE(M, e);

    const r = a_AU * (1 - e * Math.cos(E));
    const cosν = (Math.cos(E) - e) / (1 - e * Math.cos(E));
    const sinν = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
    const x_p = r * cosν;
    const y_p = r * sinν;
    const pos = new THREE.Vector3(x_p, y_p, 0).applyMatrix3(R);
    meshRef.current.position.copy(pos);
  });

  const distance = camera.position.length();
  const opacity = Math.max(0, 1 - distance / 15);

  return (
    <>
      {isHovered && orbitGeom && (
        <primitive
          object={new THREE.Line(
            orbitGeom,
            new THREE.LineBasicMaterial({
              color: body.color ?? "#ffffff",
              transparent: true,
              opacity: 0.7,
            })
          )}
          frustumCulled={false}
        />
      )}

      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh frustumCulled={false}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial
            color={isHovered ? "#ffd500" : body.color ?? "#ffffff"}
            emissive={isHovered ? "#ffd500" : "#000000"}
            emissiveIntensity={isHovered ? 0.4 : 0}
          />
        </mesh>

        {showLabel && body.type === "Planet" && (
          <Html center position={[0, 0.05, 0]} style={{ pointerEvents: "none" }}>
            <div
              className="px-2 py-1 rounded-lg text-[11px] text-white/90 font-medium
                         backdrop-blur-md bg-black/40 border border-white/10 shadow-md
                         whitespace-nowrap select-none"
              style={{ opacity }}
            >
              {displayName}
            </div>
          </Html>
        )}

        {isHovered && (
          <Html center position={[0, 0.08, 0]}>
            <div
              className="p-2 rounded-lg text-[11px] leading-tight text-white backdrop-blur-md 
                        bg-black/60 border border-white/10 shadow-lg whitespace-nowrap select-none"
            >
              <div className="font-semibold text-[#ffd500]">{displayName}</div>
              <div className="text-gray-300">{body.type}</div>
              <div className="mt-1 text-[10px] text-gray-400">
                a={a_AU.toFixed(3)} AU<br />
                e={e.toFixed(3)}<br />
                i={( (i * 180) / Math.PI ).toFixed(2)}°<br />
                Ω={( (Ω * 180) / Math.PI ).toFixed(2)}°<br />
                ω={( (ω * 180) / Math.PI ).toFixed(2)}°<br />
                M₀={( (M0 * 180) / Math.PI ).toFixed(2)}°
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}
