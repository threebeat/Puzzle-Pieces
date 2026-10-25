# Puzzle Pieces — design notebook

**Current milestone: 0.1 / the opening architecture.** Updated 24 October 2026.

**Visual revision 0.2:** richer lighting and materials, more detailed fixtures and vegetation, cached shadows, and graphics-quality settings. See [visuals and performance](current/08-visuals-and-performance.md) for measured budgets and verification limits.

Puzzle Pieces is a web-based mystery museum in which art pieces become puzzles. This milestone establishes the building, its orientation, and a durable design record. The five exhibit rooms are deliberately empty.

## Start here

| Document | Purpose |
| --- | --- |
| [Core concept](current/01-core-concept.md) | What the new game is, what is confirmed, and what remains undecided |
| [Architecture and rooms](current/02-architecture-and-rooms.md) | Exact opening layout, stable IDs, connections, dimensions, and expansion space |
| [Interaction language](current/03-interaction-language.md) | Solution markers, mechanisms, answer sheets, wires, and player orientation |
| [Player progression](current/04-player-progression.md) | First-visit route, branches, closures, and a visual flow chart |
| [Content register](current/05-content-register.md) | Current works and room status; no unapproved puzzle content |
| [Decisions and backlog](current/06-decisions-and-backlog.md) | Assumptions, unresolved decisions, future ideas, and change history |
| [Development guide](current/07-development.md) | Source structure, local use, testing, publishing, and update procedure |
| [Visuals and performance](current/08-visuals-and-performance.md) | Material assets, lighting, model detail, quality settings, and measured budgets |
| [Floor-plan options](floor-plans/README.md) | Two alternative layouts; Option A is the playable version |
| [Puzzle design template](templates/puzzle-design.md) | A consistent record for future puzzles and exact solutions |
| [Legacy archive](legacy/README.md) | Retired prototypes, their source provenance, puzzles, solutions, and unimplemented ideas |

## Content boundaries

`current/` records the design we are developing now. `legacy/` is a reference archive with full spoilers; nothing there is automatically part of the current game. `floor-plans/` contains proposals and an explicitly selected implementation. `templates/` supplies formats for future additions.

The main hall and five exhibit room shells are walkable. The monitor can switch the connected lamp. There are no answer validators, puzzle gates, secret keys, or scores in the current experience. The inherited legacy save formats are not used.

When changing the game, update the relevant current document, the room/content register, the decision log, and the progression graph in the same commit. Keep the archive immutable except for source corrections or clearly marked additions.
