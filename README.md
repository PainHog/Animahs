# Morph Game (codename)

A tabletop roleplaying game by **Richard Moore**. Ordinary people discover they can turn into animals, and use that power to save the world. Each character is built from an animal-type frame, a human perk and an animal perk. The title is a codename; the game will get its own name.

**Status:** early design. The premise is set; the rules aren't written yet. See `docs/DESIGN.md`.

**How we work:** `WORKFLOW.md` holds the project's working rules. Read it before any work.

## What's in here
| Folder | What it is |
|---|---|
| `docs/` | `DESIGN.md` (pitch, name check, early flags, decisions, open questions), `DESIGN-RULES.md` (lessons from three earlier games), `REVIEW-PROCEDURE.md`, and reference studies from *Heisty Spideys* |
| `book/` | The rulebook: HTML chapters built into a typeset PDF (digital and print-on-demand), and `book/art/ART-CHECKLIST.md` |
| `sim/` | The rules simulator for balance testing, built once the core rules exist |
| `module/`, `templates/`, `styles/`, `lang/`, `packs/` | The Foundry VTT game system (a skeleton for now) |
| `tools/`, `test/` | Build, validation and test tooling |

## Commands
```
npm install
npm run build:book          # rulebook PDF → book/dist/
node book/build.mjs --print # print-on-demand interior + covers
npm run check               # validate the Foundry system + run tests
```

© 2026 Richard Moore. All rights reserved.
