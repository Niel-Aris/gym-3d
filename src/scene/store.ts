import { create } from "zustand";

type Gym = {
  story: 0 | 1;
  explode: boolean;
  labels: boolean;
  setStory: (s: 0 | 1) => void;
  goUp: () => void;
  goDown: () => void;
  toggleExplode: () => void;
  toggleLabels: () => void;
};

export const useGym = create<Gym>((set) => ({
  story: 0,
  explode: false,
  labels: true,
  setStory: (story) => set({ story }),
  goUp: () => set({ story: 1 }),
  goDown: () => set({ story: 0 }),
  toggleExplode: () => set((s) => ({ explode: !s.explode })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
}));

/** Imperative camera commands; the Rig inside the Canvas wires these up. */
export const view: {
  zoom: (factor: number) => void;
  rotate: (radians: number) => void;
  reset: () => void;
} = {
  zoom: () => {},
  rotate: () => {},
  reset: () => {},
};
