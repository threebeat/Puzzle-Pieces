# Signage and wayfinding

Revision 0.4 / 25 October 2026. These samples use the same lettering, spacing, colours and drawing code as the signs installed in the museum.

## Visual language

The museum uses quiet, contemporary signage: warm white panels, charcoal lettering, muted exhibit colours and matte dark metal edges. Arial/Helvetica provides a familiar sans-serif face without an external font download. Exhibit numbers are prominent; titles use sentence case; descriptions have generous line spacing. Directional arrows are simple drawn symbols. Decorative borders and italic body text have been removed.

| Family | Content and hierarchy | Mounting |
| --- | --- | --- |
| Exhibit introduction | Exhibit number, name, entrance description | One wall panel beside each exhibit doorway |
| Directional sign | Location code, destination, brief secondary line and arrow where needed | Solid wall bay beside the passage |
| Room label | Gallery code, room name, exhibit name | Interior wall, away from the entrance aperture |
| Collection caption | Collection name, work title and medium | Classical plinth face or a narrow floor stand beside the bronze sculpture |
| Visitor directory | Ground-floor plan, numbered exhibits, amenities and current location | Backed panel on the northern arcade wall |
| Information desk | Small nameplate and integrated monitor interface | Counter brackets and the monitor housing |
| Service information | Elevator availability or access restriction | Wall above the lift bank or beside the restricted doorway |

## Placement and hardware

Every wall panel has a slim backing plate touching the wall. No sign floats across a doorway. Introduction panels sit beside the openings; café and shop labels have moved onto solid wall bays; closure signs sit beside closed doors. Elevator signage is above the door heads with clear vertical separation. A panel must clear door/window apertures and their trim by at least 0.2 m.

The four classical captions attach directly to their plinths. The bronze caption uses a metal post, floor base and backed panel beside the artwork. The information nameplate has brackets reaching the curved counter. The screen sits on the monitor housing, whose stand rests on the countertop.

Sign placement is registered in `dist/signage.mjs`. Changes must retain a declared wall, floor or fixture mount. Wall-support and opening-clearance checks use the production room geometry. Sign panels on the same wall must not overlap. Floor stands have collision so players cannot walk through them and must remain outside doorway approaches.

## Desk and arcade circulation

The information booth is a C-shaped ring with a **5.8 m outer diameter**, a **3.2 m clear central diameter under the countertop**, and a **1.3 m wide entrance on the west side**. Its body, countertop, trim and fluting all stop at the entrance. The interior has a compact work stool offset from the entry route. Players can enter, turn inside and leave. The wired monitor, keyboard and brochures stay on the ring; the cable follows the counter and exits toward the lamp, without crossing the entrance.

The plant previously at the northern arcade threshold has moved to the northwestern hall bay near the window. The arcade approach is checked for several walking lines across the opening, extending well beyond the threshold itself.

## Performance and validation

All 24 sign faces share one 2048 × 2048 texture atlas. Backing plates and mounts reuse existing materials. The new scene contains **42 meshes, 134,472 triangles, 41 materials and 27 referenced surface textures** after batching. The prior revision had 69 meshes and 132,264 triangles. These are geometry/resource counts, not measured FPS.

Checks cover entry and exit through the counter, its open centre, solid counter edges, monitor reach, the full northern arcade approach, supported wall panels, doorway/window clearance, and overlapping signage. Existing room, stair, closure and archive checks remain in place. Browser samples check the actual text layout independently of WebGL. The preview browser cannot verify the final 3D lighting or GPU appearance.
