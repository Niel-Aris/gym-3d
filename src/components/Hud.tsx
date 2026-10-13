"use client";

import { useMemo, useState } from "react";
import { useGym, view } from "@/scene/store";
import { FLOOR_1, FLOOR_2, INFO, type Group } from "@/scene/layout";
import { META, STATIONS, STATION_BY_ID } from "@/scene/stations";
import { fmtClock, fmtDur, phaseOf, type Live } from "@/scene/sim";
import styles from "./gym.module.css";

const FLOORS = [
  { name: "Floor 1", title: "Upper body", items: FLOOR_1 },
  { name: "Floor 2", title: "Legs & cardio", items: FLOOR_2 },
] as const;

const EXTRAS = ["Reception desk", "Locker area (9 lockers)", "Dumbbell rack (8 m, 2 tiers)", "Stairs to floor 2"];

const GROUP_COLOR: Record<Group, string> = { upper: "#2f63f0", lower: "#1e44b8", cardio: "#22b5b8", other: "#f6b93b" };
const GROUP_NAME: Record<Group, string> = { upper: "Upper body", lower: "Lower body", cardio: "Cardio", other: "Free weights" };

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
  close: "M6 6l12 12M18 6L6 18",
  locate: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  chevron: "M9 6l6 6-6 6",
};

const STATUS_TEXT = { free: "Free", busy: "In use", maint: "Out of service" } as const;

function StatusPill({ status }: { status: Live["status"] }) {
  return <span className={`${styles.pill} ${styles[`pill_${status}`]}`}>{STATUS_TEXT[status]}</span>;
}

/* ───────────────────────── top row ───────────────────────── */

function TopStats() {
  const live = useGym((s) => s.live);
  const clock = useGym((s) => s.clock);
  const story = useGym((s) => s.story);
  const floor = FLOORS[story];

  const { busy, free, maint, avg } = useMemo(() => {
    let busy = 0, free = 0, maint = 0, sessions = 0, minutes = 0;
    for (const l of Object.values(live)) {
      if (l.status === "busy") busy++;
      else if (l.status === "free") free++;
      else maint++;
      sessions += l.sessions;
      minutes += l.minutes;
    }
    return { busy, free, maint, avg: sessions ? Math.round(minutes / sessions) : 0 };
  }, [live]);

  const ready = Object.keys(live).length > 0;

  return (
    <>
      <section className={`${styles.card} ${styles.stat} ${styles.s1}`}>
        <span>Members in gym</span>
        <strong>{ready ? busy + 5 : "–"}</strong>
        <em>{ready ? `${busy} training · live` : "starting…"}</em>
      </section>
      <section className={`${styles.card} ${styles.stat} ${styles.s2}`}>
        <span>Stations free</span>
        <strong>
          {ready ? free : "–"}
          <small> / {STATIONS.length - maint}</small>
        </strong>
        <em>{maint ? `${maint} out of service` : "all working"}</em>
      </section>
      <section className={`${styles.card} ${styles.stat} ${styles.s3}`}>
        <span>Avg session</span>
        <strong>
          {ready ? avg : "–"}
          <small> min</small>
        </strong>
        <em>
          {floor.name} · {floor.title}
        </em>
      </section>
      <div className={`${styles.card} ${styles.live}`}>
        <i /> Live <b>{ready ? fmtClock(clock) : "--:--"}</b>
      </div>
    </>
  );
}

/* ───────────────────────── right column ───────────────────────── */

function FloorCard() {
  const story = useGym((s) => s.story);
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

  return (
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
          EXTRAS.map((label) => (
            <li key={label} className={styles.extra}>
              <i style={{ background: "#f6b93b" }} />
              <span>{label}</span>
            </li>
          ))}
      </ul>
      <p className={styles.hint}>Click any machine for details · drag to rotate · scroll to zoom · right-drag to pan</p>
    </aside>
  );
}

function StationCard({ id }: { id: string }) {
  const select = useGym((s) => s.select);
  const live = useGym((s) => s.live[id]);
  const clock = useGym((s) => s.clock);
  const st = STATION_BY_ID.get(id);
  if (!st || !live) return null;
  const meta = META[st.kind];
  const ph = live.status === "busy" ? phaseOf(live, clock) : null;
  const cardio = st.group === "cardio";
  const color = GROUP_COLOR[st.group];

  return (
    <aside className={`${styles.card} ${styles.panel} ${styles.station}`}>
      <div className={styles.cardHead}>
        <div className={styles.tile} style={{ background: color }}>
          {st.label.slice(0, 2).toUpperCase()}
        </div>
        <div className={styles.cardTitle}>
          <span className={styles.eyebrow}>
            {GROUP_NAME[st.group].toUpperCase()} · {st.id}
          </span>
          <h2>{st.label}</h2>
          <small>
            {meta.type} · {meta.level}
          </small>
        </div>
        <div className={styles.cardBtns}>
          <button onClick={() => view.refocus()} title="Re-centre on this machine" aria-label="Locate"><Icon d={I.locate} /></button>
          <button onClick={() => select(null)} title="Close (Esc)" aria-label="Close"><Icon d={I.close} /></button>
        </div>
      </div>

      <div className={styles.statusRow}>
        <StatusPill status={live.status} />
        <span>
          {live.status === "busy" && ph
            ? cardio
              ? `Workout in progress · ${fmtDur(ph.elapsed)}`
              : `Set ${ph.set} of ${live.sets} · ${ph.working ? "working" : "resting"} ${fmtDur(ph.remain)}`
            : live.status === "free"
              ? "Available now"
              : "Awaiting technician"}
        </span>
      </div>
      <div className={styles.bar}>
        <i style={{ width: `${Math.round((ph?.progress ?? 0) * 100)}%` }} />
      </div>

      <dl className={styles.rows}>
        <div>
          <dt>Works</dt>
          <dd>
            {meta.primary.map((m) => (
              <span key={m} className={`${styles.tag} ${styles.tagMain}`}>{m}</span>
            ))}
            {meta.secondary.map((m) => (
              <span key={m} className={styles.tag}>{m}</span>
            ))}
          </dd>
        </div>
        {live.status === "busy" && (
          <>
            <div><dt>{meta.m1.label}</dt><dd>{live.v1} {meta.m1.unit}</dd></div>
            <div><dt>{meta.m2.label}</dt><dd>{live.v2} {meta.m2.unit}</dd></div>
            <div><dt>Member</dt><dd>{live.member}</dd></div>
            <div><dt>Free in about</dt><dd>{fmtDur(Math.max(0, live.start + live.dur - clock))}</dd></div>
          </>
        )}
        {live.status === "free" && (
          <div>
            <dt>Typical {meta.m1.label.toLowerCase()}</dt>
            <dd>{meta.m1.min}–{meta.m1.max} {meta.m1.unit}</dd>
          </div>
        )}
        <div><dt>Sessions today</dt><dd>{live.sessions}</dd></div>
        <div><dt>Time in use today</dt><dd>{live.minutes} min</dd></div>
        <div><dt>Location</dt><dd>{st.floor === 0 ? "Floor 1" : "Floor 2"}</dd></div>
      </dl>
      <p className={styles.tip}><b>Coach tip</b> {meta.tip}</p>
    </aside>
  );
}

