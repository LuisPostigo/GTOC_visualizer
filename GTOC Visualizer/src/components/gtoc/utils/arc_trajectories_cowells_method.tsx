/**
 * arc_trajectories_cowells_method.tsx — High-Precision Arc Propagation for the Altaira System
 * ------------------------------------------------------------------------------------------
 * Mimics the Python version that uses SciPy's solve_ivp with t_eval,
 * by integrating with a finer internal step and only emitting at t_eval times.
 */

import { ALTAIRA_GM } from "@/components/gtoc/utils/constants";

/** Euclidean norm */
function norm(v: number[]): number {
  return Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
}

/** Two-body gravitational dynamics under central body */
function twoBodyDynamics(_t: number, state: number[], mu: number): number[] {
  const [rx, ry, rz, vx, vy, vz] = state;
  const rNorm = norm([rx, ry, rz]);
  const factor = -mu / Math.pow(rNorm, 3);
  const ax = factor * rx;
  const ay = factor * ry;
  const az = factor * rz;
  return [vx, vy, vz, ax, ay, az];
}

/** One RK4 step */
function rk4Step(
  f: (t: number, y: number[], mu: number) => number[],
  t: number,
  y: number[],
  dt: number,
  mu: number
): number[] {
  const k1 = f(t, y, mu);
  const k2 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k1[i]), mu);
  const k3 = f(t + dt / 2, y.map((yi, i) => yi + (dt / 2) * k2[i]), mu);
  const k4 = f(t + dt, y.map((yi, i) => yi + dt * k3[i]), mu);
  return y.map(
    (yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
  );
}

/**
 * Propagate an arc using fixed RK4 with *finer internal steps*
 * and output only at the same sampling times the Python code uses.
 *
 * Python did: t_eval = linspace(0, dt, samples)[:-1]
 */
export function propagateArcCowell(
  r0: number[],
  v0: number[],
  dt: number,
  mu: number = ALTAIRA_GM,
  samples = 40
): { t: number; state: number[] }[] {
  // output times like Python: 0 .. dt, but drop the last one
  const tEval: number[] = Array.from({ length: samples }, (_, i) =>
    (dt * i) / (samples - 1)
  ).slice(0, -1); // drop final dt like Python

  const y0 = [...r0, ...v0];
  const results: { t: number; state: number[] }[] = [];

  let t = 0;
  let state = y0;

  // internal integration step (finer than output spacing)
  // 50 is arbitrary but safe; increase if still spiky
  const maxInternalStep = dt / (samples * 50);

  let nextOutIndex = 0;
  const eps = 1e-10;

  while (t < dt - eps && nextOutIndex < tEval.length) {
    const targetT = tEval[nextOutIndex];
    const h = Math.min(maxInternalStep, targetT - t);

    // integrate one small step
    state = rk4Step(twoBodyDynamics, t, state, h, mu);
    t += h;

    // snap to target time if we're very close
    if (Math.abs(t - targetT) < 1e-9) {
      t = targetT;
    }

    // if we reached or passed the output time, record it
    if (t >= targetT - 1e-9) {
      results.push({ t, state: [...state] });
      nextOutIndex += 1;
    }
  }

  return results;
}
