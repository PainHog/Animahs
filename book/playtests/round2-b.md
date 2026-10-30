# Second Nature v0.1, Round 2, Test B: verification and the hard paths

A Storyteller and five players checked every fix from Round 1 Test B against the current book. Then they ran "The Old Mill" (Chapter 15) and "The Lodge on the Hill" (Chapter 17) as a short campaign, carrying Chapter 8's rules between them. The only rules source was the book: the HTML chapters in `book/src/chapters/`, read in filename order, and the built PDF `book/dist/Second_Nature_v0.1.pdf` for the maps, tables and sheets. The PDF was rebuilt with the fixes, and its text matches the HTML on every page used; the Mill and Lodge maps match their obstacle tables.

Every roll came from `book/playtests/roll.mjs` and is in `book/playtests/round2-b-dice.md`: rolls 1 to 86 (Mill 1 to 30, new characters 31 to 40, Lodge 41 to 86). No roll was invented, chosen or redone, and none used the wrong number of dice. One procedure slip: rolls 42 and 43 went out in a single command, against "Roll one at a time". Roll 42 was a Success at Difficulty 1, so there was no Push to decide, and nothing changed.

**How the table was steered.** As briefed, this table played to reach the paths Round 1 never reached:

- It skipped every Push until a Fail with the Hunt Up had Taken someone (roll 26). After that it Pushed only Fails that would mean Taken.
- It gave almost no Help and hoarded Wild.
- It picked the dangerous way in on both missions.
- It started three Clashes itself, and Priya shifted in the middle of one.
- Now and then it handed a roll to the riskier character.

It also pressed on both times the Hunt came Up. These were choices, not dice, and the play log marks each one.

## 1. Verdict

CLEAN, narrowly: no blocker, and every core-flow question was settled by the book's own words. But play reached every hard path it aimed for except a Loss, and four questions on those paths needed a ruling picked between two readings (new issues 1 to 4).

## 2. Verification table (Round 1 Test B issues)

Tally: **15 fixed, 3 partly fixed, 1 changed differently, 0 not changed.**

| # | Round 1 issue | Status | New passage (file: words) |
|---|---|---|---|
| 1 | Do several Hounds' Trackers stack? | Partly fixed | `22-ch10.html`, Hound: "Sneak rolls at an obstacle a Hound guards, and in a Clash with a Hound, are at +1 Difficulty: +1 in all, however many Hounds there are." The Hound is settled. The Huntsman still reads only "Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty". The round card (`47-sheet-round.html`) still says "Tracker: Sneak +1 Difficulty where it guards", with no Clash and no "+1 in all". See new issue 2. |
| 2 | A Fail that brings the Hunt Up at a guarded obstacle | Fixed | `15-ch05.html`: "Finish resolving the roll that did it as if the Hunt weren’t Up yet: if it finished the objective, it’s finished; if it was a Fail at a guarded obstacle, its Clash still starts." `42-ch19.html`: "the roll that did it resolves as normal, then any Fail means you’re Taken". Not reached in play: both times, a Clash's own end brought the Hunt Up. |
| 3 | If everyone Slips Away, do the guards stay? | Fixed | `16-ch06.html`: "or when nobody who can act is left in it (everyone has slipped away or is Down, Netted or Taken), and then the guards are still there", and "at a point obstacle, the next Fail there starts a new Clash with them." It matches `42-ch19.html` ("with nobody able to act left in (the guards stay)") and the round card. Reached at the Callhorn (rolls 23 and 24) and worked cleanly. |
| 4 | Choosing to start a Clash at a group obstacle | Fixed | `15-ch05.html`: "You can also choose to start the Clash yourselves, before anyone rolls; then it begins at once. When a Fail starts it at a group obstacle, finish the round’s rolls first..." Used twice by choice and once from a Fail (kennels, roll 50), with no confusion. |
| 5 | Does the Fail that starts a Clash net you? | Fixed | `22-ch10.html`, Trapper: "When you Fail against a Trapper in a Clash, you’re Netted instead of Hurt (Chapter 7). The Fail that starts a Clash doesn’t net you." `15-ch05.html`: "The Fail that starts a Clash isn’t a roll against a threat, so it can’t get you Netted." `32-ch14.html` is updated too. The Netted box in `17-ch07.html` is unchanged (new issue 12), but it doesn't contradict. |
| 6 | What is a scene? | Fixed | `15-ch05.html`: "Scouting is a scene too, and when a Clash breaks out at an obstacle, the rest of the obstacle after it is a new scene." Used for Shaggy Coat (rolls 5 and 23) and Pack (roll 56). |
| 7 | Can the team split up? | Fixed | `15-ch05.html`: "The team stays together. Everyone takes the same way in and faces the same obstacle at the same time; nobody can run ahead or take the other way." |
| 8 | At the Table says Slip Away makes you "past" | Fixed | `42-ch19.html`: "Slip Away (Move or Sneak; you’re out: past a group obstacle, waiting at a point one)". |
| 9 | Withdrawing during a Clash | Changed differently | `15-ch05.html`: "The team may Withdraw at any time outside a Clash ... (In a Clash, Slip Away or see it through first.) Withdrawing before the way in just means going home". Round 1 suggested allowing it at a round's end; the book bans it in a Clash instead. That settles the question. `17-ch07.html` still says "You can always Withdraw" (new issue 9). |
| 10 | Taking the prize, and passing it between obstacles | Fixed | `15-ch05.html`: "When the objective is done, one character there takes it, with no action ... Handing it to a friend at the same obstacle takes your action, with no roll; between obstacles it’s free." Neither mission has a prize, so it wasn't used. |
| 11 | Group rolls one at a time, and when to Push | Fixed | `15-ch05.html`: "Roll one at a time, in any order; each player decides on a Push before the next one rolls." |
| 12 | "At most two friends can usefully Help" | Fixed | `13-ch03.html`: "Help counts towards the Cap (at most +2 dice from everything together), so if the roll already has a bonus die, only one friend’s Help adds anything." |
| 13 | The free Shift between obstacles | Fixed | `14-ch04.html`: "(it still costs the Wild; shifting back counts as a Shift). The gap between scouting and the way in counts as between obstacles." `15-ch05.html`, Scouting: "it doesn’t use up the scout’s free Shift before the way in". Used after both scouting rolls. |
| 14 | Does a Critical on Distract or Slip Away give an Edge? | Fixed | `16-ch06.html`: "A Critical on Distract or Slip Away works like a Success; Edges come only from obstacles." Used at roll 53. The last clause says too much (new issue 8). |
| 15 | Kit and rescued friends in the Escape | Partly fixed | `35-ch17.html`: Kit "doesn’t roll or Help. He can’t be Taken unless everyone else is." Rescued team members still have only "rejoins the team when you’re out, but doesn’t roll during the Escape": nothing on Help, Wild or being Taken. Reached in play: four rescued friends were on the lawn when Theo was Taken (new issue 4). |
| 16 | At the Table has no prize rules | Partly fixed | `42-ch19.html`: "Prize: one carries it; a shift drops it; lost if its carrier is Taken." It still says nothing on what handing it over or picking it up costs. |
| 17 | Two Team Captains | Fixed | `13-ch03.html`: "Two Team Captains start the team with 2." |
| 18 | Do unspent Edges carry over? | Fixed | `13-ch03.html`: "Edges you haven’t spent are lost when the mission ends, like Wild." `15-ch05.html`: "unspent Wild and Edges are lost and Hurt clears". |
| 19 | "Nothing else raises it" | Fixed | `15-ch05.html`: "It rises for Partials and Fails at point obstacles, once when a group obstacle ends (and every round it runs from the third on), once at the end of each Clash, for a shift the Hunt can see, for a poor scouting roll, and by 1 at the start of a mission after someone was Exposed." The new wording opened new issues 5 and 10. |

