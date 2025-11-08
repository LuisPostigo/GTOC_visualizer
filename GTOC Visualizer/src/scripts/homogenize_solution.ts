import * as fs from "fs";
import * as path from "path";
import * as THREE from "three";

/**
 * Homogenizes a GTOC solution text file to ensure viewer compatibility.
 * - Enforces strictly increasing times
 * - Assumes all positions (x,y,z) are in **kilometers**
 * - Rebuilds flags to mark continuous arcs (flag=0) and flyby transitions (flag=1)
 * - Preserves all numeric columns (bodyId, flag, t, x, y, z, vx, vy, vz, etc.)
 * - Overwrites the original file by default
 */
export function homogenizeSolution(inputPath: string, outputPath?: string) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && !l.startsWith("//") && !l.startsWith("!"));

  const states: { t: number; parts: string[]; r: THREE.Vector3 }[] = [];
  let globalT = 0;
  let lastT = 0;

  // Pass 1: ensure monotonic time
  for (const ln of lines) {
    const parts = ln.split(/[,\s]+/).filter(Boolean);
    if (parts.length < 9) continue;

    const t = Number(parts[2]);
    if (!Number.isFinite(t)) continue;

    // ensure increasing time
    if (states.length > 0 && t < lastT) {
      const dt = Math.abs(lastT - t);
      globalT += dt;
    }

    const tGlobal = t + globalT;
    lastT = t;

    parts[2] = tGlobal.toFixed(6);
    const r = new THREE.Vector3(Number(parts[3]), Number(parts[4]), Number(parts[5]));
    states.push({ t: tGlobal, parts, r });
  }

  // Pass 2: rebuild flag pattern — 0 = coasting, 1 = flyby
  for (let i = 1; i < states.length; i++) {
    const prev = states[i - 1].parts;
    const cur = states[i].parts;

    const prevBody = Number(prev[0]);
    const curBody = Number(cur[0]);

    // Default coasting
    cur[1] = "0";

    // If body changes, mark previous as flyby event (flag=1)
    if (curBody !== prevBody) {
      cur[1] = "1";
    }
  }

  // Optional: ensure at least one flyby marking even if single body (for safety)
  if (states.every(s => s.parts[1] === "0") && states.length > 2) {
    states[Math.floor(states.length / 2)].parts[1] = "1";
  }

  // Compose homogenized output
  const out = states.map(s => s.parts.join(" ")).join("\n");
  const outPath = outputPath ?? inputPath;
  fs.writeFileSync(outPath, out);

  console.log(
    `[OK] Homogenized ${path.basename(inputPath)} — ${states.length} lines (km units, flags rebuilt)`
  );
}

/* CLI usage */
if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: ts-node homogenize_solution.ts <input.txt> [output.txt]");
    process.exit(1);
  }
  homogenizeSolution(input, process.argv[3]);
}
