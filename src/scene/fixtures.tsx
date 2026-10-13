import { B, Y, Plate } from "./parts";
import { C, STORY_H } from "./theme";

/* ───────────────────────── Floor 1 fixtures ───────────────────────── */

export function Reception() {
  return (
    <group>
      {/* main counter + return, facing the entrance (+z) */}
      <B pos={[0, 0.55, 0]} size={[3.2, 1.1, 0.7]} color={C.blue} />
      <B pos={[0, 1.12, 0.02]} size={[3.3, 0.08, 0.85]} color={C.white} />
      <B pos={[1.5, 0.55, -1.0]} size={[0.7, 1.1, 1.7]} color={C.blue} />
      <B pos={[1.5, 1.12, -1.0]} size={[0.85, 0.08, 1.85]} color={C.white} />
      <B pos={[0, 0.9, 0.37]} size={[2.6, 0.5, 0.03]} color={C.blueLight} r={0.01} />
      {/* monitor + keyboard */}
      <B pos={[0.7, 1.45, -0.05]} size={[0.55, 0.34, 0.04]} color={C.navy} />
      <B pos={[0.7, 1.45, -0.025]} size={[0.48, 0.27, 0.01]} color={C.teal} r={0.005} />
      <B pos={[0.7, 1.24, -0.05]} size={[0.08, 0.2, 0.08]} color={C.steelDark} />
      <B pos={[0.7, 1.17, 0.2]} size={[0.4, 0.02, 0.14]} color={C.steel} r={0.005} />
      {/* chair */}
      <B pos={[-0.4, 0.5, -0.85]} size={[0.5, 0.1, 0.5]} color={C.pad} />
      <B pos={[-0.4, 0.85, -1.08]} size={[0.5, 0.6, 0.08]} color={C.pad} />
      <B pos={[-0.4, 0.25, -0.85]} size={[0.08, 0.5, 0.08]} color={C.steelDark} />
      {/* brand cube */}
      <B pos={[-1.0, 1.32, 0.0]} size={[0.3, 0.3, 0.3]} color={C.blueDark} rot={[0, 0.5, 0]} />
    </group>
  );
}

export function Lockers() {
  const n = 9;
  const w = 0.46;
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const x = (i - (n - 1) / 2) * w;
        const tone = i % 3 === 1 ? C.blueDark : C.blue;
        return (
          <group key={i} position={[x, 0, 0]}>
            <B pos={[0, 0.95, 0]} size={[w - 0.02, 1.9, 0.5]} color={tone} r={0.02} />
            <B pos={[0, 1.45, 0.255]} size={[w - 0.1, 0.5, 0.01]} color={C.blueLight} r={0.004} />
            <B pos={[0, 0.65, 0.255]} size={[w - 0.1, 0.9, 0.01]} color={C.blueLight} r={0.004} />
            <B pos={[0.1, 1.0, 0.27]} size={[0.025, 0.12, 0.02]} color={C.white} r={0.004} />
          </group>
        );
      })}
      <B pos={[0, 0.1, 0.0]} size={[n * w + 0.1, 0.2, 0.55]} color={C.blueDark} />
    </group>
  );
}

export function LockerBench() {
  return (
    <group>
      <B pos={[0, 0.45, 0]} size={[2.4, 0.1, 0.5]} color={C.white} />
      {[-1, 1].map((s) => (
        <B key={s} pos={[s * 1.0, 0.22, 0]} size={[0.1, 0.44, 0.4]} color={C.blue} />
      ))}
      <B pos={[-0.7, 0.62, 0]} size={[0.5, 0.22, 0.34]} color={C.orange} />
      <B pos={[0.5, 0.58, 0]} size={[0.4, 0.14, 0.3]} color={C.blueLight} />
    </group>
  );
}

function Dumbbell({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const head = 0.07 + size * 0.07;
  return (
    <group position={[x, y, 0]}>
      <Y r={0.018} len={0.2 + size * 0.02} axis="x" color={C.steel} seg={8} />
      {[-1, 1].map((s) => (
        <Y key={s} pos={[s * (0.08 + size * 0.012), 0, 0]} r={head} len={0.07 + size * 0.015} axis="x" color={color} seg={6} />
      ))}
    </group>
  );
}

/** Long two-tier dumbbell rack, built along x. */
export function DumbbellRack({ length = 8 }: { length?: number }) {
  const slots = Math.floor(length / 0.4);
  const shelves = [0.6, 1.05];
  return (
    <group>
      <B pos={[0, 0.35, 0]} size={[length, 0.7, 0.6]} color={C.blue} />
      <B pos={[0, 0.78, 0.05]} size={[length, 0.1, 0.62]} color={C.white} />
      <B pos={[0, 1.2, 0.05]} size={[length, 0.1, 0.62]} color={C.white} />
      <B pos={[0, 1.55, -0.28]} size={[length, 0.7, 0.05]} color={C.blueLight} />
      {[-1, 1].map((s) => (
        <B key={s} pos={[s * (length / 2 - 0.05), 0.95, 0]} size={[0.1, 1.9, 0.6]} color={C.blueDark} />
      ))}
      {shelves.map((sy, row) =>
        Array.from({ length: slots }).map((_, i) => {
          const size = row === 0 ? i / (slots - 1) : 1 - i / (slots - 1);
          const color = size > 0.66 ? C.blueDark : size > 0.33 ? C.navy : C.plate;
          return (
            <Dumbbell
              key={`${row}-${i}`}
              x={(i - (slots - 1) / 2) * (length / slots)}
              y={sy + 0.2 + (row === 0 ? 0.0 : 0.0) + 0.03}
              size={size * 6 + 1}
              color={color}
            />
          );
        }),
      )}
      <B pos={[0, 0.04, 0.4]} size={[length + 0.2, 0.02, 0.5]} color={C.rubberBlack} r={0.005} />
    </group>
  );
}

export function Mats() {
  return (
    <group>
      <B pos={[0, 0.03, 0]} size={[0.7, 0.06, 1.8]} color={C.teal} rot={[0, 0.05, 0]} />
      <B pos={[0.9, 0.03, 0.1]} size={[0.7, 0.06, 1.8]} color={C.blueLight} rot={[0, -0.04, 0]} />
      <B pos={[1.8, 0.03, 0.0]} size={[0.7, 0.06, 1.8]} color={C.yellow} rot={[0, 0.08, 0]} />
      <Y pos={[-0.7, 0.16, 0.6]} r={0.16} len={0.9} axis="x" color={C.orange} />
      <mesh position={[2.6, 0.32, 0.3]} castShadow>
        <sphereGeometry args={[0.32, 20, 16]} />
        <meshStandardMaterial color={C.blue} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function PlateTree() {
  return (
    <group>
      <B pos={[0, 0.03, 0]} size={[0.8, 0.06, 0.8]} color={C.blueDark} />
      <Y pos={[0, 0.6, 0]} r={0.04} len={1.2} color={C.steel} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Plate key={i} pos={[0, 0.12 + i * 0.1, 0]} r={0.3 - i * 0.025} color={i % 2 ? C.blue : C.plate} axis="y" />
      ))}
    </group>
  );
}

