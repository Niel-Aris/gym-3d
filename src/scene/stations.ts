import { FLOOR_1, FLOOR_2, INFO, type Group, type Item, type Kind } from "./layout";

export type Metric = { label: string; unit: string; min: number; max: number; step: number };
export type Pose = "sit" | "stand" | "lie";

export type Meta = {
  type: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  primary: string[];
  secondary: string[];
  m1: Metric;
  m2: Metric;
  tip: string;
  /** approximate height in metres (used to place pins) */
  h: number;
  /** where the exerciser stands/sits, in the machine's local space */
  user: { pose: Pose; pos: [number, number, number]; seat?: number; rotY?: number; move?: "run" | "climb" | "cycle" };
};

const reps = (min = 8, max = 12): Metric => ({ label: "Reps", unit: "reps", min, max, step: 1 });
const kg = (min: number, max: number, step = 5, label = "Load"): Metric => ({ label, unit: "kg", min, max, step });

export const META: Record<Kind, Meta> = {
  chestPress: { type: "Selectorised", level: "Beginner", primary: ["Chest"], secondary: ["Shoulders", "Triceps"], m1: kg(20, 80), m2: reps(), tip: "Keep shoulder blades pinched back and press without locking the elbows.", h: 1.6, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.12] } },
  pecDeck: { type: "Selectorised", level: "Beginner", primary: ["Chest"], secondary: ["Front delts"], m1: kg(15, 60), m2: reps(10, 15), tip: "Lead with the elbows and squeeze for a beat at the centre.", h: 1.6, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  shoulderPress: { type: "Selectorised", level: "Beginner", primary: ["Shoulders"], secondary: ["Triceps", "Upper chest"], m1: kg(15, 60), m2: reps(), tip: "Brace your core and press straight up, not forward.", h: 2.3, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  latPulldown: { type: "Selectorised", level: "Beginner", primary: ["Lats"], secondary: ["Biceps", "Rear delts"], m1: kg(25, 75), m2: reps(), tip: "Pull the bar to the upper chest, leading with the elbows.", h: 2.4, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.4] } },
  seatedRow: { type: "Selectorised", level: "Beginner", primary: ["Mid back"], secondary: ["Lats", "Biceps"], m1: kg(25, 75), m2: reps(), tip: "Sit tall, pull to the stomach and avoid rocking the torso.", h: 1.8, user: { pose: "sit", seat: 0.56, pos: [0, 0, 0.62], rotY: Math.PI } },
  benchPress: { type: "Free weight rack", level: "Intermediate", primary: ["Chest"], secondary: ["Triceps", "Shoulders"], m1: kg(40, 120, 2.5, "Bar load"), m2: reps(5, 10), tip: "Feet planted, bar touches mid-chest, always use the safety arms.", h: 1.8, user: { pose: "lie", pos: [0, 0.5, 0.35] } },
  cableCross: { type: "Cable station", level: "Intermediate", primary: ["Chest"], secondary: ["Shoulders", "Core"], m1: kg(5, 30, 2.5), m2: reps(10, 15), tip: "Slight bend in the elbows, bring the handles together in an arc.", h: 2.4, user: { pose: "stand", pos: [0, 0, 0.3] } },
  bicepCurl: { type: "Selectorised", level: "Beginner", primary: ["Biceps"], secondary: ["Forearms"], m1: kg(10, 45), m2: reps(), tip: "Upper arms stay on the pad, control the way down.", h: 1.5, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.2] } },
  tricepExt: { type: "Selectorised", level: "Beginner", primary: ["Triceps"], secondary: ["Shoulders"], m1: kg(10, 50), m2: reps(), tip: "Elbows pinned to the sides, extend fully and pause.", h: 1.5, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.15] } },
  bench: { type: "Free-weight bench", level: "Beginner", primary: ["Chest", "Arms"], secondary: ["Core"], m1: kg(8, 32, 2, "Dumbbells"), m2: reps(), tip: "Use the dumbbell rack behind you and re-rack after each set.", h: 0.6, user: { pose: "lie", pos: [0, 0.5, 0.15] } },
  inclineBench: { type: "Free-weight bench", level: "Beginner", primary: ["Upper chest", "Shoulders"], secondary: ["Triceps"], m1: kg(8, 30, 2, "Dumbbells"), m2: reps(), tip: "Set the angle near 30° and keep your wrists stacked over elbows.", h: 1.1, user: { pose: "sit", seat: 0.5, pos: [0, 0.15, -0.25] } },
  legPress: { type: "Plate-loaded", level: "Beginner", primary: ["Quads", "Glutes"], secondary: ["Hamstrings", "Calves"], m1: kg(60, 220, 10, "Plates"), m2: reps(8, 15), tip: "Feet shoulder-width, lower until knees reach ~90°, never lock out.", h: 1.9, user: { pose: "sit", seat: 0.45, pos: [0, 0.25, -0.5] } },
  hackSquat: { type: "Plate-loaded", level: "Intermediate", primary: ["Quads"], secondary: ["Glutes"], m1: kg(40, 160, 10, "Plates"), m2: reps(6, 12), tip: "Back flat on the pad, drive through the whole foot.", h: 2.0, user: { pose: "stand", pos: [0, 0.55, 0.4] } },
  smith: { type: "Guided barbell", level: "Intermediate", primary: ["Quads", "Glutes"], secondary: ["Core", "Shoulders"], m1: kg(30, 130, 5, "Bar load"), m2: reps(5, 10), tip: "Feet slightly forward of the bar and rotate the hooks to re-rack.", h: 2.4, user: { pose: "stand", pos: [0, 0, 0] } },
  calfRaise: { type: "Selectorised", level: "Beginner", primary: ["Calves"], secondary: [], m1: kg(40, 120, 10), m2: reps(12, 20), tip: "Full stretch at the bottom, pause at the top.", h: 1.7, user: { pose: "stand", pos: [0, 0.23, 0.35] } },
  legExtension: { type: "Selectorised", level: "Beginner", primary: ["Quads"], secondary: [], m1: kg(15, 70), m2: reps(10, 15), tip: "Align your knees with the pivot and squeeze at the top.", h: 1.4, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  legCurl: { type: "Selectorised", level: "Beginner", primary: ["Hamstrings"], secondary: ["Calves"], m1: kg(15, 65), m2: reps(10, 15), tip: "Hips down, curl smoothly and resist on the way back.", h: 1.4, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  hipAbductor: { type: "Selectorised", level: "Beginner", primary: ["Glutes (outer)"], secondary: ["Hip stabilisers"], m1: kg(20, 80), m2: reps(12, 20), tip: "Push the pads out without leaning forward.", h: 1.4, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  hipAdductor: { type: "Selectorised", level: "Beginner", primary: ["Inner thighs"], secondary: ["Hip stabilisers"], m1: kg(20, 80), m2: reps(12, 20), tip: "Squeeze the pads together slowly and control the return.", h: 1.4, user: { pose: "sit", seat: 0.6, pos: [0, 0, 0.1] } },
  gluteKick: { type: "Selectorised", level: "Intermediate", primary: ["Glutes"], secondary: ["Hamstrings", "Core"], m1: kg(10, 60), m2: reps(10, 15), tip: "Drive the heel back, keep the hips square to the machine.", h: 1.5, user: { pose: "stand", pos: [0, 0, 0.3] } },
  squatRack: { type: "Free weight rack", level: "Advanced", primary: ["Quads", "Glutes"], secondary: ["Core", "Back"], m1: kg(40, 160, 2.5, "Bar load"), m2: reps(3, 8), tip: "Set the hooks below shoulder height and the safeties just under squat depth.", h: 2.4, user: { pose: "stand", pos: [0, 0, 0.0] } },
  treadmill: { type: "Cardio", level: "Beginner", primary: ["Heart", "Legs"], secondary: ["Core"], m1: { label: "Speed", unit: "km/h", min: 6, max: 14, step: 0.5 }, m2: { label: "Incline", unit: "%", min: 0, max: 8, step: 1 }, tip: "Clip the safety key to your clothing and ease in over 3 minutes.", h: 1.8, user: { pose: "stand", pos: [0, 0.4, 0.15], rotY: Math.PI, move: "run" } },
  stairmaster: { type: "Cardio", level: "Intermediate", primary: ["Glutes", "Quads"], secondary: ["Calves", "Heart"], m1: { label: "Level", unit: "", min: 4, max: 12, step: 1 }, m2: { label: "Pace", unit: "steps/min", min: 50, max: 90, step: 5 }, tip: "Stand tall, light grip on the rails, full foot on each step.", h: 2.3, user: { pose: "stand", pos: [0, 0.3, 0.05], rotY: Math.PI, move: "climb" } },
  bike: { type: "Cardio", level: "Beginner", primary: ["Heart", "Quads"], secondary: ["Calves", "Glutes"], m1: { label: "Resistance", unit: "lvl", min: 4, max: 16, step: 1 }, m2: { label: "Cadence", unit: "rpm", min: 60, max: 95, step: 5 }, tip: "Saddle at hip height, soft knees at the bottom of the stroke.", h: 1.9, user: { pose: "sit", seat: 1.2, pos: [0, 0, 0.36], rotY: Math.PI, move: "cycle" } },
};

export type Station = {
  id: string;
  kind: Kind;
  floor: 0 | 1;
  label: string;
  group: Group;
  x: number;
  z: number;
  rot: number;
  index: number;
};

function build(items: Item[], floor: 0 | 1): Station[] {
  return items.map((it, i) => ({
    id: `F${floor + 1}-${String(i + 1).padStart(2, "0")}`,
    kind: it.kind,
    floor,
    label: INFO[it.kind].label,
    group: INFO[it.kind].group,
    x: it.x,
    z: it.z,
    rot: it.rot ?? 0,
    index: i,
  }));
}

export const STATIONS: Station[] = [...build(FLOOR_1, 0), ...build(FLOOR_2, 1)];
export const STATION_BY_ID = new Map(STATIONS.map((s) => [s.id, s]));