**New gaps the fixes opened** (all listed in section 3):

- The Hound's new "in a Clash" wording makes the unchanged Huntsman look different (issue 2).
- The Scent box now words the round-3 rule differently from the Results box and the round card. The card adds "since the last rise", which the chapter doesn't have (issue 5).
- "Edges come only from obstacles" contradicts the scouting and Team Captain Edges (issue 8).
- Chapter 5's "outside a Clash" isn't carried into Chapter 7's "You can always Withdraw" (issue 9).
- Chapter 1's new mission length disagrees with Chapter 9 (issue 11).
- The Trapper's "in a Clash" isn't carried into Chapter 7, Chapter 19 or the round card (issue 12).

## 3. New issues

Most severe first. There are no blockers. Issues found by reading, on paths play didn't reach, are marked.

### Issue 1 (confusing): Does a threat that your Partial knocks out still deal its Harm?

- **Where:** `16-ch06.html`: "Against a threat, **a Partial does the job, but the threat’s Harm hits you**." `13-ch03.html`: "When a roll happens, the result comes first, then its cost, then everything else."
- **What happened:** at the grain store, Sam's Partial Strike (roll 13) put the Beater out, its 2nd point of harm of 2. The table asked at once how a knocked-out watchman can still hit him. The same thing happened at the kennels (roll 65), where Jonah's Partial finished the last Hound.
  - Both times, the Harm put the roller Down. That decided whether Sam was Stuck as a rat for the rest of the Mill.
  - At the kennels it turned the Clash's rise from +1 into +2 ("someone went Down"), which took Scent from 4 to 5 of 7.
  - The literal text says the Harm lands, and that is the ruling the table used. But the fiction argues the other way, and the ruling changed Scent.
- **Fix:** add to the Clash Actions box: "A Partial that takes a threat out still costs you its Harm: it got you as it went down." Or the opposite, but say it.
- **Ruling tonight:** the Harm lands (result, then cost).

### Issue 2 (confusing): Does the Huntsman's Trophy apply in a Clash?

- **Where:**
  - `22-ch10.html`, Hound: "Sneak rolls at an obstacle a Hound guards, **and in a Clash with a Hound**, are at +1 Difficulty: +1 in all, however many Hounds there are."
  - Same file, Huntsman: "Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty."
  - `47-sheet-round.html`: "Tracker: Sneak +1 Difficulty where it guards" and "Trophy: Sneak +1 Difficulty where it guards".
- **What happened:** in the Callhorn Clash, Sam distracted Mr Thatch by Sneak (roll 20) and Maya slipped away from him by Sneak (roll 24). The fix spelled out Clashes for the Hound and not for the Huntsman, so one player read the difference as deliberate: no Trophy in a Clash. The round card, the sheet the Storyteller actually looks at, doesn't mention Clashes for either.
  - The ruling moved both rolls from Difficulty 3 to 4. It changed no result: each had 1 hit, a Partial either way.
- **Fix:** give the Huntsman the same wording ("and in a Clash with a Huntsman"). Make the round card say "Tracker: Sneak +1 Difficulty where it guards and in a Clash with it (+1 in all)", and the same for the Trophy. Say whether a Hound and a Huntsman together give +1 or +2.
- **Ruling tonight:** the Trophy applies in a Clash at the obstacle the Huntsman guards.

### Issue 3 (confusing): A friend Taken at the Lodge cellar: freed when the cage opens?

- **Where:** `35-ch17.html`, the cellar cage: "When it opens, Kit (and any Taken friend of yours) comes with you." `17-ch07.html`, Taken: "The Hunt cages you, and you’re out for the rest of the mission." The same Chapter 17 page says, under Rescuing a friend: "if one of your team was Taken on an earlier mission, they’re in the cellar cage too." `18-ch08.html`, Last Hunt: "(a friend Taken that night is freed with them)".
- **What happened:** Jonah went Down in the cellar Clash (roll 70). The Clash's rise brought the Hunt Up, so he was Taken at the end of that scene. Three rolls later Rosa opened the cage (roll 77).
  - His player pointed at "any Taken friend of yours": he was Taken in this very cellar, so isn't he in the cage that just opened?
  - Chapter 7 says no, and so does the earlier-mission line. Chapter 8's Last Hunt has to spell out its exception, which suggests the normal rule is no.
  - It didn't change tonight's result, since Theo was Taken on the lawn anyway. In a run where nobody is Taken later, it decides a Win against a Costly Win.
- **Fix:** in the cellar paragraph, write "any friend of yours Taken on an earlier mission".
- **Ruling tonight:** Jonah stays Taken.

### Issue 4 (confusing; Round 1 issue 15, still open, reached in play): Can rescued friends be Taken in the Escape?

- **Where:** `35-ch17.html`: "A rescued character rejoins the team when you’re out, but doesn’t roll during the Escape." Kit alone gets: "He can’t be Taken unless everyone else is." `17-ch07.html`: "If every character is Down, Netted or Taken at the same moment, nobody is left to help: everyone is Taken".
- **What happened:** the Lodge cage freed four of the team (Maya, Priya, Sam and Lucía, all Taken at the Mill) and Kit. On the lawn, Theo Failed his Push with the Hunt Up (roll 79) and was Taken, leaving Ben, with 0 Wild, about to roll.
  - The table had to know the stakes: if Ben, Rosa and Dev were all Taken, would the four rescued friends go back in the cage?
  - Do they count as characters for "everyone at once"? Can they Help or Patch Up, since only rolling is ruled out?
