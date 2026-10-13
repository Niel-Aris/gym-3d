// Generic, soft isometric palette (pale lavender world, one strong blue accent).
export const C = {
  bg: "#e6ecfb",
  ground: "#dde5f6",
  road: "#c9d2ea",
  line: "#f7d77a",
  floor: "#f2f4fb",
  rubber: "#cbd5ee",
  carpet: "#d9e1fa",
  wall: "#f7f9fe",
  blue: "#2f63f0",
  blueDark: "#1e44b8",
  blueLight: "#6f93f7",
  navy: "#27324f",
  pad: "#2c3659",
  steel: "#c3cbdc",
  steelDark: "#8c97b0",
  plate: "#3a4360",
  rubberBlack: "#2e3550",
  yellow: "#f6b93b",
  orange: "#f28c3d",
  teal: "#22b5b8",
  glass: "#b9d5ff",
  green: "#59c293",
  greenDark: "#3fa377",
  trunk: "#c98e5b",
  white: "#ffffff",
  red: "#ef5b5b",
} as const;

export type V3 = [number, number, number];

// Building dimensions (metres). Footprint x:[-8,8], z:[-6,6]; +z is the front.
export const STORY_H = 3.4;
