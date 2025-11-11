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
  MILISECONDS_PER_DAY,
  UNIX_EPOCH_JD,
} from "@/components/gtoc/utils/constants";
import { useBodiesFromGTOCCSV } from "@/components/gtoc/utils/dataLoader";
import { useSimClock, epochSecondsFromJD } from "@/components/gtoc/utils/simClock";
import type { HoverPayload } from "@/components/gtoc/solutions/SolutionPath";
import BodySelector from "@/components/gtoc/BodySelector";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";

type HoverState = { data: HoverPayload; x: number; y: number } | null;

export default function ViewerCanvas(props = {}) {
  const usingExternalClock =
    "jd" in props &&
    "setJD" in props &&
    "isPlaying" in props &&
    "setPlaying" in props &&
    "rate" in props &&
    "setRate" in props;

  const { jd, setJD, isPlaying, setPlaying, rate, setRate } = usingExternalClock
    ? (props as any)
    : useSimClock({
        jd0: JD_EPOCH_0,
        jdMin: JD_EPOCH_0,
        jdMax: JD_EPOCH_0 + 200 * DAYS_PER_YEAR,
        rate0: 50,
      });

  const bodiesHook = useBodiesFromGTOCCSV("/data/df_extracted_full.csv", [
    "Planet",
    "Asteroid",
    "Comet",
  ]);
  const bodies = (props as any).bodies ?? bodiesHook.bodies ?? [];
  const hookError = bodiesHook.error;

  const { setPlanets, selectedBodies } = usePlanetStore();

  useEffect(() => {
    if (bodies && bodies.length > 0) {
      const mapped = bodies
        .filter((b: any) => b && (b.name || b.id))
        .map((b: any) => ({
          id: b.id,
          name: b.name || String(b.id),
          type: b.type,
          color:
            b.color ?? TYPE_COLORS[b.type as "Planet" | "Asteroid" | "Comet"],
        }));
      setPlanets(mapped);
    }
  }, [bodies, setPlanets]);

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

  // Epoch-derived from the current JD (viewer time == file time)
  const epochSec = epochSecondsFromJD(jd);
  const epochDays = jd - JD_EPOCH_0;
  const epochYears = epochDays / DAYS_PER_YEAR;
  const isoAtJD =
    new Date((jd - UNIX_EPOCH_JD) * MILISECONDS_PER_DAY).toISOString().slice(0, 19) + "Z";

  const tooltip = hover && (() => {
    const isShip = hover.data.kind === "ship";

    // Distinct look for EPOCH tooltip (ship hover)
    const shellGradient = isShip
      ? "linear-gradient(135deg, rgba(16,185,129,0.6) 0%, rgba(59,130,246,0.25) 70%)" // emerald → blue
      : `linear-gradient(135deg, ${hover.data.color}99 0%, rgba(255,255,255,0.2) 70%)`;

    const shellShadow = isShip
      ? "0 0 0 2px rgba(16,185,129,0.55), 0 10px 28px rgba(16,185,129,0.35)"
      : "0 6px 20px rgba(0,0,0,0.35)";

    const innerBgClass = isShip ? "bg-emerald-900/50" : "bg-black/85";
    const innerBorderClass = isShip ? "border-emerald-300/30" : "border-white/10";

    return (
      <div
        className="pointer-events-none fixed z-[2147483646] select-none"
        style={{ left: hover.x + 14, top: hover.y + 16 }}
      >
        <div
          className="rounded-xl p-[1px]"
          style={{ background: shellGradient, boxShadow: shellShadow }}
        >
          <div
            className={`relative rounded-xl backdrop-blur-md ${innerBgClass} px-3 py-2 text-[11px] text-white min-w-[230px] border ${innerBorderClass} shadow-2xl`}
          >
            {/* EPOCH badge (ship only) */}
            {isShip && (
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-semibold bg-emerald-400 text-black shadow ring-1 ring-white/50">
                    <span aria-hidden>🕒</span> EPOCH
                  </span>
                </div>
              </div>
            )}

            {/* Solution name */}
            <div className="flex items-center justify-center mb-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white/30 mr-2"
                style={{ backgroundColor: hover.data.color }}
              />
              <div className="font-semibold text-white/90 truncate">
                {hover.data.solutionName}
              </div>
            </div>

            {/* From → To */}
            <div className="text-xs text-center text-white/70 mb-1">
              {hover.data.fromBody
                ? bodyName.get(hover.data.fromBody) ?? `#${hover.data.fromBody}`
                : "—"}{" "}
              <span className="opacity-50">→</span>{" "}
              {hover.data.toBody
                ? bodyName.get(hover.data.toBody) ?? `#${hover.data.toBody}`
                : "—"}
            </div>

            {/* Leg & TOF */}
            <div className={`mt-1 pt-1 border-t text-[10px] text-center ${
              isShip ? "border-emerald-300/20 text-emerald-100/90" : "border-white/10 text-white/70"
            }`}>
              Leg {hover.data.legIndex} • TOF {hover.data.tofDays.toFixed(1)} days
            </div>

            {/* Epoch block (ship only) */}
            {isShip && (
              <div className="mt-1 pt-1 border-t border-emerald-300/20 text-[10px] text-emerald-50/90">
                <div className="text-center">
                  <span className="text-emerald-200/80">epoch (t − t₀):</span>{" "}
                  <b className="text-white">{epochSec.toLocaleString()}</b> s
                </div>
                <div className="text-center">
                  {epochDays.toFixed(3)} d ({epochYears.toFixed(3)} yr)
                </div>
                <div className="text-center text-emerald-200/80">
                  JD {jd.toFixed(5)} • {isoAtJD}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })();

  return (
    <div className="relative w-full h-screen bg-black">
      <BodySelector />
      <SolutionsUI />

      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 65, near: 0.001, far: 1e12, position: [0, 0, 2e6] }}
      >
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#fff" />

        <CameraRig />
        <OrbitControls enableDamping dampingFactor={0.1} />
        <Stars radius={100} depth={50} count={1000} factor={2} fade speed={0.5} />

        <Sun />
        <Axes size={1.0} />

        {bodies
          ?.filter((b: any) => b && (b.name || b.id) && b.a_AU && b.e !== undefined)
          .map((b: any, idx: number) => {
            const idOrName = String(b.name && b.name !== "None" ? b.name : b.id);
            const isSelected = selectedBodies.includes(idOrName);
            const showOrbit = b.type === "Planet" || isSelected;

            return (
              <group key={String(b.id ?? b.name ?? idx)}>
                {showOrbit && (
                  <OrbitPath
                    body={b}
                    visible
                    segments={256}
                    color={
                      b.color ?? TYPE_COLORS[b.type as "Planet" | "Asteroid" | "Comet"]
                    }
                    isSelected={isSelected}
                  />
                )}
                <BodyPoint body={b} jd={jd} showLabel={isSelected || b.type === "Planet"} />
              </group>
            );
          })}

        <Solutions3D
          currentJD={jd}
          epochZeroJD={JD_EPOCH_0}
          showShip
          onHover={(data, x, y) => setHover({ data, x, y })}
          onUnhover={() => setHover(null)}
        />
      </Canvas>

      {tooltip}

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
              (props as any).milestonesJD ?? [
                JD_EPOCH_0,
                JD_EPOCH_0 + 50 * DAYS_PER_YEAR,
                JD_EPOCH_0 + 100 * DAYS_PER_YEAR,
              ]
            }
            milestonesISO={
              (props as any).milestonesISO ?? [
                "2000-01-01",
                "2050-01-01",
                "2100-01-01",
              ]
            }
          />
        </div>
      </PortalHUD>

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

function PortalHUD({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
