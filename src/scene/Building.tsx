import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import { B } from "./parts";
import { C, STORY_H, type V3 } from "./theme";
import { Equipment } from "./Equipment";
import { Walker } from "./People";
import {
  Reception, Lockers, LockerBench, DumbbellRack, Mats, PlateTree, Plant, Cooler,
  Stairs, HoleRail, HOLE,
} from "./fixtures";
import { SNAP, useGym } from "./store";

const H = STORY_H;
const DOOR = { x0: -3.5, x1: -1.5 };

/* ───────────────────────── shared shell pieces ───────────────────────── */

function Window({ pos, size, vertical = false }: { pos: V3; size: V3; vertical?: boolean }) {
  return (
    <group position={pos}>
      <B size={size} color={C.glass} opacity={0.55} r={0.01} />
      <B
        pos={[0, 0, 0]}
        size={vertical ? [size[0] + 0.02, size[1], 0.06] : [size[0], size[1], size[2] + 0.02]}
        color={C.blue}
        opacity={1}
        r={0.005}
        shadow={false}
      />
    </group>
  );
}

function LowWall({ x0, x1, z, depth = 0.25, axis = "x" }: { x0: number; x1: number; z: number; depth?: number; axis?: "x" | "z" }) {
  const len = x1 - x0;
  const mid = (x0 + x1) / 2;
  const h = 0.5;
  return axis === "x" ? (
    <group>
      <B pos={[mid, h / 2, z]} size={[len, h, depth]} color={C.wall} r={0.02} />
      <B pos={[mid, h + 0.04, z]} size={[len + 0.02, 0.08, depth + 0.08]} color={C.blue} r={0.02} />
    </group>
  ) : (
    <group>
      <B pos={[z, h / 2, mid]} size={[depth, h, len]} color={C.wall} r={0.02} />
      <B pos={[z, h + 0.04, mid]} size={[depth + 0.08, 0.08, len + 0.02]} color={C.blue} r={0.02} />
    </group>
  );
}

function Shell({ ground }: { ground: boolean }) {
  return (
    <group>
      {/* back + left full-height walls (the camera looks at their inner faces) */}
      <B pos={[0, H / 2, -6.125]} size={[16.5, H, 0.25]} color={C.wall} r={0.02} />
      <B pos={[-8.125, H / 2, 0.125]} size={[0.25, H, 12.25]} color={C.wall} r={0.02} />
      <B pos={[0, H + 0.05, -6.125]} size={[16.6, 0.1, 0.35]} color={C.blue} r={0.02} />
      <B pos={[-8.125, H + 0.05, 0.1]} size={[0.35, 0.1, 12.5]} color={C.blue} r={0.02} />
      {/* skirting */}
      <B pos={[0, 0.07, -5.95]} size={[15.9, 0.14, 0.06]} color={C.blueLight} r={0.01} shadow={false} />
      <B pos={[-7.95, 0.07, 0]} size={[0.06, 0.14, 11.9]} color={C.blueLight} r={0.01} shadow={false} />

      {/* cut-away low walls on the camera side */}
      {ground ? (
        <>
          <LowWall x0={-8.25} x1={DOOR.x0} z={6.125} />
          <LowWall x0={DOOR.x1} x1={8.25} z={6.125} />
        </>
      ) : (
        <LowWall x0={-8.25} x1={8.25} z={6.125} />
      )}
      <LowWall x0={-6.0} x1={6.25} z={8.125} axis="z" />

      {/* windows */}
      {ground
        ? [-6.2, -2.2, 1.8, 5.8].map((x) => <Window key={x} pos={[x, 2.55, -5.96]} size={[2.8, 0.9, 0.04]} />)
        : [-6.0, -2.4, 1.2, 4.8].map((x) => <Window key={x} pos={[x, 1.95, -5.96]} size={[2.9, 1.6, 0.04]} />)}
      {[-3.6, 0.0, 3.6].map((z) => (
        <Window key={z} pos={[-7.96, ground ? 2.1 : 1.8, z]} size={[0.04, ground ? 1.3 : 1.5, 2.6]} vertical />
      ))}
    </group>
  );
}

function UpperSlab() {
  // 16 x 12 slab with a cut-out for the stair well in the front-right corner.
  const t = 0.4;
  const rx = HOLE.x1 - HOLE.x0;
  return (
    <group>
      <B pos={[(-8 + HOLE.x0) / 2, -t / 2, 0]} size={[HOLE.x0 + 8, t, 12]} color={C.floor} r={0.02} />
      <B pos={[(HOLE.x0 + HOLE.x1) / 2, -t / 2, (HOLE.z1 + 6) / 2]} size={[rx, t, 6 - HOLE.z1]} color={C.floor} r={0.02} />
      <B pos={[(HOLE.x0 + HOLE.x1) / 2, -t / 2, (-6 + HOLE.z0) / 2]} size={[rx, t, HOLE.z0 + 6]} color={C.floor} r={0.02} />
      <B pos={[0, -0.2, 6.05]} size={[16.2, 0.4, 0.1]} color={C.blue} r={0.02} />
    </group>
  );
}

function Pin({ pos, children }: { pos: V3; children: string }) {
  return (
    <Html position={pos} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="pin">
        <span className="pinDot" />
        {children}
      </div>
    </Html>
  );
}

/* ───────────────────────── floors ───────────────────────── */

