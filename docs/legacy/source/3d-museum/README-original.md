# Puzzle Pieces — made for Tiffany

A self-contained first-person WebGL museum puzzle game, published at the existing site address so browser saves migrate in place. Three.js and all assets are local; play needs no external asset service.

## Current building

The Long Hall is now 19 × 70 metres and 14 metres high, looking toward the original bronze sculpture and tall north window. The curved oak-and-glass reception island stands at its center. A single stair along the south wall reaches only the west mezzanine; there are no bridges. Six original Greek-inspired marble figures and eight fluted columns line the hall. Seven fern planters use individually paired leaflets.

A glass-fronted gift shop replaces the former Security office. It starts locked; its key is on the conference table in the employee wing. The south-wall employees-only door opens only after Security certification and connects to the conference room and full service wing. The South Arcade has two public lift cars; Security and South Service sit in a separate southern hallway.

| Level | Collection and circulation |
| --- | --- |
| Ground | Chromatic Debt northwest, The Shape of Silence northeast, Counterform southwest. The South Arcade, public elevators, separate Security Approach and certified service wing lie southeast. Washrooms retain the dropped staff card. The garage, Letter Workshop and concealed Counterform return extend south and west. |
| Upper | In Perpetuity: three delays, a five-beat kinetic sculpture and a locked afterimage archive. The east employee hall connects the relocated break room, Projection Loft and freight landing. The hanging weights remain upstairs in the loft. |
| Third | Staff stair landing, administrator’s office and an abandoned birthday room for Tiffany. |
| Basement | The Uncatalogued: an unfinished receiving/restoration exhibit with twelve artifacts, six paired reference paintings, three worktables, a markable manifest, mechanical verifier and five-contact circuit. |

Complete Security’s redaction lessons, print the final sheet and submit it to the checker. Acceptance lights the copper cable from the computer to the service door and releases South Service, the conference room, supply closet, garage and employee stair. The south inspection lift descends with that authorisation, and always permits a return. The basement verifier issues clearance for the separate freight lift to the upper employee hall. Museum transformations, carried restoration tools and the garden meta-puzzle remain future work.

The staff room has a microwave, bubbling coffee pot, opening fridge, table and chairs. Its five colored post-its are half their earlier dimensions; a wanted poster sits beside them. The Chinese takeout menu retains its handwritten note and fictional telephone number, updated to refer to south service. Appliances have physical interactions and spatial sound.

## Visiting and interacting

The title screen overlays the blurred museum view. Continue, New Game, Settings and pause remain available. Settings include fullscreen when supported, sound, sensitivity, captions, reduced motion and graphics quality.

Physical art controls act directly. The interaction indicator remains an unlabeled circle. Plaques carry title, artist, medium and clue text; their close-ups reuse the exact world artwork. Longer exhibit introductions receive taller bordered cards. Artwork, papers and the four-level visitor map can be zoomed and panned.

Pick up the plan and brochure from reception. The inventory holds collected papers, the security card and the collected shop key. In B1, pick up the manifest, cross off suspected forgeries, and submit it at the verifier. Rejected sheets return after two seconds; gauges identify only the incorrect groups of four. There is no resource penalty or permanent lockout.

- WASD / up-down arrows: walk; Shift: faster. Mouse/drag: look; left-right arrows: turn.
- E / click / unlabeled touch circle: interact.
- M: collected map. I: carried papers. J: collected manifest. N: notes.
- Escape or the corner ×: close / pause. Touch joystick: walk.

Save schema 5 preserves earlier discoveries, settings and notes. Versions 1–4 return the player to the arrival point because the architecture changed. Existing basement visitors retain their authorisation. Current saves preserve all four elevations, papers, manifest marks, verifier attempts, time dials, redactions, dispatch guesses, tile placements and opened routes. The existing localStorage key is retained for continuity.

## Security and the service garage

The white computer presents six redaction sheets. Every surviving statement must be true; periods remain attached to words and line breaks are only spacing. Each sheet displays its word allowance, and excess attempts flash the budget without changing the answer. Starting with sheet III, heavy type inverts the whole statement. Two later exercises refer to actual hall architecture and the public west-mezzanine height study. The final printed sheet goes through a two-second physical checking cycle; wrong work is returned for unlimited revisions.

The garage dispatch plate accepts five-letter words from an in-world register, using position and repeated-letter feedback. Its accepted word opens the Letter Workshop. There, sixteen loose tiles form a four-by-four square whose matching rows and columns must agree. Acceptance opens a hidden service passage back to Counterform. Both boards use their exact world images when inspected; keyboard and touch controls are available.