- **Fix:** give rescued friends Kit's line: "Rescued friends go where you go, and don’t roll, Help or spend Wild until you’re out. They can’t be Taken unless everyone else is."
- **Ruling tonight:** as the fix. It didn't bite: Ben, Rosa and Dev all got out.

### Issue 5 (confusing, found on reading): Three wordings of the round-3 Scent rule

- **Where:**
  - `15-ch05.html`, Results box: "And from the third round on, if anyone still isn’t past at the end of a round, Scent rises by 1."
  - Same chapter, Scent box: "once when a group obstacle ends (and every round it runs from the third on)".
  - `47-sheet-round.html`, step 4: "Scent +1 if anyone got a Partial or Fail **since the last rise** ... From round 3, anyone not past at a round’s end: Scent +1."
- **What happened:** no group obstacle went past round 2 tonight, but the table read these while planning the lawn, and they disagree in two places.
  - If everyone gets past in round 3, the Results box says no extra rise. The Scent box ("every round it runs from the third on") says round 3 costs 1.
  - Say a Partial lands in round 1, someone is still out at the end of round 3 (+1), and the rest get past in round 4. Chapter 5 gives the end-of-obstacle +1 as well. The card's "since the last rise" gives it only if a Partial or Fail came after the round-3 rise.
  - The rule also changed from Round 1's "after the third round" to "from the third round", which is one Scent harsher. Every summary follows the change, so that part is fine.
- **Fix:** use the Results box wording everywhere. Drop "since the last rise" from the card, or add it to Chapter 5 if it's meant.
- **Ruling tonight:** the Results box, and the end-of-obstacle +1 counts every Partial or Fail at that obstacle.

### Issue 6 (minor): Replacement characters when Taken friends are still in the group

- **Where:** `12-ch02.html`: "No two characters in a group have the same animal. If two players want the same one, they each roll a die ... the other picks again (they can keep the same frame)." `18-ch08.html`: "their player makes a new Bonded (or takes a ready-made one)" and "When a Taken friend is rescued, their player chooses which of their two characters to play from then on; the other becomes a friend of the team."
- **What happened:** four were Taken at the Mill, so four players needed characters. One took Theo, the only ready-made left, and three built new Bonded with Chapter 2. Three questions came up:
  - Maya's player rolled the alligator (roll 32), Lucía's animal, and Lucía was in the Lodge cage. Does a Taken character still count as "in the group"?
  - After the Lodge, Lucía's player had to choose between Lucía (rescued) and Theo (now Taken). That's no choice at all. Is Theo still a Taken friend the team must rescue before the full moon, or just a "friend of the team"?
  - Jonah's player (Jonah Taken) needs a new character. Can he take a ready-made that another player has just retired as a "friend of the team" (Priya)?
- **Fix:** "Taken characters still count as in the group. If you roll an animal someone already has, roll the animal die again. A friend of the team stays out of play."
- **Ruling tonight:** Taken characters count. Roll the animal again, keeping the frame (roll 33). Theo is still a Taken friend to rescue. Jonah's player makes a new Bonded before the next mission.

### Issue 7 (minor): At a point obstacle, can a friend use their action and then Help that same round's roll?

- **Where:** `15-ch05.html`: "Each round, one character rolls ... and the others may Help." `16-ch06.html` gives Clashes "in any order the players like"; obstacles have no order.
- **What happened:** at the cage (roll 75), Theo and Ben shifted back to human as their actions so they could Help Rosa's Wits. Can they do it in the same round, or only from the next? Round 1 Test B waited a round. This table didn't.
- **Fix:** "In a round at a point obstacle, the others act in any order, before or after the roll."
- **Ruling tonight:** any order. The Helps counted at roll 75.

### Issue 8 (minor): "Edges come only from obstacles"

- **Where:** `16-ch06.html`: "A Critical on Distract or Slip Away works like a Success; Edges come only from obstacles." `13-ch03.html`: "You gain Edges from a Critical ... from a good scouting roll ... and from the Team Captain perk."
- **What happened:** rolls 53 and 73 were Criticals on Distracts. The new sentence settled them, but a player noted it also says scouting (roll 1) and Team Captain can't give Edges.
- **Fix:** "...works like a Success; a Clash never gives an Edge."
- **Ruling tonight:** Chapter 3.

### Issue 9 (minor): Chapter 7 still says "You can always Withdraw"

- **Where:** `17-ch07.html`, Giving Up: "You can always **Withdraw**: abandon the objective and head straight for the Escape (Chapter 5)." `15-ch05.html`: "at any time outside a Clash ... (In a Clash, Slip Away or see it through first.)"
- **What happened:** when three friends went Down in the Callhorn Clash, a player read Chapter 7 aloud and asked to Withdraw on the spot. Chapter 5 says no.
- **Fix:** Chapter 7: "You can always Withdraw outside a Clash".
- **Ruling tonight:** Chapter 5.

### Issue 10 (minor): Does the Exposed Scent add to a poor scouting roll?

- **Where:** `15-ch05.html`, Scent: "It rises ... by 1 at the start of a mission after someone was Exposed." Scouting: "Partial: the team picks the way in, but **Scent starts at 1**." `17-ch07.html`: "That’s only ever 1: it doesn’t add to a poor scouting roll’s Scent 1."
- **What happened:** the team came to the Lodge Exposed, and the scouting roll was a Partial (roll 41). Read alone, Chapter 5's "rises ... by 1 at the start" plus "starts at 1" gives 2. Chapter 7 settles it at 1, but the Scent box is the one the table checks.
- **Fix:** Scent box: "starts at 1 after someone was Exposed (not on top of a poor scouting roll)".
- **Ruling tonight:** Chapter 7. Scent 1.

### Issue 11 (minor): Two mission lengths

- **Where:** `11-ch01.html`: "A mission takes one to two hours, a little more for a Hard one with a big group." `21-ch09.html`, Pacing: "**A mission takes two to three hours.**"
- **What happened:** the Storyteller planned the evening from Chapter 9 and was told Chapter 1 says otherwise.
- **Fix:** change Chapter 9 to match.
- **Ruling tonight:** none needed.

### Issue 12 (minor): Netted "in a Clash" isn't carried everywhere

