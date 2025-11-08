// src/components/gtoc/utils/propagateConicArc.ts
import * as THREE from "three";

// Solar μ (km^3/s^2)
const MU_SUN = 1.32712440018e11;

export function propagateConicArc(
  r0: THREE.Vector3,
  v0: THREE.Vector3,
  dt: number, // total propagation time [seconds]
  steps = 200
): THREE.Vector3[] {
  const propagated: THREE.Vector3[] = [];
  const step = dt / steps;
  let r = r0.clone();
  let v = v0.clone();

  for (let i = 0; i <= steps; i++) {
    propagated.push(r.clone());

    // simple 2-body acceleration
    const rmag = r.length();
    const acc = r.clone().multiplyScalar(-MU_SUN / (rmag * rmag * rmag));

    // integrate using Velocity Verlet
    const v_half = v.clone().add(acc.clone().multiplyScalar(step / 2));
    r.add(v_half.clone().multiplyScalar(step));

    const rmag_new = r.length();
    const acc_new = r.clone().multiplyScalar(-MU_SUN / (rmag_new * rmag_new * rmag_new));
    v = v_half.add(acc_new.clone().multiplyScalar(step / 2));
  }

  return propagated;
}
