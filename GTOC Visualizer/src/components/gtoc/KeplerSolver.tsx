"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
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

export interface CandidateLOD {
  level: 1 | 2 | 3;
  path: [number, number, number][];
}

export interface CandidateEvent {
  tJD: number;
  label: string;
  bodyId: string;
  vinf_kms?: number;
  alt_km?: number;
}

export interface Candidate {
  id: string;
  name: string;
  lods: CandidateLOD[];
  events: CandidateEvent[];
  color?: string;
}

/* ======================= Kepler Solver ======================= */
/** Solves Kepler’s equation for elliptic, parabolic, and hyperbolic orbits. */
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

  if (e === 1) return M; // Parabolic fallback

  // Hyperbolic
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
/** Draws a static orbital path for an elliptic body. */
export function OrbitPath({
  body,
  visible = true,
  segments = 256,
  color,
}: {
  body: Body;
  visible?: boolean;
  segments?: number;
  color?: string;
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

  return (
    <Line
      points={points}
      lineWidth={1}
      color={color ?? TYPE_COLORS[body.type]}
      opacity={0.7}
      transparent
      raycast={() => null}
    />
  );
}

/** Displays an orbiting body with a hover tooltip and live position updates. */
export function BodyPoint({ body, jd }: { body: Body; jd: number }) {
  const dotRef = useRef<THREE.Mesh>(null!);
  const hitRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState<{ pos: THREE.Vector3; Ldeg: number; fdeg: number } | null>(null);
  const color = new THREE.Color(body.color ?? TYPE_COLORS[body.type]);

  useFrame(() => {
    const r = keplerToPositionAU(body, jd);
    dotRef.current.position.copy(r);
    hitRef.current.position.copy(r);

    if (!hovered) return;

    const a_km = body.a_AU * AU_KM;
    const n = Math.sqrt(ALTAIRA_GM / (a_km ** 3));
    const dt_s = (jd - body.epoch_JD) * SECONDS_PER_DAY;
    let M = body.M0 + n * dt_s;
    if (body.e < 1) M = ((M + Math.PI) % (2 * Math.PI)) - Math.PI;
    const L = body.Omega + body.omega + M;

    const EorH = solveKepler(M, body.e);
    const f_true =
      body.e < 1
        ? Math.atan2(
            Math.sqrt(1 - body.e ** 2) * Math.sin(EorH),
            Math.cos(EorH) - body.e
          )
        : Math.atan2(
            Math.sqrt(body.e ** 2 - 1) * Math.sinh(EorH),
            body.e - Math.cosh(EorH)
          );

    const dir = r.clone().sub(camera.position).normalize();
    const pos = r.clone().add(dir.multiplyScalar(0.06));

    setTooltip({
      pos,
      Ldeg: THREE.MathUtils.radToDeg(L),
      fdeg: THREE.MathUtils.radToDeg(f_true),
    });
  });

  const displayName = body.name?.trim()?.length ? body.name : body.id;
  const typeLabel = body.type ?? "Body";

  return (
    <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {body.type !== "Planet" && (
        <OrbitPath
          body={body}
          visible={hovered}
          segments={192}
          color={body.color ?? TYPE_COLORS[body.type]}
        />
      )}

      <mesh ref={hitRef}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={dotRef}>
        <sphereGeometry args={[0.01, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {hovered && tooltip && (
        <Html
          position={tooltip.pos.toArray()}
          center
          sprite
          distanceFactor={8}
          style={{ pointerEvents: "none", transform: "translate(-50%, -110%)" }}
        >
          <div className="relative z-50 inline-block w-max">
            <div className="absolute inset-0 -z-10 blur-md opacity-40 rounded-2xl bg-gradient-to-br from-white/70 to-white/10" />
            <div className="px-3 py-2 rounded-2xl bg-white/95 text-xs shadow-lg ring-1 ring-black/5 text-black">
              <div className="text-[8px] uppercase tracking-wide text-zinc-500 whitespace-nowrap">
                {typeLabel}
              </div>
              <div className="text-base font-semibold leading-5 whitespace-nowrap">
                {displayName}
              </div>
              <div className="mt-1 text-[10px] text-zinc-700 whitespace-nowrap">
                Mean longitude: {tooltip.Ldeg.toFixed(2)}°
              </div>
              <div className="text-[10px] text-zinc-700 whitespace-nowrap">
                True anomaly: {tooltip.fdeg.toFixed(2)}°
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/** Renders the central Sun sphere. */
export function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="#ffcc66" />
    </mesh>
  );
}

/** Draws RGB axes for scene orientation. */
export function Axes({ size = 1.0 }: { size?: number }) {
  return (
    <group>
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(size, 0, 0)]} color="#ff5555" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, size, 0)]} color="#55ff55" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, size)]} color="#5555ff" lineWidth={1} />
    </group>
  );
}

/** Initializes the camera position at scene load. */
export function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 3.5);
  }, [camera]);
  return null;
}

/** Selects the appropriate LOD for a candidate based on camera distance. */
export function useCandidateLOD(candidate: Candidate) {
  const { camera } = useThree();
  return useMemo(() => {
    const sphere = new THREE.Sphere(new THREE.Vector3(), 0);
    const all = candidate.lods[candidate.lods.length - 1].path;
    for (const p of all) sphere.expandByPoint(new THREE.Vector3().fromArray(p));
    const d = camera.position.distanceTo(sphere.center) - sphere.radius;
    if (d > 10) return candidate.lods.find(l => l.level === 3)!;
    if (d > 3) return candidate.lods.find(l => l.level === 2)!;
    return candidate.lods.find(l => l.level === 1)!;
  }, [candidate, camera.position.x, camera.position.y, camera.position.z]);
}

/** Displays a labeled event marker near its associated body. */
export function EventBillboard({
  event,
  jd,
  bodies,
}: {
  event: CandidateEvent;
  jd: number;
  bodies: Body[];
}) {
  const show = Math.abs(jd - event.tJD) < 30;
  if (!show) return null;
  const body = bodies.find(b => b.id === event.bodyId);
  const pos = body ? keplerToPositionAU(body, event.tJD) : new THREE.Vector3();

  return (
    <group position={pos.toArray()}>
      <mesh>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html center distanceFactor={8} style={{ pointerEvents: "auto" }}>
        <div className="px-2 py-1 rounded-xl bg-white/90 text-xs shadow border border-gray-200">
          <strong>{event.label}</strong>
          {event.vinf_kms != null && <div>V∞: {event.vinf_kms.toFixed(1)} km/s</div>}
          {event.alt_km != null && <div>Alt: {event.alt_km.toFixed(0)} km</div>}
        </div>
      </Html>
    </group>
  );
}
