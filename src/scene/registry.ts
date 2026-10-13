import type { Object3D } from "three";

/** station id -> the Object3D holding just that machine's meshes (used for brackets and camera focus). */
export const registry = new Map<string, Object3D>();
