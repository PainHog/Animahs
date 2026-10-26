# Art list

Every picture in the book, where it goes, and the smallest file that prints sharply.
This list is written by the build tools from the chapters; don't edit it by hand
(run `node book/tools/art-list.mjs` after changing which pictures the book uses).

## Swapping in your own artwork

1. Save your picture in `book/art/` with the **name** from the tables below and the
   ending `.png`, `.jpg` or `.webp`, for example `book/art/map-zoo.png`.
2. Rebuild the book (`npm run build:book`, and `npm run build:book -- --print` for the print file).
   Your picture is used in place of the stand-in drawing of the same name; nothing else changes.
   To go back to the stand-in, move your file out of `book/art/`.
3. The build warns if a picture is too small to print sharply (under 300 pixels per inch
   at its printed size). The **smallest file** column gives the size to aim for; bigger is fine.

Notes:

- Draw at the shape given. A picture of another shape still works: strips and portraits
  are cropped to fill, from the middle; maps, part pages and the back panel keep their
  own shape and are scaled to the width; spot illustrations are scaled to the height.
- PNG keeps transparency. Portraits are shown as circles, so their corners never show.
- Keep the checklist in `ART-CHECKLIST.md` in mind (true scale, the right number of legs,
  each character's Mark on the correct side, and nothing halfway through a change).
- Words drawn into a picture must stay at least 7.5pt when printed; spot illustrations
  should have none, because they can print small.

## Covers

**Portrait, 8.5 : 11**, printed 8.75 × 11.25 in. Smallest file: 2625 × 3375 px. Fills the front cover edge to edge (the size includes the 0.125in print bleed on every side, which is trimmed off). The title sits over the top third and the version line along the bottom, so keep those parts quiet.

**4 : 3**, printed 4.16 × 3.12 in. Smallest file: 1248 px wide. The framed panel on the back cover, under the blurb.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `back` | Back cover | 1248 px wide | The Lodge on Thornhill at night, one window lit, with two grey Hounds standing on the wall below. |
| `cover` | Front cover | 2625 × 3375 | Six animals on a moonlit hill above the town: a bison, a jaguar, a coyote, a rat, a barn owl on a post, an alligator, and an owl flying across the moon. Far off, the Lodge's windows glow gold. |

## Part pages

**3 : 1**, printed 6.7 × 2.23 in. Smallest file: 2010 px wide. On a dark part-title page, under the part's name.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `part-four` | Part Four page | 2010 px wide | Two character sheets, four dice and green Wild tokens on a table. |
| `part-one` | Part One page | 2010 px wide | A jaguar walking along a fallen log at the edge of the woods, with a barn owl flying across the moon. |
| `part-three` | Part Three page | 2010 px wide | Wrenfield at night with five numbered gold markers over the five missions, the last over the Lodge on Thornhill. |
| `part-two` | Part Two page | 2010 px wide | The Storyteller's table: an open book, a lit lantern and two dice, with the Hunt's gold crest above. |

## Chapter strips

**About 4 : 1**, printed 7.14 × 1.8 in. Smallest file: 2142 × 540 px. The strip across the top of a chapter. A picture of another shape is cropped to fill it, from the middle.

**About 6 : 1**, printed 7.14 × 1.14 in. Smallest file: 2142 × 342 px. A shorter strip, so the whole reference fits on one page. Cropped to fill, from the middle.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `ch-01` | Chapter 1, The Wild Wakes | 2142 × 540 | Wrenfield the night the lights went out: dark windows, storm clouds clearing, an owl across the moon and a swirl of light over the rooftops. |
| `ch-02` | Chapter 2, Making Your Bonded | 2142 × 540 | The six frames side by side at their true sizes: an alligator, a bison, a jaguar, a coyote, a barn owl on a post and a rat on a stone. |
| `ch-03` | Chapter 3, Rolling the Dice | 2142 × 540 | Six dice on a table, the two 6s and the 5 ringed as hits, with green Wild tokens and a pencil lying beside them. |
| `ch-04` | Chapter 4, Shifting | 2142 × 540 | A swirl of light and leaves in a garden at night, with a barn owl flying up out of it. Nothing of the change itself is shown. |
| `ch-05` | Chapter 5, Missions and the Hunt’s Scent | 2142 × 540 | A pale path through the dark leading to a gate in a wall, glowing paw prints along it, and a grey Hound on the far hill, sniffing. |
| `ch-06` | Chapter 6, Clashes | 2142 × 540 | A bison squares up to two grey Hounds on a dark lawn. |
| `ch-07` | Chapter 7, Hurt, Taken and Worse | 2142 × 540 | An empty gilded cage with its door open on a stone floor, moonlight from a window, and a single owl feather lying beside it. |
| `ch-08` | Chapter 8, Campaigns | 2142 × 540 | The road from Wrenfield up Thornhill to the Lodge, with lanterns marking the way: a campaign's missions on the road to the Last Hunt. |
| `ch-09` | Chapter 9, Running the Game | 2142 × 540 | The Storyteller's table: a desk lamp, a character sheet lying flat, two dice and a bowl of green tokens. |
| `ch-10` | Chapter 10, The Gilded Hunt | 2142 × 540 | The Gilded Hunt's crest, gold antlers over a horn on a crimson banner, between two grey Hounds. |
| `ch-11` | Chapter 11, Wrenfield | 2142 × 540 | Wrenfield at dusk: the Old Mill and its waterwheel by the river, the High Street, the museum's dome, the zoo's trees, and the Lodge on Thornhill. |
| `ch-12` | Chapter 12, Making Missions | 2142 × 540 | A hand-drawn mission map lying on a table, with a dotted route, three crosses, a pencil on the map and two dice beside it. |
| `ch-13` | Chapter 13, Pemberton’s Pets | 2142 × 540 | Pemberton's Pets at night: cages in the window with eyes glinting inside, the coal hatch in the alley, a skylight on the flat roof and a streetlamp. |
| `ch-14` | Chapter 14, The Zoo After Dark | 2142 × 540 | The zoo's loading dock at night: crates stencilled THORNHILL, a pair of eyes glinting in one, a truck with its lights off and the moat in front. |
| `ch-15` | Chapter 15, The Old Mill | 2142 × 540 | The Old Mill at night: a glint of brass from the tower window, ivy on the wall, the waterwheel turning in the river. |
| `ch-16` | Chapter 16, The Trophy Gala | 2142 × 540 | The Ashcombe Museum lit up for the gala: tall columns, every window glowing, a crimson GALA banner and wide stone steps. |
| `ch-17` | Chapter 17, The Lodge on the Hill | 2142 × 540 | The Lodge on Thornhill: a great dark house with one lit window high under the roof, Hounds on the lawn and the old wall with its gate. |
| `ch-18` | Chapter 18, Ready-Made Bonded | 2142 × 540 | The six Bonded in animal form on a hilltop at night, all drawn to one true scale, with a barn owl flying overhead. |
| `ch-19` | Chapter 19, At the Table | 2142 × 342 | The pieces of the game: a die, a Wild token, an Edge, a paw print for Scent, a gilded cage and the Hunt's horn. |

## Maps

**4 : 3**, printed 3.42 × 2.57 in. Smallest file: 1026 px wide. One column wide. Keep every marker (A, B, the numbers, ★ and E) where the table and the text put it, and keep labels at least 7.5pt at this size.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `map-gala` | Chapter 16, The Trophy Gala | 1026 px wide | Plan of the Ashcombe Museum: the front doors at the top of the steps (A), the loading bay into the kitchens (B), the ballroom (1), the dark exhibit halls (2), the Trophy case under its spotlight in the Hall of Hunters, beside the dinosaur (the objective), and the way out back through the upper galleries (E1) and down the museum steps (E2). |
| `map-lodge` | Chapter 17, The Lodge on the Hill | 1026 px wide | Plan of the Lodge grounds: the deer park (A) and the ice-house tunnel from Wrenwood (B), the kennels (1), the servants' door (2), the trophy hall (3), the cellar cage below it (the objective), and the way out across the lawn (E1) and over the wall (E2). |
| `map-mill` | Chapter 15, The Old Mill | 1026 px wide | Cutaway of the Old Mill: the millrace under the wheel and the mill (A), the ivy wall up to a broken window in the grain store (B), the grain store (1), the gear loft (2), the Callhorn at the top of the tower (the objective), and the way out through the tower window and down the waterwheel into the river (E). |
| `map-petshop` | Chapter 13, Pemberton’s Pets | 1026 px wide | Floor plan of Pemberton's Pets: the coal chute from the alley (A), the skylight over the stockroom (B), the shop floor (1), the office door (2), the cage room (the objective), and the way out through the back yard and its gate (E). |
| `map-wrenfield` | Chapter 11, Wrenfield | 1026 px wide | A map of Wrenfield: the High Street with Pemberton's Pets at its end (1), the Library and the School; the zoo by the River Wren (2); the Old Mill on the river (3); the Ashcombe Museum (4); and the Lodge (5) on Thornhill, beyond Wrenwood. |
| `map-zoo` | Chapter 14, The Zoo After Dark | 1026 px wide | Map of Wrenfield Zoo: the perimeter fence (A), the river culvert (B), the aviary walkway (1), the staff gate (2), the Hound patrol on the lawns (3), the loading dock (the objective), and the way out across the moat round the big cats to the river path (E). |

## Portraits

**Square, shown as a circle**, printed 1.2 × 1.2 in. Smallest file: 360 × 360 px. Cropped to the circle that fits inside the square, so keep the face and the Mark well inside it.

**Square, shown as a circle**, printed 1.75 × 1.75 in. Smallest file: 525 × 525 px. Cropped to the circle that fits inside the square.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `frame-birds` | Chapter 2, Making Your Bonded | 360 × 360 | A barn owl perched on a fence post, pale rings around its eyes |
| `frame-canines` | Chapter 2, Making Your Bonded | 360 × 360 | A coyote standing on open ground, a notch in its left ear |
| `frame-cats` | Chapter 2, Making Your Bonded | 360 × 360 | A jaguar walking through the dark, a fleck of gold in its left eye |
| `frame-critters` | Chapter 2, Making Your Bonded | 360 × 360 | A brown rat on a cellar floor, a white patch between its ears |
| `frame-heavies` | Chapter 2, Making Your Bonded | 360 × 360 | A bison on a moonlit field, a pale scar over its right eye |
| `frame-reptiles` | Chapter 2, Making Your Bonded | 360 × 360 | An alligator at the edge of dark water, pale spots on its snout |
| `pc-jonah` | Chapter 18, Ready-Made Bonded | 360 × 360 | Jonah Mensah, with a scar through his right eyebrow |
| `pc-lucia` | Chapter 18, Ready-Made Bonded | 360 × 360 | Lucía Ortega, with freckles across her nose |
| `pc-maya` | Chapter 18, Ready-Made Bonded | 360 × 360 | Maya Reyes, with a fleck of gold in her left eye |
| `pc-priya` | Chapter 18, Ready-Made Bonded | 360 × 360 | Priya Shah, in round glasses |
| `pc-sam` | Chapter 18, Ready-Made Bonded | 360 × 360 | Sam Lindqvist, with a white streak in his fringe |
| `pc-theo` | Chapter 18, Ready-Made Bonded | 360 × 360 | Theo Park, with a notch in his left ear |
| `threat-beater` | Chapter 10, The Gilded Hunt | 525 × 525 | A Beater: a hired watchman in a flat cap and heavy coat |
| `threat-hound` | Chapter 10, The Gilded Hunt | 525 × 525 | One of the Hunt's grey Hounds, wearing a gilt collar |
| `threat-huntsman` | Chapter 10, The Gilded Hunt | 525 × 525 | A Huntsman in tweed, with a gold Trophy brooch on his lapel |
| `threat-trapper` | Chapter 10, The Gilded Hunt | 525 × 525 | A Trapper in a bucket hat and waxed jacket, a net over one shoulder |

## Spot illustrations

**4 : 3**, printed 7.07 × 5.3 in. Smallest file: 1590 px tall. Fills the space left at a chapter's end, printed anywhere from 1.3in to 5.3in tall, so it has to read when small. No words in it.

| Name | Where it goes | Smallest file | What the stand-in shows |
|---|---|---|---|
| `spot-alligator` | The end of Chapter 14, The Zoo After Dark, when there's room | 1590 px tall | An alligator lying on a muddy riverbank among the reeds and bulrushes at night, the moon over the water. |
| `spot-bison` | The end of Chapter 17, The Lodge on the Hill, when there's room | 1590 px tall | A bison standing behind a wooden fence on a moonlit meadow, with fireflies over the grass. |
| `spot-books` | The end of Chapter 9, Running the Game, when there's room | 1590 px tall | A stack of library books on a table with an owl feather on top, a lit lantern and a mug, and a shelf of books behind. |
| `spot-busstop` | The end of Chapter 11, Wrenfield, when there's room | 1590 px tall | The bus stop on the High Street at night, shop windows lit behind it, and a coyote trotting past under the street lamp. |
| `spot-gears` | The end of Chapter 15, The Old Mill, when there's room | 1590 px tall | Two great wooden gears meshing in the mill loft, a lantern hanging from the beam above, a ladder leaning on it and a brown rat running along the beam. |
| `spot-keys` | The end of Chapter 16, The Trophy Gala, when there's room | 1590 px tall | A ring of old keys hanging from a nail on a heavy wooden door with iron bands and a lock. |
| `spot-net` | The end of Chapter 6, Clashes, when there's room | 1590 px tall | An empty net lying on the cobbles under a street lamp, and a brown rat running for the drain. |
| `spot-notebook` | The end of Chapter 12, Making Missions, when there's room | 1590 px tall | An open notebook on a wooden table: notes on one page, and on the other a sketched plan of rooms with a dashed route, circled steps and a star. |
| `spot-poster` | The end of Chapter 13, Pemberton’s Pets, when there's room | 1590 px tall | Two hand-drawn posters for missing pets taped to a lamp post, and a coyote sniffing at the foot of the post. |
| `spot-scent` | The end of Chapter 5, Missions and the Hunt’s Scent, when there's room | 1590 px tall | A grey Hound standing on the towpath by the river at night, with a trail of faintly glowing pawprints ahead of it. |
| `spot-sheet` | The end of Chapter 2, Making Your Bonded, when there's room | 1590 px tall | A character sheet lying on a wooden table, a pawprint drawn in its portrait circle, with a pencil, a die and an owl feather beside it. |
| `spot-table` | A spare: the end of any chapter with room | 1590 px tall | Game night: two character sheets, dice and green Wild tokens on the table, cups, a bowl of popcorn, and a window onto the moon. |
| `spot-tracks` | The end of Chapter 4, Shifting, when there's room | 1590 px tall | Trainer prints in the mud of a path that turn, after a swirl of leaves and light, into a big cat's pawprints. |
| `spot-treehouse` | The end of Chapter 8, Campaigns, when there's room | 1590 px tall | A treehouse built on the branches of an old oak at night, a light in its window and a rope ladder down to the grass, with a lantern at the foot of the tree. |
| `spot-trophy` | The end of Chapter 10, The Gilded Hunt, when there's room | 1590 px tall | The Hunt's gilded horn and a gold eye-shaped brooch on a crimson velvet cushion under a glass dome, lit from above. |
| `spot-window` | The end of Chapter 7, Hurt, Taken and Worse, when there's room | 1590 px tall | A lit bedroom window at night, its curtains half open, and a barn owl standing on the sill outside, looking in. |

63 pictures in all.
