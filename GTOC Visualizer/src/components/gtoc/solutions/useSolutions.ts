import { create } from "zustand";
import { Solution } from "./types";

type Vec3 = [number, number, number];

type SolutionsState = {
  solutions: Solution[];
  visible: Record<string, boolean>;
  importSolution: (file: File) => Promise<void>;
  deleteSolution: (id: string) => Promise<void>;
  toggle: (id: string) => void;
  recolorSolution: (id: string, newColor: string) => void;
  loadPersisted: () => Promise<void>;
};

export const useSolutions = create<SolutionsState>((set, get) => ({
  solutions: [],
  visible: {},

  loadPersisted: async () => {
    console.log("[useSolutions] Local-only mode, skipping persistence");
    set({ solutions: [], visible: {} });
  },

  importSolution: async (file: File) => {
    try {
      const text = await file.text();
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));

      let sol: Solution | null = null;
      const joined = lines.join("\n");

      try {
        sol = JSON.parse(joined);
      } catch {
        const samples = lines
          .map((line) => {
            const nums = line.split(/[,\s]+/).map(Number);
            if (nums.length < 9 || nums.some((n) => Number.isNaN(n))) return null;

            // GTOC layout: bodyId, flag, t, px, py, pz, vx, vy, vz, ...
            const [bodyId, flag, t, px, py, pz, vx, vy, vz, ...rest] = nums;
            const p: Vec3 = [px, py, pz];
            const v: Vec3 = [vx, vy, vz];
            const u: Vec3 =
              rest.length >= 3 ? [rest[0], rest[1], rest[2]] : [0, 0, 0];

            return { bodyId, flag, t, p, v, u };
          })
          .filter((s): s is NonNullable<typeof s> => !!s);

        sol = {
          id: file.name.replace(/\.[^/.]+$/, ""),
          name: file.name,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
          samples,
        };
      }

      if (!sol?.samples?.length)
        throw new Error(`Invalid or empty data in ${file.name}`);

      set((state) => ({
        solutions: [...state.solutions, sol!],
        visible: { ...state.visible, [sol!.id]: true },
      }));

      console.log(
        `[useSolutions] Imported "${sol.name}" (${sol.samples.length} samples)`
      );
    } catch (err) {
      console.error("[useSolutions] importSolution error:", err);
      alert(`Failed to import solution: ${(err as Error).message}`);
    }
  },

  deleteSolution: async (id: string) => {
    console.log(`[useSolutions] Deleted ${id}`);
    set((state) => ({
      solutions: state.solutions.filter((s) => s.id !== id),
      visible: Object.fromEntries(
        Object.entries(state.visible).filter(([k]) => k !== id)
      ),
    }));
  },

  toggle: (id: string) =>
    set((state) => ({
      visible: { ...state.visible, [id]: !state.visible[id] },
    })),

  recolorSolution: (id, newColor) =>
    set((state) => ({
      solutions: state.solutions.map((s) =>
        s.id === id ? { ...s, color: newColor } : s
      ),
    })),
}));
