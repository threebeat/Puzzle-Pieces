# Visuals and performance — revisions 0.2–0.4

This pass improves the existing museum's finish while retaining the empty exhibit rooms and all opening navigation rules.

## Counter and signage / 0.4

The walk-in ring counter and mounted signage retain the existing lighting and quality settings. The single sign atlas reduces the complete scene to 42 meshes, 41 materials and 27 surface texture references; triangles total 134,472 (1.7% above revision 0.3). See [signage and wayfinding](09-signage-and-wayfinding.md) for the visual system, placement rules and text samples.

## Surface corrections / 0.3

Shared room boundaries previously generated two coincident wall boxes, which could compete for the same depth pixels. The wall builder now unions each boundary into non-overlapping slabs and cuts door/window apertures once. The glazing uses one transparent double-sided sheet per opening, with no depth writes or received shadows; this avoids stacked glass faces and dark shadow patterns on clear panes. Decorative art has been moved off the gift-shop glazing. The Days of Rebirth ceiling now clears the Cross/Hatch floor above it.

The scene remains at **69 meshes, 68 materials and 55 referenced surface textures** after the larger hall and return stair. The triangle count is **132,264**, 0.7% above revision 0.2 and within the existing 135,000 budget. No extra rendering passes or real-time lights were added. These corrections target confirmed geometry/material causes; the preview environment still cannot establish that every artifact reported on the user's GPU is gone.

## Lighting

Cooler daylight and warmer ground bounce give the architecture more depth. A directional fill keeps the darker sides of objects readable. The atmospheric haze begins farther away so the whole hall remains visible. Glass and luminous skylight panels no longer act as opaque shadow casters.

A small, prefiltered room environment provides soft reflections on bronze, brass, glass, and polished stone. It is generated once, not rendered as a live mirror. Subtle floor-light overlays suggest the skylight grid without a screen-space effects pass. The single directional shadow map is cached because the building and sun are static; changing graphics quality refreshes it. The switchable street lamp remains a non-shadowed point light.

## Materials and models

- Shared procedural texture assets: plaster grain, limestone/marble veining, fine relief, oak grain, brushed metal, and bronze patina. Maps are 64–512 pixels and generated locally at startup.
- Material-scaled UVs on box-built architecture prevent texture details from stretching over an entire wall.
- Four-triangle folded fern leaflets replace rounded ellipsoid leaves; curved stems and pot rims give each plant a more convincing silhouette.
- Door surrounds, column flutes and collars, stepped capitals, concentric chandelier arms and shades, desk fluting, keyboard keys, brochures, a pen stand, picture lamps, floor inlays, and layered trees improve close inspection.
- The abstract bronze sculpture has a slightly smoother silhouette. Classical sculpture studies gain veined marble and softer environmental highlights.

The exhibit rooms remain empty. Added objects are decorative finish, not new puzzle clues or mechanics.

## Measured scene budgets

These are geometry and resource counts from the instantiated production scene after batching, not a device frame-rate benchmark.

| Measure | Revision 0.1 | Revision 0.2 | Change |
| --- | --- | --- | --- |
| Renderable meshes | 85 | 69 | 18.8% fewer |
| Triangles | 128,246 | 131,384 | 2.4% more |
| Unique mesh materials | 84 | 68 | 19.0% fewer |
| Referenced surface textures | 65 | 55 | 15.4% fewer |

The texture count covers map, bump-map, and roughness-map references on meshes. The one GPU reflection environment is additional. A mesh count is not the same as total draw calls: shadow and renderer passes also contribute. These figures do not prove an FPS improvement. Cached shadows reduce repeated work, while bump mapping and environment sampling add some fragment-shading cost.

Static merging now preserves shadow flags. Shared contact shadows and skylight overlays are merged by material, avoiding separate texture/material allocations per object. Superseded geometry buffers are disposed after merging.

## Graphics settings

The visit menu offers three settings, saved with the current visit:

| Setting | Pixel-ratio cap | Shadow map | Intended use |
| --- | --- | --- | --- |
| Economy | 1.0 | 1024 × 1024 | Devices where movement feels slow |
| Balanced (default) | 1.25 | 1536 × 1536 | General use |
| High | 1.5 | 2048 × 2048 | Sharper edges and shadows on capable devices |

All settings retain the same room content and geometry. No bloom, SSAO, real-time mirrors, extra shadow-casting lights, or per-frame reflection probes are added. The plan-view fallback is retained; its graphics selector is disabled because it does not use the 3D quality settings.

## Verification

The regression suite checks every public threshold in both directions, two-flight stair ascent/descent and turning-landing headroom, duplicate wall prevention, glazing surfaces, desk interaction reach, closed routes, upper-floor boundaries, lamp behavior, spawn points, and archive integrity. It also enforces budgets of 75 meshes, 135,000 triangles, and 60 referenced surface textures, tests quality selection, and checks that glazing and luminous panels do not cast opaque shadows.

The available preview browser has WebGL disabled. Its UI and fallback can be verified, but final 3D lighting, material appearance, and frame rate must be checked on a WebGL-capable device. No FPS claim is made from the headless checks.
