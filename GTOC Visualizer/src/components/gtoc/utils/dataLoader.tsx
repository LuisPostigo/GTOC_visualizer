"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { AU_KM, JD_EPOCH_0 } from "@/components/gtoc/utils/constants";

export type BodyType = "Planet" | "Asteroid" | "Comet";

export interface Body {
  id: string;
  name: string;
  type: BodyType;
  a_AU: number;
  e: number;
  inc: number;
  Omega: number;
  omega: number;
  M0: number;
  epoch_JD: number;
  color?: string;
}

/**
 * Loads and parses a GTOC13 body catalog from CSV.
 * Returns an array of bodies with orbital elements normalized to AU and radians.
 */
export function useBodiesFromGTOCCSV(
  url: string,
  keepTypes: BodyType[] = ["Planet", "Asteroid", "Comet"]
) {
  const [bodies, setBodies] = useState<Body[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resp = await fetch(url, { cache: "no-store" });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} loading ${url}`);

        const text = await resp.text();
        const lines = text
          .split(/\r?\n/)
          .map(l => l.trim())
          .filter(Boolean);

        if (lines.length < 2) throw new Error("CSV missing data rows.");

        const header = lines[0].split(",").map(h => h.trim());
        const out: Body[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(",").map(c => c.trim());
          if (cells.length !== header.length) continue;

          const rec: Record<string, string> = {};
          for (let j = 0; j < header.length; j++) rec[header[j]] = cells[j];

          const type = (rec["Type"] ?? "Asteroid") as BodyType;
          if (!keepTypes.includes(type)) continue;

          const a_km = Number(rec["a"]);
          const e = Number(rec["e"]);
          const iDeg = Number(rec["i"]);
          const ODeg = Number(rec["Omega"]);
          const wDeg = Number(rec["omega"]);
          const MDeg = Number(rec["M"]);

          if ([a_km, e, iDeg, ODeg, wDeg, MDeg].some(v => !Number.isFinite(v))) continue;

          out.push({
            id: rec["ID"] || `body-${i}`,
            name: rec["Name"] || `Body ${i}`,
            type,
            a_AU: a_km / AU_KM,
            e,
            inc: THREE.MathUtils.degToRad(iDeg),
            Omega: THREE.MathUtils.degToRad(ODeg),
            omega: THREE.MathUtils.degToRad(wDeg),
            M0: THREE.MathUtils.degToRad(MDeg),
            epoch_JD: JD_EPOCH_0,
          });
        }

        if (!cancelled) {
          setBodies(out);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setBodies(null);
          setError(err.message ?? String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(keepTypes)]);

  return { bodies, error };
}
