import * as THREE from "three";
import {
  AU_KM,
  SECONDS_PER_DAY,
  ALTAIRA_GM,
} from "@/components/gtoc/utils/constants";
import type { Body } from "@/components/gtoc/utils/dataLoader";

/* ======================= Kepler Solver ======================= */
export function solveKepler(M: number, e: number, tol = 1e-10, maxIter = 50): number {
  if (e < 1) {
    let E = M;
    for (let k = 0; k < maxIter; k++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const d = f / fp;
      E -= d;
      if (Math.abs(d) < tol) break;
    }
    return E;
  }

  if (e === 1) return M;

  let H = Math.log((2 * Math.abs(M)) / e + 1.8);
  for (let k = 0; k < maxIter; k++) {
    const sH = Math.sinh(H);
    const cH = Math.cosh(H);
    const f = e * sH - H - M;
    const fp = e * cH - 1;
    const d = f / fp;
    H -= d;
    if (Math.abs(d) < tol) break;
  }
  return H;
}

/** Computes heliocentric position in AU from orbital elements and Julian date. */
export function keplerToPositionAU(body: Body, jd: number, out?: THREE.Vector3): THREE.Vector3 {
  const { a_AU, e, inc, Omega, omega, M0, epoch_JD } = body;
  const a_km = a_AU * AU_KM;
  const n = Math.sqrt(ALTAIRA_GM / (a_km ** 3));
  const dt_s = (jd - epoch_JD) * SECONDS_PER_DAY;

  let M = M0 + n * dt_s;
  if (e < 1) M = ((M + Math.PI) % (2 * Math.PI)) - Math.PI;

  const EorH = solveKepler(M, e);
  let r_km: number, f_true: number;

  if (e < 1) {
    const E = EorH;
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const denom = 1 - e * cosE;
    r_km = a_km * denom;
    const cosf = (cosE - e) / denom;
    const sinf = (Math.sqrt(1 - e ** 2) * sinE) / denom;
    f_true = Math.atan2(sinf, cosf);
  } else {
    const H = EorH;
    const coshH = Math.cosh(H);
    const sinhH = Math.sinh(H);
    const denom = e * coshH - 1;
    r_km = a_km * denom;
    const cosf = (e - coshH) / denom;
    const sinf = (Math.sqrt(e ** 2 - 1) * sinhH) / denom;
    f_true = Math.atan2(sinf, cosf);
  }

  const cO = Math.cos(Omega),
    sO = Math.sin(Omega),
    ci = Math.cos(inc),
    si = Math.sin(inc),
    co = Math.cos(omega),
    so = Math.sin(omega);

  const R11 = cO * co - sO * so * ci;
  const R12 = -cO * so - sO * co * ci;
  const R21 = sO * co + cO * so * ci;
  const R22 = -sO * so + cO * co * ci;
  const R31 = so * si;
  const R32 = co * si;

  const x_peri = r_km * Math.cos(f_true);
  const y_peri = r_km * Math.sin(f_true);

  const x = (R11 * x_peri + R12 * y_peri) / AU_KM;
  const y = (R21 * x_peri + R22 * y_peri) / AU_KM;
  const z = (R31 * x_peri + R32 * y_peri) / AU_KM;

  if (!out) out = new THREE.Vector3();
  return out.set(x, y, z);
}
