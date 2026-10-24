# Puzzle Pieces

A public, buildless point-and-click museum puzzle game. The completed playable scope is the opening exhibit: five division paintings, a related sculpture, two connected murals, a four-painting food rebus, and a cross-room map puzzle. The named wings after the ending are future chapters.

## Files

- `dist/index.html`, `style.css`: responsive presentation and all interface layouts.
- `dist/app.mjs`: scenes, opening letter/dialogue, tablet, inventory, map, settings, developer controls, keyboard and touch interactions, local saves, synthesized optional audio.
- `dist/core.mjs`: puzzle data, accepted responses, save validation, room completion, item collection, progression gates.
- `dist/art.mjs`: exact SVG puzzle artwork and equipment icons. Counts are deterministic; generated environment images never carry essential puzzle information.
- `dist/assets/`: three self-hosted, generated WebP environment stills.
- `scripts/check.mjs`: answer/progression tests and a browser-free UI event walkthrough.
- `.openai/hosting.json`: existing Site identity and static hosting configuration. Preserve the project ID for subsequent edits.

## Working on the game

There is no install or build step. Serve `dist/` as static files. Run `npm test` or `node scripts/check.mjs` for logic and UI dispatch checks. Browser visual QA requires a separate supported browser environment; these checks do not assert layout pixels or browser-specific behavior.

Use the Sites workflow helper to synchronize the source and package `dist/`; deploy a saved version of that exact source state. The Site is public at the user's explicit request. There are no visitor accounts or external data calls. Every visitor's progress and notes stay in their own browser's localStorage, under versioned keys. This is not cross-device saving. All environment assets are local, with no third-party CDN dependency.

## Extending content

Add rooms and puzzle records to `core.mjs`, then their artwork to `art.mjs` and scene markup to `app.mjs`. Keep puzzle information exact and available in inspect views. Preserve the minimal hint approach: plaques, response shape, frame markings, and the tablet catalogue. Add developer explanations with every puzzle. The numeric room/answer state uses stable IDs rather than display names.

The five-second gear on the menu reveals the complete developer guide and local progression controls. It is discoverability concealment, not security; this is a fully client-side game, and answers can be read from its source. The $100,000 offer is fictional narrative content in the in-game invitation.

## Environment art

The built-in image generation tool created three wide, cinematic, liminal museum stills. They were converted to WebP for delivery.

- `exterior.webp`: a solitary symmetrical neoclassical museum in misty moorland at dusk, warm windows, amber-gray light, no lettering or people.
- `gallery.webp`: a wide empty classical gallery, bare olive cream wall, walnut dado, five picture lights, parquet floor and central stone pedestal; precise art is composed in code.
- `hallway.webp`: an impossibly long dark green corridor with two blank recessed mural panels, amber lamps, checkerboard floor, and a distant door.

## Main route (spoilers)

Gallery: 4, 6, 3, 7, 2; sculpture: 11. Murals: 62533. Food paintings in painting order: 07, 08, 09, 01. Collect each room's physical map fragment. The assembled map extracts 11 from the sculpture, 5 from the middle mural answer, and 25 from the sum of chosen food columns. A1Z26 gives KEY. All nine accepted responses and all three fragments open Further In.

Three exhibit rooms open together after the tablet is taken. The long corridor's far door deliberately loops into itself. A secondary gallery door reaches that corridor. Room numbers and navigation remain dependable even where the architecture does not.
