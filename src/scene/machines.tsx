import { B, Y, Stack, Plate } from "./parts";
import { C } from "./theme";

// Every machine is modelled around its own origin on the floor (y = 0).
// By default the user faces +z (towards the camera) unless noted.

const SIDES = [-1, 1] as const;

function Base({ w = 1, d = 1.9, z = 0 }: { w?: number; d?: number; z?: number }) {
  return <B pos={[0, 0.04, z]} size={[w, 0.08, d]} color={C.blueDark} />;
}

/* ───────────────────────── Floor 1 · upper body ───────────────────────── */

export function ChestPress() {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.5} />
      <B pos={[0, 0.3, 0.12]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.12]} size={[0.5, 0.12, 0.5]} color={C.pad} />
      <B pos={[0, 1.05, -0.26]} size={[0.5, 0.8, 0.12]} color={C.pad} rot={[-0.12, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.4, 0.95, -0.3]} size={[0.07, 0.6, 0.07]} color={C.steel} />
          <B pos={[s * 0.4, 1.1, 0.0]} size={[0.07, 0.07, 0.7]} color={C.steel} />
          <Y pos={[s * 0.4, 1.1, 0.4]} r={0.035} len={0.16} axis="z" color={C.navy} />
        </group>
      ))}
    </group>
  );
}

export function PecDeck() {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.5} />
      <B pos={[0, 0.3, 0.1]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.1]} size={[0.5, 0.12, 0.5]} color={C.pad} />
      <B pos={[0, 1.05, -0.28]} size={[0.5, 0.8, 0.12]} color={C.pad} rot={[-0.12, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.55, 0.95, -0.2]} size={[0.08, 1.0, 0.08]} color={C.blue} />
          <B pos={[s * 0.5, 1.05, 0.05]} size={[0.1, 0.55, 0.18]} color={C.pad} rot={[0, s * -0.25, 0]} />
        </group>
      ))}
    </group>
  );
}

export function ShoulderPress() {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.5} />
      <B pos={[0, 0.3, 0.1]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.1]} size={[0.5, 0.12, 0.5]} color={C.pad} />
      <B pos={[0, 1.0, -0.3]} size={[0.5, 0.8, 0.12]} color={C.pad} rot={[-0.08, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.45, 1.1, -0.42]} size={[0.08, 2.2, 0.08]} color={C.blue} />
          <B pos={[s * 0.45, 1.5, -0.1]} size={[0.07, 0.07, 0.65]} color={C.steel} />
          <Y pos={[s * 0.45, 1.5, 0.28]} r={0.035} len={0.16} axis="z" color={C.navy} />
        </group>
      ))}
      <B pos={[0, 2.2, -0.42]} size={[1.0, 0.1, 0.1]} color={C.blue} />
    </group>
  );
}

export function LatPulldown() {
  return (
    <group>
      <Base w={1.1} d={2.0} z={0.05} />
      <Stack pos={[0, 0, -0.8]} h={2.0} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.55, 1.1, -0.4]} size={[0.1, 2.2, 0.1]} color={C.blue} />
          <B pos={[s * 0.42, 1.95, 0.27]} size={[0.015, 0.32, 0.015]} color={C.steelDark} r={0.005} />
          <B pos={[s * 0.22, 0.82, 0.0]} size={[0.18, 0.12, 0.4]} color={C.pad} />
        </group>
      ))}
      <B pos={[0, 2.2, -0.08]} size={[1.2, 0.12, 0.7]} color={C.blue} />
      <Y pos={[0, 1.78, 0.27]} r={0.025} len={1.3} axis="x" color={C.steel} />
      <B pos={[0, 0.28, 0.4]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.4]} size={[0.45, 0.12, 0.5]} color={C.pad} />
    </group>
  );
}

/** Seated cable row. User sits at +z facing the stack at -z. */
export function SeatedRow() {
  return (
    <group>
      <Base w={0.8} d={2.2} />
      <Stack pos={[0, 0, -0.92]} h={1.4} />
      <B pos={[0, 0.58, 0.05]} size={[0.1, 1.0, 0.1]} color={C.blue} />
      <B pos={[0, 0.95, 0.0]} size={[0.42, 0.5, 0.12]} color={C.pad} />
      <B pos={[0, 0.5, 0.62]} size={[0.42, 0.1, 0.45]} color={C.pad} />
      <B pos={[0, 0.3, 0.62]} size={[0.1, 0.4, 0.1]} color={C.blue} />
      <B pos={[0, 0.32, -0.38]} size={[0.8, 0.06, 0.35]} color={C.steel} rot={[0.5, 0, 0]} />
      <B pos={[0, 0.78, -0.6]} size={[0.55, 0.04, 0.04]} color={C.steel} />
      <B pos={[0, 0.7, -0.78]} size={[0.015, 0.015, 0.4]} color={C.steelDark} r={0.005} />
    </group>
  );
}

