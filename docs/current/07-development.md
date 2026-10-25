# Development and handoff

## Source layout

| Path | Responsibility |
| --- | --- |
| `dist/index.html` and `dist/style.css` | Menu, visitor HUD, touch controls, dialogs, responsive styling |
| `dist/layout.mjs` | Stable room data, dimensions, openings, stair bounds, floor lookup |
| `dist/world.mjs` | Procedural architecture, furniture, lighting, collision boxes, target selection |
| `dist/visuals.mjs` | Shared material textures, detailed decorative geometry, fern models, reflection environment, quality presets |
| `dist/sculptures.mjs` | Original procedural classical studies adapted from the legacy renderer; no puzzle code |
| `dist/app.mjs` | Movement, inspection, map, monitor/lamp, save state, menus, ambience |
| `dist/vendor/` | Self-hosted Three.js 0.170.0 and geometry utilities; MIT license included |
| `docs/current/` | Source-of-truth design documents for this version |
| `docs/legacy/` | Historical source snapshots and full-spoiler catalogue; never imported by the game |
| `docs/floor-plans/` | Two author plans, visitor plans, and progression visual |
| `scripts/build-docs.mjs` | Regenerates plans and the public design notebook |
| `tests/foundation.mjs` | Scope, navigation topology, ramp continuity, closed routes, document coverage |
| `.openai/hosting.json` | Hosted Site identity and static deployment directory |

## Work locally

The game is a static module application with no installation or bundling requirement. Serve `dist/` over HTTP. One local option is `python -m http.server 8000 --directory dist`; open `http://localhost:8000`. ES modules do not run correctly from `file://`.

After editing documentation or layout, run `npm run build`. Run `npm run check` for syntax and foundation checks. Browser checks should cover startup, touch controls, keyboard navigation, every open threshold, stair ascent/descent, closed routes, lamp switching, map, and save/continue.

## Update rules

Keep stable IDs when moving or renaming rooms. Change `layout.mjs` first, then regenerate the plans. Keep collision boundaries and visible openings consistent. Each new puzzle must have a complete design record before its validator is implemented. Update the content register and progression dependencies in the same commit.

The app uses a new save key. If its schema changes incompatibly, version the key and document the migration or reset. Storage failure must not prevent a visit. Secrets cannot be secured in a static client; future solutions will be inspectable in source.

## Rendering and accessibility

The geometry is built procedurally. Static meshes sharing a material and shadow flags are merged to reduce draw calls; pixel ratio is capped at 1.25 by default, with Economy and High options. One cached directional shadow map supplies daylight. Shared small textures and a one-time prefiltered environment add surface detail and reflections. The scene uses no external CDN, no image downloads, and no dynamic asset fetch beyond its own static files. Decorative artwork is original procedural artwork and carries no puzzle evidence. See [visuals and performance](08-visuals-and-performance.md) for budgets.

Controls include keyboard, drag-to-look, touch joystick, visible inspection actions, text versions of entrance descriptions, and a map with quick visits to open rooms. Ambient audio is opt-in and not a clue. The layout is responsive; the 3D view requires WebGL. If WebGL is unavailable, an automatic Canvas 2D plan view preserves movement, physical collisions, stairs, floor changes, and interactions. The menu identifies this fallback. This milestone is not a fully nonvisual playable game.

## Verification limits

The managed preview browser reported WebGL disabled. Browser interaction and layout checks therefore run in the plan-view fallback. The actual production scene is also instantiated in a headless geometry test: every open threshold is traversed in both directions, the full stair is climbed and descended, closed gates and the mezzanine void are checked, spawn points are verified, and lamp switching is asserted. Visual quality and GPU performance of the 3D rendering still require checking on a WebGL-capable device. This is an environment limitation, not evidence of a 3D rendering failure.

## Hosting and GitHub

The user repository is `https://github.com/threebeat/Puzzle-Pieces`. The hosted Site uses its own source remote for publishing the same source state. Keep GitHub synchronized for future sessions. Preserve the Site ID in `.openai/hosting.json`; do not accidentally deploy into either retired museum.

Use the Sites source-workflow helper to commit, push, and package `dist/`. Publish the saved version of the exact verified commit. This documentation and the game are Git-backed project files; they are not separate Library artifacts.
