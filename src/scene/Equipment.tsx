import { useEffect, useRef, type ComponentType } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, Vector3, type Group } from "three";
import * as M from "./machines";
import { Treadmill, Stairmaster, Bike } from "./cardio";
import type { Kind } from "./layout";
import { META, STATIONS, type Station } from "./stations";
import { registry } from "./registry";
import { useGym } from "./store";
import { Member } from "./People";
import { C } from "./theme";

type Props = { busy: boolean };

const MAP: Record<Kind, ComponentType<Props>> = {
  chestPress: M.ChestPress,
  pecDeck: M.PecDeck,
  shoulderPress: M.ShoulderPress,
  latPulldown: M.LatPulldown,
  seatedRow: M.SeatedRow,
  benchPress: M.BenchPress,
  cableCross: M.CableCross,
  bicepCurl: M.BicepCurl,
  tricepExt: M.TricepExt,
  bench: () => <M.Bench />,
  inclineBench: () => <M.Bench incline />,
  legPress: M.LegPress,
  hackSquat: M.HackSquat,
  smith: M.Smith,
  calfRaise: M.CalfRaise,
  legExtension: () => <M.LegExtension />,
  legCurl: () => <M.LegExtension curl />,
  hipAbductor: () => <M.HipMachine />,
  hipAdductor: () => <M.HipMachine adduct />,
  gluteKick: M.GluteKick,
  squatRack: M.SquatRack,
  treadmill: Treadmill,
  stairmaster: Stairmaster,
  bike: Bike,
};

const wp = new Vector3();

const PIN_COLOR = { free: "#2fbf8a", busy: C.blue, maint: C.orange } as const;

function StatusPin({ y, color, phase }: { y: number; color: string; phase: number }) {
  const g = useRef<Group>(null);
  useFrame((state) => {
    const p = g.current;
    if (!p) return;
    // keep pins a readable size at any zoom level
    p.getWorldPosition(wp);
    p.scale.setScalar(MathUtils.clamp(state.camera.position.distanceTo(wp) / 32, 0.3, 1.2));
    p.position.y = y + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.07;
  });
  return (
    <group ref={g} position={[0, y, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.17, 16, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.28, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.3, 0.1]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function StationView({ st, interactive }: { st: Station; interactive: boolean }) {
  const inner = useRef<Group>(null);
  const status = useGym((s) => s.live[st.id]?.status ?? "free");
  const pins = useGym((s) => s.pins && s.selected !== st.id);
  const select = useGym((s) => s.select);
  const hover = useGym((s) => s.hover);
  const Cmp = MAP[st.kind];
  const busy = status === "busy";

  useEffect(() => {
    const obj = inner.current;
    if (obj) registry.set(st.id, obj);
    return () => {
      registry.delete(st.id);
    };
  }, [st.id]);

  const handlers = interactive
    ? {
        onClick: (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          select(st.id);
        },
        onPointerOver: (e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          hover(st.id);
        },
        onPointerOut: () => hover(null),
      }
    : {};

  return (
    <group position={[st.x, 0, st.z]} rotation={[0, st.rot, 0]}>
      <group ref={inner} {...handlers}>
        <Cmp busy={busy} />
      </group>
      {busy && <Member kind={st.kind} id={st.id} />}
      {pins && <StatusPin y={META[st.kind].h + 0.25} color={PIN_COLOR[status]} phase={st.index} />}
    </group>
  );
}

/** All stations of one floor. `interactive` is off for floors that are hidden or covered. */
export function Equipment({ floor, interactive }: { floor: 0 | 1; interactive: boolean }) {
  return (
    <>
      {STATIONS.filter((s) => s.floor === floor).map((st) => (
        <StationView key={st.id} st={st} interactive={interactive} />
      ))}
    </>
  );
}