export function BenchPress() {
  return (
    <group>
      {/* bench, head towards -z under the rack */}
      <B pos={[0, 0.44, 0.35]} size={[0.34, 0.12, 1.4]} color={C.pad} />
      <B pos={[0, 0.22, 0.95]} size={[0.1, 0.4, 0.1]} color={C.blue} />
      <B pos={[0, 0.22, -0.1]} size={[0.1, 0.4, 0.1]} color={C.blue} />
      <B pos={[0, 0.04, 0.35]} size={[0.6, 0.08, 0.12]} color={C.blueDark} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.62, 0.7, -0.35]} size={[0.08, 1.4, 0.08]} color={C.blue} />
          <B pos={[s * 0.62, 0.04, -0.2]} size={[0.1, 0.08, 0.9]} color={C.blueDark} />
          <B pos={[s * 0.62, 1.38, -0.35]} size={[0.14, 0.05, 0.1]} color={C.yellow} />
          <B pos={[s * 0.62, 0.4, -0.05]} size={[0.06, 0.06, 0.5]} color={C.steelDark} />
          <Plate pos={[s * 0.98, 1.45, -0.35]} r={0.22} />
          <Plate pos={[s * 1.06, 1.45, -0.35]} r={0.15} color={C.blue} />
        </group>
      ))}
      <Y pos={[0, 1.45, -0.35]} r={0.02} len={2.3} axis="x" color={C.steel} />
    </group>
  );
}

export function CableCross() {
  return (
    <group>
      <B pos={[0, 0.04, -0.15]} size={[2.5, 0.08, 0.8]} color={C.blueDark} />
      {SIDES.map((s) => (
        <group key={s}>
          <Stack pos={[s * 1.0, 0, -0.2]} h={2.1} w={0.45} />
          <B pos={[s * 0.7, 1.95, -0.1]} size={[0.07, 0.07, 0.35]} color={C.steel} />
          <B pos={[s * 0.62, 1.55, 0.17]} size={[0.015, 0.8, 0.015]} color={C.steelDark} r={0.005} />
          <Y pos={[s * 0.62, 1.1, 0.17]} r={0.03} len={0.2} axis="x" color={C.navy} />
        </group>
      ))}
      <B pos={[0, 2.28, -0.2]} size={[2.45, 0.12, 0.4]} color={C.blue} />
      <Y pos={[0, 2.0, 0.0]} r={0.025} len={1.0} axis="x" color={C.steel} />
    </group>
  );
}

export function BicepCurl() {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.3} />
      <B pos={[0, 0.3, 0.2]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.2]} size={[0.46, 0.12, 0.46]} color={C.pad} />
      <B pos={[0, 0.9, -0.2]} size={[0.14, 0.9, 0.12]} color={C.blue} />
      <B pos={[0, 1.0, 0.25]} size={[0.5, 0.1, 0.5]} color={C.pad} rot={[-0.7, 0, 0]} />
      {SIDES.map((s) => (
        <Y key={s} pos={[s * 0.22, 1.1, 0.55]} r={0.03} len={0.18} axis="z" color={C.navy} />
      ))}
    </group>
  );
}

export function TricepExt() {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.3} />
      <B pos={[0, 0.3, 0.15]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.15]} size={[0.46, 0.12, 0.46]} color={C.pad} />
      <B pos={[0, 0.95, -0.12]} size={[0.5, 0.7, 0.12]} color={C.pad} rot={[-0.1, 0, 0]} />
      <B pos={[0, 0.85, 0.45]} size={[0.5, 0.1, 0.3]} color={C.pad} rot={[-0.5, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.3, 1.0, -0.1]} size={[0.07, 0.07, 0.7]} color={C.steel} />
          <Y pos={[s * 0.3, 0.8, 0.28]} r={0.03} len={0.2} axis="y" color={C.navy} />
        </group>
      ))}
    </group>
  );
}

