/**
 * arc_trajectories_cowells_method.tsx — High-Precision Arc Propagation for the Altaira System
 * ------------------------------------------------------------------------------------------
 * Mimics the Python version that uses SciPy's solve_ivp with t_eval,
 * by integrating with a finer internal step and only emitting at t_eval times.
 */

import { ALTAIRA_GM } from "@/components/gtoc/utils/constants";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function angleBetweenPositionStates(a: number[], b: number[]): number {
  const na = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
  const nb = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
  if (!(na > 0) || !(nb > 0)) return 0;

  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return Math.acos(clamp(dot / (na * nb), -1, 1));
}

function angularRateFromState(y: number[]): number {
  const rx = y[0], ry = y[1], rz = y[2];
  const vx = y[3], vy = y[4], vz = y[5];
  const r2 = rx * rx + ry * ry + rz * rz;
  if (!(r2 > 0)) return 0;

  const hx = ry * vz - rz * vy;
  const hy = rz * vx - rx * vz;
  const hz = rx * vy - ry * vx;
  const h = Math.sqrt(hx * hx + hy * hy + hz * hz);
  return h / r2;
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
  if (!(dt > 0)) {
    return [{ t: 0, state: [...r0, ...v0] }];
  }

  const targetSamples = Math.max(8, Math.floor(samples));
  const maxOutputDt = dt / Math.max(targetSamples - 1, 1);

  // Keep the global work bounded, then locally refine around fast-turning regions.
  const baseInternalSteps = Math.max(180, targetSamples * 4);
  const baseInternalStep = dt / baseInternalSteps;
  const minInternalStep = dt / 8000;
  const maxOutputAngle = Math.min(Math.PI / 24, (2 * Math.PI) / Math.max(targetSamples, 24));
  const targetInternalAngle = Math.max(maxOutputAngle / 3, Math.PI / 720);

  const state = [...r0, ...v0];
  const results: { t: number; state: number[] }[] = [{ t: 0, state: [...state] }];
  let lastEmittedState = [...state];
  let lastEmitT = 0;

  // Pre-allocate buffers for RK4 to avoid GC thrashing
  const k1 = new Array(6).fill(0);
  const k2 = new Array(6).fill(0);
  const k3 = new Array(6).fill(0);
  const k4 = new Array(6).fill(0);
  const tmp = new Array(6).fill(0);

  let t = 0;
  const eps = 1e-10;

  while (t < dt - eps) {
    const remaining = dt - t;
    const omega = angularRateFromState(state);
    const angleLimitedStep = omega > 1e-12 ? targetInternalAngle / omega : baseInternalStep;
    const h = Math.min(
      remaining,
      Math.max(minInternalStep, Math.min(baseInternalStep, angleLimitedStep))
    );

    // integrate one small step (optimized)
    rk4StepOptimized(state, h, mu, k1, k2, k3, k4, tmp);
    t += h;

    const angleSinceLastEmit = angleBetweenPositionStates(lastEmittedState, state);
    const shouldEmit =
      (t - lastEmitT) >= maxOutputDt ||
      angleSinceLastEmit >= maxOutputAngle ||
      (dt - t) <= eps;

    if (shouldEmit) {
      results.push({ t, state: [...state] });
      lastEmittedState = [...state];
      lastEmitT = t;
    }
  }

  return results;
}
