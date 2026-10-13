import { META, STATIONS, type Station } from "./stations";

// A tiny, fake "live" gym: members start sessions on stations, do sets with rests, then leave.
// Times are in simulated seconds; the store advances the clock faster than real time.

export type Status = "free" | "busy" | "maint";

export type Live = {
  status: Status;
  start: number;
  dur: number;
  nextAt: number;
  sets: number;
  v1: number;
  v2: number;
  member: string;
  sessions: number;
  minutes: number;
};

export const SIM_SPEED = 8; // sim seconds per real second
export const WORK = 45;
export const REST = 75;
export const MAINT_IDS = new Set(["F1-02", "F2-16"]);

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const gap = (st: Station) => (st.group === "cardio" ? rand(300, 1000) : rand(120, 600));
const pick = (m: { min: number; max: number; step: number }) => {
  const n = Math.floor((m.max - m.min) / m.step);
  return Math.round((m.min + Math.floor(Math.random() * (n + 1)) * m.step) * 10) / 10;
};

export function phaseOf(l: Live, clock: number) {
  const cycle = WORK + REST;
  const e = Math.max(0, clock - l.start);
  const set = Math.min(l.sets, Math.floor(e / cycle) + 1);
  const inCycle = e - (set - 1) * cycle;
  const working = inCycle < WORK && e < l.dur;
  const remain = working ? WORK - inCycle : cycle - inCycle;
  return {
    set,
    working,
    remain: Math.max(0, Math.round(remain)),
    progress: Math.min(1, e / l.dur),
    elapsed: e,
  };
}

function session(st: Station, clock: number, prev: Live, elapsed = 0): Live {
  const meta = META[st.kind];
  const cardio = st.group === "cardio";
  const sets = cardio ? 1 : 3 + Math.floor(Math.random() * 3);
  const dur = cardio ? rand(900, 1500) : sets * (WORK + REST) - REST;
  return {
    ...prev,
    status: "busy",
    start: clock - elapsed,
    dur,
    sets,
    v1: pick(meta.m1),
    v2: pick(meta.m2),
    member: `M-${100 + Math.floor(Math.random() * 900)}`,
  };
}

export function initLive(clock: number): Record<string, Live> {
  const out: Record<string, Live> = {};
  for (const st of STATIONS) {
    const base: Live = {
      status: "free",
      start: 0,
      dur: 0,
      nextAt: clock + gap(st),
      sets: 0,
      v1: 0,
      v2: 0,
      member: "",
      sessions: 4 + Math.floor(Math.random() * 20),
      minutes: 0,
    };
    base.minutes = base.sessions * Math.round(rand(6, 11));
    if (MAINT_IDS.has(st.id)) out[st.id] = { ...base, status: "maint", nextAt: Infinity };
    else if (Math.random() < 0.5) {
      const s = session(st, clock, base, 0);
      out[st.id] = { ...s, start: clock - rand(0, s.dur * 0.7) };
    } else out[st.id] = base;
  }
  return out;
}

/** Advance the simulation; returns the same object when nothing changed. */
export function step(live: Record<string, Live>, clock: number): Record<string, Live> {
  let next: Record<string, Live> | null = null;
  for (const st of STATIONS) {
    const l = live[st.id];
    if (!l || l.status === "maint") continue;
    if (l.status === "busy" && clock >= l.start + l.dur) {
      next ??= { ...live };
      next[st.id] = {
        ...l,
        status: "free",
        sessions: l.sessions + 1,
        minutes: l.minutes + Math.round(l.dur / 60),
        nextAt: clock + gap(st),
      };
    } else if (l.status === "free" && clock >= l.nextAt) {
      next ??= { ...live };
      next[st.id] = session(st, clock, l);
    }
  }
  return next ?? live;
}

export const fmtClock = (sec: number) => {
  const s = Math.floor(sec) % 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const fmtDur = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
