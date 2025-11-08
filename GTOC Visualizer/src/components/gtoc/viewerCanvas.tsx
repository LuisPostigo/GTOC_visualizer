"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import { SolutionsUI, Solutions3D } from "@/components/gtoc/solutions";
import HUD from "@/components/gtoc/sceneParts/HUD";
import BodyPoint from "@/components/gtoc/sceneParts/BodyPoint";
import { OrbitPath, Sun, Axes, CameraRig } from "@/components/gtoc/KeplerSolver";
import {
  TYPE_COLORS,
  JD_EPOCH_0,
  DAYS_PER_YEAR,
} from "@/components/gtoc/utils/constants";
import { useBodiesFromGTOCCSV } from "@/components/gtoc/utils/dataLoader";
import { useSimClock } from "@/components/gtoc/utils/simClock";
import type { HoverPayload } from "@/components/gtoc/solutions/SolutionPath";

/* ---------- Types ---------- */
export type ViewerCanvasProps = Partial<{
  bodies: any[];
  jd: number;
  setJD: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
  milestonesJD: number[];
  milestonesISO: string[];
}>;

type HoverState = { data: HoverPayload; x: number; y: number } | null;

/* ======================= Main Component ======================= */
export default function ViewerCanvas(props: ViewerCanvasProps = {}) {
  /* ---- Simulation clock ---- */
  const usingExternalClock =
    props.jd !== undefined &&
    props.setJD &&
    props.isPlaying !== undefined &&
    props.setPlaying &&
    props.rate !== undefined &&
    props.setRate;

  const { jd, setJD, isPlaying, setPlaying, rate, setRate } = usingExternalClock
    ? (props as Required<
        Pick<
          ViewerCanvasProps,
          "jd" | "setJD" | "isPlaying" | "setPlaying" | "rate" | "setRate"
        >
      >)
    : useSimClock();

  /* ---- Load celestial bodies ---- */
  const bodiesHook = useBodiesFromGTOCCSV("/data/df_extracted_full.csv", [
    "Planet",
    "Asteroid",
    "Comet",
  ]);
  const bodies = props.bodies ?? bodiesHook.bodies ?? [];
  const hookError = bodiesHook.error;

  /* ---- Tooltip state ---- */
  const [hover, setHover] = useState<HoverState>(null);

  const bodyName = useMemo(() => {
    const m = new Map<number, string>();
    bodies?.forEach((b: any) => {
      const idNum = Number(b.id);
      const nm = (b.name && String(b.name).trim()) || `#${idNum || "?"}`;
      if (!Number.isNaN(idNum)) m.set(idNum, nm);
    });
    return m;
  }, [bodies]);

  /* ---- Tooltip overlay ---- */
  const tooltip = hover && (
    <div
      className="pointer-events-none fixed z-[2147483646] select-none"
      style={{ left: hover.x + 14, top: hover.y + 16 }}
    >
      <div
        className="rounded-xl p-[1px]"
        style={{
          background: `linear-gradient(135deg, ${hover.data.color}99 0%, rgba(255,255,255,0.2) 70%)`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}
      >
        <div className="rounded-xl backdrop-blur-md bg-black/85 px-3 py-2 text-[11px] text-white min-w-[200px] border border-white/10 shadow-2xl">
          {/* === Header: color dot + solution name === */}
          <div className="flex items-center justify-center mb-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white/30 mr-2"
              style={{ backgroundColor: hover.data.color }}
            />
            <div className="font-semibold text-white/90 truncate">
              {hover.data.solutionName}
            </div>
          </div>

          {/* === Body: leg path === */}
          <div className="text-xs text-center text-white/70 mb-1">
            {hover.data.fromBody
              ? bodyName.get(hover.data.fromBody) ?? `#${hover.data.fromBody}`
              : "—"}{" "}
            <span className="opacity-50">→</span>{" "}
            {hover.data.toBody
              ? bodyName.get(hover.data.toBody) ?? `#${hover.data.toBody}`
              : "—"}
          </div>

          {/* === Footer: leg index + TOF === */}
          <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-white/60 text-center">
            Leg {hover.data.legIndex} • TOF {hover.data.tofDays.toFixed(1)} days
          </div>
        </div>
      </div>
    </div>
  );


  /* ---- Render ---- */
  return (
    <div className="relative w-full h-screen bg-black">
      {/* 🧭 Overlay UI */}
      <SolutionsUI />

      {/* 🪐 3D Scene */}
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 65, near: 0.001, far: 1e12, position: [0, 0, 2e6] }}
      >
        {/* Scene setup */}
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#ffffff" />

        <CameraRig />
        <OrbitControls enableDamping dampingFactor={0.1} />
        <Stars radius={100} depth={50} count={1000} factor={2} fade speed={0.5} />

        <Sun />
        <Axes size={1.0} />

        {/* === Celestial Bodies === */}
        {bodies?.map((b: any) => (
          <group key={b.id}>
            {b.type === "Planet" && b.e < 1 ? (
              <>
                <OrbitPath
                  body={b}
                  visible
                  segments={256}
                  color={b.color ?? TYPE_COLORS[b.type as "Planet" | "Asteroid" | "Comet"]}
                />
                <BodyPoint body={b} jd={jd} showLabel />
              </>
            ) : (
              <BodyPoint body={b} jd={jd} />
            )}
          </group>
        ))}

        {/* ✅ Imported Trajectories with hover */}
        <Solutions3D
          currentJD={jd}
          epochZeroJD={JD_EPOCH_0}
          showShip
          onHover={(data, x, y) => setHover({ data, x, y })}
          onUnhover={() => setHover(null)}
        />
      </Canvas>

      {/* ✨ Tooltip */}
      {tooltip}

      {/* === HUD overlay === */}
      <PortalHUD>
        <div className="pointer-events-auto fixed left-1/2 -translate-x-1/2 bottom-2 z-[999] w-full max-w-[120rem] px-3">
          <HUD
            jd={jd}
            setJD={setJD}
            isPlaying={isPlaying}
            setPlaying={setPlaying}
            rate={rate}
            setRate={setRate}
            candidates={[]}
            jdMin={JD_EPOCH_0}
            jdMax={JD_EPOCH_0 + 200 * DAYS_PER_YEAR}
            milestonesJD={
              props.milestonesJD ?? [
                JD_EPOCH_0,
                JD_EPOCH_0 + 50 * DAYS_PER_YEAR,
                JD_EPOCH_0 + 100 * DAYS_PER_YEAR,
              ]
            }
            milestonesISO={
              props.milestonesISO ?? [
                "2000-01-01",
                "2050-01-01",
                "2100-01-01",
              ]
            }
          />
        </div>
      </PortalHUD>

      {/* === Error banner === */}
      {hookError && (
        <div className="absolute top-16 right-3 z-[80] text-xs pointer-events-none">
          <div className="px-3 py-2 rounded bg-red-600 text-white shadow">
            {hookError}
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================= Utility Components ======================= */
function PortalHUD({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
