# Decisions, questions, and future ideas

## Confirmed from the current brief

The title is Puzzle Pieces. The main hall is the hub. Exhibit names are Hidden Operators, Days of Rebirth, and Cross/Hatch. The hall has a north/northeast window, a south/southwest staircase, skylights, special chandeliers, one large abstract sculpture, four Greek-style studies, benches, plants, wall art, a circular information booth, and a monitor wired to an old street lamp.

The northern arcade is open, with Hidden Operators and a café opposite one another, plus the downstairs map. The eastern arcade is locked. The southern arcade is shorter, open, and contains elevators, a gift-shop door, and a separate locked security route. Gift-shop windows face the main hall. The public stair reaches the west mezzanine only. The east mezzanine starts closed. Cross/Hatch is upstairs.

Solution markers, answer sheets, physical mechanisms, and cable-linked monitors are recorded for future work. The five gallery rooms remain empty.

## Decisions made for this implementation

| Decision | Status / rationale |
| --- | --- |
| Later five-room list defines the milestone | Explicit detailed instruction supersedes earlier “1–2 rooms” shorthand |
| Hall bearing = 12° east of north | Proposed numerical interpretation of the requested slight tilt |
| Option A is the playable plan | Preserves clear axial orientation and offers expansion bands |
| Days of Rebirth west of the stair | Preserves “across from southern arcade”; resolves conflicting “left” wording |
| Café and gift shop are open shells | No lock requested; prevents carrying over the retired gift-shop key puzzle |
| Elevator access is inactive | Protects the required west-only public mezzanine access |
| Monitor switches lamp directly | Demonstrates the specified cable connection without adding a puzzle |
| Exhibit entrance prose | Proposed thematic descriptions, not puzzle rules |
| Browser map includes quick visits | Lets the current architecture be reviewed on desktop and touch without unlocking closures |
| Automatic plan-view fallback | Keeps the museum playable on browsers that cannot initialize WebGL; uses the same movement and collision logic |
| Legacy archive covers both earlier prototypes | User references a previous project; both related local source snapshots were recovered |

## Open questions for the next design pass

1. Which exact first artwork teaches Hidden Operators' central idea?
2. Should room-wide and exhibit-wide answers share a visible input grammar, or differ by mechanism?
3. How should the player know which kinds of outputs can be reused without being told where they belong?
4. What belongs in the opening narrative, if anything, before free exploration begins?
5. How much impossible architecture should appear after the hall establishes a reliable baseline?
6. Is Option A's straight progression through 1.01–1.03 preferred, or Option B's return loop?

## Deferred features from the current brief

- Glowing question-mark solution markers and their answer screens.
- Answer sheets and submissions to physical mechanisms.
- More cable-connected computers and mechanisms, with documented endpoints.
- Room, artwork, and exhibit puzzles, including reused outputs across spaces.
- An opening condition for the eastern arcade, security route, lifts, and east mezzanine.
- Further gallery rooms, café details, gift-shop details, employee circulation, and room features.

## Retired ideas available for reconsideration

The older tablet, redaction training, division gallery, map fragments, color masks, sound sequences, provenance audit, secret return passages, and dedication/narrative beats are archived. None are a current requirement. See the legacy catalogue before selecting material to reuse.

## Change log

**0.2 — 24 October 2026:** Added shared surface textures, stone relief, soft environment reflections, corrected daylight shadow flags, detailed ferns and architectural fittings, and three graphics settings. Cached the static shadow map and reduced the batched scene from 85 to 69 meshes; triangle count increased 2.4%. Layout and empty exhibit scope are unchanged. Full 3D appearance and FPS remain unverified in the WebGL-disabled preview environment.

**0.1 — 24 October 2026:** Established a separate new codebase and documentation structure; drafted two floor-plan options; selected Option A; built the main hall, arcades, two amenity shells, five gallery shells, and public west mezzanine; archived the two recovered prototypes and their solution data. Added movement, collision boundaries, map, local saves, optional ambience, and the wired lamp interaction.
