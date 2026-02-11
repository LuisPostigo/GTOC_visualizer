import * as THREE from "three";
import { Solution } from "../solutions/types";
import { AU_KM, SECONDS_PER_DAY } from "./constants";

/**
 * Calculates current ship position for a given solution and time.
 * Replicates the logic from SolutionPath.tsx to ensure consistency.
 */
export function getShipPosition(
    sol: Solution,
    currentJD: number,
    epochZeroJD: number
): THREE.Vector3 | null {
    if (!sol?.samples?.length) return null;

    // --- SCALE LOGIC (from SolutionPath.tsx) ---
    // If coordinates are large (e.g. > 1000), assume KM and convert to AU.
    // Otherwise assume AU.
    const medianR = (() => {
        const mags = sol.samples
            .map((s) => Math.hypot(...s.p))
            .filter((m) => Number.isFinite(m))
            .sort((a, b) => a - b);
        return mags[Math.floor(mags.length / 2)] || 1;
    })();
    const SCALE = medianR > 1e3 ? 1 / AU_KM : 1;

    // --- TIME ---
    const elapsed = (currentJD - epochZeroJD) * SECONDS_PER_DAY;
    const times = sol.samples.map((s) => s.t);

    // If before start, return first point
    if (elapsed < times[0]) {
        return new THREE.Vector3(...sol.samples[0].p).multiplyScalar(SCALE);
    }

    // If after end, return last point
    if (elapsed > times[times.length - 1]) {
        const last = sol.samples[sol.samples.length - 1];
        return new THREE.Vector3(...last.p).multiplyScalar(SCALE);
    }

    // --- INTERPOLATION ---
    let idx = times.findIndex((t, i) => elapsed >= t && elapsed <= times[i + 1]);
    if (idx < 0) idx = Math.max(0, times.length - 2);

    const t0 = times[idx];
    const t1 = times[idx + 1];
    const a = t1 > t0 ? (elapsed - t0) / (t1 - t0) : 0;

    const p0 = new THREE.Vector3(...sol.samples[idx].p).multiplyScalar(SCALE);
    const p1 = new THREE.Vector3(...sol.samples[idx + 1].p).multiplyScalar(SCALE);

    return p0.lerp(p1, a);
}
