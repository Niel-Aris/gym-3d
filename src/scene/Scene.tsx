"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, type ElementRef } from "react";
import { Box3, MathUtils, Spherical, Vector3 } from "three";
import { Building } from "./Building";
import { Outdoors } from "./Outdoors";
import { Highlight } from "./Highlight";
import { registry } from "./registry";
import { C } from "./theme";
import { SNAP, useGym, view } from "./store";

const HOME_POS = new Vector3(19, 15, 23);
const HOME_TARGET = new Vector3(0, 1.6, 0);
const HOME = new Spherical().setFromVector3(HOME_POS.clone().sub(HOME_TARGET));

const MIN_R = 4.5;
const MAX_R = 70;

const box = new Box3();
const bsize = new Vector3();
const bcenter = new Vector3();

/**
 * Wraps OrbitControls. Handles: smooth zoom / rotate / reset buttons, following the active story,
 * and flying in to the selected station (then back out when the selection is cleared).
 */
function Rig() {
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const goal = useRef({ az: 0, zoom: 0, reset: false });
  const offset = useRef(new Vector3());
  const sph = useRef(new Spherical());
  const lock = useRef(false); // true once the user grabs the camera, until the selection changes
  const prevSel = useRef<string | null>(null);
  const restore = useRef<{ target: Vector3; radius: number } | null>(null);
  const want = useRef(new Vector3());

  useEffect(() => {
    view.rotate = (a) => (goal.current.az += a);
    view.zoom = (f) => (goal.current.zoom += Math.log(f));
    view.reset = () => {
      goal.current.reset = true;
      goal.current.az = 0;
      goal.current.zoom = 0;
      lock.current = false;
      restore.current = null;
    };
    view.refocus = () => {
      lock.current = false;
    };
  }, []);

  useFrame((state, rawDt) => {
    const c = controls.current;
    if (!c) return;
    const dt = Math.min(rawDt, 0.05);
    const k = SNAP ? 1 : 1 - Math.exp(-dt * 6);
    const cam = state.camera;
    const { story, explode, selected } = useGym.getState();

    offset.current.copy(cam.position).sub(c.target);
    const radiusNow = offset.current.length();

    if (selected !== prevSel.current) {
      if (selected && !prevSel.current) restore.current = { target: c.target.clone(), radius: radiusNow };
      if (!selected && prevSel.current && lock.current) restore.current = null;
      lock.current = false;
      prevSel.current = selected;
    }

    // 1. where should the orbit target (and distance) be?
    const floorY = explode ? 3.4 : story === 1 ? 4.9 : 1.6;
    let wantRadius: number | null = null;
    want.current.set(c.target.x, floorY, c.target.z);

    const obj = selected ? registry.get(selected) : undefined;
    if (obj && !lock.current) {
      box.setFromObject(obj);
      box.getCenter(bcenter);
      box.getSize(bsize);
      want.current.copy(bcenter);
      wantRadius = MathUtils.clamp(Math.max(bsize.x, bsize.y, bsize.z) * 3.2 + 3.5, 7, 12);
    } else if (!selected && restore.current && !lock.current) {
      want.current.set(restore.current.target.x, floorY, restore.current.target.z);
      wantRadius = restore.current.radius;
      if (want.current.distanceTo(c.target) < 0.05 && Math.abs(wantRadius - radiusNow) < 0.1) restore.current = null;
    }

    // 2. translate camera + target together (keeps the viewing direction), then ease the distance
    const delta = want.current.clone().sub(c.target).multiplyScalar(k);
    c.target.add(delta);
    cam.position.add(delta);
    if (wantRadius !== null) {
      offset.current.copy(cam.position).sub(c.target);
      const r = offset.current.length();
      offset.current.setLength(r + (wantRadius - r) * k);
      cam.position.copy(c.target).add(offset.current);
    }

    // 3. button-driven moves
    const g = goal.current;
    if (g.reset || Math.abs(g.az) > 1e-3 || Math.abs(g.zoom) > 1e-3) {
      offset.current.copy(cam.position).sub(c.target);
      const s = sph.current.setFromVector3(offset.current);
      if (g.reset) {
        const dTheta = MathUtils.euclideanModulo(HOME.theta - s.theta + Math.PI, Math.PI * 2) - Math.PI;
        s.theta += dTheta * k;
        s.phi += (HOME.phi - s.phi) * k;
        s.radius += (HOME.radius - s.radius) * k;
        c.target.x += -c.target.x * k;
        c.target.z += -c.target.z * k;
        const done =
          Math.abs(HOME.phi - s.phi) < 0.005 &&
          Math.abs(HOME.radius - s.radius) < 0.05 &&
          Math.abs(c.target.x) < 0.02 &&
          Math.abs(c.target.z) < 0.02;
        if (done) g.reset = false;
      } else {
        const da = g.az * k;
        s.theta += da;
        g.az -= da;
        const dz = g.zoom * k;
        s.radius *= Math.exp(dz);
        g.zoom -= dz;
      }
      s.radius = MathUtils.clamp(s.radius, MIN_R, MAX_R);
      offset.current.setFromSpherical(s);
      cam.position.copy(c.target).add(offset.current);
    }
    c.update();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={MIN_R}
      maxDistance={MAX_R}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI / 2.15}
      target={HOME_TARGET.toArray()}
      onStart={() => {
        lock.current = true;
        restore.current = null;
        goal.current.reset = false;
        goal.current.az = 0;
        goal.current.zoom = 0;
      }}
    />
  );
}

export default function Scene() {
  const select = useGym((s) => s.select);
  return (
    <Canvas
      flat
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: HOME_POS.toArray(), fov: 28, near: 0.3, far: 400 }}
      gl={{ antialias: true }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 70, 160]} />

      <hemisphereLight args={["#ffffff", "#c9d4f2", 1.15]} />
      <directionalLight
        position={[14, 24, 16]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      <Outdoors />
      <Building />
      <Highlight />
      <Rig />
    </Canvas>
  );
}