export function Bench({ incline = false }: { incline?: boolean }) {
  return (
    <group>
      <B pos={[0, 0.44, 0.25]} size={[0.34, 0.12, 0.8]} color={C.pad} />
      <B
        pos={[0, incline ? 0.78 : 0.44, incline ? -0.32 : -0.5]}
        size={[0.34, 0.12, incline ? 0.7 : 0.55]}
        color={C.pad}
        rot={[incline ? 0.7 : 0, 0, 0]}
      />
      <B pos={[0, 0.22, 0.55]} size={[0.1, 0.4, 0.1]} color={C.blue} />
      <B pos={[0, 0.22, -0.3]} size={[0.1, 0.4, 0.1]} color={C.blue} />
      <B pos={[0, 0.04, 0.25]} size={[0.6, 0.08, 0.1]} color={C.blueDark} />
      <B pos={[0, 0.04, -0.3]} size={[0.6, 0.08, 0.1]} color={C.blueDark} />
    </group>
  );
}

/* ───────────────────────── Floor 2 · lower body ───────────────────────── */

export function LegPress() {
  return (
    <group>
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.4, 0.8, 0.05]} size={[0.08, 0.08, 2.15]} color={C.blue} rot={[-0.5, 0, 0]} />
          <B pos={[s * 0.4, 0.04, -0.55]} size={[0.1, 0.08, 1.6]} color={C.blueDark} />
          <B pos={[s * 0.4, 0.04, 0.95]} size={[0.1, 0.08, 0.6]} color={C.blueDark} />
          <B pos={[s * 0.4, 0.3, -0.95]} size={[0.08, 0.5, 0.08]} color={C.blue} />
          <B pos={[s * 0.4, 0.5, 0.95]} size={[0.08, 0.9, 0.08]} color={C.blue} />
          <Plate pos={[s * 0.62, 0.95, 0.35]} r={0.26} />
          <Plate pos={[s * 0.7, 0.95, 0.35]} r={0.2} color={C.blue} />
        </group>
      ))}
      <B pos={[0, 0.62, -0.45]} size={[0.5, 0.1, 0.9]} color={C.pad} rot={[-0.5, 0, 0]} />
      <B pos={[0, 0.5, -0.88]} size={[0.5, 0.35, 0.1]} color={C.pad} rot={[-0.5, 0, 0]} />
      <B pos={[0, 1.2, 0.8]} size={[0.9, 0.7, 0.06]} color={C.steel} rot={[-0.5, 0, 0]} />
    </group>
  );
}

export function HackSquat() {
  return (
    <group>
      <B pos={[0, 0.05, 0]} size={[1.1, 0.1, 2.0]} color={C.blueDark} />
      <B pos={[0, 0.5, 0.65]} size={[0.95, 0.1, 0.7]} color={C.steel} rot={[-0.2, 0, 0]} />
      <B pos={[0, 1.05, -0.3]} size={[0.5, 1.5, 0.1]} color={C.pad} rot={[-0.35, 0, 0]} />
      <B pos={[0, 0.8, -0.65]} size={[0.8, 1.4, 0.08]} color={C.blue} rot={[-0.35, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.3, 1.62, -0.55]} size={[0.16, 0.12, 0.35]} color={C.pad} />
          <B pos={[s * 0.52, 0.9, -0.2]} size={[0.06, 1.6, 0.06]} color={C.steelDark} rot={[-0.35, 0, 0]} />
          <Plate pos={[s * 0.62, 0.55, -0.3]} r={0.2} />
        </group>
      ))}
    </group>
  );
}

export function Smith() {
  return (
    <group>
      <B pos={[0, 0.04, -0.1]} size={[2.4, 0.08, 1.1]} color={C.blueDark} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 1.0, 1.2, -0.45]} size={[0.08, 2.4, 0.08]} color={C.blue} />
          <B pos={[s * 1.0, 1.2, 0.25]} size={[0.08, 2.4, 0.08]} color={C.blue} />
          <B pos={[s * 1.0, 2.38, -0.1]} size={[0.1, 0.1, 0.8]} color={C.blue} />
          <Plate pos={[s * 0.88, 1.35, -0.1]} r={0.22} />
          <Plate pos={[s * 0.8, 1.35, -0.1]} r={0.16} color={C.blue} />
        </group>
      ))}
      <Y pos={[0, 1.35, -0.1]} r={0.022} len={2.2} axis="x" color={C.steel} />
      <B pos={[0, 2.38, -0.45]} size={[2.1, 0.1, 0.08]} color={C.blue} />
    </group>
  );
}

export function CalfRaise() {
  return (
    <group>
      <B pos={[0, 0.04, -0.1]} size={[1.0, 0.08, 1.6]} color={C.blueDark} />
      <B pos={[0, 0.16, 0.35]} size={[0.8, 0.14, 0.7]} color={C.steel} />
      <Stack pos={[0, 0, -0.8]} h={1.3} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.42, 0.85, -0.38]} size={[0.08, 1.6, 0.08]} color={C.blue} />
          <B pos={[s * 0.25, 1.45, -0.12]} size={[0.25, 0.12, 0.45]} color={C.pad} />
        </group>
      ))}
      <B pos={[0, 1.65, -0.38]} size={[0.9, 0.08, 0.08]} color={C.blue} />
    </group>
  );
}

