"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  jd: number;
  setJD: (v: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setPlaying: (v: boolean) => void;
  rate: number;
  setRate: (v: number) => void;
  jdMin: number;
  jdMax: number;
  milestonesJD: number[];
  milestonesISO: string[];
  candidates?: Array<{ id: string; name: string }>;
};

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const RAIL_HEIGHT_PX = 6;
const RAIL_BOTTOM_PX = 16;
const RAIL_CENTER_BOTTOM_PX = RAIL_BOTTOM_PX + RAIL_HEIGHT_PX / 2;

function jdToDate(jd: number) {
  const ms = (jd - 2440587.5) * 86400000;
  return new Date(ms);
}
function dateToJD(d: Date) {
  return d.getTime() / 86400000 + 2440587.5;
}
function jdToISO(jd: number) {
  return jdToDate(jd).toISOString().replace(".000Z", "Z");
}
const isoShort = (iso: string) => iso.slice(0, 10);

type Marker = { jd: number; label?: string; kind: "start" | "end" | "major" | "minor" | "custom" };

function buildTimeGrid(jdMin: number, jdMax: number, custom: Marker[]): Marker[] {
  const start = jdToDate(jdMin);
  const end = jdToDate(jdMax);
  const y0 = start.getUTCFullYear();
  const y1 = end.getUTCFullYear();

  const first25 = Math.floor(y0 / 25) * 25;
  const last25 = Math.ceil(y1 / 25) * 25;

  const grid: Marker[] = [
    { jd: jdMin, label: isoShort(jdToISO(jdMin)), kind: "start" },
    { jd: jdMax, label: isoShort(jdToISO(jdMax)), kind: "end" },
  ];

  const yearBufferJD = 365.25;
  for (let y = first25; y <= last25; y += 25) {
    const d = new Date(Date.UTC(y, 0, 1));
    const mJD = dateToJD(d);
    if (mJD <= jdMin + yearBufferJD || mJD >= jdMax - yearBufferJD) continue;
    const isCentury = y % 100 === 0;
    grid.push({ jd: mJD, label: String(y), kind: isCentury ? "major" : "minor" });
  }

  const dedupTol = (jdMax - jdMin) * 1e-4;
  for (const m of custom) {
    if (!grid.some((g) => Math.abs(g.jd - m.jd) < dedupTol)) grid.push(m);
  }

  grid.sort((a, b) => a.jd - b.jd);
  return grid;
}

/* ---------- Icons ---------- */

const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M7 5l12 7-12 7V5z" fill="currentColor" />
  </svg>
);
const IconPause = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor" />
  </svg>
);
const IconPrev = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M7 6h2v12H7zM21 18L9 12l12-6v12z" fill="currentColor" />
  </svg>
);
const IconNext = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M15 6h2v12h-2zM3 18l12-6L3 6v12z" fill="currentColor" />
  </svg>
);
const IconSpeed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 12l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * Heads-Up Display (HUD) for time control and mission timeline.
 * Provides interactive JD scrubbing, playback, and time-step control.
 */
