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

## How decisions are made: draft first, then Richard revises
- **Design decisions are drafted in full and logged, then Richard revises them.** That covers rules, numbers, character frames, animals, human and animal perks, the enemy, setting text and the names of mechanics.
- **Every decision goes in the `docs/DESIGN.md` Decisions log** with the date, the options that were weighed, the reason, and a status: **draft** (in force for the simulator and the next draft, open to revision) or **approved** (Richard has signed it off).
- **Richard's revisions win.** When he changes a draft decision, log the change as a new row (never edit history away), re-run the simulator, and update everything that depends on it in the same piece of work.
- **When a decision (draft or revision) would repeat a mistake from `docs/DESIGN-RULES.md` Part A,** say so straight away, name the rule, and offer options.
- **Wording clarifications and fixes** for things the book already implies may be made directly.
- **When Richard gives feedback on art or layout,** fix it and audit the whole book for the same kind of mistake.

## Order of work (DESIGN-RULES Part C)
1. **Design pass** through every Part B question (drafted, logged, then revised with Richard).
2. **One-page core rules** in `docs/CORE-RULES.md`.
3. **Simulator** in `sim/`, showing win and loss rates by difficulty and party size, frame, animal and perk balance, and how often morphing is used, and how often each animal and frame gets picked and pays off.
4. **Richard reviews, revises and approves the core.**
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

## Portal
- This game has a card in Richard's project portal. The portal reads `PORTAL.md` at the repo root on every push to the default branch (`main`) and shows it on the card to everyone he has invited. Work that should show there must land on `main`.
- **Keep `PORTAL.md` current as part of every piece of work,** in the same commit as the work:
  - "Now:" is what you're working on and "Next:" the next step, one line each.
  - The checklist holds real milestones ("- [ ]" / "- [x]") under Design, Building the game and Online version. Tick an item when it's finished and add new ones as the plan grows. An item that needs Richard's say (the title, approving the core) is ticked only once he has approved it in the Decisions log; a draft doesn't tick it. Never delete a ticked item.
  - "Number: Label = value" lines (2 to 6) are counted from the project, never guessed: "Design decisions so far" is the entries in the `docs/DESIGN.md` Decisions log (draft or approved), "Approved by Richard" is those with the status approved, and "Core questions still open" is the numbered questions in its §5 that no Decisions log entry names yet (entries name them as Q1, Q2 and so on). Later, other counts may suit better (for example chapters in the rulebook, ready-made characters, or simulated games per balance check); swap a line when it stops being useful.
- **Every line in it is plain words for family and friends,** with nothing you wouldn't show every invitee: never repo names, usernames, file paths, links, code, commit IDs, the word "GitHub", anything about the tools used to make the game, the *Animorphs* name or its distinctive elements (`docs/DESIGN.md` §2.1), or anyone's personal details. The portal hides any line that names the repo or a username, contains "GitHub" or looks like a commit ID; don't rely on it.
- **Portal-Update lines:** in a commit that changes something people would notice, add one line below the first line, at the very start of the line: "Portal-Update: <one plain sentence>". It is posted to the game's changelog for everyone invited, so the same plain-words rule applies. No other line may look like that marker: "Portal update" or "Portal updates" in any case, with or without a space, dash or underscore, followed by a colon (a full-width colon too), even indented or after a bullet, number, quote or bold. The portal takes it for a mistyped marker and holds the push for Richard's review.
- **Screenshot:** at most one "Screenshot: path = caption" line, added once there is a rulebook cover: the cover saved under `docs/portal/` as a PNG, JPEG or WebP under 1 MB, with nothing private visible. When it changes a lot, replace the file and push; Richard approves each new picture in the portal.
- **Downloads:** none yet. When Richard asks for the rulebook or the online version to be downloadable from the portal, add at most 6 "Download: path = caption" lines. Each file is committed (not Git LFS), a real PDF or ZIP, at most 25 MiB, and holds no repo names, GitHub links, usernames, commit IDs or mentions of the tools used to make the game inside, in its text or its properties: the portal screens only names and captions, and Richard checks each file before sharing it. The online version needs its own cleaned portal copy, because `system.json` links to the code's hosting; ask Richard before setting that up. Captions are plain words, at most 120 characters.

## Housekeeping
- Commit and push work in progress often. Resume stopped work rather than restarting it.
- **Credits:** "Game design & writing: Richard Moore".
- **This is based on the *Animorphs* books, and it needs a new name and original specifics.** "Morph Game" is only a codename. Never use the *Animorphs* name or its distinctive elements (see `docs/DESIGN.md` §2) in the book, art, code or store pages.
