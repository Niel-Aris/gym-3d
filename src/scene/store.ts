import { create } from "zustand";
import { STATION_BY_ID } from "./stations";
import { SIM_SPEED, initLive, step, type Live } from "./sim";

type Gym = {
  story: 0 | 1;
  explode: boolean;
  labels: boolean;
  pins: boolean;
  selected: string | null;
  hovered: string | null;
  clock: number; // simulated seconds since midnight
  live: Record<string, Live>;
  setStory: (s: 0 | 1) => void;
  goUp: () => void;
  goDown: () => void;
  toggleExplode: () => void;
  toggleLabels: () => void;
  togglePins: () => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  start: () => void;
  tick: () => void;
};

export const useGym = create<Gym>((set, get) => ({
  story: 0,
  explode: false,
  labels: true,
  pins: true,
  selected: null,
  hovered: null,
  clock: 0,
  live: {},
  setStory: (story) => {
    const sel = get().selected;
    const keep = sel && STATION_BY_ID.get(sel)?.floor === story;
    set({ story, selected: keep ? sel : null });
  },
  goUp: () => get().setStory(1),
  goDown: () => get().setStory(0),
  toggleExplode: () => set((s) => ({ explode: !s.explode })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  togglePins: () => set((s) => ({ pins: !s.pins })),
  select: (id) => {
    if (id === null) return set({ selected: null });
    const st = STATION_BY_ID.get(id);
    if (!st) return;
    set({ selected: id, story: st.floor });
  },
  hover: (hovered) => set({ hovered }),
  // The simulation only starts on the client (it uses Math.random and the local time).
  start: () => {
    if (Object.keys(get().live).length) return;
    const now = new Date();
    const clock = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    set({ clock, live: initLive(clock) });
  },
  tick: () => {
    const { clock, live } = get();
    if (!Object.keys(live).length) return;
    const c = clock + SIM_SPEED;
    set({ clock: c, live: step(live, c) });
  },
}));

/** Imperative camera commands; the Rig inside the Canvas wires these up. */
export const view: {
  zoom: (factor: number) => void;
  rotate: (radians: number) => void;
  reset: () => void;
  refocus: () => void;
} = {
  zoom: () => {},
  rotate: () => {},
  reset: () => {},
  refocus: () => {},
};

/** `?snap` skips animations (used for deterministic screenshots). */
export const SNAP = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("snap");