- **Where:** `17-ch07.html`, Netted: "When you Fail against a Trapper, you’re Netted instead of Hurt." `42-ch19.html`: "Netted (a Trapper on your Fail)". `47-sheet-round.html`: "Net: a Fail against it nets you".
- **What happened:** nothing went wrong. Rosa's Fail in the cellar Clash (roll 69) netted her by any reading. But the three places a table checks first don't say "in a Clash", and Chapter 10 and Chapter 5 now do.
- **Fix:** add "in a Clash" to all three.
- **Ruling tonight:** Chapter 10.

## 4. Play log

### Before play

- **Table:** a Storyteller and five players. `11-ch01.html`: "Three to five players and a Storyteller."
- **Characters (`41-ch18.html`):**
  - Maya Reyes (jaguar; Night Rosettes, Hide-and-Seek Champ)
  - Priya Shah (barn owl; Silent Wings, Brainiac)
  - Sam Lindqvist (brown rat; Gnaw, Gamer)
  - Jonah Mensah (bison; Shaggy Coat, Football Player)
  - Lucía Ortega (alligator; Lurker, Swim Team), playing this time because the Mill is the Water mission and her perks went untested in Round 1.
  - Theo Park sat out as the ready replacement. That means no Team Captain Edge at the Mill, and no Pack.
- **Signals:** one bark for danger, two taps for "here" (`14-ch04.html`).

### Mission 1: The Old Mill (Standard)

**Setup.** `33-ch15.html`: "Scent Limit: 7 with 3 players · 7 with 4 · 6 with 5." So the Limit is 6, and On the Trail is 3 ("at least half the Limit (round up)", `15-ch05.html`).

- Wild: Maya 4, Priya 4, Sam 5 (Gamer), Jonah 4, Lucía 4.
- Edges 0. Scent 0. Everyone human, 0 Hurt.

**Scouting (roll 1).** Greedy: Sam scouts as a human, Sense 3, with no Help, against 2. Roll 1 gave 2 hits, a Success: "the team picks the way in and gains **an Edge**." **Edges 1.**

**The way in.** The table chose Way in A, the millrace (Water, Dark; Sneak 2, Move 2; group): "Dangerous: a Fail deals 1 Hurt."

- In the gap (`14-ch04.html`: "The gap between scouting and the way in counts as between obstacles"), Lucía shifted to alligator (Wild 4 to 3), Sam to rat (5 to 4) and Jonah to bison (4 to 3).
- Maya and Priya stayed human to save Wild.

**Millrace, round 1 (rolls 2 to 6).** Rolled one at a time, with no Pushes and no Help:

- **Lucía** (roll 2): Sneak 3 +1 (Water and Dark, a Reptile Strength) +1 Swim Team, against 2 −1 Lurker = 1. Success.
- **Maya** (roll 3): human Sneak 3 +1 Hide-and-Seek, against 2. Partial: past.
- **Sam** (roll 4): rat Sneak 4 against 2. Fail: not past, and 1 Hurt ("A dangerous obstacle also deals 1 Hurt to whoever Failed"). **Sam Hurt 1.**
- **Jonah** (roll 5): bison Move 3 against 2. Fail. Shaggy Coat ("Once per scene, when you’d take Hurt, take 1 less") cancels the Hurt.
- **Priya** (roll 6): human Move 2 against 2. Partial: past.

**Round 2 (rolls 7 and 8).** Sam got a Success and Jonah a Partial. Everyone is past. "At a group obstacle, Scent rises once, when the obstacle ends: +1 if anyone got a Partial or a Fail." **Scent 1.**

**Inside 1, the grain store.** Dark, Narrow; Sneak 2, Move 3, Sense 3, Wits 2; group; a Beater (Difficulty 2, Toughness 2, Harm 1) and a Hound (2, 3, 1).

- In the gap, Maya shifted to jaguar (Wild 4 to 3).
- The table chose the fight: "You can also choose to start the Clash yourselves, before anyone rolls; then it begins at once." Nobody rolls the obstacle, so it raises no Scent of its own.
- The place's tags apply in the Clash, as in the `16-ch06.html` lawn example. The Tracker (+1 to Sneak "in a Clash with a Hound") applies to any Sneak roll.

**Grain-store Clash, round 1 (rolls 9 to 12).**

- **Sam** (roll 9) Distracts the Beater by Move: rat Move 3 +1 Narrow against 2. Partial. "A Partial does the job, but the threat’s Harm hits you", so the Distract works and Sam takes 1. **Sam Hurt 2.**
- **Jonah** (roll 10) Strikes the Beater: Force 4 +1 Football Player, against 2 +1 Narrow (a Heavy Weakness) −1 Distract = 2. Success: Beater at 1 of 2.
- **Maya** (roll 11) Strikes the Hound: Force 3 +1 Dark against 2. Success: Hound at 1 of 3.
- **Lucía** (roll 12) Strikes the Hound: Force 3 +1 Dark. Partial: Hound at 2 of 3, and she's bitten. **Lucía Hurt 1.**
- **Priya** shifts to owl as her action (Wild 4 to 3). `14-ch04.html`: "A shift during a Clash is always in sight." `16-ch06.html`: "Anyone who shifted during it is Exposed." **Priya Exposed**, and the Clash will rise +2.
- Both threats were rolled against, so there are no end-of-round attacks.

**Round 2 (rolls 13 to 15).**

- **Sam** (roll 13), at Hurt 2, Strikes the Beater himself (deliberately reckless): rat Force 1 +1 Narrow against 2. Partial: the Beater is out (2 of 2).
  - The table asked whether a knocked-out Beater still hits him (issue 1). Ruling: yes, Harm 1. Sam is at Hurt 3: **Down** ("When your third Hurt box is marked, you’re Down"). He's in animal form, so he's **Stuck** ("If you go Down in animal form, you’re Stuck: you can’t shift back until the mission ends").
  - No Push, by plan.
- **Priya** (roll 14) Distracts the Hound: owl Move 4 +1 Silent Wings (Dark), against 2 +1 Narrow (a Bird Weakness). Partial: it works, and she's bitten. **Priya Hurt 1.**
- **Maya** (roll 15) Strikes the Hound at Difficulty 1. Success: the Hound is out.

"A Clash ends when every threat is out." It ended in round 2. "+2 if ... someone went Down, or someone shifted during it": both happened, but +2 is the most. **Scent 3**, the On the Trail mark.

"The Clash’s Scent rises first; then the scene ends." A friend is standing and the Hunt isn't Up, so Sam "get[s] back up with 2 Hurt and you’re past the obstacle". **Sam Hurt 2, Stuck as a rat.** The guards are beaten, so the grain store is cleared.

**Inside 2, the gear loft.** High, Narrow; Move 2, Sense 3; point, 3 progress; dangerous. At a point obstacle every Partial or Fail is Scent +1. Greedy: no Patch Up for Sam in the gap.

