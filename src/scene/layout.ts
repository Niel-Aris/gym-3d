// Single source of truth for what stands where. Rotation 0 = user faces +z (towards the entrance side).
export type Kind =
  | "chestPress" | "pecDeck" | "shoulderPress" | "latPulldown" | "seatedRow"
  | "benchPress" | "cableCross" | "bicepCurl" | "tricepExt" | "bench" | "inclineBench"
  | "legPress" | "hackSquat" | "smith" | "calfRaise" | "legExtension" | "legCurl"
  | "hipAbductor" | "hipAdductor" | "gluteKick" | "squatRack"
  | "treadmill" | "stairmaster" | "bike";

export type Item = { kind: Kind; x: number; z: number; rot?: number };

export type Group = "upper" | "lower" | "cardio" | "other";

export const INFO: Record<Kind, { label: string; group: Group }> = {
  chestPress: { label: "Chest press", group: "upper" },
  pecDeck: { label: "Pec deck", group: "upper" },
  shoulderPress: { label: "Shoulder press", group: "upper" },
  latPulldown: { label: "Lat pulldown", group: "upper" },
  seatedRow: { label: "Seated row", group: "upper" },
  benchPress: { label: "Bench press rack", group: "upper" },
  cableCross: { label: "Cable crossover", group: "upper" },
  bicepCurl: { label: "Bicep curl", group: "upper" },
  tricepExt: { label: "Tricep extension", group: "upper" },
  bench: { label: "Flat bench", group: "other" },
  inclineBench: { label: "Incline bench", group: "other" },
  legPress: { label: "Leg press", group: "lower" },
  hackSquat: { label: "Hack squat", group: "lower" },
  smith: { label: "Smith machine", group: "lower" },
  calfRaise: { label: "Calf raise", group: "lower" },
  legExtension: { label: "Leg extension", group: "lower" },
  legCurl: { label: "Leg curl", group: "lower" },
  hipAbductor: { label: "Hip abductor", group: "lower" },
  hipAdductor: { label: "Hip adductor", group: "lower" },
  gluteKick: { label: "Glute kickback", group: "lower" },
  squatRack: { label: "Squat rack", group: "lower" },
  treadmill: { label: "Treadmill", group: "cardio" },
  stairmaster: { label: "Stairmaster", group: "cardio" },
  bike: { label: "Exercise bike", group: "cardio" },
};

export const FLOOR_1: Item[] = [
  // row A
  { kind: "chestPress", x: -1.2, z: -2.1 },
  { kind: "chestPress", x: 1.0, z: -2.1 },
  { kind: "pecDeck", x: 3.2, z: -2.1 },
  { kind: "shoulderPress", x: 5.2, z: -2.1 },
  // row B
  { kind: "latPulldown", x: -1.2, z: 0.6 },
  { kind: "latPulldown", x: 1.0, z: 0.6 },
  { kind: "seatedRow", x: 3.2, z: 0.6 },
  { kind: "seatedRow", x: 5.2, z: 0.6 },
  // row C
  { kind: "benchPress", x: -1.0, z: 3.2 },
  { kind: "bicepCurl", x: 1.1, z: 3.2 },
  { kind: "tricepExt", x: 2.7, z: 3.2 },
  { kind: "cableCross", x: 4.9, z: 3.2 },
  // free-weights benches in front of the dumbbell rack
  { kind: "bench", x: 0.6, z: -4.0 },
  { kind: "inclineBench", x: 2.6, z: -4.0 },
];

export const FLOOR_2: Item[] = [
  // cardio along the back wall, runners face the windows
  { kind: "treadmill", x: -6.8, z: -4.8 },
  { kind: "treadmill", x: -5.2, z: -4.8 },
  { kind: "treadmill", x: -3.6, z: -4.8 },
  { kind: "treadmill", x: -2.0, z: -4.8 },
  { kind: "stairmaster", x: 0.0, z: -4.9 },
  { kind: "stairmaster", x: 1.5, z: -4.9 },
  { kind: "bike", x: 3.1, z: -4.8 },
  { kind: "bike", x: 4.3, z: -4.8 },
  { kind: "bike", x: 5.5, z: -4.8 },
  // row A: big lower-body machines
  { kind: "legPress", x: -6.0, z: -1.6 },
  { kind: "legPress", x: -3.6, z: -1.6 },
  { kind: "hackSquat", x: -1.2, z: -1.6 },
  { kind: "smith", x: 1.6, z: -1.6 },
  { kind: "calfRaise", x: 4.4, z: -1.6 },
  // row B: seated machines
  { kind: "legExtension", x: -6.4, z: 1.7 },
  { kind: "legCurl", x: -4.8, z: 1.7 },
  { kind: "hipAbductor", x: -3.2, z: 1.7 },
  { kind: "hipAdductor", x: -1.6, z: 1.7 },
  { kind: "gluteKick", x: 0.1, z: 1.7 },
  // row C
  { kind: "squatRack", x: -5.0, z: 4.0 },
];
