"use client";

import { useMemo } from "react";
import { useGym, view } from "@/scene/store";
import { FLOOR_1, FLOOR_2, INFO, type Group } from "@/scene/layout";
import styles from "./gym.module.css";

const FLOORS = [
  { name: "Floor 1", title: "Upper body", items: FLOOR_1 },
  { name: "Floor 2", title: "Legs & cardio", items: FLOOR_2 },
] as const;

const EXTRAS = [
  ["Reception desk", 1],
  ["Locker area (9 lockers)", 1],
  ["Dumbbell rack (8 m, 2 tiers)", 1],
  ["Stairs to floor 2", 1],
] as const;

const GROUP_COLOR: Record<Group, string> = {
  upper: "#2f63f0",
  lower: "#1e44b8",
  cardio: "#22b5b8",
  other: "#f6b93b",
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const I = {
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  left: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  right: "M21 12a9 9 0 1 1-3-6.7M21 4v5h-5",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
};

export function Hud() {
  const { story, explode, labels, setStory, goUp, goDown, toggleExplode, toggleLabels } = useGym();
  const floor = FLOORS[story];

  const rows = useMemo(() => {
    const counts = new Map<string, { label: string; group: Group; n: number }>();
    for (const it of floor.items) {
      const info = INFO[it.kind];
      const row = counts.get(it.kind) ?? { label: info.label, group: info.group, n: 0 };
      row.n += 1;
      counts.set(it.kind, row);
    }
    return [...counts.values()];
  }, [floor]);

  const stations = rows.filter((r) => r.group !== "other").reduce((a, r) => a + r.n, 0);

  return (
    <>
      <header className={`${styles.card} ${styles.brand}`}>
        <div className={styles.logo} aria-hidden />
        <div>
          <strong>IronNest Gym</strong>
          <span>Two-storey training hall · 3D layout</span>
        </div>
      </header>

      <section className={`${styles.card} ${styles.stat}`}>
        <span>Now viewing</span>
        <strong>{floor.name}</strong>
        <em>{floor.title}</em>
      </section>
      <section className={`${styles.card} ${styles.stat2}`}>
        <span>Stations on this floor</span>
        <strong>{stations}</strong>
        <em>{story === 0 ? "plus 2 benches" : "machines & cardio"}</em>
      </section>

      <nav className={`${styles.card} ${styles.tools}`} aria-label="Camera controls">
        <button onClick={() => view.zoom(0.8)} title="Zoom in" aria-label="Zoom in"><Icon d={I.plus} /></button>
        <button onClick={() => view.zoom(1.25)} title="Zoom out" aria-label="Zoom out"><Icon d={I.minus} /></button>
        <hr />
        <button onClick={() => view.rotate(Math.PI / 6)} title="Rotate left" aria-label="Rotate left"><Icon d={I.left} /></button>
        <button onClick={() => view.rotate(-Math.PI / 6)} title="Rotate right" aria-label="Rotate right"><Icon d={I.right} /></button>
        <button onClick={() => view.reset()} title="Reset view" aria-label="Reset view"><Icon d={I.home} /></button>
      </nav>

      <aside className={`${styles.card} ${styles.panel}`}>
        <div className={styles.panelHead}>
          <span className={styles.eyebrow}>{floor.name.toUpperCase()}</span>
          <h2>{floor.title}</h2>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.label}>
              <i style={{ background: GROUP_COLOR[r.group] }} />
              <span>{r.label}</span>
              <b>{r.n}</b>
            </li>
          ))}
          {story === 0 &&
            EXTRAS.map(([label]) => (
              <li key={label} className={styles.extra}>
                <i style={{ background: "#f6b93b" }} />
                <span>{label}</span>
              </li>
            ))}
        </ul>
        <p className={styles.hint}>Drag to rotate · scroll to zoom · right-drag to pan</p>
      </aside>

      <div className={`${styles.card} ${styles.stories}`}>
        <button onClick={goDown} disabled={story === 0} title="Go down (↓)" aria-label="Go down one story">
          <Icon d={I.down} /> Down
        </button>
        <div className={styles.chips} role="tablist" aria-label="Story">
          {FLOORS.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              aria-selected={story === i}
              className={story === i ? styles.active : ""}
              onClick={() => setStory(i as 0 | 1)}
            >
              <b>{f.name}</b>
              <small>{f.title}</small>
            </button>
          ))}
        </div>
        <button onClick={goUp} disabled={story === 1} title="Go up (↑)" aria-label="Go up one story">
          <Icon d={I.up} /> Up
        </button>
        <hr />
        <label className={styles.toggle}>
          <input type="checkbox" checked={explode} onChange={toggleExplode} /> Exploded
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={labels} onChange={toggleLabels} /> Labels
        </label>
      </div>
    </>
  );
}