- **Round 1** (roll 16): Sam, Stuck at Hurt 2, rolls Move 3 +1 Narrow against 2, with no Help. A Fail would put him Down again. He got two 6s, a Critical: "as a Success, plus 1 extra progress." 2 of 3.
- **Round 2** (roll 17): the riskier pick, Priya the owl. Move 4 +1 High, against 2 +1 Narrow = 3. Partial: 3 of 3, cleared, but Scent +1. No Push. **Scent 4.**

**The objective: the Callhorn.** High, Locked; Force 3, Wits 2; point, 3 progress; "Guarded by a Huntsman. Beating the guards doesn’t clear it." Mr Thatch: Difficulty 3, Toughness 4, Harm 2; Trophy, Sneak +1.

Nobody shifted or patched in the gap. At Scent 4 of 6, the table started the Clash.

**Callhorn Clash, round 1 (rolls 18 to 22).**

- **Priya** (roll 18) Distracts: owl Move 4 +1 High against 3. Partial: it works, and Harm 2 takes her from 1 to 3. **Priya Down, and Stuck as an owl.**
- **Jonah** (roll 19) Strikes: Force 4 +1 Football +1 Locked (Cap +2), against 3 −1 = 2. Success: 1 of 4.
- **Sam** (roll 20) Distracts by Sneak: rat Sneak 4, against 3 +1 Trophy = 4 (issue 2; ruling: the Trophy applies). Partial: it works, and Harm 2. **Sam Down again** (still Stuck).
- **Maya** (roll 21) Strikes: Force 3 +1 High, against 3 −1 = 2. Success: 2 of 4.
- **Lucía** (roll 22) Strikes: Force 3 against 3, no Edge. Fail: Harm 2. **Lucía Down, and Stuck as an alligator.** No Push, by plan.

Mr Thatch was rolled against, so there's no end-of-round attack.

**What the table saw next.** Three were Down, so the Clash would rise +2 however it ended, from 4 to 6, the Limit. `16-ch06.html`: "so if that rise brings the Hunt Up, they’re Taken." Nothing Maya or Jonah could do would save the three.

With the Hunt about to be Up, the guard no longer mattered: "A Fail at a guarded obstacle doesn’t start a Clash any more: you’re just Taken." So both slipped away instead of fighting on. A player asked to Withdraw instead (issue 9); Chapter 5 says not in a Clash.

**Round 2 (rolls 23 and 24).**

- **Jonah** (roll 23) Slips Away: bison Move 3 against 3. Partial: he's out and waiting ("at a point obstacle you wait, out of harm’s way, until the Clash ends"). He takes Harm 2, cut to 1 by Shaggy Coat, fresh this scene. **Jonah Hurt 1.**
- **Maya** (roll 24) Slips Away: Sneak 4 +1 High +1 Hide-and-Seek, against 3 +1 Trophy = 4. Partial: out, and Harm 2. **Maya Hurt 2.**

Nobody who can act is left: "the guards are still there". The Clash rise is +2 (someone went Down): **Scent 6 of 6. The Hunt is Up.** Horns sound, and the Callhorn groans as the Masters come up the stairs. Then the scene ends. The Hunt is Up, so the three Down are **Taken**: "The Hunt cages you, and you’re out for the rest of the mission ... You’re also Exposed." **Priya, Sam and Lucía Taken.**

**Press on or Withdraw.** "If the objective isn’t done, the team chooses: keep going, or Withdraw straight to the Escape (a Loss)." The book's advice box says "Run the moment a friend is Taken." The greedy table kept going, with the Callhorn at 0 of 3 and Mr Thatch still on guard.

**Callhorn with the Hunt Up (rolls 25 to 29).** "From now on, any Fail means you’re Taken, wherever you are." "Any Scent past the Limit is lost."

- **Round 1** (roll 25): Jonah, Force 6 dice against 3. Partial: 1 of 3.
- **Round 2** (roll 26): the riskier pick, Maya, with Force 3 +1 High and the team's Edge (**Edges 0**). Fail. The table skipped the Push, so **Maya is Taken**. That's the Fail path, as opposed to the Down path. From here, any Fail that would mean Taken gets Pushed.
- Jonah, alone, kept going: Withdrawing would cross the same Escape with the same risk.
- **Round 3** (roll 27): Jonah, Partial. 2 of 3.
- **Round 4** (roll 28): Jonah Fails. He Pushes (Wild 3 to 2), and roll 29 gives a Partial: 3 of 3. **The Callhorn is wrecked.**

**Escape, down the waterwheel (roll 30).** Water, High; Sneak 3, Move 2; group. Scent 6 is at least 3: "that Escape obstacle is at +1 Difficulty for every approach."

- **Jonah** (roll 30): bison Move 3 against 3. Partial: past. "In the Escape, Partials cost no Scent."

"When everyone still free is past the last Escape obstacle, the mission ends."

**Result: Costly Win.** `15-ch05.html`: "The objective is done, but someone (not everyone) is Taken."

- Taken: Priya, Sam, Lucía and Maya. Exposed: all four, plus Priya's shift (Jonah is not).
- Wild spent: only 6 of 21 (Maya 1, Priya 1, Sam 1, Jonah 2, Lucía 1). Jonah lost 2 unspent. The other three Taken characters' Wild is irrelevant: Maya had 3 left, Priya 3, Sam 4, Lucía 3.
- `33-ch15.html`: "the horn is wrecked, but a friend was caught in the tower." Four friends, in fact.

### Campaign step after the Mill (Chapter 8)

- **Hunt track:** "After a Costly Win, it rises by 1." **0 to 1.**
- **Growth:** "every character marks 1 Growth", and "A Taken character marks Growth after the mission like everyone else." All at 1, so there are no choices yet.
- **Exposed:** "The next mission starts at Scent 1 (only 1, however many of you were Exposed)."
- **Taken friends:** the four are held at the Lodge. "Rescuing them can be the team’s next mission (The Lodge on the Hill, Chapter 17, is written as a rescue)". They are in its cellar cage ("if one of your team was Taken on an earlier mission, they’re in the cellar cage too"). The full moon allows "either of the next two missions".
- **Replacements:** "their player makes a new Bonded (or takes a ready-made one) who joins at the start of the next mission ... A new character starts with Growth equal to the lowest in the group" (1).
  - Lucía's player took Theo, the last ready-made.
  - Three players built new Bonded with Chapter 2's steps, rolling frame, animal and perk (rolls 31 to 40).
  - **Dev Okafor**, 13. Reptiles (roll 31), then the alligator (roll 32). That's Lucía's, so he picked again, keeping the frame (issue 6), and got the Komodo dragon (roll 33): Taste the Air, "+1 die on Sense rolls, and a Hound’s Tracker doesn’t affect you". Perk: Football Player (roll 34). Human: Sneak 1, Force 3, Move 2, Sense 1, Wits 2.
  - **Rosa Lind**, 11. Critters, House Mouse (rolls 35 and 36): Tiny, "In Narrow places, your Sneak and Move rolls are at −1 Difficulty". Perk: Drama Kid (roll 37). Human: Sneak 2, Force 1, Move 2, Sense 1, Wits 3.
  - **Ben Adeyemi**, 14. Heavies, Hippopotamus (rolls 38 and 39): Charge, "Once per scene, when a Force roll Succeeds, it counts as a Critical". Perk: Night Owl (roll 40). Human: Sneak 1, Force 3, Move 2, Sense 2, Wits 1.
  - Each took about five minutes with the dice. Chapter 2's step-by-step box was enough.
