"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Hud } from "./Hud";
import { useGym } from "@/scene/store";
import styles from "./gym.module.css";

// The 3D scene is client-only (WebGL), so it is code-split and skipped during SSR.
const Scene = dynamic(() => import("@/scene/Scene"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading 3D model…</div>,
});

export function GymApp() {
  // Deep links: /?floor=2&explode=1&labels=0&select=F1-03
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const gym = useGym.getState();
    if (q.get("floor") === "2") gym.setStory(1);
    if (q.get("explode") === "1" && !gym.explode) gym.toggleExplode();
    if (q.get("labels") === "0" && gym.labels) gym.toggleLabels();
    const sel = q.get("select");
    if (sel) gym.select(sel.toUpperCase());
  }, []);

  // Start the fake live data (client only) and advance it once a second.
  useEffect(() => {
    useGym.getState().start();
    const timer = setInterval(() => useGym.getState().tick(), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { goUp, goDown, select } = useGym.getState();
      if (e.key === "Escape") select(null);
      if (e.key === "ArrowUp" || e.key === "PageUp") goUp();
      if (e.key === "ArrowDown" || e.key === "PageDown") goDown();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className={styles.root}>
      <div className={styles.canvas}>
        <Scene />
      </div>
      <Hud />
    </main>
  );
}
