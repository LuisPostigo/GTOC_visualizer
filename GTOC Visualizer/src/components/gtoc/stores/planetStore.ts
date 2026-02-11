import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Planet = {
  id: number | string;
  name: string;
  color: string;
  type?: string;
  elements: number[];
};

type HoveredContext = { id: string; name: string; type: "planet" | "ship" };

type PlanetStore = {
  planets: Planet[];
  selectedBodies: string[];
  centerBodyId: string | null;
  setPlanets: (list: Planet[]) => void;
  togglePlanet: (idOrName: string) => void;
  setCenterBody: (id: string | null) => void;
  updatePlanetColor: (id: string | number, color: string) => void;
  updatePlanetTypeColor: (type: string, color: string) => void;
  showOrbits: boolean;
  toggleShowOrbits: () => void;
  clearAll: () => void;
  hoveredContext: HoveredContext | null;
  setHoveredContext: (ctx: HoveredContext | null) => void;
  lockedBodyId: string | null;
  setLockedBodyId: (id: string | null) => void;
  customColors: Record<string, string>;
};

export const usePlanetStore = create<PlanetStore>()(
  persist(
    (set, get) => ({
      planets: [],
      selectedBodies: [],
      centerBodyId: null,
      showOrbits: true,
      lockedBodyId: null,
      customColors: {},
      hoveredContext: null,

      setPlanets: (list) => set({ planets: list }),

      togglePlanet: (idOrName) => {
        const selected = get().selectedBodies;
        set({
          selectedBodies: selected.includes(idOrName)
            ? selected.filter((n) => n !== idOrName)
            : [...selected, idOrName],
        });
      },

      setCenterBody: (id) => set({ centerBodyId: id }),

      updatePlanetColor: (id, color) => {
        set((state) => ({
          planets: state.planets.map((p) =>
            String(p.id) === String(id) ? { ...p, color } : p
          ),
          customColors: { ...state.customColors, [String(id)]: color },
        }));
      },

      updatePlanetTypeColor: (type, color) => {
        set((state) => ({
          planets: state.planets.map((p) =>
            (p.type || "").toLowerCase() === type.toLowerCase()
              ? { ...p, color }
              : p
          ),
        }));
      },

      toggleShowOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),

      clearAll: () => set({ selectedBodies: [] }),

      setHoveredContext: (ctx) => set({ hoveredContext: ctx }),

      setLockedBodyId: (id) => set({ lockedBodyId: id }),
    }),
    {
      name: "vectra-planet-store",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any)
      ),
      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 1) {
          return {
            selectedBodies: [],
            centerBodyId: null,
            showOrbits: true,
            lockedBodyId: null,
            customColors: {},
          };
        }
        return persistedState as any;
      },
      partialize: (state) => ({
        selectedBodies: state.selectedBodies,
        centerBodyId: state.centerBodyId,
        showOrbits: state.showOrbits,
        lockedBodyId: state.lockedBodyId,
        customColors: state.customColors,
      }),
    }
  )
);
