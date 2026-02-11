"use client";

import { create } from "zustand";
import { parseSolutionFile } from "./parseSolutionFile";
import type { Solution } from "./types";
import { propagateArcCowell } from "@/components/gtoc/utils/arc_trajectories_cowells_method";
import { ALTAIRA_GM } from "@/components/gtoc/utils/constants";

interface SolutionsState {
  solutions: Solution[];
  visible: Record<string, boolean>;
  importSolution: (input: File | string) => Promise<void>;
  deleteSolution: (id: string) => void;
  toggle: (id: string) => void;
  recolorSolution: (id: string, newColor: string) => void;
  loadPersisted: () => Promise<void>;
}

function isVec3(v: unknown): v is number[] {
  return Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === "number");
}

export const useSolutions = create<SolutionsState>((set, get) => ({
  solutions: [],
  visible: {},

  loadPersisted: async () => {
    return;
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

      const propagatedSamples: any[] = [];

      for (let i = 0; i < parsed.samples.length - 1; i++) {
        const s0 = parsed.samples[i];
        const s1 = parsed.samples[i + 1];
        const dt = s1.t - s0.t;

        const isArc = s0.bodyId === 0 && s0.flag === 0 && s1.flag === 0;

        if (isArc && dt > 1.0 && isVec3(s0.p) && isVec3(s0.v)) {
          const r0 = s0.p;
          const v0 = s0.v;

          try {
            const sol = propagateArcCowell(r0, v0, dt, ALTAIRA_GM, 200);

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

      if (parsed.samples.length > 0) {
        propagatedSamples.push(parsed.samples[parsed.samples.length - 1]);
      }

      const propagatedSolution: Solution = {
        ...parsed,
        samples: propagatedSamples,
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
}));
