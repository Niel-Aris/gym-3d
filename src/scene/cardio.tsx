import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { B, Y } from "./parts";
import { C } from "./theme";

// Cardio machines face -z (the runner looks at the console / back wall).
const SIDES = [-1, 1] as const;

function Console({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <B size={[0.62, 0.3, 0.1]} color={C.navy} rot={[0.35, 0, 0]} />
      <B pos={[0, 0.0, 0.055]} size={[0.5, 0.18, 0.02]} color={C.teal} rot={[0.35, 0, 0]} r={0.01} />
    </group>
  );
}

export function Treadmill({ busy = false }: { busy?: boolean }) {
  const stripes = useRef<Group>(null);
  useFrame((state) => {
    if (!busy || !stripes.current) return;
    stripes.current.position.z = ((state.clock.elapsedTime * 1.4) % 0.4) - 0.2;
  });
  return (
    <group>
      <B pos={[0, 0.22, 0.1]} size={[0.85, 0.3, 1.8]} color={C.plate} />
      <B pos={[0, 0.39, 0.12]} size={[0.62, 0.03, 1.55]} color={C.rubberBlack} r={0.01} />
      <group ref={stripes} position={[0, 0.405, 0.12]}>
        {[-0.6, -0.2, 0.2, 0.6].map((z) => (
          <B key={z} pos={[0, 0, z]} size={[0.56, 0.012, 0.04]} color={C.steelDark} r={0.004} shadow={false} />
        ))}
      </group>
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.46, 0.4, 0.1]} size={[0.1, 0.1, 1.8]} color={C.blue} />
          <B pos={[s * 0.4, 0.85, -0.7]} size={[0.07, 1.15, 0.07]} color={C.blue} />
          <B pos={[s * 0.4, 1.12, -0.28]} size={[0.05, 0.05, 0.9]} color={C.steel} />
        </group>
      ))}
      <B pos={[0, 1.38, -0.74]} size={[0.88, 0.1, 0.12]} color={C.blue} />
      <Console pos={[0, 1.5, -0.7]} />
    </group>
  );
}

export function Stairmaster({ busy = false }: { busy?: boolean }) {
  const stepL = useRef<Group>(null);
  const stepR = useRef<Group>(null);
  useFrame((state) => {
    const t = busy ? state.clock.elapsedTime * 3.2 : 0;
    if (stepL.current) stepL.current.position.y = 0.43 + Math.sin(t) * 0.12;
    if (stepR.current) stepR.current.position.y = 0.43 - Math.sin(t) * 0.12;
  });
  return (
    <group>
      <B pos={[0, 0.04, -0.1]} size={[0.9, 0.08, 1.4]} color={C.blueDark} />
      <B pos={[0, 0.5, -0.55]} size={[0.75, 1.0, 0.4]} color={C.blue} />
      {SIDES.map((s) => (
        <group key={s}>
          <B pos={[s * 0.4, 1.2, -0.58]} size={[0.07, 2.0, 0.07]} color={C.blue} />
          <B pos={[s * 0.42, 1.2, -0.18]} size={[0.05, 0.05, 0.85]} color={C.steel} />
          <group ref={s === 1 ? stepR : stepL} position={[s * 0.2, 0.43, 0.05]}>
            <B size={[0.3, 0.12, 0.45]} color={C.pad} />
          </group>
        </group>
      ))}
      <B pos={[0, 2.14, -0.58]} size={[0.88, 0.1, 0.1]} color={C.blue} />
      <Console pos={[0, 1.75, -0.52]} />
    </group>
  );
}

export function Bike({ busy = false }: { busy?: boolean }) {
  const wheel = useRef<Group>(null);
  useFrame((_, dt) => {
    if (busy && wheel.current) wheel.current.rotation.x += dt * 9;
  });
  return (
    <group>
      <B pos={[0, 0.04, -0.4]} size={[0.7, 0.08, 0.1]} color={C.blueDark} />
      <B pos={[0, 0.04, 0.45]} size={[0.7, 0.08, 0.1]} color={C.blueDark} />
      <B pos={[0, 0.6, -0.1]} size={[0.1, 1.0, 0.12]} color={C.blue} rot={[-0.35, 0, 0]} />
      <B pos={[0, 0.3, 0.0]} size={[0.1, 0.1, 0.95]} color={C.blue} />
      <group ref={wheel} position={[0, 0.42, -0.42]}>
        <Y r={0.26} len={0.09} axis="x" color={C.plate} seg={24} />
        <Y r={0.1} len={0.12} axis="x" color={C.steel} seg={16} />
        <B pos={[0, 0.2, 0]} size={[0.1, 0.1, 0.05]} color={C.yellow} r={0.01} shadow={false} />
      </group>
      <B pos={[0, 0.78, 0.34]} size={[0.09, 0.8, 0.09]} color={C.steelDark} />
      <B pos={[0, 1.2, 0.36]} size={[0.28, 0.08, 0.4]} color={C.pad} />
      <B pos={[0, 1.05, -0.55]} size={[0.07, 0.9, 0.07]} color={C.blue} rot={[0.25, 0, 0]} />
      <Y pos={[0, 1.5, -0.62]} r={0.025} len={0.6} axis="x" color={C.steel} />
      <Console pos={[0, 1.58, -0.7]} />
      {SIDES.map((s) => (
        <B key={s} pos={[s * 0.2, 0.28, 0.02]} size={[0.14, 0.06, 0.26]} color={C.navy} />
      ))}
    </group>
  );
}