- **Hurt clears, Wild resets, Edges are lost.** Rumour 5 (the Lodge), chosen.

### Mission 2: The Lodge on the Hill (Hard)

**Setup.** `35-ch17.html`: "Scent Limit: 7 with 3 players · 7 with 4 · 7 with 5." On the Trail at 4.

- Team: Jonah (bison), Theo (coyote), Dev (Komodo), Rosa (mouse) and Ben (hippo). All have 4 Wild.
- **Edges 1** from Team Captain. **Scent 1** (Exposed).

**Scouting (roll 41).** Theo shifted to coyote to scout (Wild 4 to 3; "it doesn’t use up the scout’s free Shift"). Sense 4 against 2, no Help. 1 hit: a Partial, "Scent starts at 1". That's the same 1 as the Exposed start (`17-ch07.html`: "it doesn’t add to a poor scouting roll’s Scent 1"; issue 10). **Scent 1.**

**The way in.** Way in B, the ice-house tunnel (Narrow, Dark, Water; Sneak 2, Move 2; group; dangerous). Round 1 never used it. In the gap, Rosa shifted to mouse and Dev to Komodo (Wild 4 to 3 each). Ben and Jonah stayed human.

**Tunnel, round 1 (rolls 42 to 46).** Rolls 42 and 43 went out in one command (see the introduction).

- **Rosa** (roll 42): Sneak 4 +1 Narrow, against 2 −1 Tiny = 1. Success.
- **Dev** (roll 43): Sneak 3 +1 Water/Dark against 2. Success.
- **Theo** (roll 44): coyote Move 3 against 2. Critical: past, and "If the extra isn’t needed (always so at a group obstacle), the team gains an Edge." **Edges 2.**
- **Ben** (roll 45): human Move 2 +1 Night Owl ("+1 die on rolls in Dark places"; "Every perk works in any form") against 2. Partial.
- **Jonah** (roll 46): human Move 2 against 2. Fail: 1 Hurt, with no Shaggy Coat in human form. **Jonah Hurt 1.** No Push.

**Round 2** (roll 47): Jonah, with an Edge spent because the team was at the 2-Edge maximum (**Edges 1**). Partial: past. +1. **Scent 2.**

**Inside 1, the kennels.** Narrow, Dark; Sneak 2, Move 3, Sense 3; group; 3 Hounds. Tracker +1 to Sneak "in all". This time the table sneaked, to test a Fail starting a Clash at a group obstacle.

- **Rosa** (roll 48): Sneak 4 +1 Narrow, against 2 +1 Tracker −1 Tiny = 2. Critical: an Edge. **Edges 2.**
- **Dev** (roll 49): Sneak 3 +1 Dark against 2, with no Tracker (Taste the Air). Critical, but "The team holds at most 2 Edges at a time; any more are lost."
- **Theo** (roll 50): coyote Sense 4 against 3. Fail: "A Fail at a guarded obstacle starts a Clash". No Push, by plan.
  - "When a Fail starts it at a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then".
- **Ben** (roll 51): human Move 2 +1 Night Owl against 3. Partial.
- **Jonah** (roll 52): human Move 2 against 3. Partial.

The round's rolls are done, so the kennels' rise comes now: **Scent 3**. Then "the whole team is in the Clash, including anyone already past." This was clear on first reading.

**Kennels Clash** against Hounds A, B and C (Difficulty 2, Toughness 3, Harm 1 each), Narrow and Dark. Ben and Jonah stayed human on purpose: human Force at Difficulty 2 beats Heavy Force at 3 in a Narrow place.

- **Round 1 (rolls 53 to 57):**
  - Rosa (roll 53) Distracts A by Move, at Difficulty 1 (Tiny; the Tracker touches only Sneak). Success, a Critical that "works like a Success".
  - Dev (roll 54) Strikes A at Difficulty 1. Fail: bitten. **Dev Hurt 1.**
  - Jonah (roll 55) Strikes B: human Force 3 +1 Football against 2. Partial: B at 1 of 3. **Jonah Hurt 2.**
  - Ben (roll 56) Strikes C: Force 3 +1 Night Owl +1 Theo's Pack ("Once per scene, Help without spending Wild"). Success: C at 1 of 3.
  - Theo (roll 57) Strikes A. Partial: A at 1 of 3. **Theo Hurt 1.**
  - All three were rolled against, so no bites.
- **Round 2 (rolls 58 to 62):**
  - Rosa (roll 58) Distracts A: Success.
  - Dev (roll 59) Strikes A at Difficulty 1: Success, 2 of 3.
  - Jonah (roll 60) Strikes B with the second Edge (**Edges 0**). Critical: 2 harm, **B is out**.
  - Ben (roll 61) Strikes C. Fail: **Ben Hurt 1.**
  - Theo (roll 62) Strikes A. Success: **A is out.**
- **Round 3 (rolls 63 to 65):**
  - Rosa (roll 63) Distracts C: Success.
  - Dev (roll 64) Strikes C: Success, 2 of 3.
  - Jonah (roll 65), at Hurt 2, Strikes C. Partial: **C is out**, and by the issue-1 ruling its Harm still lands. **Jonah Down** (human, so not Stuck).

The Clash ends in round 3: +2 (someone went Down). **Scent 5.** The scene ends with friends standing and the Hunt not Up, so Jonah gets up at Hurt 2. The kennels are cleared, and Theo is past.

**Inside 2, the servants’ door.** Locked; Force 3, Wits 2; point, 2 progress. In the gap, Ben shifted to hippo (Wild 4 to 3) to use Charge, and Rosa shifted back to human (free; "shifting back counts as a Shift").

