import { create } from "zustand";
import { Solution } from "./types";
import { parseSolutionFile } from "./parseSolutionFile";

/* ---------- Types ---------- */
type SolutionsState = {
  solutions: Solution[];
  visible: Record<string, boolean>;
  importSolution: (file: File) => Promise<void>;
  deleteSolution: (id: string) => Promise<void>;
  toggle: (id: string) => void;
  recolorSolution: (id: string, newColor: string) => void;
  loadPersisted: () => Promise<void>;
};

/* ---------- Zustand global store ---------- */
export const useSolutions = create<SolutionsState>((set, get) => ({
  solutions: [],
  visible: {},

  /* === Load all persisted solutions from /api/solutions === */
  loadPersisted: async () => {
    try {
      const res = await fetch("/api/solutions");
      if (!res.ok) throw new Error("Failed to load persisted solutions");
      const data = await res.json();
      const sols: Solution[] = data.solutions ?? [];
      const visibility = Object.fromEntries(sols.map((s) => [s.id, true]));
      console.log(`[useSolutions] Loaded ${sols.length} persisted solutions`);
      set({ solutions: sols, visible: visibility });
    } catch (err) {
      console.error("[useSolutions] loadPersisted error:", err);
    }
  },

  /* === Import new file → persist to disk → load it locally === */
  importSolution: async (file: File) => {
    try {
      // Upload to API (permanent storage)
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/solutions", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload solution");
      console.log(`[useSolutions] Uploaded ${file.name}`);

      // Parse locally for immediate visualization
      const sol = await parseSolutionFile(file);

      set((state) => ({
        solutions: [...state.solutions, sol],
        visible: { ...state.visible, [sol.id]: true },
      }));
    } catch (err) {
      console.error("[useSolutions] importSolution error:", err);
    }
  },

  /* === Delete a solution (both locally + server-side) === */
  deleteSolution: async (id: string) => {
    try {
      await fetch(`/api/solutions?name=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      console.log(`[useSolutions] Deleted ${id}`);
      set((state) => ({
        solutions: state.solutions.filter((s) => s.id !== id),
        visible: Object.fromEntries(
          Object.entries(state.visible).filter(([k]) => k !== id)
        ),
      }));
    } catch (err) {
      console.error("[useSolutions] deleteSolution error:", err);
    }
  },

  /* === Toggle visibility of a given solution === */
  toggle: (id: string) =>
    set((state) => ({
      visible: { ...state.visible, [id]: !state.visible[id] },
    })),

  /* === Recolor a given solution === */
  recolorSolution: (id, newColor) =>
    set((state) => {
      console.log(`[useSolutions] recolorSolution → ${id} = ${newColor}`);
      const updated = state.solutions.map((s) =>
        s.id === id ? { ...s, color: newColor } : s
      );
      return { solutions: [...updated] }; // ensure new array reference
    }),
}));
