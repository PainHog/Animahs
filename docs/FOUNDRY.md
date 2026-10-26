# Second Nature for Foundry VTT

The Foundry VTT game system for *Second Nature* (system id `morphgame`). It follows `docs/CORE-RULES.md` (v0.1b) and the rulebook chapters, and it is **automation-first**: players and the Storyteller shouldn't have to track a rule by hand. Where the rules need a human judgement, the Storyteller gets one click with the rules-correct default. Every automation can be switched off.

- **Foundry:** v13 or later (verified on v14).
- **Recommended:** Dice So Nice (every roll and Push is a real Foundry `Roll`).

## Install

In Foundry's setup screen: **Game Systems → Install System**, paste the manifest URL and press Install:

```
https://github.com/PainHog/Animahs/releases/latest/download/system.json
```

A release is published by the `Release` workflow (`.github/workflows/release.yml`), run by the author with a version number. Until the first release exists, copy the repository into `Data/systems/morphgame/` (only `system.json`, `module/`, `templates/`, `styles/`, `lang/`, `assets/` and `packs/` are needed).

## Quick start for the Storyteller

1. Create a world with the *Second Nature* system.
2. Import characters: open the **Ready-Made Bonded** compendium (the six of Chapter 18) and import one per player, or create a new **Bonded** actor and use **Character builder** on its sheet (pick, or roll it all by the book; an animal another Bonded already has is rerolled). Give each player ownership of their character.
3. Read the mission in the **Missions** compendium (each one has its obstacle table, Limits and the chapter text).
4. Open the **Mission Tracker** from the paw button in the token controls. Choose the mission, tick the Bonded who are playing and press **Start the mission**. Everyone gets their Wild back and loses their Hurt; Team Captain's Edge and an Exposed character's Scent 1 are applied.
5. **Scouting:** a player rolls (from their sheet or the tracker's **Roll to scout**). The dialog already says Sense against Difficulty 2. The result sets Edges, Scent and who picks; press **Go in by way A** or **B**.
6. **Obstacles:** players roll from their sheets or from the tracker's approach buttons. The roll dialog binds to the current obstacle (tags, approaches, Difficulty, guards, On the Trail). The tracker shows progress or who is past, the round, and **End round** (a group obstacle that runs past round 3 costs Scent). Press **Next obstacle** when the team moves on.
7. **Clashes** start by themselves on a guarded Fail: at once at a point obstacle, and at **End Round** at a group obstacle, once everyone has rolled (or with **Start the Clash**). Players roll Strike, Distract or Slip Away against a threat. **End the Clash round** asks who each unattended threat goes for (a random friend preselected). The Clash ends when every threat is out, nobody is left, or after round 4.
8. **The Hunt is Up:** the tracker announces it and offers **Press on** or **Withdraw**, with the book's advice highlighted. Every Fail now means Taken.
9. **The Escape:** **Start the Escape** after the objective. When the last Escape obstacle is behind the team the tracker shows the result; **Finish the mission** moves the Hunt track and gives everyone 1 Growth. **Close the mission** gets the tracker ready for the next one (the campaign carries on).

A custom mission: choose **A custom mission** on the tracker. It opens as data (start from the blank mission or your last one), is checked against Chapter 12's checklist, and is remembered for next time. A macro can also run one: `game.morphgame.startMission({ mission: {...}, actorIds: [...] })`.

## For players

- **Your sheet** shows both rating rows (the current form highlighted), Strengths and Weaknesses, your perks, Wild pips and Hurt boxes (click to spend or restore), statuses, **Shift** (into the animal: 1 Wild, or 1 Hurt with no Wild unless that would put you Down; back: free; not while Stuck), **Patch Up**, **Free from the net**, **Hand the prize to** (when you carry it), Growth picks, and a warning when the character breaks §11.
- **Roll buttons** open the roll dialog: what the roll is for, the approach (with Gnaw and Clever Beak where they apply), Difficulty, place tags, every automatic modifier with its source, Help from friends who can (each pays 1 Wild; Coyote's Pack is free once a scene; nobody in animal form can help Wits, not even the Raven), Edges, the Cap, the final dice and the odds.
- **Roll cards** show the dice with hits highlighted. A Fail or Partial stays open while you could still **Push** (1 Wild, rerolls every miss), **Burst** (Cheetah, a free Push on Move) or use **Wily** (Red Fox: the Fail becomes a Partial); press **Accept**, or the next roll anyone makes settles it. A Success can be Pushed for a Critical or counted as one with **Charge** (Hippopotamus). **Antler Sweep** (Moose) puts a Beater or Hound out at once.

## What's automated

| Rule | What the system does | Setting |
|---|---|---|
| §1 the roll, the Cap | Dialog plan: rating, Strengths, Weaknesses, animal and human perks, Wild Sense, Tracker, Trophy, Distract, Coil, Ambush; +2 dice / −1 Difficulty cap; boosts over the Cap aren't spent | always |
| §3 shifting | Cost paid (Wild, or Hurt); Stuck refuses shifting back; the prize drops; in a Clash: Exposed and the Clash rises by 2; on a watched mission: Scent +1 and Exposed | Wild: `autoWild` |
| §4 Push, Help, Edges, Patch Up | Wild spent from the right actor (a friend's through the GM); team Edges spent through the GM; Edges from Criticals and scouting; Team Captain at the start | `autoWild` |
| §6 point obstacles | 1 progress per Success/Partial; a Critical's extra progress, or an Edge when it isn't needed; Scent +1 for Partials (not in the Escape) and Fails | `autoProgress`, `autoScent` |
| §6 group obstacles | Who's past; one Scent rise when it ends (+1 for any Partial or Fail; in the Escape only Fails); +1 at the end of each round from the third while anyone isn't past | `autoProgress`, `autoScent` |
| §6 dangerous / guarded | 1 Hurt on a Fail; a Clash with the guards on a Fail (threats as tokens when a scene is viewed, otherwise tracker entries) | `autoHurt`, `autoClash` |
| §7 Clashes | Strike harm (Critical 2), Distract, Slip Away, Harm on Partials and Fails, the Trapper's Net, unattended threats at End Round, out at Toughness, the end at round 4, the end rise (+1, or +2), Exposed shifters | `autoProgress`, `autoHurt`, `threatTargets` |
| Animal perks | Ambush, Coil, Good Dog, Keen Eyes, Lurker, Night Rosettes, Silent Wings, Tiny, Leaper, Taste the Air, Gnaw, Clever Beak in the plan; Shaggy Coat on Hurt; Pack on Help; Burst, Wily, Charge, Antler Sweep as card buttons; once-per-scene uses stamped against the mission clock | always |
| §8 Scent, the Hunt | The ledger (one event, one rise; never down; past the Limit lost); On the Trail as an Escape obstacle begins; the Hunt is Up; Taken on any Fail after that; the press-on choice | `autoScent`, `autoTaken` |
| §9 Hurt and worse | Down at 3 Hurt (Stuck as an animal); at scene end Down friends get up with 2 Hurt and Netted friends are freed, or are Taken; Taken means Exposed and loses the prize; everyone down at once is a Loss | `autoHurt`, `autoTaken` |
| §10 the mission | Scouting, the way in, the sequence, the objective and the prize, Withdraw, the Escape, Win / Costly Win / Loss | always |
| §12 campaign | Hunt track +1 / +2, Growth +1, Exposed → next mission at Scent 1, Wild maximum (Gamer, Growth, at most 6), Growth picks | `autoGrowth` |

With an automation switched off, its outcome is kept as a suggestion: the roll card gets **Apply the outcome** for the Storyteller and the tracker lists it with **Apply** and **Dismiss**.

## Settings

| Setting | Default | Meaning |
|---|---|---|
| Apply roll outcomes: progress (`autoProgress`) | on | Progress, who's past, Edges from Criticals, harm to threats, Distract, Slip Away |
| Apply Scent automatically (`autoScent`) | on | Every rise the rules call for |
| Apply Hurt and Netted (`autoHurt`) | on | Dangerous obstacles, threats' Harm, the Trapper's Net |
| Start Clashes on a guarded Fail (`autoClash`) | on | |
| Apply Taken and scene ends (`autoTaken`) | on | Fails once the Hunt is Up; Down and Netted at scene end; everyone down |
| Spend Wild automatically (`autoWild`) | on | Shift, Push, Help, Patch Up |
| Mark Growth after a mission (`autoGrowth`) | on | |
| Unattended threats choose (`threatTargets`) | ask | Ask the Storyteller (random friend preselected), or pick at random |
| Players see the Mission Tracker (`trackerForPlayers`) | on | Read-only, with Roll buttons |
| Rules reminders in chat (`rulesReminders`) | on | Short reminders on cards |
| Open the tracker when a mission is running (client) | on | |

## How it works (for developers)

- **Rules code lives once.** `module/config.mjs` holds every number; `module/logic/` holds the pure, Foundry-free rules (dice and odds, the roll plan, Scent, the mission catalog, characters, usage stamps, Clashes and the mission reducer). The simulator (`sim/`) imports the same files, so the balance numbers and the table can't disagree.
- **The GM's client reacts to documents.** A roll or shift posts a chat card with structured flags (`flags.morphgame.card`); the active GM's client applies final cards to the mission state (one world setting, written only by the active GM through a serialized queue) and to the actors. Players write only their own actors and messages; anything else is a GM operation (`CONFIG.queries["morphgame.op"]` via `User#query`).
- **Once per scene** uses are stamped with the mission clock (`<missionId>:<sceneSerial>`), so scene changes need no resets.
- **Packs** are built from the book: `npm run build:sources` (writes `packs/_source/`), then `npm run build:packs`. `npm run check` fails if the sources fall behind the book.
- **Tests:** `npm run check` runs the validator and `node --test`: the pure rules, the mission reducer and the system booted on `tools/fake-foundry.mjs` with a GM and two players (sheets, the roll flow, Clashes, a whole mission, GM operations, packs).
- **API:** `game.morphgame` (`openTracker`, `startMission`, `rollDialog`, `performRoll`, `shift`, `patchUp`, `freeNetted`, `getState`, `automation`, `logic`, `mission`).

## Rulings the system makes

Where the rules leave a choice, the system takes these readings (the Storyteller can override any of them with the tracker's manual controls):

1. A group obstacle's long-round cost starts at the end of round 3 if anyone still isn't past (the simulator's reading of "after the third round").
2. A Fail at a guarded group obstacle doesn't start the Clash at once: the round's other rolls come first, and **End Round** starts it, with the whole team in it. The obstacle's Scent rise for the rolls so far comes first, then the Clash's when it ends; rolls after the Clash count towards the obstacle's own rise as it ends (Chapter 6, as the simulator plays it).
3. After a Clash at an obstacle, its guards are gone (beaten, pulled back, or slipped past), as in the simulator.
4. A Fail or Partial that could still be changed is applied when it becomes final: Accept, a reaction, the next roll anyone makes, End Round, the next obstacle, or the Storyteller. A Success is applied at once; a later Push to a Critical, Charge or Antler Sweep adds only the difference.
5. Burst is the roll's one Push. Wily ends the roll (no Push after it); a Push and then Wily is allowed.
6. Shaggy Coat applies by itself to the first Hurt each scene in animal form; Charge and Antler Sweep are the player's choice (card buttons).
7. The roller ticks the friends who Help; each pays 1 Wild through the GM (or Pack). Nobody in animal form can Help a Wits roll; the Raven's Clever Beak lets it roll Wits against Locked things, but not Help (Chapter 4).
8. Help or Edges over the Cap aren't spent.
9. Two Team Captains start the team with 2 Edges (one each, at most 2).
10. Patching Up a Down friend lowers their Hurt, but they stay Down until the scene ends.
11. Starting a mission resets every Bonded in it: Wild to its maximum, no Hurt, human form, and no Down, Netted, Stuck, Taken or Exposed (taking a Taken friend means they've been rescued). Being Exposed last time starts the mission at Scent 1 once, and a poor scouting roll doesn't add to it: the mission starts at Scent 1 either way (Chapter 7).
12. A party smaller than 3 or larger than 5 uses the nearest Limit the mission gives.
13. Every character in the mission marks 1 Growth when it is finished, Taken ones included ("whatever the result").
14. Shifts between obstacles are in sight only when the Storyteller marks the mission **Watched** (no mission in the book is).
15. Once the Hunt is Up, a Fail on any roll by a Bonded in the mission means Taken, free rolls included ("wherever you are").
16. The character who finishes a prize objective carries it; shifting drops it; the carrier hands it over from their sheet; the Storyteller can set it on the tracker.
17. Gnaw applies to Force rolls at a place tagged Locked, not to Strikes in a Clash. Clever Beak needs the Locked tag.
18. A Distract helps the next Strike against that threat this round, by anyone; Coil is used up by the next roll of any kind against that threat.
19. Scouting is its own scene; a Clash is its own scene, and so is the rest of an obstacle after a Clash.
20. Everyone standing when a Clash starts is in it.

## Known limitations

- Built and tested against a stand-in for Foundry (`tools/fake-foundry.mjs`); the layout, the stylesheet, Dice So Nice, threat tokens on the canvas, importing threats from the compendium, the scene-control button and image editing need checking in a real v13/v14 world (`TESTING.md`).
- Actions per round aren't enforced: the tracker doesn't record who has acted, and the free Shift or Patch Up on the way between obstacles isn't counted.
- No Combat tracker integration; Clash rounds are counted on the tracker.
- Threat tokens are placed only when the Storyteller is viewing a scene; out threats are hidden, not deleted.
- Chat card text is written in the roller's language; whispered and blind rolls show their buttons only to those who can see them.
- Custom missions are edited as data, not with a form.
- The campaign rules (Growth, the Hunt track, the Last Hunt) haven't been simulated yet; the Last Hunt's lower Limit is applied only when a macro starts it with `lastHunt: true`.
