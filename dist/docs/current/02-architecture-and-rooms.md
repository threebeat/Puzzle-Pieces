# Architecture and room register

## Coordinate convention

The hall is 20 m wide and 56 m long. Its long axis points **12 degrees east of true north**. In the implementation, local east is +x, local south is +z, and floor height is y. Plans rotate the building 12 degrees clockwise under a true-north arrow. The great window is at the north/northeast end; the public staircase is at the south/southwest end. This is a schematic design scale, not a construction specification.

Facing the window, the northern arcade turns left/west and the locked eastern arcade turns right/east. Facing the stair, the southern arcade turns left/east. Days of Rebirth is on the opposite/west side adjacent to the stair. The source brief also described Exhibit 2 as “going left” while facing the stair; that conflicts with placing it across from the southern arcade. The across-from relationship is the chosen, reversible interpretation.

## Main hall

An 11.6 m high room with a floor-to-ceiling northern window, alternating skylight bays and original ring chandeliers. A large abstract bronze sculpture stands in front of the glass. Four smaller Greek-style studies are grouped against the long walls around the hall's middle. Benches, potted ferns, slender columns, and four decorative wall paintings establish the rhythm of a museum without adding puzzle content.

A circular information booth sits at the centre. Its monitor connects by a visible copper wire to an old street lamp next to it. The monitor operates that lamp directly; this is a connection demonstration, not a solved-answer gate.

The single public stair rises at the south end to the west mezzanine only. The two mezzanine ledges have no bridge. The eastern side remains inaccessible in this milestone.

## Room schedule

| ID / code | Space | Approx. footprint | Initial state | Connections / purpose |
| --- | --- | --- | --- | --- |
| hall / H.00 | Main Hall | 20 × 56 m | Open; start | Northern arcade, southern arcade, Days of Rebirth, stair; view into gift shop |
| north / N.00 | Northern Arcade | 28 × 6 m | Open | Hidden Operators north side; café opposite; large downstairs map, bench, plants |
| east / E.00 | Eastern Arcade | 18 × 6 m | Locked | Future eastern rooms; the hall-facing doors are physically closed |
| south / S.00 | Southern Arcade | 18 × 6 m | Open | Two elevator doors, gift shop, separate locked security passage |
| cafe / N.01 | Café | 14 × 12 m | Open shell | Across from Hidden Operators; future furnishings and uses undecided |
| gift / S.01 | Gift Shop | 10 × 16 m | Open shell | Door from southern arcade; glazed windows into the main hall |
| security / S.02 | Security Hall | 6 × 10 m | Locked | Space reserved for later employee rooms; not part of the lift bank |
| ho1 / 1.01 | Hidden Operators / Room 01 | 16 × 19 m | Open; empty | North arcade → Room 02 |
| ho2 / 1.02 | Hidden Operators / Room 02 | 12 × 6 m | Open; empty | Hallway gallery linking 1.01 and 1.03 |
| ho3 / 1.03 | Hidden Operators / Room 03 | 19 × 20 m | Open; empty | Large third room; future expansion north/east |
| dr1 / 2.01 | Days of Rebirth / Room 01 | 18 × 16 m | Open; empty | West side of south hall; future expansion west/south |
| west / M.01 | West Mezzanine | 4 × 54 m | Open by public stair | Hall overlook and Cross/Hatch entrance |
| east-upper / M.02 | East Mezzanine | 4 × 54 m | Closed | No public bridge or stair; future access undecided |
| ch1 / 3.01 | Cross/Hatch / Room 01 | 28 × 22 m | Open; empty | West mezzanine; two freestanding display walls; future expansion west/north |

Exhibit room ceilings: 1.01 = 5.8 m, 1.02 = 4.1 m, 1.03 = 6.2 m, 2.01 = 5.2 m, 3.01 = 5.4 m above the mezzanine. Mezzanine elevation is 4.5 m.

## Circulation contracts

- All five exhibit rooms can be reached immediately through public paths. “Open” does not mean each has its own doorway to the hub.
- The café and gift shop are accessible shells. Their operational furniture and story are deferred.
- The east arcade and security hall cannot be walked through. Map quick visits do not bypass them.
- Both elevator banks are visible and inspectable, but neither operates. No puzzle currently restores them.
- The west stair is physically traversable in both directions. A railing and the floor boundary keep visitors out of the hall's upper void.
- Room names and exhibit names remain visible in the HUD. Doorway labels provide local confirmation.

## Space reserved for growth

Option A reserves the land beyond Hidden Operators' north edge for further rooms, west of Days of Rebirth for a second room sequence, the eastern arcade for a new wing, the south security threshold for a future employee circulation system, and west/north of Cross/Hatch for upper galleries. These are dashed areas on the author plans, not walkable rooms or promises of a particular puzzle.

Do not occupy expansion bands with necessary structural objects until the next room layout is agreed. The dimensions and IDs live in `dist/layout.mjs`, which also generates the floor plans.