function GroundFloor({ labels, interactive }: { labels: boolean; interactive: boolean }) {
  return (
    <group>
      <B pos={[0, -0.2, 0]} size={[16.6, 0.4, 12.6]} color={C.floor} r={0.02} />
      {/* zone flooring */}
      <B pos={[1.7, 0.012, -1.0]} size={[8.8, 0.024, 10.0]} color={C.rubber} r={0.005} shadow={false} />
      <B pos={[-5.2, 0.012, 3.6]} size={[5.6, 0.024, 4.6]} color={C.carpet} r={0.005} shadow={false} />
      <B pos={[-5.9, 0.012, -2.2]} size={[4.2, 0.024, 7.6]} color={C.carpet} r={0.005} shadow={false} />
      <Shell ground />

      {/* entrance: doorway frame + canopy */}
      {[DOOR.x0, DOOR.x1].map((x) => (
        <B key={x} pos={[x, 1.3, 6.125]} size={[0.14, 2.6, 0.3]} color={C.blue} />
      ))}
      <B pos={[-2.5, 2.68, 6.2]} size={[2.5, 0.16, 0.5]} color={C.blue} />
      <B pos={[-2.5, 2.2, 6.2]} size={[1.9, 0.5, 0.06]} color={C.white} shadow={false} />
      <B pos={[-2.5, 2.2, 6.24]} size={[0.34, 0.34, 0.04]} color={C.blue} rot={[0, 0, Math.PI / 4]} />
      <B pos={[-2.5, 0.01, 7.2]} size={[2.0, 0.03, 2.2]} color={C.blueLight} r={0.005} shadow={false} />

      <group position={[-5.2, 0, 3.6]}><Reception /></group>
      <group position={[-5.7, 0, -5.55]}><Lockers /></group>
      <group position={[-5.7, 0, -4.3]}><LockerBench /></group>
      <group position={[-5.7, 0, -1.2]}><Mats /></group>
      <group position={[1.5, 0, -5.45]}><DumbbellRack length={8} /></group>
      <group position={[-7.3, 0, 1.4]}><Cooler /></group>
      <group position={[-7.2, 0, -2.3]}><Plant /></group>
      <group position={[-4.0, 0, 5.4]}><Plant scale={1.2} /></group>
      <group position={[-1.0, 0, -4.7]}><PlateTree /></group>
      <Equipment floor={0} interactive={interactive} />
      <Walker path={[[-6.3, -0.4], [-3.2, -0.4], [-3.2, 2.0], [-6.3, 2.0]]} offset={2} shirt={C.orange} />
      <Walker path={[[-2.4, -0.8], [6.0, -0.8]]} pingPong speed={0.8} shirt={C.teal} />
      <Walker path={[[-0.5, 5.0], [6.5, 5.0]]} pingPong speed={0.7} offset={5} shirt={C.yellow} />
      <Stairs />

      {labels && (
        <>
          <Pin pos={[-5.2, 2.0, 3.6]}>Reception</Pin>
          <Pin pos={[-5.7, 2.5, -5.5]}>Lockers</Pin>
          <Pin pos={[1.5, 2.5, -5.4]}>Dumbbells</Pin>
          <Pin pos={[1.0, 2.7, 0.6]}>Upper-body machines</Pin>
          <Pin pos={[7.2, 3.0, -2.0]}>Stairs ↑</Pin>
          <Pin pos={[-2.5, 3.2, 6.3]}>Entrance</Pin>
        </>
      )}
    </group>
  );
}

function UpperFloor({ labels, interactive }: { labels: boolean; interactive: boolean }) {
  return (
    <group>
      <UpperSlab />
      <B pos={[-0.65, 0.012, -0.5]} size={[14.4, 0.024, 11.6]} color={C.rubber} r={0.005} shadow={false} />
      <B pos={[-0.5, 0.014, -4.6]} size={[13.4, 0.026, 2.0]} color={C.carpet} r={0.005} shadow={false} />
      <Shell ground={false} />
      <HoleRail />
      <Equipment floor={1} interactive={interactive} />
      <Walker path={[[-7.0, 0.1], [5.5, 0.1]]} pingPong speed={0.8} shirt={C.red} />
      <Walker path={[[-2.5, 5.2], [5.8, 5.2]]} pingPong speed={0.7} offset={4} shirt={C.blueLight} />
      <group position={[1.0, 0, 4.2]}><Mats /></group>
      <group position={[-1.0, 0, 4.4]}><PlateTree /></group>
      <group position={[-7.3, 0, 4.6]}><Cooler /></group>
      <group position={[-7.3, 0, -1.0]}><Plant /></group>
      <group position={[5.6, 0, 4.9]}><Plant scale={1.2} /></group>

      {labels && (
        <>
          <Pin pos={[-3.0, 2.6, -4.8]}>Treadmills</Pin>
          <Pin pos={[0.8, 2.7, -4.8]}>Stairmasters</Pin>
          <Pin pos={[4.3, 2.4, -4.8]}>Bikes</Pin>
          <Pin pos={[-3.2, 2.9, -1.6]}>Leg machines</Pin>
          <Pin pos={[7.2, 1.8, -1.8]}>Stairs ↓</Pin>
        </>
      )}
    </group>
  );
}

export function Building() {
  const upper = useRef<Group>(null);
  const story = useGym((s) => s.story);
  const explode = useGym((s) => s.explode);
  const labels = useGym((s) => s.labels && s.selected === null);

  useFrame((_, dt) => {
    const g = upper.current;
    if (!g) return;
    const lift = explode ? 5.5 : story === 1 ? 0 : 10;
    const k = SNAP ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 5);
    g.position.y += (H + lift - g.position.y) * k;
    // fully hidden once it has flown out of the way
    g.visible = lift < 9 || g.position.y < H + 9.5;
  });

  return (
    <group>
      <GroundFloor labels={labels && (story === 0 || explode)} interactive={story === 0 || explode} />
      <group ref={upper} position={[0, H + 10, 0]} visible={false}>
        <UpperFloor labels={labels && (story === 1 || explode)} interactive={story === 1 || explode} />
      </group>
    </group>
  );
}
