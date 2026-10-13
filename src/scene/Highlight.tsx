import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Box3, MeshBasicMaterial, type Group, type Mesh, Vector3 } from "three";
import { registry } from "./registry";
import { useGym } from "./store";
import { STATION_BY_ID } from "./stations";
import { C } from "./theme";

const T = 0.045; // bracket thickness
const box = new Box3();
const size = new Vector3();
const centre = new Vector3();

// 8 corners x 3 arms = 24 little bars drawn on top of everything, like the corner marks in the reference.
const ARMS = Array.from({ length: 24 }, (_, i) => ({
  corner: [i % 2, Math.floor(i / 2) % 2, Math.floor(i / 4) % 2] as const,
  axis: Math.floor(i / 8),
}));

function Brackets({ id, color, opacity }: { id: string | null; color: string; opacity: number }) {
  const root = useRef<Group>(null);
  const bars = useRef<(Mesh | null)[]>([]);
  const label = useRef<Group>(null);
  const material = useMemo(
    () => new MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity }),
    [color, opacity],
  );
  useEffect(() => () => material.dispose(), [material]);
  const st = id ? STATION_BY_ID.get(id) : undefined;
  const status = useGym((s) => (id ? s.live[id]?.status : undefined));

  useFrame(() => {
    const g = root.current;
    const obj = id ? registry.get(id) : undefined;
    if (!g) return;
    g.visible = !!obj;
    if (!obj) return;
    box.setFromObject(obj);
    box.getSize(size);
    box.getCenter(centre);
    const L = Math.min(0.4, Math.min(size.x, size.y, size.z) * 0.45 + 0.1);
    ARMS.forEach((a, i) => {
      const m = bars.current[i];
      if (!m) return;
      const [cx, cy, cz] = a.corner;
      const px = cx ? box.max.x : box.min.x;
      const py = cy ? box.max.y : box.min.y;
      const pz = cz ? box.max.z : box.min.z;
      const dir = [cx ? -1 : 1, cy ? -1 : 1, cz ? -1 : 1];
      const sc = [T, T, T];
      sc[a.axis] = L;
      const pos = [px, py, pz];
      pos[a.axis] += (dir[a.axis] * L) / 2;
      m.position.set(pos[0], pos[1], pos[2]);
      m.scale.set(sc[0], sc[1], sc[2]);
    });
    label.current?.position.set(centre.x, box.max.y + 0.45, centre.z);
  });

  if (!id) return null;
  const dot = status === "busy" ? C.blue : status === "maint" ? C.orange : "#2fbf8a";
  const text = status === "busy" ? "In use" : status === "maint" ? "Out of service" : "Free";

  return (
    <group ref={root} visible={false}>
      {ARMS.map((a, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bars.current[i] = m;
          }}
          material={material}
          renderOrder={999}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
      <group ref={label}>
        <Html center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
          <div className="pin pinSel">
            <span className="pinDot" style={{ background: dot, boxShadow: `0 0 0 4px ${dot}33` }} />
            {st?.label} <small>· {text}</small>
          </div>
        </Html>
      </group>
    </group>
  );
}

export function Highlight() {
  const selected = useGym((s) => s.selected);
  const hovered = useGym((s) => s.hovered);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  return (
    <>
      <Brackets id={selected} color={C.blue} opacity={1} />
      {hovered && hovered !== selected && <Brackets id={hovered} color={C.blueLight} opacity={0.8} />}
    </>
  );
}
