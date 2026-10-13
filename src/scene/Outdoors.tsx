import { B, Y } from "./parts";
import { C } from "./theme";

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <Y pos={[0, 0.5, 0]} r={0.12} len={1.0} color={C.trunk} seg={8} />
      <mesh position={[0, 1.7, 0]} castShadow>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color={C.green} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.25, 2.5, 0.1]} castShadow>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color={C.greenDark} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Block({ x, z, w, d, h, tone = "#d7e0f7" }: { x: number; z: number; w: number; d: number; h: number; tone?: string }) {
  const rows = Math.floor(h / 1.6);
  return (
    <group position={[x, 0, z]}>
      <B pos={[0, h / 2 - 0.4, 0]} size={[w, h, d]} color={tone} r={0.05} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: Math.floor(w / 1.6) }).map((__, c) => (
          <B
            key={`${r}-${c}`}
            pos={[(c - (Math.floor(w / 1.6) - 1) / 2) * 1.6, 1.0 + r * 1.6, d / 2 + 0.01]}
            size={[1.0, 0.9, 0.03]}
            color={C.blueLight}
            r={0.01}
            shadow={false}
          />
        )),
      )}
    </group>
  );
}

export function Outdoors() {
  const dashes = Array.from({ length: 14 });
  return (
    <group>
      {/* ground plate, plot, road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      <B pos={[0, -0.42, 0]} size={[24, 0.04, 22]} color="#eef2fc" r={0.01} shadow={false} />
      <B pos={[0, -0.4, 19]} size={[160, 0.04, 6]} color={C.road} r={0.01} shadow={false} />
      {dashes.map((_, i) => (
        <B key={i} pos={[-39 + i * 6, -0.37, 19]} size={[2.6, 0.02, 0.18]} color="#f4f6fd" r={0.005} shadow={false} />
      ))}
      {/* path to the door */}
      <B pos={[-2.5, -0.38, 11.5]} size={[2.2, 0.03, 8]} color="#d8e0f4" r={0.01} shadow={false} />

      {/* trees */}
      <Tree x={-11} z={-4} s={1.1} />
      <Tree x={-11.5} z={4} />
      <Tree x={-10.5} z={9.5} s={0.9} />
      <Tree x={11.5} z={-5} s={1.2} />
      <Tree x={11} z={5.5} />
      <Tree x={10.5} z={11} s={0.9} />
      <Tree x={-7} z={-10} />
      <Tree x={4} z={-10.5} s={1.1} />
      <Tree x={9} z={-9.5} s={0.9} />
      <Tree x={-6} z={11} s={0.8} />
      <Tree x={3} z={11.5} s={0.9} />

      {/* soft background blocks */}
      <Block x={-26} z={-18} w={14} d={10} h={14} />
      <Block x={-4} z={-24} w={18} d={10} h={20} tone="#cfd9f4" />
      <Block x={20} z={-20} w={12} d={9} h={11} />
      <Block x={36} z={-4} w={10} d={14} h={16} tone="#cfd9f4" />
      <Block x={-34} z={6} w={10} d={14} h={9} />
    </group>
  );
}
