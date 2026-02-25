"use client";

import { create } from "zustand";
import { parseSolutionFile } from "./parseSolutionFile";
import type { Solution } from "./types";
import { propagateArcCowell } from "@/components/gtoc/utils/arc_trajectories_cowells_method";
import { ALTAIRA_GM } from "@/components/gtoc/utils/constants";

interface SolutionsState {
  solutions: Solution[];
  visible: Record<string, boolean>;
  integratorSteps: number;
  importSolution: (input: File | string) => Promise<void>;
  deleteSolution: (id: string) => void;
  toggle: (id: string) => void;
  recolorSolution: (id: string, newColor: string) => void;
  updateSolution: (id: string, updates: Partial<Solution>) => void;
  setIntegratorSteps: (n: number) => void;
  repropagateAll: () => void;
  loadPersisted: () => Promise<void>;
}

function isVec3(v: unknown): v is number[] {
  return Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === "number");
}

/* Helper to propagate a solution from raw samples */
function propagateSolution(rawSamples: any[], steps: number): any[] {
  const propagatedSamples: any[] = [];
  for (let i = 0; i < rawSamples.length - 1; i++) {
    const s0 = rawSamples[i];
    const s1 = rawSamples[i + 1];
    const dt = s1.t - s0.t;
    const isArc = s0.bodyId === 0;

    if (isArc && dt > 0.0001 && isVec3(s0.p) && isVec3(s0.v)) {
      try {
        const sol = propagateArcCowell(s0.p, s0.v, dt, ALTAIRA_GM, steps);
        sol.forEach(({ t, state }: { t: number; state: number[] }) => {
          propagatedSamples.push({
            t: s0.t + t,
            p: state.slice(0, 3),
            v: state.slice(3, 6),
            bodyId: 0,
            flag: 0,
          });
        });
      } catch (err) {
        console.error(`[Cowell] Arc propagation failed at segment ${i}:`, err);
        propagatedSamples.push(s0);
      }
    } else {
      propagatedSamples.push(s0);
    }
  }
  if (rawSamples.length > 0) {
    propagatedSamples.push(rawSamples[rawSamples.length - 1]);
  }
  return propagatedSamples;
}

export const useSolutions = create<SolutionsState>((set, get) => ({
  solutions: [],
  visible: {},
  integratorSteps: 200,

  loadPersisted: async () => {
    return;
  },

  setIntegratorSteps: (n: number) => set({ integratorSteps: n }),

  repropagateAll: () => {
    const { solutions, integratorSteps } = get();
    const newSolutions = solutions.map((sol) => {
      // Only re-propagate if we have raw samples
      if (!sol.rawSamples) return sol;

      const newSamples = propagateSolution(sol.rawSamples, integratorSteps);
      return { ...sol, samples: newSamples };
    });
    set({ solutions: newSolutions });
  },

  importSolution: async (input: File | string) => {
    try {
      let fileForParser: File;
      if (typeof input === "string") {
        fileForParser = new File([input], "solution.txt", { type: "text/plain" });
      } else {
        fileForParser = input;
      }

      const parsed: Solution = await parseSolutionFile(fileForParser);
      // Store raw samples for re-propagation
      const rawSamples = parsed.samples;

      // Propagate using current settings
      const propagatedSamples = propagateSolution(rawSamples, get().integratorSteps);

      const propagatedSolution: Solution = {
        ...parsed,
        samples: propagatedSamples,
        rawSamples: rawSamples,
      };

      set((state) => ({
        solutions: [...state.solutions, propagatedSolution],
        visible: { ...state.visible, [propagatedSolution.id]: true },
      }));
    } catch (err) {
      console.error("[useSolutions] Failed to import solution:", err);
    }
  },

  deleteSolution: (id: string) => {
    set((state) => ({
      solutions: state.solutions.filter((s) => s.id !== id),
      visible: Object.fromEntries(Object.entries(state.visible).filter(([k]) => k !== id)),
    }));
  },

  toggle: (id: string) => {
    set((state) => ({
      visible: { ...state.visible, [id]: !state.visible[id] },
    }));
  },

  recolorSolution: (id: string, newColor: string) => {
    set((state) => ({
      solutions: state.solutions.map((s) => (s.id === id ? { ...s, color: newColor } : s)),
    }));
  },

  updateSolution: (id: string, updates: Partial<Solution>) => {
    set((state) => ({
      solutions: state.solutions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },
}));
