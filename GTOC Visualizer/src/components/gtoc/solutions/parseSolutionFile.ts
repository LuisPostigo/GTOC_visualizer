import { Solution, SamplePt } from "./types";

const PALETTE = [
  "#ff6b6b", "#4dabf7", "#63e6be", "#ffd43b", "#845ef7",
  "#ffa94d", "#5c7cfa", "#94d82d", "#fcc2d7", "#66d9e8",
];

function randomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

/** Deterministic parser: reads rows exactly as-is (km or AU) */
export async function parseSolutionFile(file: File): Promise<Solution> {
  const text = await file.text();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("//") && !l.startsWith("!"));

  const samples: SamplePt[] = [];

  for (const line of lines) {
    const parts = line.split(/[,\s]+/).map(Number);
    if (parts.length < 6) continue;

    const [bodyId, flag, t, x, y, z, vx, vy, vz] = parts;
    samples.push({
      t,
      p: [x, y, z],
      v: [vx ?? 0, vy ?? 0, vz ?? 0],
      bodyId,
      flag,
    });
  }

  return {
    id: file.name,
    name: file.name,
    color: randomColor(),
    samples,
  };
}