- **Round 1** (roll 66): Ben, hippo Force 4 +1 Locked +1 Edge... except there was no Edge left after roll 60. **Correction:** the team held 0 Edges after roll 60, so the "+1 Edge" in roll 66's label is wrong. Ben rolled six dice where he should have rolled five. That's a wrong number of dice, and per the brief the result stands: 2 hits against 3, a Partial. With five dice it would still have been at most the same 2 hits, so it was a Partial either way. Charge needs a Success. 1 of 2, Scent +1. No Push. **Scent 6.**
- **Round 2** (roll 67): Rosa, human Wits 3 against 2, no Help. Success: 2 of 2, at no Scent.

**Inside 3, the trophy hall** (roll 68). High, Dark; Sense 2; point, 2 progress. Dev rolled Sense 3 +1 Dark +1 Taste the Air (at the Cap) against 2. Critical: 2 progress, at no Scent. **Scent 6 of 7.**

**The objective: the cellar cage.** Locked, Narrow; Force 3, Wits 2; point, 3 progress; 2 Trappers (Difficulty 2, Toughness 2, Harm 1; Net). "Beating the guards doesn’t clear it."

At Scent 6, any Clash would end with the Hunt Up. The aggressive table started one anyway, so that Fails against the Trappers would net people before the Hunt was Up. Nobody changed form in the gap.

**Cellar Clash, round 1 (rolls 69 to 72).**

- **Rosa** (roll 69), human, Distracts Trapper 2: Move 2 against 2. Fail: "When you Fail against a Trapper in a Clash, you’re Netted instead of Hurt." **Rosa Netted.** No Push.
- **Jonah** (roll 70) Strikes Trapper 2: human Force 3 +1 Football against 2. Partial: 1 of 2, and Harm 1. **Jonah Down** (Hurt 3).
- **Ben** (roll 71) Strikes Trapper 2: hippo Force 4 +1 Locked, against 2 +1 Narrow. Partial: **Trapper 2 is out.** **Ben Hurt 2.**
- **Dev** (roll 72) Strikes Trapper 1: Force 3 +1 Football against 2. Partial: 1 of 2. **Dev Hurt 2.**
- **Theo** frees Rosa: "You can’t act until a friend spends their action to free you (no roll)." **Rosa freed.**
- Trapper 1 was rolled against, so there's no end-of-round attack.

**Round 2 (rolls 73 and 74).**

- **Rosa** (roll 73) Distracts Trapper 1: Success.
- **Theo** (roll 74) Strikes at Difficulty 1: Success. **Trapper 1 is out.**

The Clash ends in round 2: +2 (Jonah Down), from 6 to 8, with the excess lost. **Scent 7 of 7. The Hunt is Up**, and the lit window under the roof goes dark. Jonah is Down when the scene ends with the Hunt Up: **Jonah Taken** (and Exposed). His player then pointed at "any Taken friend of yours" (issue 3; ruling: he stays Taken).

**Press on or Withdraw again.** The cage was at 0 of 3, with four friends from the Mill inside, and the full moon allows one more try. The table kept going, which matches the book's advice this time ("Press on only if you’re already working on the objective").

**Cellar cage with the Hunt Up (rolls 75 to 77).**

- **Round 1** (roll 75): Theo and Ben shifted back to human as their actions (out of sight: "So is a shift you take as your action at an obstacle"). Both Helped Rosa's Wits (issue 7), Wild 1 each. Rosa rolled Wits 3 +2 against 2. Partial: 1 of 3.
- **Round 2** (roll 76): Ben Helps (Wild 2 to 1). Partial: 2 of 3.
- **Round 3** (roll 77): Rosa alone. Partial: 3 of 3. **The cage is open.**

Kit, Maya, Priya, Sam and Lucía are free. "A rescued character rejoins the team when you’re out, but doesn’t roll during the Escape" (issue 4 for whether they can be Taken).

**Escape 1, the lawn (rolls 78 to 83).** Open; Sneak 3, Move 2; group; +1 On the Trail; Hunt Up. In the gap, Theo shifted to coyote (Wild 2 to 1), Ben to hippo (1 to 0) and Rosa to mouse (3 to 2).

- **Theo** (roll 78): coyote Move 3 +1 Open against 3. Fail. He Pushes (Wild 1 to 0), and roll 79 Fails again. **Theo Taken.**
- **Ben** (roll 80): hippo Move 3 +1 Open against 3, with 0 Wild. Two 6s but only 2 hits: a Partial, since a Critical needs a Success. Past.
- **Rosa** (roll 81): mouse Sneak 4, against 3 +1 Open (a Critter Weakness) +1 On the Trail = 5. Partial: past.
- **Dev** (roll 82): Komodo Move 3 against 3. Fail. He Pushes (Wild 3 to 2), and roll 83 gives a Partial: past.
- The lawn had a Fail, so Scent +1, which is lost past the Limit.

**Escape 2, the wall (rolls 84 to 86).** High; Force 3, Move 2; group; +1.

- **Ben** (roll 84): hippo Force 4 +1 Help from Rosa (Wild 2 to 1), against 4. Partial.
- **Rosa** (roll 85): mouse Move 3 against 3. Partial.
- **Dev** (roll 86): Komodo Force 3 +1 Football against 4. Partial.

Everyone still free is past, so the mission ends.

**Result: Costly Win.** Kit and four friends are free. Jonah and Theo are Taken. `35-ch17.html`: "Kit is free, but one of the team now sits in the cage he left."

- Wild spent: 13 of 20 (Jonah 0, Theo 4, Dev 2, Rosa 3, Ben 4). Jonah was Taken holding all 4 of his.
- End Hurt (it all clears): Ben 2, Dev 2, Rosa 0.

### Campaign step after the Lodge

- **Hunt track:** Costly Win, so **1 to 2**.
- **Growth:** every character marks 1, including Jonah and Theo (Taken) and the four freed tonight. Everyone reaches 2 and chooses.
- **Rescued friends choose** ("their player chooses which of their two characters to play from then on"):
  - Maya's player keeps **Maya**: Growth +1 Wild (starts at 5). Dev becomes a friend of the team.
  - Priya's player switches to **Rosa**: +1 to human Move (2 to 3). Priya becomes a friend.
  - Sam's player keeps **Sam**: +1 Wild (6, "to a maximum of 6, counting the Gamer perk").
  - Lucía's player keeps **Lucía**, since Theo is Taken (issue 6): a second human perk, Night Owl ("a different one").
  - Jonah's player needs a new Bonded before mission 3 (issue 6 ruling).
