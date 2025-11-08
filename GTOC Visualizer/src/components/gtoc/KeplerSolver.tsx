"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";
import {
  TYPE_COLORS,
  AU_KM,
  SECONDS_PER_DAY,
  ALTAIRA_GM,
} from "@/components/gtoc/utils/constants";

/* ======================= Types ======================= */
export type BodyType = "Planet" | "Asteroid" | "Comet";

export interface Body {
  id: string;
  name: string;
  type: BodyType;
  a_AU: number;
  e: number;
  inc: number;
  Omega: number;
  omega: number;
  M0: number;
  epoch_JD: number;
  color?: string;
}

/* ======================= Kepler Solver ======================= */
export function solveKepler(M: number, e: number, tol = 1e-10, maxIter = 50): number {
  if (e < 1) {
    let E = M;
    for (let k = 0; k < maxIter; k++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const d = f / fp;
      E -= d;
      if (Math.abs(d) < tol) break;
    }
    return E;
  }

  if (e === 1) return M;

  let H = Math.log((2 * Math.abs(M)) / e + 1.8);
  for (let k = 0; k < maxIter; k++) {
    const sH = Math.sinh(H);
    const cH = Math.cosh(H);
    const f = e * sH - H - M;
    const fp = e * cH - 1;
    const d = f / fp;
    H -= d;
    if (Math.abs(d) < tol) break;
  }
  return H;
}

/** Computes heliocentric position in AU from orbital elements and Julian date. */
export function keplerToPositionAU(body: Body, jd: number): THREE.Vector3 {
  const { a_AU, e, inc, Omega, omega, M0, epoch_JD } = body;
  const a_km = a_AU * AU_KM;
  const n = Math.sqrt(ALTAIRA_GM / (a_km ** 3));
  const dt_s = (jd - epoch_JD) * SECONDS_PER_DAY;

  let M = M0 + n * dt_s;
  if (e < 1) M = ((M + Math.PI) % (2 * Math.PI)) - Math.PI;

  const EorH = solveKepler(M, e);
  let r_km: number, f_true: number;

  if (e < 1) {
    const E = EorH;
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const denom = 1 - e * cosE;
    r_km = a_km * denom;
    const cosf = (cosE - e) / denom;
    const sinf = (Math.sqrt(1 - e ** 2) * sinE) / denom;
    f_true = Math.atan2(sinf, cosf);
  } else {
    const H = EorH;
    const coshH = Math.cosh(H);
    const sinhH = Math.sinh(H);
    const denom = e * coshH - 1;
    r_km = a_km * denom;
    const cosf = (e - coshH) / denom;
    const sinf = (Math.sqrt(e ** 2 - 1) * sinhH) / denom;
    f_true = Math.atan2(sinf, cosf);
  }

  const cO = Math.cos(Omega),
    sO = Math.sin(Omega),
    ci = Math.cos(inc),
    si = Math.sin(inc),
    co = Math.cos(omega),
    so = Math.sin(omega);

  const R11 = cO * co - sO * so * ci;
  const R12 = -cO * so - sO * co * ci;
  const R21 = sO * co + cO * so * ci;
  const R22 = -sO * so + cO * co * ci;
  const R31 = so * si;
  const R32 = co * si;

  const x_peri = r_km * Math.cos(f_true);
  const y_peri = r_km * Math.sin(f_true);

  const x = (R11 * x_peri + R12 * y_peri) / AU_KM;
  const y = (R21 * x_peri + R22 * y_peri) / AU_KM;
  const z = (R31 * x_peri + R32 * y_peri) / AU_KM;

  return new THREE.Vector3(x, y, z);
}

/* ======================= Scene Components ======================= */
export function OrbitPath({
  body,
  visible = true,
  segments = 256,
  color,
  isSelected = false,
}: {
  body: Body;
  visible?: boolean;
  segments?: number;
  color?: string;
  isSelected?: boolean;
}) {
  if (!visible) return null;

  const points = useMemo(() => {
    const a = body.a_AU;
    const e = body.e;
    if (!Number.isFinite(a) || a <= 0 || !Number.isFinite(e) || e >= 1) return [];

    const pts: THREE.Vector3[] = [];
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
      if (Number.isFinite(x + y + z)) pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [body, segments]);

  if (!points.length) return null;

  const lineWidth = isSelected ? 2.5 : 1;
  const opacity = isSelected ? 1.0 : 0.7;
  const finalColor = isSelected ? "#ffd500" : color ?? TYPE_COLORS[body.type];

  return (
    <Line
      points={points}
      lineWidth={lineWidth}
      color={finalColor}
      opacity={opacity}
      transparent
      depthWrite={false}
      toneMapped={false}
      frustumCulled={false}
    />
  );
}

/* ======================= BodyPoint (with big label for selected) ======================= */
export function BodyPoint({ body, jd }: { body: Body; jd: number }) {
  const dotRef = useRef<THREE.Mesh>(null!);
  const hitRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const color = new THREE.Color(body.color ?? TYPE_COLORS[body.type]);
  const { selectedBodies } = usePlanetStore.getState();
  const idOrName = String(body.name && body.name !== "None" ? body.name : body.id);
  const isSelected = selectedBodies.includes(idOrName);

  useFrame(() => {
    const r = keplerToPositionAU(body, jd);
    dotRef.current.position.copy(r);
    hitRef.current.position.copy(r);
  });

  const displayName = body.name && body.name !== "None" ? body.name : body.id;

  return (
    <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh ref={hitRef}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={dotRef} scale={isSelected ? 1.8 : hovered ? 1.3 : 1.0}>
        <sphereGeometry args={[0.01, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {(hovered || isSelected) && (
        <Html
          position={[0, 0.05, 0]}
          center
          sprite
          distanceFactor={10}
          style={{ pointerEvents: "none", transform: "translate(-50%, -140%)" }}
        >
          <div
            className={`font-semibold ${
              isSelected ? "text-white" : "text-gray-300"
            }`}
            style={{
              fontSize: isSelected ? "18px" : "11px",
              letterSpacing: "0.5px",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              opacity: isSelected ? 1.0 : 0.75,
              transition: "all 0.25s ease",
            }}
          >
            {displayName}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ======================= Miscellaneous Components ======================= */
export function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="#ffcc66" />
    </mesh>
  );
}

export function Axes({ size = 1.0 }: { size?: number }) {
  return (
    <group>
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(size, 0, 0)]} color="#ff5555" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, size, 0)]} color="#55ff55" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, size)]} color="#5555ff" lineWidth={1} />
    </group>
  );
}

export function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 3.5);
  }, [camera]);
  return null;
}
