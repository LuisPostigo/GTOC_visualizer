"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { AU_KM, SECONDS_PER_DAY } from "@/components/gtoc/utils/constants";
import { Solution } from "./types";

export type HoverPayload = {
  solutionName: string;
  color: string;
  legIndex: number;
  fromBody?: number | null;
  toBody?: number | null;
  tofDays: number;
  kind?: "leg" | "ship";
};

type Props = {
  sol: Solution;
  currentJD: number;
  epochZeroJD: number;
  showShip?: boolean;
  onHover?: (data: HoverPayload, x: number, y: number) => void;
  onUnhover?: () => void;
};

export default function SolutionPath({
  sol,
  currentJD,
  epochZeroJD,
  showShip,
  onHover,
  onUnhover,
}: Props) {
  if (!sol?.samples?.length) return null;

  /* -------------------- SCALE -------------------- */
  const medianR = (() => {
    const mags = sol.samples
      .map((s) => Math.hypot(...s.p))
      .filter((m) => Number.isFinite(m))
      .sort((a, b) => a - b);
    return mags[Math.floor(mags.length / 2)] || 1;
  })();
  const SCALE = medianR > 1e3 ? 1 / AU_KM : 1;

  /* -------------------- POINTS -------------------- */
  const pts = useMemo(
    () =>
      sol.samples
        .map((s) => new THREE.Vector3(...s.p).multiplyScalar(SCALE))
        .filter((v) => Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)),
    [sol.samples, SCALE]
  );

  if (pts.length < 2) return null;

  /* -------------------- TIME -------------------- */
  const elapsed = (currentJD - epochZeroJD) * SECONDS_PER_DAY;
  const times = sol.samples.map((s) => s.t);
  const firstEpoch = times[0];
  const solutionStarted = elapsed >= firstEpoch;

  /* -------------------- STATE HOOK -------------------- */
  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);

  /* -------------------- LEGS SPLIT -------------------- */
  const legs = useMemo(() => {
    const out: {
      fromBody: number;
      toBody: number;
      t0: number;
      t1: number;
      pts: THREE.Vector3[];
    }[] = [];

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

      const nextBody = scaled[i + 1]?.body ?? s.body;
      if (nextBody !== s.body) {
        const toBody =
          scaled.slice(i + 1).map((p) => p.body).find((b) => b !== s.body) ?? s.body;

        cur.toBody = toBody;
        out.push(cur);

        cur = {
          fromBody: s.body,
          toBody,
          t0: s.t,
          t1: s.t,
          pts: [],
        };
      }
    }

    if (cur.pts.length > 0) out.push(cur);
    return out;
  }, [sol.samples, SCALE]);

  /* -------------------- CURRENT LEG -------------------- */
  const currentLegIndex = useMemo(() => {
    if (!legs.length) return null;
    const k = legs.findIndex((L) => elapsed >= L.t0 && elapsed <= L.t1);
    if (k >= 0) return k;
    if (elapsed < legs[0].t0) return 0;
    return legs.length - 1;
  }, [elapsed, legs]);

  /* -------------------- INTERPOLATION (only after start) -------------------- */
  let shipPos = pts[0];
  let visiblePts = [pts[0]];

  if (solutionStarted) {
    let idx = times.findIndex((t, i) => elapsed >= t && elapsed <= times[i + 1]);
    if (idx < 0) idx = Math.max(0, times.length - 2);

    const t0 = times[idx];
    const t1 = times[idx + 1];
    const a = t1 > t0 ? (elapsed - t0) / (t1 - t0) : 0;

    shipPos = pts[idx].clone().lerp(pts[idx + 1], a);
    visiblePts = [...pts.slice(0, idx + 1), shipPos];
  }

  const baseColor = sol.color || "#66d9e8";

  /* ============================================================= */
  return (
    <group>
      {/* full dashed outline */}
      <Line
        points={pts}
        color={baseColor}
        dashed
        dashSize={0.02}
        gapSize={0.02}
        lineWidth={0.2}
        transparent
        opacity={0.25}
        toneMapped={false}
      />

      {/* visible trajectory (either first point or real progress) */}
      <Line
        points={visiblePts}
        color={baseColor}
        lineWidth={1.8}
        transparent
        opacity={0.95}
        toneMapped={false}
      />

      {/* SHIP — only after start */}
      {solutionStarted && showShip && (
        <mesh
          position={shipPos}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (currentLegIndex != null) setHoveredLeg(currentLegIndex);

            const leg = currentLegIndex != null ? legs[currentLegIndex] : undefined;
            const tofDays = leg ? (leg.t1 - leg.t0) / SECONDS_PER_DAY : 0;

            onHover?.(
              {
                solutionName: sol.name,
                color: baseColor,
                legIndex: (currentLegIndex ?? 0) + 1,
                fromBody: leg?.fromBody,
                toBody: leg?.toBody,
                tofDays,
                kind: "ship",
              },
              (e as any).clientX,
              (e as any).clientY
            );
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredLeg(null);
            onUnhover?.();
          }}
        >
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshBasicMaterial color={baseColor} toneMapped={false} />
        </mesh>
      )}

      {/* LEGS (hoverable) — only after start */}
      {solutionStarted &&
        legs.map((leg, i) => {
          const isHovered = hoveredLeg === i;
          const tofDays = (leg.t1 - leg.t0) / SECONDS_PER_DAY;

          return (
            <group key={i}>
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
                      kind: "leg",
                    },
                    (e as any).clientX,
                    (e as any).clientY
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
