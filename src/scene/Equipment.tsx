import type { ComponentType } from "react";
import * as M from "./machines";
import { Treadmill, Stairmaster, Bike } from "./cardio";
import type { Item, Kind } from "./layout";

const MAP: Record<Kind, ComponentType> = {
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

export function Equipment({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((it, i) => {
        const Cmp = MAP[it.kind];
        return (
          <group key={`${it.kind}-${i}`} position={[it.x, 0, it.z]} rotation={[0, it.rot ?? 0, 0]}>
            <Cmp />
          </group>
        );
      })}
    </>
  );
}