export default function HUD({
  jd,
  setJD,
  isPlaying,
  setPlaying,
  rate,
  setRate,
  jdMin,
  jdMax,
  milestonesJD,
  milestonesISO,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setScrubbing] = useState(false);
  const [stepDays, setStepDays] = useState(rate);

  useEffect(() => setStepDays(rate), [rate]);

  const pct = useMemo(
    () => (jdMax > jdMin ? ((jd - jdMin) / (jdMax - jdMin)) * 100 : 0),
    [jd, jdMin, jdMax]
  );

  const customMarkers = useMemo<Marker[]>(
    () =>
      milestonesJD.map((mjd, i) => ({
        jd: mjd,
        label: milestonesISO[i],
        kind: "custom" as const,
      })),
    [milestonesJD, milestonesISO]
  );

  const markers = useMemo(
    () => buildTimeGrid(jdMin, jdMax, customMarkers),
    [jdMin, jdMax, customMarkers]
  );

  useEffect(() => {
    if (knobRef.current) knobRef.current.tabIndex = 0;
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const p = clamp((clientX - rect.left) / rect.width, 0, 1);
      setJD(lerp(jdMin, jdMax, p));
    },
    [jdMin, jdMax, setJD]
  );

  const onPointerDownRail = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setScrubbing(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMoveRail = (e: React.PointerEvent) => {
    if (isScrubbing) updateFromClientX(e.clientX);
  };
  const onPointerUpRail = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setScrubbing(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = (jdMax - jdMin) * (e.deltaY < 0 ? -0.0015 : 0.0015);
    setJD((prev) => clamp(prev + delta, jdMin, jdMax));
  };

  const onKeyDownKnob = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setJD((prev) => clamp(prev - stepDays, jdMin, jdMax));
    else if (e.key === "ArrowRight") setJD((prev) => clamp(prev + stepDays, jdMin, jdMax));
    else if (e.key === " ") {
      e.preventDefault();
      setPlaying(!isPlaying);
    }
  };

  const jumpTo = (mjd: number) => setJD(clamp(mjd, jdMin, jdMax));
  const leftPct = (mjd: number) => (jdMax > jdMin ? ((mjd - jdMin) / (jdMax - jdMin)) * 100 : 0);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] pb-[max(env(safe-area-inset-bottom),0px)] text-white select-none"
      role="region"
      aria-label="Time controls"
    >
      {/* Timeline markers */}
      <div className="max-w-[1400px] mx-auto px-4 pt-1">
        <div className="relative" style={{ height: 40 + RAIL_CENTER_BOTTOM_PX }}>
          <div className="absolute inset-x-0" style={{ bottom: RAIL_CENTER_BOTTOM_PX, height: 0 }}>
            {markers.map(({ jd: mjd, label, kind }, i) => {
              const pos = leftPct(mjd);
              const isCustom = kind === "custom";
              const isStart = kind === "start";
              const isEnd = kind === "end";
              const tickDown = 6;
              const tickColor = isStart || isEnd ? "bg-white" : isCustom ? "bg-emerald-300" : "bg-white/65";
              const textColor = isCustom
                ? "text-emerald-200"
                : isStart || isEnd
                ? "text-white/90"
                : "text-white/70";

              const text =
                label ??
                (isStart || isEnd
                  ? isoShort(jdToISO(mjd))
                  : String(jdToDate(mjd).getUTCFullYear()));

              return (
                <div
                  key={`${kind}-${i}-${mjd}`}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <div className={`w-[1px] ${tickColor}`} style={{ height: tickDown }} />
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%-4px)] text-[10px] leading-3 whitespace-nowrap ${textColor}`}
                    style={{ bottom: tickDown }}
                    title={text}
                  >
                    {text}
                  </div>
                  <button
                    className="absolute -left-2 -top-6 w-4 h-[28px] pointer-events-auto"
                    title={label ?? jdToISO(mjd)}
                    aria-label={`Jump to ${label ?? jdToISO(mjd)}`}
                    onClick={() => jumpTo(mjd)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline rail */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div ref={railRef} className="relative cursor-pointer" style={{ height: RAIL_BOTTOM_PX + RAIL_HEIGHT_PX }}>
          <div
            className="absolute inset-x-0 rounded-full bg-white/12 hover:bg-white/16 transition-colors"
            style={{ bottom: RAIL_BOTTOM_PX, height: RAIL_HEIGHT_PX }}
            onPointerDown={onPointerDownRail}
            onPointerMove={onPointerMoveRail}
            onPointerUp={onPointerUpRail}
            onWheel={onWheel}
          >
            <div className="absolute inset-y-0 left-0 rounded-l-full bg-white/35" style={{ width: `${pct}%` }} />
            <div
              ref={knobRef}
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow ring-2 ring-black/30"
              style={{ left: `calc(${pct}% - 6px)` }}
              tabIndex={0}
              onKeyDown={onKeyDownKnob}
            />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="max-w-[1400px] mx-auto px-4 pb-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <IconCalendar />
              <span className="tabular-nums">{isoShort(jdToISO(jd))}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setJD((p) => clamp(p - stepDays, jdMin, jdMax))}
              className="h-8 px-2 rounded-md border border-white/15 hover:bg-white/10 text-white/90"
            >
              <IconPrev />
            </button>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center"
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button
              onClick={() => setJD((p) => clamp(p + stepDays, jdMin, jdMax))}
              className="h-8 px-2 rounded-md border border-white/15 hover:bg-white/10 text-white/90"
            >
              <IconNext />
            </button>
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden md:flex items-center gap-2 text-white/90">
              <IconSpeed />
              <input
                type="range"
                min={1}
                max={1000}
                step={1}
                value={clamp(Math.round(rate), 1, 1000)}
                onChange={(e) => setRate(parseInt(e.target.value, 10))}
                className="w-48 accent-white"
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/80">
              <span>Step</span>
              <input
                type="number"
                className="w-25 bg-transparent border border-white/15 rounded px-2 py-1 text-right [color-scheme:dark] text-white tracking-wide"
                min={1}
                max={3650}
                value={stepDays}
                onChange={(e) => {
                  const newVal = clamp(parseInt(e.target.value || "1", 10), 1, 3650);
                  setStepDays(newVal);
                  setRate(newVal);
                }}
              />
              <span>d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
