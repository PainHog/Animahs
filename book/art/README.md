# Book art

Every picture in the book has a name, and the chapters place it with
`<figure class="art" data-art="NAME">`. The build looks in this folder for that name:

- **`NAME.png`, `NAME.jpg` or `NAME.webp`** (your own artwork) is used first, if it's here;
- otherwise **`NAME.svg`**, the stand-in drawing made by the scripts in `book/tools/art-gen/`.

So replacing a stand-in is just saving a picture with the same name. The Foundry system uses
the same pictures: `npm run build:art` remakes its maps, portraits and cover from this folder.
**`ART-LIST.md`** lists every name, where it goes, its shape and the smallest file that
prints sharply. Every piece, stand-in or final, should pass `ART-CHECKLIST.md`.

## The stand-in drawings

House style (DESIGN D29): flat shapes with an inked outline, like a storybook. Deep blue
nights, warm cream paper, moss green for the Wild, gold and crimson for the Gilded Hunt.
Animals are true to life in shape, markings and size, and every scene keeps one scale.
The change is only ever a swirl of light and leaves that hides the body.

To remake them after changing a script:

    node book/tools/art-gen/scenes/build.mjs            # every piece
    node book/tools/art-gen/scenes/build.mjs map-zoo    # just one
    node book/tools/preview-art.mjs <outDir> map-zoo    # render PNGs to look at

| Script (`book/tools/art-gen/scenes/`) | What it draws |
|---|---|
| `kit.mjs` | Shared shapes: smooth outlines, skies, moons, hills, trees, the Wild's swirl, medallions |
| `animals.mjs` | The animals at real size (1 unit = 1 cm, ground at y = 0, facing right) |
| `people.mjs` | Head-and-shoulders portraits of the six ready-made Bonded and the Hunt's people |
| `sn.mjs` | Portraits: the six frames, the threats and the ready-made Bonded |
| `sn-scenes.mjs` | The cover, the back panel, the part pages and the chapter strips |
| `sn-maps.mjs` | The town map and the five mission maps |
| `sn-spots.mjs` | The spot illustrations that fill the end of chapters |
| `placeholders.mjs` | Plain marked placeholders for any picture that has no drawing yet |

Every SVG has a `viewBox` and no fixed width or height (the page's CSS sizes it), and no
`<image>`, `<script>`, filters or outside links. Map labels are at least 26 units, which
prints at about 8pt.

## Palette

The same values as `C` in `book/tools/art-gen/lib.mjs` and the tokens at the top of
`book/src/book.css`; change them together.

| Token | Hex | Use |
|---|---|---|
| deep / night | `#1f2a3a` | night skies, dark pages |
| dark / night2 | `#2f3f52` | dark fills, headings |
| dusk / soft | `#4a5d73` | evening, water at night |
| paper | `#f6f0e1` | the page |
| paper2 | `#ece2c9` | light fills |
| edge | `#d6c8a6` | soft lines on light |
| light | `#fbf7ee` | lightest fill |
| ink | `#1d1b19` | outlines, text |
| accent / leaf | `#5f7d4e` / `#6f8f4f` | moss green: the Wild |
| accentDeep / leafDeep | `#3e5a34` | dark green, labels |
| wild | `#d9e8b0` | the Wild's light |
| gold | `#c9a227` | the Gilded Hunt |
| crimson / alarm | `#8c2f24` | the Hunt's red, danger |
| moon / lamp | `#f3e7c4` / `#f2d27a` | moonlight, lit windows |

## Spot illustrations

The build measures the space each chapter leaves on its last page and places a spot
illustration there, sized to fit (from 1.3in to 5.3in tall) and never enough to move a
page. Which chapter prefers which spot is set in `book/src/spots.json`; the `spare` list
holds pieces any chapter may take. A chapter with less than about 1.5in to spare gets none.