The employee stair is the first route to the east mezzanine. Once upstairs, the PUBLIC LIFT SUPPLY switch restores the South Arcade cars as a return loop. Each car has a call button, sliding metal doors, illuminated header, threshold tracks, interior floor button and handrail. The basement inspection lift and clearance-controlled freight lift are separate systems.

## Visuals and audio

This revision adds 36 inspectable abstract canvases across thirteen visual modes, plus six classical sculpture cards. Decorative works do not introduce undocumented locks. The toilet models have open oval bowls, water, separate seats and lids, tanks, flush controls and paper rolls. New materials include brushed steel, darkened metal, marble, oak, ceramic and clear glass. Reference sources and their use are recorded in [VISUAL-REFERENCES.md](VISUAL-REFERENCES.md).

Procedural materials, the retained limestone texture, directional shadows, contact shading, recessed lights and authored floor shading distinguish the spaces. This is an authored lighting approximation, not a ray-traced light bake. Artifact paintings and inspection plates are deliberately stylized, exact drawings so clue details remain consistent. In-world Canvas textures are capped at 768 pixels; inspectors keep or regenerate the full-resolution original. Standard card canvases are generated again when inspected instead of retaining a large duplicate for every label.

Web Audio supplies resonators, appliance sounds, footsteps, a 4.4-second reverberation response, separate echo taps, the five-pulse movement and verifier clatter. The upstairs movement and suspect watch share one synthesis function; visible pulses and maker marks independently confirm their relationship. No commercial recordings are used.

## Source and design

- `dist/layout.js`: room bounds, four elevations, doors, stairs, floor support and collision.
- `dist/world.js`: original gallery geometry, materials, physical controls and raycasting.
- `dist/expansion-world.js`: staff areas, upper exhibit, third floor, basement objects and verifier animation.
- `dist/circulation-data.js`, `dist/circulation-world.js`: lift definitions, service-wing fixtures, floor cable, conference room and shop.
- `dist/collection-data.js`, `dist/collection-assets.js`: original collection, classical figures, columns, ferns, reception and toilets.
- `dist/logic.js`: original puzzle facts, save schema and gallery texts.
- `dist/expansion-data.js`: all twelve provenance records, six reference pairings, verdicts, time puzzle and verification logic.
- `dist/art.js`, `dist/staff-paper.js`, `dist/expansion-paper.js`: exact images and physical papers.
- `dist/language-data.js`, `dist/language-game.js`, `dist/language-paper.js`, `dist/language-ui.js`, `dist/language-world.js`: redaction curriculum, truth evaluation, Security checker, garage word puzzles, exact display canvases and physical installation.
- `dist/game.js`, `dist/ui.js`, `dist/audio.js`: action handlers, walking, menus/inspection/inventory/map, saving and synthesized audio.
- `dist/floor-plan.html`: annotated author atlas with four zoomable, pannable floors, clickable rooms and numbered gates, global and local progression, a searchable lock register, exact clue cards, solutions and all twelve audit verdicts. Includes printable full guide and downloadable annotated SVG / Markdown. Spoilers are separate from the visitor map and do not alter game saves.
- `dist/guide-data.js`, `dist/guide-map.js`, `dist/guide-render.js`: author interpretation, maps from the actual spatial model and shared rendering. Exact puzzle answers and card text are imported from the game’s data.
- [PUZZLE-DESIGN.md](PUZZLE-DESIGN.md): complete author solution document.
- [EXHIBIT-ROADMAP.md](EXHIBIT-ROADMAP.md): larger future transformation and tool direction.

Three.js 0.170.0 and BufferGeometryUtils are vendored under MIT. The static hosting manifest requires no build step.

## Verification

`npm run check` checks module syntax/imports, unique original solutions, the independent time proof, all 4,096 manifests, group feedback, save migration, collision navigation through four elevations and all public/service/freight routes, real Three.js target raycasts, actual game action handlers with controlled timers, all permitted redaction subsets, duplicate-aware word feedback and unique word-square construction.

`node scripts/proof-collection.mjs` renders the original paintings and native geometry proofs for the new models. `node scripts/proof-language.mjs` renders Security and garage board states and checks card layouts. `node scripts/proof-expansion.mjs` renders artifact/paper proofs using native Canvas and checks all real card layouts. `node scripts/proof-staff.mjs` checks staff papers. `node scripts/draw-plan.mjs` (or `node scripts/build-author-guide.mjs`) derives the annotated four-floor SVG and written author guide from the actual layout, clue text and answers. These utilities are not runtime dependencies.

Browser/WebGL playtesting was unavailable in this environment. Actual fullscreen, pointer lock, touch gestures, audio balance and frame rate still need a browser playtest. Structural and raycast checks do not substitute for that visual/audio pass.
