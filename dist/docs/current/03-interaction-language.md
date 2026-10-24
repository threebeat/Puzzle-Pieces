# Interaction language

## Implemented now

Visitors walk, look, inspect entrance descriptions, open the museum map, use an optional quick visit to an open space, and toggle the information booth's connected lamp. Location, exhibit, and floor are visible. Position and settings save locally under `puzzle-pieces-foundation-v1`; no legacy progress is loaded. Wrong movement cannot cross a closed threshold.

Desktop: WASD / up-down arrows walk; drag to look; left-right arrows turn; Shift walks faster; E inspects; M opens map; Escape opens/closes the menu. Touch: left joystick moves; dragging the scene looks; the visible interaction button inspects. Sound is optional and starts off.

## Confirmed direction, deferred implementation

### Solution markers

A marker is a **glowing question mark inside a circle**, placed on the ground. It may stand immediately in front of one artwork, in a room's shared space, or somewhere apparently unrelated. Activating it opens a marker screen containing the appropriate solution field. Discovering what a marker refers to can be part of the puzzle.

Do not assume proximity is a universal binding rule. A marker needs a stable authoring ID and a documented scope even when that relationship is hidden from the player. Its screen must make the input format and submit action understandable without revealing the inference.

### Mechanisms and monitors

Answers may be entered into a physical mechanism, a monitor, or a marker field. Mechanisms can also require spatial or physical actions. Some monitors are wired to a separate device. A visible cable means the endpoints are connected in some way; it does not by itself say which answer is needed or whether the signal is one-way.

Wires should form a continuous, traceable path over floor or wall surfaces. Future wire records should explicitly name both endpoints and what state is communicated. The present example is `hub-monitor → hall-lamp`, switching the lamp on/off.

### Answer sheets

Some puzzles will use an answer sheet that the player fills in and submits to a mechanism. The current game does not yet implement carried paper, editing rules, printers, checking machines, or an inventory. The legacy Security and audit systems are archived as optional reference material.

## Authoring fields required before implementing a puzzle

| Field | Why it matters |
| --- | --- |
| Stable ID; exhibit, room and work IDs | Allows content to move without corrupting progress |
| Player-visible evidence | Ensures all required facts are available |
| Scope and dependencies | Distinguishes work, room, exhibit, and museum-wide reasoning |
| Answer destination(s) | Makes reuse of a solution explicit |
| Canonical solution and accepted equivalents | Prevents formatting traps |
| Incorrect, incomplete, and accepted feedback | Makes the response legible |
| State changes and persistence | Defines exactly what a correct answer affects |
| Reset and recovery | Prevents irreversible experimentation or softlocks |
| Accessibility alternative | Avoids reliance on color, audio, precision aiming, or tiny lettering alone |
| Proof / ambiguity review | Shows why competing reasonable answers fail |

## Proposed conventions to review

Separate discovery from answer correctness. Treat accepted solutions as permanent unless a puzzle explicitly defines a reversible state. Normalize harmless whitespace and case when those are not part of the puzzle. Do not award a universal score or use attempts as currency without a new design decision. Mark these as proposals until an actual puzzle is authored.

The former tablet, map-fragment puzzle, universal multi-answer catalogue, and redaction grammar have not been adopted. They remain in `legacy/`.