/** Leg extension / leg curl style seated machine. `curl` moves the roller behind the knee. */
export function LegExtension({ curl = false }: { curl?: boolean }) {
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.3} />
      <B pos={[0, 0.3, 0.1]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.1]} size={[0.5, 0.12, 0.55]} color={C.pad} />
      <B pos={[0, 0.98, -0.25]} size={[0.5, 0.8, 0.12]} color={C.pad} rot={[-0.2, 0, 0]} />
      <B pos={[0, 0.35, 0.55]} size={[0.08, 0.7, 0.08]} color={C.steel} rot={[curl ? -0.4 : 0.35, 0, 0]} />
      <Y pos={[0, curl ? 0.2 : 0.2, curl ? 0.45 : 0.72]} r={0.07} len={0.42} axis="x" color={C.pad} />
      {SIDES.map((s) => (
        <B key={s} pos={[s * 0.3, 0.75, 0.3]} size={[0.07, 0.07, 0.6]} color={C.steel} />
      ))}
    </group>
  );
}

export function HipMachine({ adduct = false }: { adduct?: boolean }) {
  const px = adduct ? 0.2 : 0.4;
  return (
    <group>
      <Base />
      <Stack pos={[0, 0, -0.72]} h={1.3} />
      <B pos={[0, 0.3, 0.1]} size={[0.1, 0.45, 0.1]} color={C.blue} />
      <B pos={[0, 0.54, 0.1]} size={[0.5, 0.12, 0.5]} color={C.pad} />
      <B pos={[0, 0.98, -0.25]} size={[0.5, 0.8, 0.12]} color={C.pad} rot={[-0.1, 0, 0]} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * (px + 0.1), 0.7, 0.3]} size={[0.14, 0.38, 0.3]} color={C.pad} rot={[0, s * (adduct ? 0.3 : -0.3), 0]} />
          <B pos={[s * 0.5, 0.45, -0.1]} size={[0.07, 0.07, 0.6]} color={C.steel} />
        </group>
      ))}
    </group>
  );
}

export function GluteKick() {
  return (
    <group>
      <B pos={[0, 0.04, 0]} size={[1.0, 0.08, 1.6]} color={C.blueDark} />
      <Stack pos={[0, 0, -0.65]} h={1.3} />
      <B pos={[0, 0.12, 0.45]} size={[0.8, 0.14, 0.5]} color={C.steel} />
      <B pos={[0, 1.0, -0.15]} size={[0.5, 0.45, 0.14]} color={C.pad} rot={[0.2, 0, 0]} />
      <B pos={[0, 0.7, -0.2]} size={[0.1, 1.4, 0.1]} color={C.blue} />
      <B pos={[0.2, 0.55, 0.0]} size={[0.07, 0.07, 0.8]} color={C.steel} rot={[0.5, 0, 0]} />
      <B pos={[0.2, 0.28, 0.32]} size={[0.2, 0.14, 0.16]} color={C.pad} />
    </group>
  );
}

export function SquatRack() {
  return (
    <group>
      <B pos={[0, 0.03, 0]} size={[1.7, 0.06, 1.6]} color={C.rubberBlack} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.62, 1.15, -0.5]} size={[0.1, 2.3, 0.1]} color={C.blue} />
          <B pos={[s * 0.62, 1.15, 0.5]} size={[0.1, 2.3, 0.1]} color={C.blue} />
          <B pos={[s * 0.62, 2.28, 0]} size={[0.1, 0.1, 1.1]} color={C.blue} />
          <B pos={[s * 0.62, 1.4, 0.0]} size={[0.07, 0.07, 1.0]} color={C.blueDark} />
          <B pos={[s * 0.62, 1.55, -0.45]} size={[0.14, 0.05, 0.12]} color={C.yellow} />
          <Plate pos={[s * 1.0, 1.62, -0.45]} r={0.22} />
          <Plate pos={[s * 1.08, 1.62, -0.45]} r={0.15} color={C.blue} />
        </group>
      ))}
      <Y pos={[0, 1.62, -0.45]} r={0.02} len={2.3} axis="x" color={C.steel} />
      <B pos={[0, 0.5, 0.45]} size={[0.5, 0.06, 0.5]} color={C.pad} />
    </group>
  );
}
