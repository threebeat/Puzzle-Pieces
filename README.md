# Puzzle Pieces

A web-based puzzle game set in a mysterious museum where the art pieces are the puzzles.

**Current milestone: 0.1 — the opening architecture.** The main hall, public arcades, west mezzanine, and five empty exhibit rooms are explorable. Actual exhibit puzzles will be designed in later iterations.

- [Play online](https://puzzle-pieces-foundation.johnmoore2048.chatgpt.site)
- [Read the design notebook online](https://puzzle-pieces-foundation.johnmoore2048.chatgpt.site/docs/)
- [Documentation index](docs/README.md)
- [Two floor-plan options](docs/floor-plans/README.md)
- [Player progression](docs/current/04-player-progression.md)
- [Legacy puzzles and exact solutions — spoilers](docs/legacy/puzzles-and-solutions.md)

## The current museum

**Hidden Operators** has a boxy first gallery, a hallway gallery, and a larger third gallery. **Days of Rebirth** has a medium rectangular room beside the south stair. **Cross/Hatch** has a very large room with freestanding display walls on the west mezzanine. All five are open and empty.

The hall contains the great northern window, abstract sculpture, four Greek-style studies, skylights, chandeliers, benches, plants, wall paintings, and a circular information booth. Its monitor operates an old lamp through a visible wire. The northern arcade contains the café and visitor map; the southern arcade contains the gift-shop entrance and inactive lifts. The east arcade, security route, and east mezzanine remain closed.

Option A is implemented. Option B is a documented alternative with a returning northern wing. Future expansion zones are reserved on the author plans.

## Play and develop

Desktop: WASD to walk, drag to look, E to inspect, M for the map, Escape for menu. Touch: left joystick to move, drag the view to look, and tap the visible inspection action. The map offers quick visits to open rooms. Position is saved in the current browser.

The primary view is 3D. Browsers without WebGL automatically use a playable plan view with the same physical layout, collision rules, stairs, and interactions.

No dependency installation is needed. Serve `dist/` over HTTP, for example:

```sh
python -m http.server 8000 --directory dist
```

Run `npm run build` after layout/documentation changes; run `npm run check` for syntax and behavioral checks. See the [development guide](docs/current/07-development.md).

## Documentation boundaries

`docs/current/` is the new design. `docs/legacy/` preserves both retired prototypes, including their puzzle solutions, exact clue text, source snapshots, and checksums. Legacy material is not imported by the new game. New puzzles should begin with the [design template](docs/templates/puzzle-design.md).

The code and documents are committed here so future sessions can continue from a concrete source of truth. The hosted copy uses the Site identity in `.openai/hosting.json`; do not reuse either retired museum's hosting identity.
