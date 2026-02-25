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

/** Two-body gravitational dynamics under central body (optimized) */
function twoBodyDynamicsInPlace(y: number[], mu: number, out: number[]): void {
  const rx = y[0], ry = y[1], rz = y[2];
  const r2 = rx * rx + ry * ry + rz * rz;
  const rInv3 = -mu / (r2 * Math.sqrt(r2));

  out[0] = y[3];
  out[1] = y[4];
  out[2] = y[5];
  out[3] = rInv3 * rx;
  out[4] = rInv3 * ry;
  out[5] = rInv3 * rz;
}

/** One RK4 step (optimized for memory) */
function rk4StepOptimized(
  y: number[],
  dt: number,
  mu: number,
  k1: number[],
  k2: number[],
  k3: number[],
  k4: number[],
  tmp: number[]
): void {
  // k1 = f(t, y)
  twoBodyDynamicsInPlace(y, mu, k1);

  // k2 = f(t + dt/2, y + dt/2 * k1)
  for (let i = 0; i < 6; i++) tmp[i] = y[i] + (dt * 0.5) * k1[i];
  twoBodyDynamicsInPlace(tmp, mu, k2);

  // k3 = f(t + dt/2, y + dt/2 * k2)
  for (let i = 0; i < 6; i++) tmp[i] = y[i] + (dt * 0.5) * k2[i];
  twoBodyDynamicsInPlace(tmp, mu, k3);

  // k4 = f(t + dt, y + dt * k3)
  for (let i = 0; i < 6; i++) tmp[i] = y[i] + dt * k3[i];
  twoBodyDynamicsInPlace(tmp, mu, k4);

  // y = y + dt/6 * (k1 + 2k2 + 2k3 + k4)
  const dt6 = dt / 6;
  for (let i = 0; i < 6; i++) {
    y[i] += dt6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
}

/**
 * Propagate an arc using fixed RK4 with *finer internal steps*
 * and output only at the same sampling times the Python code uses.
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

  const state = [...r0, ...v0];
  const results: { t: number; state: number[] }[] = [];

  // Pre-allocate buffers for RK4 to avoid GC thrashing
  const k1 = new Array(6).fill(0);
  const k2 = new Array(6).fill(0);
  const k3 = new Array(6).fill(0);
  const k4 = new Array(6).fill(0);
  const tmp = new Array(6).fill(0);

  let t = 0;
  const maxInternalStep = dt / (samples * 50);

  let nextOutIndex = 0;
  const eps = 1e-10;

  while (t < dt - eps && nextOutIndex < tEval.length) {
    const targetT = tEval[nextOutIndex];
    const h = Math.min(maxInternalStep, targetT - t);

    // integrate one small step (optimized)
    rk4StepOptimized(state, h, mu, k1, k2, k3, k4, tmp);
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
