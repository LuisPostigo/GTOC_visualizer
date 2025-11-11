"use client";

import {
  SECONDS_PER_DAY,
  MILISECONDS_PER_DAY,
  DAYS_PER_YEAR,
  JD_EPOCH_0,
} from "@/components/gtoc/utils/constants";
import { useEffect, useRef, useState, useCallback } from "react";

/* ============================== Helpers ============================== */

/** Clamps a number between optional bounds. */
export function clamp(v: number, lo?: number, hi?: number) {
  if (lo != null && v < lo) return lo;
  if (hi != null && v > hi) return hi;
  return v;
}

/** Converts Date → Julian Date. */
export function dateToJD(date: Date): number {
  return date.getTime() / MILISECONDS_PER_DAY + 2440587.5;
}

/** Converts Julian Date → Date. */
export function jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * MILISECONDS_PER_DAY);
}

/** Builds an array of JD milestones between start and end. */
export function buildMilestonesByStep(
  jdStart: number,
  jdEnd: number,
  stepDays: number
): number[] {
  const out: number[] = [];
  const dir = Math.sign(jdEnd - jdStart) || 1;
  const step = Math.abs(stepDays) * dir;
  let jd = jdStart;

  if (dir > 0) {
    while (jd <= jdEnd) {
      out.push(jd);
      jd += step;
    }
  } else {
    while (jd >= jdEnd) {
      out.push(jd);
      jd += step;
    }
  }

  if (out[out.length - 1] !== jdEnd) out.push(jdEnd);
  return out;
}

/** Creates a JD range centered at `centerJD` with ±`years`. */
export function makeJDRangeFromYears(centerJD: number, years: number) {
  const days = years * DAYS_PER_YEAR;
  return { jdMin: centerJD - days, jdMax: centerJD + days };
}

/** === NEW: file-epoch glue (epoch seconds ↔ JD) === */
export const JD_T0 = JD_EPOCH_0;

/** Seconds past t₀ (solution-file epoch) for a given JD. */
export function epochSecondsFromJD(jd: number): number {
  return Math.round((jd - JD_T0) * SECONDS_PER_DAY);
}

/** JD corresponding to epoch seconds past t₀. */
export function jdFromEpochSeconds(tSec: number): number {
  return JD_T0 + tSec / SECONDS_PER_DAY;
}

/* ============================ useSimClock ============================ */

export type SimClockOpts = {
  jd0?: number;
  jdMin?: number;
  jdMax?: number;
  milestones?: number[];
  snapPlayToMilestones?: boolean;
  milestoneStepsPerSec?: number;
  playing?: boolean;
  /** Rate in days per second (default: 50). */
  rate0?: number;
};

/**
 * Simulation clock that advances Julian Date continuously or by discrete milestones.
 * Internally runs a single requestAnimationFrame loop for stable timing.
 */
export function useSimClock(opts: SimClockOpts = {}) {
  const {
    jd0,
    jdMin,
    jdMax,
    milestones,
    snapPlayToMilestones = false,
    milestoneStepsPerSec = 2,
    playing = true,
    rate0 = 50,
  } = opts;

  // ✅ Default to file epoch (JD_EPOCH_0) rather than wall-clock "now"
  const [jd, _setJD] = useState<number>(() =>
    clamp(jd0 ?? JD_EPOCH_0, jdMin, jdMax)
  );
  const [isPlaying, _setPlaying] = useState<boolean>(playing);
  const [rate, _setRate] = useState<number>(rate0); // days per second

  /* Refs to avoid stale closures */
  const jdRef = useRef(jd);
  const rateRef = useRef(rate);
  const playingRef = useRef(isPlaying);
  const minJDRef = useRef(jdMin);
  const maxJDRef = useRef(jdMax);
  const milestonesRef = useRef(milestones);
  const snapRef = useRef(snapPlayToMilestones);
  const stepPerSecRef = useRef(milestoneStepsPerSec);
  const lastGoodRateRef = useRef(rate0 > 0 ? rate0 : 1);
  const idxRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  /* Sync state to refs */
  useEffect(() => {
    jdRef.current = jd;
  }, [jd]);
  useEffect(() => {
    rateRef.current = rate;
    if (Number.isFinite(rate) && rate > 0) lastGoodRateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    minJDRef.current = jdMin;
  }, [jdMin]);
  useEffect(() => {
    maxJDRef.current = jdMax;
  }, [jdMax]);
  useEffect(() => {
    milestonesRef.current = milestones;
  }, [milestones]);
  useEffect(() => {
    snapRef.current = snapPlayToMilestones;
  }, [snapPlayToMilestones]);
  useEffect(() => {
    stepPerSecRef.current = milestoneStepsPerSec;
  }, [milestoneStepsPerSec]);

  /* State setters */
  const setJD = useCallback((v: number | ((prev: number) => number)) => {
    _setJD(prev => {
      const raw = typeof v === "function" ? (v as (p: number) => number)(prev) : v;
      const lo = minJDRef.current ?? -Infinity;
      const hi = maxJDRef.current ?? Infinity;
      const next = clamp(raw, lo, hi);
      jdRef.current = next;
      return next;
    });
  }, []);

  const setRate = useCallback((v: number) => {
    _setRate(v);
    rateRef.current = v;
    if (Number.isFinite(v) && v > 0) lastGoodRateRef.current = v;
  }, []);

  const setPlaying = useCallback((v: boolean) => {
    _setPlaying(v);
    playingRef.current = v;
    if (!v) lastTsRef.current = null;
  }, []);

  /* Keeps milestone index near current jd */
  useEffect(() => {
    const ms = milestonesRef.current;
    if (!ms?.length) return;
    let best = 0;
    let bd = Infinity;
    for (let k = 0; k < ms.length; k++) {
      const d = Math.abs(ms[k] - jdRef.current);
      if (d < bd) {
        bd = d;
        best = k;
      }
    }
    idxRef.current = best;
  }, [milestones, jd]);

  /* Main RAF loop */
  useEffect(() => {
    function tick(ts: number) {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const prevTs = lastTsRef.current;
      lastTsRef.current = ts;
      const dtSec = Math.max(0, (ts - prevTs) / 1000);

      if (playingRef.current) {
        const lo = minJDRef.current ?? -Infinity;
        const hi = maxJDRef.current ?? Infinity;

        if (snapRef.current && milestonesRef.current?.length) {
          const ms = milestonesRef.current;
          const maxIdx = ms.length - 1;
          let idx = idxRef.current + stepPerSecRef.current * dtSec;
          idx = clamp(idx, 0, maxIdx);
          idxRef.current = idx;

          const jdSnap = ms[Math.round(idx)];
          const next = clamp(jdSnap, lo, hi);
          _setJD(next);
          jdRef.current = next;

          if (next <= lo || next >= hi || Math.round(idx) === 0 || Math.round(idx) === maxIdx) {
            _setPlaying(false);
            playingRef.current = false;
          }
        } else {
          const r =
            Number.isFinite(rateRef.current) && rateRef.current > 0
              ? rateRef.current
              : lastGoodRateRef.current;

          if (r > 0) {
            let next = jdRef.current + r * dtSec;
            next = clamp(next, lo, hi);
            _setJD(next);
            jdRef.current = next;

            if ((next === hi && r > 0) || (next === lo && r < 0)) {
              _setPlaying(false);
              playingRef.current = false;
            }
          }
        }
      } else {
        lastTsRef.current = ts; // paused: avoids dt spike
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, []);

  return { jd, setJD, isPlaying, setPlaying, rate, setRate };
}
