import { RoundedBox } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { C, type V3 } from "./theme";

const cache = new Map<string, MeshStandardMaterial>();

export function mat(color: string, opacity = 1) {
  const key = `${color}|${opacity}`;
  let m = cache.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      roughness: opacity < 1 ? 0.15 : 0.6,
      metalness: 0.04,
      transparent: opacity < 1,
      opacity,
    });
    cache.set(key, m);
  }
  return m;
}

type BoxProps = {
  pos?: V3;
  size: V3;
  color: string;
  rot?: V3;
  r?: number;
  opacity?: number;
  shadow?: boolean;
};

/** Soft rounded box, the building block of everything in the scene. */
export function B({ pos = [0, 0, 0], size, color, rot, r, opacity = 1, shadow = true }: BoxProps) {
  const radius = r ?? Math.min(0.035, Math.min(...size) / 2.5);
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={2}
      position={pos}
      rotation={rot}
      castShadow={shadow && opacity === 1}
      receiveShadow
      material={mat(color, opacity)}
    />
  );
}

type CylProps = {
  pos?: V3;
  r: number;
  len: number;
  axis?: "x" | "y" | "z";
  color: string;
  seg?: number;
};

export function Y({ pos = [0, 0, 0], r, len, axis = "y", color, seg = 16 }: CylProps) {
  const rot: V3 = axis === "x" ? [0, 0, Math.PI / 2] : axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow material={mat(color)}>
      <cylinderGeometry args={[r, r, len, seg]} />
    </mesh>
  );
}

/** Weight stack housing used by most selectorised machines. Front window faces +z. */
export function Stack({ pos = [0, 0, 0], h = 1.5, w = 0.5, d = 0.42 }: { pos?: V3; h?: number; w?: number; d?: number }) {
  return (
    <group position={pos}>
      <B pos={[0, h / 2, 0]} size={[w, h, d]} color={C.steel} />
      <B pos={[0, h / 2, d / 2]} size={[w * 0.74, h * 0.82, 0.04]} color={C.plate} r={0.01} />
      {[0, 1, 2, 3].map((i) => (
        <B
          key={i}
          pos={[0, h * 0.16 + i * h * 0.19, d / 2 + 0.03]}
          size={[w * 0.66, 0.06, 0.03]}
          color={i === 1 ? C.yellow : C.steelDark}
          r={0.01}
        />
      ))}
      <B pos={[0, h + 0.05, 0]} size={[w + 0.04, 0.1, d + 0.04]} color={C.blue} />
    </group>
  );
}

export function Plate({ pos, r = 0.22, color = C.plate, axis = "x" as "x" | "y" | "z" }: { pos: V3; r?: number; color?: string; axis?: "x" | "y" | "z" }) {
  return <Y pos={pos} r={r} len={0.06} axis={axis} color={color} seg={20} />;
}