function StationList() {
  const live = useGym((s) => s.live);
  const clock = useGym((s) => s.clock);
  const selected = useGym((s) => s.selected);
  const select = useGym((s) => s.select);
  const [tab, setTab] = useState<"upper" | "lower" | "cardio">("upper");

  const rows = STATIONS.filter((s) => (tab === "upper" ? s.group === "upper" || s.group === "other" : s.group === tab));
  const count = (t: typeof tab) =>
    STATIONS.filter((s) => (t === "upper" ? s.group === "upper" || s.group === "other" : s.group === t) && live[s.id]?.status === "busy").length;

  return (
    <section className={`${styles.card} ${styles.list}`}>
      <div className={styles.tabs} role="tablist">
        {(["upper", "lower", "cardio"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? styles.tabOn : ""} onClick={() => setTab(t)}>
            {t === "upper" ? "Upper" : t === "lower" ? "Lower" : "Cardio"} <b>{count(t)}</b>
          </button>
        ))}
        <span>busy now</span>
      </div>
      <ul>
        {rows.map((s) => {
          const l = live[s.id];
          const ph = l?.status === "busy" ? phaseOf(l, clock) : null;
          return (
            <li key={s.id} className={selected === s.id ? styles.rowOn : ""}>
              <button onClick={() => select(s.id)}>
                <span className={styles.rid}>{s.id}</span>
                <span className={styles.rname}>
                  {s.label}
                  <small>Floor {s.floor + 1}</small>
                </span>
                {l ? <StatusPill status={l.status} /> : <span />}
                <span className={styles.mini}><i style={{ width: `${Math.round((ph?.progress ?? 0) * 100)}%` }} /></span>
                <Icon d={I.chevron} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ───────────────────────── root ───────────────────────── */

export function Hud() {
  const { story, explode, labels, pins, selected, setStory, goUp, goDown, toggleExplode, toggleLabels, togglePins } = useGym();

  return (
    <>
      <header className={`${styles.card} ${styles.brand}`}>
        <div className={styles.logo} aria-hidden />
        <div>
          <strong>IronNest Gym</strong>
          <span>Two-storey training hall · live 3D</span>
        </div>
      </header>

      <TopStats />

      <nav className={`${styles.card} ${styles.tools}`} aria-label="Camera controls">
        <button onClick={() => view.zoom(0.8)} title="Zoom in" aria-label="Zoom in"><Icon d={I.plus} /></button>
        <button onClick={() => view.zoom(1.25)} title="Zoom out" aria-label="Zoom out"><Icon d={I.minus} /></button>
        <hr />
        <button onClick={() => view.rotate(Math.PI / 6)} title="Rotate left" aria-label="Rotate left"><Icon d={I.left} /></button>
        <button onClick={() => view.rotate(-Math.PI / 6)} title="Rotate right" aria-label="Rotate right"><Icon d={I.right} /></button>
        <button onClick={() => view.reset()} title="Reset view" aria-label="Reset view"><Icon d={I.home} /></button>
      </nav>

      {selected ? <StationCard id={selected} /> : <FloorCard />}
      <StationList />

      <div className={`${styles.card} ${styles.stories}`}>
        <button onClick={goDown} disabled={story === 0} title="Go down (↓)" aria-label="Go down one story">
          <Icon d={I.down} /> Down
        </button>
        <div className={styles.chips} role="tablist" aria-label="Story">
          {FLOORS.map((f, i) => (
            <button key={f.name} role="tab" aria-selected={story === i} className={story === i ? styles.active : ""} onClick={() => setStory(i as 0 | 1)}>
              <b>{f.name}</b>
              <small>{f.title}</small>
            </button>
          ))}
        </div>
        <button onClick={goUp} disabled={story === 1} title="Go up (↑)" aria-label="Go up one story">
          <Icon d={I.up} /> Up
        </button>
        <hr />
        <label className={styles.toggle}><input type="checkbox" checked={explode} onChange={toggleExplode} /> Exploded</label>
        <label className={styles.toggle}><input type="checkbox" checked={labels} onChange={toggleLabels} /> Labels</label>
        <label className={styles.toggle}><input type="checkbox" checked={pins} onChange={togglePins} /> Status pins</label>
      </div>
    </>
  );
}
