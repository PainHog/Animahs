# Morph Game (codename): how we work

Author and designer: **Richard Moore**. Earlier games were reviewed with simulators and scripted playtests: *Heisty Spideys* (finished, with a fully automated Foundry VTT system), *Don't Get Forked* and *Nine Lives Gang*. The same mistakes kept turning up, and the lessons are written down in this repository.

**Read these before any work:**
1. `docs/DESIGN.md`: the pitch, name check, early flags, decisions and open questions.
2. `docs/DESIGN-RULES.md`: Part A hard rules, Part B questions the core rules must answer, Part C process, Part D release gates. **They are this project's rules.**
3. `book/art/ART-CHECKLIST.md`: before any art.
4. `docs/REVIEW-PROCEDURE.md`: after every version.

## Keep Richard's other games separate
- *Heisty Spideys* (SpideyHeist), *Don't Get Forked* (DontGetForked), *Nine Lives Gang* and the *Elemental Fighters* project are separate products. If one is ever attached to a session, it is **read-only reference**: never edit, commit to, push to, branch or release from it.
- Copy anything useful into this repository (with a note of where it came from) and adapt the copy. Never import from or link to their files.
- If another game seems to need a change, stop and tell Richard.

## The author decides the game
- **Never invent game content without Richard's approval.** That includes rules, numbers, character frames, animals, human and animal perks, the enemy, setting text and the names of mechanics.
- **For each decision,** give two or three concrete options, with a recommendation and why. Wait for his choice, then record it in the `docs/DESIGN.md` Decisions log with the date.
- **When one of his ideas would repeat a mistake from `docs/DESIGN-RULES.md` Part A,** say so straight away, name the rule, and offer options.
- **Wording clarifications and fixes** for things the book already implies may be made directly. Anything that changes numbers or adds rules goes to Richard first.
- **When he gives feedback on art or layout,** fix it and audit the whole book for the same kind of mistake.

## Order of work (DESIGN-RULES Part C)
1. **Design interview** through every Part B question.
2. **One-page core rules** in `docs/CORE-RULES.md`.
3. **Simulator** in `sim/`, showing win and loss rates by difficulty and party size, element and build balance, and how often each animal and frame gets picked and pays off.
4. **Richard approves the core.**
5. **Then** chapters, then art, then layout. No chapters or art before step 4.

After every version, run `docs/REVIEW-PROCEDURE.md`. A version isn't done until it passes the DESIGN-RULES Part D release gates.

## Source of truth
- **The rulebook source is the rules:** `book/src/chapters/*.html`, and `docs/CORE-RULES.md` until chapters exist.
- **Everything else follows the book in the same piece of work:** the simulator, the Foundry system, the quick reference and the sheets.
- **Each rule is stated fully in one place.** After every change, check the quick reference, sheets and trackers against the chapters.
- **Log every ruling** in `book/REVIEW.md`: what changed, where, why, and the source (author, playtest or simulator).

## Quality bars
- **Balance is simulated, not guessed.** Report numbers: win **and** loss rates, per difficulty and party size, plus option and build effects.
- **Playtests are run strictly by the book, with real dice.** Rolls come from a script and are logged, never invented. Each issue gets a severity, the quoted passage and a suggested fix.
- **Art** passes `book/art/ART-CHECKLIST.md`, including the object and character tables. Look at every render yourself.
- **Layout:** after every build, render a contact sheet and look at every page. Check reflow after every edit.
- **Foundry, if built, is automation-first.** Rules logic lives in Foundry-free modules (`module/logic/`), tested with `node --test`. GM-authoritative writes. Every automation can be switched off.

## Housekeeping
- Commit and push work in progress often. Resume stopped work rather than restarting it.
- **Credits:** "Game design & writing: Richard Moore".
- **This is based on the *Animorphs* books, and it needs a new name and original specifics.** "Morph Game" is only a codename. Never use the *Animorphs* name or its distinctive elements (see `docs/DESIGN.md` §2) in the book, art, code or store pages.
