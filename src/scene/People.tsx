import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { B } from "./parts";
import { C } from "./theme";
import { META, type Pose } from "./stations";
import { mat } from "./parts";

const SKIN = "#f1c7a3";
const HAIR = "#3b2f2f";
const SHIRTS = [C.white, C.orange, C.teal, C.yellow, C.red, C.blueLight, C.green];

type PersonProps = {
  pose?: Pose;
  seat?: number;
  shirt?: string;
  move?: "walk" | "run" | "climb" | "cycle";
  phase?: number;
};

function Head({ y, z = 0 }: { y: number; z?: number }) {
  return (
    <group position={[0, y, z]}>
      <mesh castShadow material={mat(SKIN)}>
        <sphereGeometry args={[0.12, 14, 12]} />
      </mesh>
      <B pos={[0, 0.07, -0.02]} size={[0.25, 0.08, 0.25]} color={HAIR} r={0.04} />
    </group>
  );
}

/** Very small low-poly person. Faces +z. Legs swing when `move` is set. */
export function Person({ pose = "stand", seat = 0.55, shirt = C.white, move, phase = 0 }: PersonProps) {
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);

  useFrame((state) => {
    if (!move || pose === "lie") return;
    const t = state.clock.elapsedTime + phase;
    const f = move === "run" ? 9 : move === "climb" ? 3.2 : move === "cycle" ? 5 : 5;
    const a = move === "run" ? 0.7 : move === "walk" ? 0.5 : move === "cycle" ? 0.5 : 0.35;
    if (legL.current) legL.current.rotation.x = Math.sin(t * f) * a;
    if (legR.current) legR.current.rotation.x = -Math.sin(t * f) * a;
  });

  if (pose === "stand") {
    return (
      <group>
        <group ref={legL} position={[-0.09, 0.9, 0]}>
          <B pos={[0, -0.43, 0]} size={[0.12, 0.86, 0.13]} color={C.navy} r={0.04} />
        </group>
        <group ref={legR} position={[0.09, 0.9, 0]}>
          <B pos={[0, -0.43, 0]} size={[0.12, 0.86, 0.13]} color={C.navy} r={0.04} />
        </group>
        <B pos={[0, 1.2, 0]} size={[0.36, 0.55, 0.2]} color={shirt} r={0.05} />
        <B pos={[-0.23, 1.2, 0]} size={[0.09, 0.5, 0.09]} color={shirt} r={0.03} />
        <B pos={[0.23, 1.2, 0]} size={[0.09, 0.5, 0.09]} color={shirt} r={0.03} />
        <Head y={1.62} />
      </group>
    );
  }

  if (pose === "sit") {
    const s = seat;
    return (
      <group>
        {[-0.09, 0.09].map((x, i) => (
          <group key={x} ref={i === 0 ? legL : legR} position={[x, s + 0.08, 0.05]}>
            <B pos={[0, 0, 0.2]} size={[0.12, 0.12, 0.45]} color={C.navy} r={0.04} />
            <B pos={[0, -(s + 0.08) / 2, 0.4]} size={[0.12, s + 0.08, 0.12]} color={C.navy} r={0.04} />
          </group>
        ))}
        <B pos={[0, s + 0.4, -0.02]} size={[0.36, 0.55, 0.2]} color={shirt} r={0.05} />
        <B pos={[-0.23, s + 0.55, 0.2]} size={[0.09, 0.09, 0.5]} color={shirt} r={0.03} />
        <B pos={[0.23, s + 0.55, 0.2]} size={[0.09, 0.09, 0.5]} color={shirt} r={0.03} />
        <Head y={s + 0.85} z={-0.02} />
      </group>
    );
  }

  // lie (on a bench, y = bench top)
  return (
    <group>
      <B pos={[0, 0.12, -0.1]} size={[0.36, 0.2, 0.55]} color={shirt} r={0.05} />
      <Head y={0.14} z={-0.5} />
      <B pos={[-0.09, 0.1, 0.45]} size={[0.12, 0.12, 0.5]} color={C.navy} r={0.04} />
      <B pos={[0.09, 0.1, 0.45]} size={[0.12, 0.12, 0.5]} color={C.navy} r={0.04} />
      <B pos={[-0.09, -0.15, 0.7]} size={[0.12, 0.5, 0.12]} color={C.navy} r={0.04} />
      <B pos={[0.09, -0.15, 0.7]} size={[0.12, 0.5, 0.12]} color={C.navy} r={0.04} />
      <B pos={[-0.23, 0.5, -0.25]} size={[0.09, 0.7, 0.09]} color={shirt} r={0.03} />
      <B pos={[0.23, 0.5, -0.25]} size={[0.09, 0.7, 0.09]} color={shirt} r={0.03} />
    </group>
  );
}

const shirtFor = (key: string) => SHIRTS[[...key].reduce((a, c) => a + c.charCodeAt(0), 0) % SHIRTS.length];

/** The member currently using a station; pops in when a session starts. */
export function Member({ kind, id }: { kind: keyof typeof META; id: string }) {
  const g = useRef<Group>(null);
  const u = META[kind].user;
  useFrame((_, dt) => {
    if (!g.current) return;
    const s = g.current.scale.x;
    g.current.scale.setScalar(s + (1 - s) * (1 - Math.exp(-dt * 8)));
  });
  return (
    <group ref={g} position={u.pos} rotation={[0, u.rotY ?? 0, 0]} scale={0.01}>
      <Person pose={u.pose} seat={u.seat} shirt={shirtFor(id)} move={u.move} phase={id.length * 1.7} />
    </group>
  );
}

type WalkerProps = { path: [number, number][]; speed?: number; pingPong?: boolean; offset?: number; shirt?: string };

/** A member strolling along a path of [x, z] waypoints. */
export function Walker({ path, speed = 0.9, pingPong = false, offset = 0, shirt = C.white }: WalkerProps) {
  const g = useRef<Group>(null);
  const segs = useRef(
    path.map((p, i) => {
      const q = path[(i + 1) % path.length];
      return { a: p, b: q, len: Math.hypot(q[0] - p[0], q[1] - p[1]) };
    }),
  );

  useFrame((state) => {
    const grp = g.current;
    if (!grp) return;
    const list = pingPong ? segs.current.slice(0, -1) : segs.current;
    const total = list.reduce((a, s) => a + s.len, 0);
    let d = (state.clock.elapsedTime * speed + offset) % (pingPong ? total * 2 : total);
    let rev = false;
    if (pingPong && d > total) {
      d = total * 2 - d;
      rev = true;
    }
    for (const s of list) {
      if (d <= s.len) {
        const t = d / s.len;
        grp.position.set(s.a[0] + (s.b[0] - s.a[0]) * t, 0, s.a[1] + (s.b[1] - s.a[1]) * t);
        const dx = (s.b[0] - s.a[0]) * (rev ? -1 : 1);
        const dz = (s.b[1] - s.a[1]) * (rev ? -1 : 1);
        grp.rotation.y = Math.atan2(dx, dz);
        break;
      }
      d -= s.len;
    }
  });

  return (
    <group ref={g}>
      <Person pose="stand" shirt={shirt} move="walk" phase={offset} />
    </group>
  );
}
