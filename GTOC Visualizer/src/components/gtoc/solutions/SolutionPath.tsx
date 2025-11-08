"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { AU_KM, SECONDS_PER_DAY } from "@/components/gtoc/utils/constants";
import { Solution } from "./types";

/* ---------- Hover payload type ---------- */
export type HoverPayload = {
  solutionName: string;
  color: string;
  legIndex: number;
  fromBody?: number | null;
  toBody?: number | null;
  tofDays: number;
};

/* ---------- Props ---------- */
type Props = {
  sol: Solution;
  currentJD: number;
  epochZeroJD: number;
  showShip?: boolean;
  onHover?: (data: HoverPayload, x: number, y: number) => void;
  onUnhover?: () => void;
};

/* ============================================================= */
export default function SolutionPath({
  sol,
  currentJD,
  epochZeroJD,
  showShip,
  onHover,
  onUnhover,
}: Props) {
  if (!sol?.samples?.length) return null;

  // --- Detect AU vs km ---
  const medianR = (() => {
    const mags = sol.samples
      .map((s) => Math.hypot(...s.p))
      .filter((m) => Number.isFinite(m))
      .sort((a, b) => a - b);
    return mags[Math.floor(mags.length / 2)] || 1;
  })();
  const SCALE = medianR > 1e3 ? 1 / AU_KM : 1;

  // --- Convert to 3D points ---
  const pts = useMemo(
    () =>
      sol.samples
        .map((s) => new THREE.Vector3(...s.p).multiplyScalar(SCALE))
        .filter(
          (v) =>
            Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
        ),
    [sol.samples, SCALE]
  );
  if (pts.length < 2) return null;

  // --- Continuous progress interpolation ---
  const elapsed = (currentJD - epochZeroJD) * SECONDS_PER_DAY;
  const times = sol.samples.map((s) => s.t);

  let idx = times.findIndex((t, i) => elapsed >= t && elapsed <= times[i + 1]);
  if (idx < 0) idx = Math.max(0, times.length - 2);

  const t0 = times[idx];
  const t1 = times[idx + 1];
  const a = t1 > t0 ? (elapsed - t0) / (t1 - t0) : 0;

  const shipPos = pts[idx].clone().lerp(pts[idx + 1], a);
  const visiblePts = [...pts.slice(0, idx + 1), shipPos];

  const baseColor = sol.color || "#66d9e8";

  // --- Hovered leg state ---
  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);

    // --- Leg metadata (hover info) ---
  const legs = useMemo(() => {
      const out: {
        fromBody: number;
        toBody: number;
        t0: number;
        t1: number;
        pts: THREE.Vector3[];
      }[] = [];

      if (!sol.samples.length) return out;

      const scaled = sol.samples.map((s) => ({
        t: s.t,
        body: s.bodyId ?? 0,
        v: new THREE.Vector3(...s.p).multiplyScalar(SCALE),
      }));

      let cur = {
        fromBody: scaled[0].body,
        toBody: scaled[0].body,
        t0: scaled[0].t,
        t1: scaled[0].t,
        pts: [scaled[0].v],
      };

      for (let i = 1; i < scaled.length; i++) {
        const s = scaled[i];
        cur.pts.push(s.v);
        cur.t1 = s.t;

        // Detect a body transition
        const nextBody = scaled[i + 1]?.body ?? s.body;
        if (nextBody !== s.body) {
          // Find the next distinct body ahead to serve as destination
          const toBody =
            scaled
              .slice(i + 1)
              .map((p) => p.body)
              .find((b) => b !== s.body) ?? s.body;

          cur.toBody = toBody;
          out.push(cur);

          // Start new leg
          cur = {
            fromBody: s.body,
            toBody,
            t0: s.t,
            t1: s.t,
            pts: [],
          };
        }
      }

      // Push the last leg if valid
      if (cur.pts.length > 0) out.push(cur);

      return out;
    }, [sol.samples, SCALE]);


  /* ============================================================= */
  return (
    <group>
      {/* thin dashed outline of full orbit */}
      <Line
        points={pts}
        color={baseColor}
        lineWidth={0.2}
        dashed
        dashSize={0.02}
        gapSize={0.02}
        transparent
        opacity={0.25}
        toneMapped={false}
      />

      {/* visible trajectory so far */}
      <Line
        key={`${sol.id}-progress`}
        points={visiblePts}
        color={baseColor}
        lineWidth={1.8}
        transparent
        opacity={0.95}
        toneMapped={false}
      />

      {/* spacecraft marker */}
      {showShip && (
        <mesh position={shipPos}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshBasicMaterial color={baseColor} toneMapped={false} />
        </mesh>
      )}

      {/* hoverable legs + highlight */}
      {legs.map((leg, i) => {
        const tofDays = (leg.t1 - leg.t0) / SECONDS_PER_DAY;
        const isHovered = hoveredLeg === i;

        return (
          <group key={`${sol.id}-leg-${i}`}>
            {/* ✨ bright highlight when hovered */}
            {isHovered && (
              <Line
                points={leg.pts}
                color={baseColor}
                lineWidth={4.2}
                transparent
                opacity={0.9}
                toneMapped={false}
              />
            )}

            {/* invisible hit zone for hover detection */}
            <Line
              points={leg.pts}
              color={baseColor}
              lineWidth={3.5}
              transparent
              opacity={0}
              toneMapped={false}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLeg(i);
                onHover?.(
                  {
                    solutionName: sol.name,
                    color: baseColor,
                    legIndex: i + 1,
                    fromBody: leg.fromBody,
                    toBody: leg.toBody,
                    tofDays,
                  },
                  e.clientX,
                  e.clientY
                );
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredLeg(null);
                onUnhover?.();
              }}
            />
          </group>
        );
      })}
    </group>
  );
}
