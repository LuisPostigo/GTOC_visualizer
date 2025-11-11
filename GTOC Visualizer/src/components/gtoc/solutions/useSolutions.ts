"use client";

/**
 * useSolutions.ts — Central store for GTOC solutions
 * --------------------------------------------------
 * - loads/parses uploaded solution files
 * - runs Cowell propagation on valid arcs
 * - exposes visibility / color controls for the UI and 3D view
 */

import { create } from "zustand";
import { parseSolutionFile } from "./parseSolutionFile";
import type { Solution } from "./types";
import { propagateArcCowell } from "@/components/gtoc/utils/arc_trajectories_cowells_method";
import { ALTAIRA_GM } from "@/components/gtoc/utils/constants";

/* =============================================================
   Types
============================================================= */
interface SolutionsState {
  solutions: Solution[];
  visible: Record<string, boolean>;
  importSolution: (input: File | string) => Promise<void>;
  deleteSolution: (id: string) => void;
  toggle: (id: string) => void;
  recolorSolution: (id: string, newColor: string) => void;
  loadPersisted: () => Promise<void>;
}

/* =============================================================
   Helpers
============================================================= */
function isVec3(v: unknown): v is number[] {
  return Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === "number");
}

/* =============================================================
   Store
============================================================= */
export const useSolutions = create<SolutionsState>((set) => ({
  solutions: [],
  visible: {},

  /**
   * Initializes the store.
   * In this project we don't restore solutions from disk yet,
   * so we just reset the state.
   */
  loadPersisted: async () => {
    console.log("[useSolutions] Local-only mode — no persistence.");
    set({ solutions: [], visible: {} });
  },

  /**
   * Core ingestion pipeline:
   * 1. accept a File or raw string
   * 2. parse it into a Solution object
   * 3. walk the samples, detect valid 0→0 arcs
   * 4. propagate those arcs numerically (Cowell)
   * 5. push the propagated samples into state
   */
  importSolution: async (input: File | string) => {
    try {
      // normalize input so the parser always receives a File
      let fileForParser: File;
      if (typeof input === "string") {
        fileForParser = new File([input], "solution.txt", { type: "text/plain" });
      } else {
        fileForParser = input;
      }

      // turn raw text file into our in-memory Solution shape
      const parsed: Solution = await parseSolutionFile(fileForParser);

      // we’ll build a brand-new sample list containing both
      // original and propagated samples
      const propagatedSamples: any[] = [];

      // walk all consecutive pairs to find arcs, same logic as the Python script
      for (let i = 0; i < parsed.samples.length - 1; i++) {
        const s0 = parsed.samples[i];
        const s1 = parsed.samples[i + 1];
        const dt = s1.t - s0.t;

        // “valid arc” = source is body 0, no flag, and target is also unflagged
        const isArc = s0.bodyId === 0 && s0.flag === 0 && s1.flag === 0;

        // we only propagate if:
        // - it’s an arc
        // - the arc is not trivially short
        // - we actually have both position and velocity
        if (isArc && dt > 1.0 && isVec3(s0.p) && isVec3(s0.v)) {
          const r0 = s0.p;
          const v0 = s0.v;

          try {
            // this mirrors the Python spacing: we pass 200 so the 3D looks smooth
            const sol = propagateArcCowell(r0, v0, dt, ALTAIRA_GM, 200);

            // convert integrator output to our sample format
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
            // if a single arc fails, keep the original node so the path isn’t broken
            console.error(`[Cowell] Arc propagation failed at segment ${i}:`, err);
            propagatedSamples.push(s0);
          }
        } else {
          // not an arc → just forward the original sample
          propagatedSamples.push(s0);
        }
      }

      // keep the very last sample from the file (endpoint)
      if (parsed.samples.length > 0) {
        propagatedSamples.push(parsed.samples[parsed.samples.length - 1]);
      }

      // build the final solution object with our propagated samples
      const propagatedSolution: Solution = {
        ...parsed,
        samples: propagatedSamples,
      };

      // drop it in the store and make it visible by default
      set((state) => ({
        solutions: [...state.solutions, propagatedSolution],
        visible: { ...state.visible, [propagatedSolution.id]: true },
      }));

      console.log(
        `[useSolutions] Propagation complete for ${parsed.name} — ${propagatedSamples.length} propagated samples.`
      );
    } catch (err) {
      console.error("[useSolutions] Failed to import solution:", err);
    }
  },

  /**
   * Remove a solution and its visibility entry
   */
  deleteSolution: (id: string) => {
    set((state) => ({
      solutions: state.solutions.filter((s) => s.id !== id),
      visible: Object.fromEntries(
        Object.entries(state.visible).filter(([k]) => k !== id)
      ),
    }));
  },

  /**
   * Toggle visibility in the 3D / UI
   */
  toggle: (id: string) => {
    set((state) => ({
      visible: { ...state.visible, [id]: !state.visible[id] },
    }));
  },

  /**
   * Change the color for a given solution
   */
  recolorSolution: (id: string, newColor: string) => {
    set((state) => ({
      solutions: state.solutions.map((s) =>
        s.id === id ? { ...s, color: newColor } : s
      ),
    }));
  },
}));