- **Exposed:** Jonah and Theo (Taken), so mission 3 starts at Scent 1. The Mill's Exposures clear: "After that mission, Exposed clears."
- **Taken friends:** Jonah and Theo. The rescue must come on mission 3 or 4. The Lodge is used up, so the Storyteller will add "one more point obstacle before the Escape: a locked cage, Force 3 or Wits 2, 3 progress".
- Kit is home.

### Hard paths reached in play

| Path | Reached? | Where |
|---|---|---|
| Scent reaching the Limit | Yes, twice | Mill: the Callhorn Clash's rise, 4 to 6 (after roll 24). Lodge: the cellar Clash's rise, 6 to 7 (after roll 74). |
| The choice to press on or Withdraw | Yes, twice | Pressed on both times: against the book's advice at the Mill, with it at the Lodge. Withdraw itself was never used. |
| A Fail after that (Taken) | Yes, twice | Maya (roll 26, no Push). Theo (rolls 78 and 79, after a Push). |
| Taken from Down when the Hunt comes Up | Yes, four | Priya, Sam and Lucía at the Mill; Jonah at the Lodge. |
| Down | Yes, six times | Sam (rolls 13 and 20), Priya (18), Lucía (22), Jonah (65 and 70). Back up with 2 Hurt twice (Sam, Jonah). |
| Stuck in animal form | Yes, three | Sam, Priya, Lucía. |
| Netted and freed | Yes | Rosa (roll 69), freed by Theo's action. |
| A Clash nobody is left in | Yes | The Callhorn (rolls 23 and 24). Mr Thatch stayed on guard. |
| A shift during a Clash (Exposed, +2) | Yes | Priya, grain store round 1. |
| A Fail starting a Clash at a group obstacle | Yes | Kennels (roll 50): round finished, Scent raised, then the whole team in. |
| Dangerous obstacles | Yes | Millrace (rolls 4, 5), tunnel (roll 46). Gear loft rolled with no Fail. |
| Costly Win | Yes, twice | Both missions. |
| Loss | No | |
| Campaign: Taken friends carried and rescued | Yes | Four Taken at the Mill were freed from the Lodge cage. Two more Taken at the Lodge carry on. |
| Campaign: replacement characters | Yes | Theo, plus three new Bonded built with Chapter 2. |
| Campaign: Hunt track | Yes | 0 to 1 to 2. |
| Campaign: Growth | Yes | 1, then 2 with four choices. |
| Campaign: Exposed | Yes | The Lodge started at Scent 1, with the scouting Partial on top (issue 10). |

**Not reached:**

- A Loss, a Withdraw, everyone Taken.
- Round 4 of a Clash.
- A group obstacle past round 2 (issue 5 stayed on paper).
- A Slip Away at a group obstacle.
- A Fail bringing the Hunt Up at a guarded obstacle (the Round 1 issue 2 fix).
- Anyone Netted at a scene's end.
- A prize.

## 5. What worked, and how it felt

### What worked

- **The Round 1 fixes held up on the paths they were written for.**
  - The nobody-left Clash at the Callhorn ran straight from Chapter 6, with no argument about whether Mr Thatch stayed.
  - The Fail-started Clash at the kennels was clear on first reading.
  - "The Clash’s Scent rises first; then the scene ends" decided four Taken without a pause.
  - The Trapper text made the net exact.
  - The scene definition answered every Shaggy Coat and Pack question.
  - "The team stays together" closed off splitting before anyone asked.
- **The Hunt Up box is complete for play.** Taken on a Fail, the press-on choice, "If you’re already in the Escape, carry on", Scent past the Limit lost, and guards making no difference once the Hunt is Up: the table never had to look past one box.
- **Down and Stuck are vivid.** Three animals, a rat, an owl and an alligator, lying in the tower when the horns sounded made the best scene of the night. "Getting a moose home through town" (`14-ch04.html`) is exactly the right picture, though tonight they went to the cage instead.
- **The Lodge as a rescue works beautifully.** Four of the team in the cage that Kit was meant to be alone in gave the second mission a reason and a cost. Rosa's three straight Partials on the locks, with the Hunt Up and the Masters coming downstairs, were the tensest rolls of the night.
- **Making new Bonded mid-campaign is fast.** Three characters from dice in about fifteen minutes, all playable. A Komodo that ignores the Tracker, a mouse at Difficulty 1 in every Narrow place, and a hippo whose Charge almost opened the door in one roll each had a real moment.
- **The round card and the mission tracker carried both missions.** The new progress, round and Clash-round pips on the tracker were used all night.

### How it felt

**Losing is very real once you play greedily.** In Round 1, a careful table never brought the Hunt Up. Tonight, skipping Pushes and Help and starting fights brought it Up on both missions. Six characters were Taken, and the team still scored two Costly Wins. The book's warning that "Teams that hold their Wild back for later lose far more often" is exactly right: only 6 of 21 Wild was spent at the Mill, and Jonah was Taken at the Lodge with all 4 of his.

**The cliff.** The sharpest thing tonight was the chain in Chapter 6: a Down raises the Clash's rise to +2, and if that rise reaches the Limit, every Down friend is Taken. At the Callhorn, three friends went Down in one round at Scent 4 of 6, and from that moment all three were lost whatever anyone did. It's clear and fair by the text, but it's all or nothing: one bad round in a Clash near the Limit can cage half the team. That's a design note, not a rules gap: does the game want it?

**Costly Win stretches a long way.** The Mill counted as a Costly Win with four of five Taken, the same +1 on the Hunt track as one friend Taken. The campaign cost showed up instead as four players needing new characters and a forced rescue mission, which felt about right in play. But the result label undersells it.

**The Hunt Up makes guards irrelevant at a point obstacle.** Once the Hunt is Up, a Fail there is Taken whether or not a guard stands by, so slipping away from Mr Thatch cost nothing. With the Hunt about to come Up anyway, the all-Slip-Away move was clearly right. It's not a hole, just a sharp tactic the book leaves for players to find.

**Pacing.** The Mill was 30 rolls with two Clashes, and the Lodge 46 rolls with two Clashes, plus about 15 minutes of new characters between them. At a real table I'd expect about 1.5 hours for the Mill and 2 to 2.5 for the Lodge. That's in line with Chapter 1's new "one to two hours, a little more for a Hard one", not with Chapter 9's "two to three" (issue 11).

**Did anything break?** No. The one place a careless reading could change a result is issue 1 (a knocked-out threat's Harm), which decided one Down and one point of Scent. The rest are wording and campaign admin. The table's main open question for the designers is the Down-to-Taken cliff above.
