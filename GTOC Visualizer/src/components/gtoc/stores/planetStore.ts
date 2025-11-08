import { create } from "zustand";

type Planet = {
  id: number | string;
  name: string;
  color: string;
  type?: string;
};

type PlanetStore = {
  planets: Planet[];
  selectedBodies: string[];
  setPlanets: (list: Planet[]) => void;
  togglePlanet: (idOrName: string) => void;
  clearAll: () => void;
};

export const usePlanetStore = create<PlanetStore>((set, get) => ({
  planets: [],
  selectedBodies: [],

  setPlanets: (list) => set({ planets: list }),

  togglePlanet: (idOrName) => {
    const selected = get().selectedBodies;
    set({
      selectedBodies: selected.includes(idOrName)
        ? selected.filter((n) => n !== idOrName)
        : [...selected, idOrName],
    });
  },

  clearAll: () => set({ selectedBodies: [] }),
}));