export function Plant({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <Y pos={[0, 0.25, 0]} r={0.22} len={0.5} color={C.white} seg={14} />
      <mesh position={[0, 0.8, 0]} castShadow>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial color={C.green} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.15, 1.1, 0.05]} castShadow>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial color={C.greenDark} roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

export function Cooler() {
  return (
    <group>
      <B pos={[0, 0.5, 0]} size={[0.4, 1.0, 0.4]} color={C.white} />
      <B pos={[0, 0.7, 0.21]} size={[0.2, 0.1, 0.02]} color={C.blue} r={0.005} />
      <Y pos={[0, 1.25, 0]} r={0.17} len={0.5} color={C.glass} seg={14} />
    </group>
  );
}

/* ───────────────────────── Stairs ───────────────────────── */

const STEPS = 18;
const STAIR_Z0 = 1.0; // bottom of the flight
const STAIR_LEN = 6.0; // runs towards -z
export const STAIR_X = 7.2;
export const HOLE = { x0: 6.4, x1: 8.0, z0: -5.0, z1: 1.4 };

/** Straight flight along the right wall, climbing towards the back (-z). */
export function Stairs() {
  const rise = STORY_H / STEPS;
  const run = STAIR_LEN / STEPS;
  return (
    <group position={[STAIR_X, 0, 0]}>
      {Array.from({ length: STEPS }).map((_, i) => {
        const h = (i + 1) * rise;
        const z = STAIR_Z0 - i * run - run / 2;
        return (
          <group key={i}>
            <B pos={[0, h / 2, z]} size={[1.3, h, run]} color={C.white} r={0.015} />
            <B pos={[0, h - 0.01, z + run / 2 - 0.02]} size={[1.3, 0.03, 0.05]} color={C.blueLight} r={0.005} />
          </group>
        );
      })}
      {/* side stringer + handrail on the open (left) side */}
      <B
        pos={[-0.7, STORY_H / 2 + 0.05, STAIR_Z0 - STAIR_LEN / 2]}
        size={[0.08, 0.1, Math.hypot(STAIR_LEN, STORY_H) + 0.2]}
        color={C.blue}
        rot={[Math.atan2(STORY_H, STAIR_LEN), 0, 0]}
      />
      <B
        pos={[-0.7, STORY_H / 2 + 1.0, STAIR_Z0 - STAIR_LEN / 2]}
        size={[0.07, 0.07, Math.hypot(STAIR_LEN, STORY_H) + 0.2]}
        color={C.blue}
        rot={[Math.atan2(STORY_H, STAIR_LEN), 0, 0]}
      />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const z = STAIR_Z0 - 0.1 - t * (STAIR_LEN - 0.2);
        const y = t * (STORY_H - rise) + 0.55;
        return <B key={i} pos={[-0.7, y, z]} size={[0.05, 1.0, 0.05]} color={C.blueLight} r={0.01} />;
      })}
    </group>
  );
}

/** Safety rail around the stair opening on the upper floor. */
export function HoleRail() {
  const len = HOLE.z1 - HOLE.z0;
  const posts = 6;
  return (
    <group>
      <B pos={[HOLE.x0, 1.0, (HOLE.z0 + HOLE.z1) / 2]} size={[0.06, 0.06, len]} color={C.blue} />
      <B pos={[HOLE.x0, 0.55, (HOLE.z0 + HOLE.z1) / 2]} size={[0.04, 0.04, len]} color={C.blueLight} />
      <B pos={[(HOLE.x0 + HOLE.x1) / 2, 1.0, HOLE.z1]} size={[HOLE.x1 - HOLE.x0, 0.06, 0.06]} color={C.blue} />
      <B pos={[(HOLE.x0 + HOLE.x1) / 2, 0.55, HOLE.z1]} size={[HOLE.x1 - HOLE.x0, 0.04, 0.04]} color={C.blueLight} />
      {Array.from({ length: posts }).map((_, i) => (
        <B key={i} pos={[HOLE.x0, 0.5, HOLE.z0 + (i / (posts - 1)) * len]} size={[0.06, 1.0, 0.06]} color={C.blue} />
      ))}
      <B pos={[HOLE.x1 - 0.05, 0.5, HOLE.z1]} size={[0.06, 1.0, 0.06]} color={C.blue} />
    </group>
  );
}
