# IronNest Gym · 3D layout

Interactive 3D model of a small two-storey gym, built with **Next.js (App Router) + React Three Fiber + drei + zustand**.

- **Floor 1 – upper body:** reception, open locker area, 12 machines, benches, a long 2-tier dumbbell rack, stairs up.
- **Floor 2 – legs & cardio:** 11 lower-body machines, 4 treadmills, 2 stairmasters, 3 bikes, stairs down.

## Run it

Requires Node 20.9+ (tested on Node 24).

```bash
git clone <this repo>
cd gym-3d
npm install
npm run dev          # http://localhost:3000
# or a production build:
npm run build && npm start
```

## Controls

| Action | How |
| --- | --- |
| Rotate | drag, or the ⟲ ⟳ buttons |
| Zoom | scroll / pinch, or + − |
| Pan | right-drag |
| Reset view | home button |
| Change story | **Up / Down** buttons, floor chips, or ↑ ↓ keys |
| Exploded view | "Exploded" checkbox |
| Zone labels | "Labels" checkbox |

### Interactive stations

- **Click any machine** (in the scene or in the bottom-right list): the camera flies in, blue corner brackets frame it and a card shows the muscles worked, load, reps, who is using it, a progress bar for the current set, usage stats and a coaching tip. `Esc` or the ✕ closes it; the target button re-centres the camera.
- **Hover** a machine to preview its name and status.
- **Live simulation:** members start and finish sessions on their own (about 8× real time, clock in the top bar). Treadmill belts, stairmaster steps and bike flywheels animate while in use, and a few members walk the aisles. Two stations are "out of service" to show the orange state.
- **Status pins** float above every station: green = free, blue = in use, orange = out of service.
- The data is fake and generated in `src/scene/sim.ts`; per-machine info (muscles, load ranges, tips) lives in `src/scene/stations.ts`.

Deep links: `/?floor=2`, `/?explode=1`, `/?labels=0`, `/?select=F1-03` (combine with `&`). `?snap` skips animations (handy for screenshots).

## Project map

```
src/app/            Next.js shell (page + layout)
src/components/     GymApp (client wrapper, lazy-loads the scene), Hud (UI overlay)
src/scene/
  layout.ts         WHAT stands WHERE on each floor – edit this to rearrange equipment
  stations.ts       station ids + per-machine metadata (muscles, load ranges, tips, where the user sits)
  sim.ts            fake live data: sessions, sets/rest phases, maintenance
  Highlight.tsx     selection brackets + name pills       People.tsx  members and walkers
  Equipment.tsx     places stations, click/hover, pins    registry.ts station id -> 3D object
  machines.tsx      upper/lower-body machine models
  cardio.tsx        treadmill, stairmaster, bike
  fixtures.tsx      reception, lockers, dumbbell rack, stairs, rails, props
  Building.tsx      walls, slabs, windows, floors + story animation
  Outdoors.tsx      ground, road, trees, background blocks
  Scene.tsx         Canvas, lights, camera rig (zoom/rotate/reset)
  store.ts          zustand store (story, exploded, labels) + camera commands
  theme.ts          palette + dimensions
```

All models are built from rounded boxes and cylinders (no external assets), so the repo is self-contained and works offline.

## Notes

- WebGL does not render on the server, so the scene is loaded with `next/dynamic` and `ssr: false`; the HUD is still server-rendered.
- Units are metres. The footprint is 16 × 12 m, story height 3.4 m.
