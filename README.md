# Morph Game (codename)

A tabletop roleplaying game by **Richard Moore**. Ordinary people discover they can turn into animals, and use that power to save the world. Each character is built from an animal-type frame, a human perk and an animal perk. The title is a codename; the game will get its own name.

**Status:** first full draft, for Richard to revise. Working title *Second Nature*. The rulebook with stand-in art is `book/dist/Second_Nature_v0.1.pdf`; decisions are in `docs/DESIGN.md`, the core rules (v0.1c) in `docs/CORE-RULES.md`, balance results in `sim/REPORT.md`, and the Foundry VTT system's guide in `docs/FOUNDRY.md`.

**How we work:** `WORKFLOW.md` holds the project's working rules. Read it before any work.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | `DESIGN.md` (pitch, name check, early flags, decisions, open questions), `DESIGN-RULES.md` (lessons from three earlier games), `REVIEW-PROCEDURE.md`, and reference studies from *Heisty Spideys* |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand). Its pictures are in `book/art/`: `ART-LIST.md` lists every one, with the size to draw it, and a PNG, JPG or WebP with the same name replaces the stand-in |
| `sim/` | The rules simulator for balance testing; it uses the same rules code as the Foundry system (`module/logic/`) |
| `module/`, `templates/`, `styles/`, `lang/`, `assets/`, `packs/` | The Foundry VTT game system: install, quick start and what it automates in `docs/FOUNDRY.md`, manual checks in `TESTING.md` |
| `tools/`, `test/` | Build, validation and test tooling |

## Commands
```
npm install
npm run build:book          # rulebook PDF → book/dist/
node book/build.mjs --print # print-on-demand interior + covers
npm run check               # validate the Foundry system + run tests
npm run build:art           # Foundry's pictures from book/art/ → assets/art/
npm run build:sources       # compendium sources from the rulebook → packs/_source/
npm run build:packs         # compile the compendium packs → packs/
```

© 2026 Richard Moore. All rights reserved.
