# Playtest round 1, Test A: a first night

- Date: 2026-10-30. Book: Second Nature v0.1 (`book/src/chapters/`, read in order, and `book/dist/Second_Nature_v0.1.pdf` for the map and sheets). Nothing else was read.
- Table: a Storyteller who has read the book once, and three new players: Ana, Ben and Cara.
- Dice: every roll is in `book/playtests/round1-test-a-dice.md` (44 rolls). Below, "roll N" means line N of that log.
- Played: setup (Chapter 9), Pemberton's Pets (Chapter 13), then a mission built with Chapter 12 ("The Autumn Fair"), played the same way.

## 1. Verdict

CLEAN: both missions ran from brief to result without a blocker or an invented core-flow ruling, but the Hunt was never Up, so Taken, Down, Netted, Stuck and Withdraw went untested.

## 2. Issues

Most severe first. No blockers. Four are confusing and ten are minor.

### 2.1 Chapter 19 says the between-obstacles shift is "for free"; Chapter 4 says it still costs Wild (confusing)

- Where: `42-ch19.html`: "Between obstacles, everyone may Shift or Patch Up once for free." Against `14-ch04.html`: "as you move from one obstacle to the next, everyone may Shift or Patch Up once without it using an action", and its example: "Jonah shifts into his bison on the way, which costs him 1 Wild but no action". `15-ch05.html` makes the same misreading easy: "Moving from one obstacle to the next is free, and on the way everyone may Shift or Patch Up once without using an action."
- At the table: before the coal chute, Cara had the At the Table page in front of her and asked whether her shift was free. "For free" reads as "no Wild". The Storyteller had to find the Chapter 4 example to settle it. A table that trusts the one-page summary would give a free shift and a free Patch Up at every gap, which changes the Wild economy completely.
- Fix: in Chapter 19, write "Between obstacles, everyone may Shift or Patch Up once without using an action (it still costs 1 Wild)." In Chapter 5, put "it still costs Wild" in the same sentence.
- Ruling tonight: it costs 1 Wild as usual; only the action is free.

### 2.2 Chapter 12's Limit guidance can't settle a Limit or a label (confusing)

- Where: `24-ch12.html`: "The Limit is what makes a mission Easy or Hard." Then: "Find the most similar mission in Part Three: same number of obstacles, similar Difficulties, similar guards. Start from its Limits." And: "For each extra obstacle you add, add 1 to each Limit." The checklist asks for "A Limit for 3, 4 and 5 players, and a label (Easy, Standard or Hard)." `18-ch08.html` says of the Last Hunt: "Build it as a Hard mission (Chapter 12)".
- At the table: while building the Fair:
  - The chapter never says what counts as an obstacle for this rule. Is it only "obstacles inside" (the checklist's words), or the ways in, objective and Escape as well?
  - The Fair has the same count as Pemberton's Pets (Easy, 7/6/5) and The Old Mill (Standard, 7/7/6). At 3 players both give 7. So the Limit did not make the label. The label came only from which mission I called "most similar".
  - Part Three doesn't follow step 2. The Trophy Gala (2 inside, objective, 2 Escapes) is 6/6/6, but the Old Mill plus one Escape would give 8/8/7. The Lodge (the Zoo plus one Escape) is 7/7/7, not 9/9/9. Picking a different "similar" mission moves the Limit by 2.
  - Nothing says how to aim at a label, so the Last Hunt's "Hard mission" can't be built on purpose. Nothing says how to split 3/4/5 players when your mix of group and point obstacles differs from the source mission.
- Fix: define the count, for example "obstacles from the first inside one to the last Escape". Give a base Limit by structure, with a label offset such as "Easy +1, Hard −1". Say how the 5-player Limit moves for missions heavy in group obstacles. Then either line the Part Three Limits up with the rule or say why the Gala and Lodge run lower (heavier guards).
- Ruling tonight: copy The Old Mill's 7/7/6 (the match on guards as well as count) and call it Standard.

### 2.3 Shifting before the way in, and whether the scout's shift uses it up (confusing)

- Where: `15-ch05.html`: "Shifting to scout is out of sight, as it is between obstacles; it still costs Wild." `14-ch04.html`: "as you move from one obstacle to the next, everyone may Shift or Patch Up once without it using an action."
- At the table: the way in is the first obstacle, so the walk to it isn't "from one obstacle to the next". The table asked:
  - Can the others shift before the way in without using an action?
  - Does Priya's shift to scout use up her one shift, or could she scout as an owl and then turn back into a kid before the chute?
  
  Only the Chapter 4 museum example answers part of this: Jonah shifts "on the way" to the loading bay, which is a way in. The same question came up in both missions.
- Fix: add one sentence to Scouting: "Before the way in, everyone may Shift or Patch Up once without using an action; a shift to scout counts as the scout's."
- Ruling tonight: the walk to the way in is a gap like any other, and the scout's shift uses the scout's one shift there.

### 2.4 Scouting has no tags (confusing)

- Where: `15-ch05.html`: "Before going in, one character rolls Sense against the mission’s scouting Difficulty (2 in every mission in this book)." Every mission gives only "Scouting: Sense, Difficulty 2." Against `12-ch02.html`: "In animal form, if any of your frame’s Strengths is among the place’s tags, you get +1 die."
- At the table: Ana wanted the barn owl's High Strength for scouting from the roof of the shop. Peregrine Falcon's Keen Eyes, Night Owl, Gymnast and Swim Team all depend on tags too. Nothing says whether scouting has tags. The table worked out that with no tags listed, nothing matches. That took a minute of discussion, though, and it cost Ana a die she expected to have.
- Fix: either state "Scouting has no tags" in Chapter 5, or give each mission's scouting line its own tag (for example "Scouting: Sense 2, High").
- Ruling tonight: no tags, so no tag bonuses (4 dice, roll 9 and roll 30).

### 2.5 A Critical on Distract (or Slip Away) has no stated effect (minor)

- Where: `16-ch06.html`: "Strike (Force) a threat. Success: 1 harm. Critical: 2 harm." and "Distract (Sneak or Move) a threat. A Success puts the next Strike against it this round at −1 Difficulty." Against `13-ch03.html`: "You gain Edges from a Critical when the extra progress isn’t needed (Chapter 5)".
- At the table: Priya's Distract on the watchman (roll 18) had two 6s. Ana asked for an Edge, by analogy with group obstacles, where a Critical that isn't needed gives one. Chapter 6 says nothing about it.
- Fix: add one line to Chapter 6: "A Critical on Distract or Slip Away counts as a Success" (or, if you prefer, "and the team gains an Edge").
- Ruling tonight: no extra effect.

### 2.6 Chapter 19's Slip Away contradicts Chapter 6 (minor)

- Where: `42-ch19.html`: "Slip Away (Move or Sneak; you’re out and past)". Against `16-ch06.html`: "At a group obstacle you’re past it; at a point obstacle you wait, out of harm’s way, until the Clash ends."
- At the table: this didn't come up, because there was no Clash at a point obstacle. A table playing from the summary would let a Slip Away at a guarded point obstacle count as getting past it.
- Fix: in Chapter 19, write "you’re out (and past, at a group obstacle)".
- Ruling tonight: Chapter 6.

### 2.7 End-of-mission bookkeeping is scattered, and nothing says what happens to Edges (minor)

- Where: `31-ch13.html` "After the Mission" gives only the story for each result. `13-ch03.html`: "The team holds at most 2 Edges at a time; any more are lost." `12-ch02.html` (Team Captain): "the team starts every mission with 1 Edge."
- At the table: both missions ended on a Critical in the Escape (roll 26, roll 44), which "gains an Edge". The players asked whether they keep it for next time, and the book doesn't say. The other end-of-mission steps had to be gathered from four chapters: Growth and the Hunt track (Ch8), Exposed (Ch7, Ch8), Hurt clears (Ch7), and Wild is lost (Ch3).
- Fix: add an "After the Mission" box to Chapter 5 or 9, and a line in Chapter 19: mark Growth, move the Hunt track, note who is Exposed, clear Hurt, and lose unspent Wild and Edges.
- Ruling tonight: Edges are lost at the end of the mission, like Wild.

### 2.8 The sheets have no place for progress or round counts (minor)

- Where: `46-sheet-mission.html` tracks Scent, Edges, way in, objective done and prize carrier. `47-sheet-round.html` has "Threats in this Clash: harm taken". Neither tracks progress at a point obstacle, the round number at a group obstacle (`15-ch05.html`: "If anyone still isn’t past after the third round, Scent also rises by 1 at the end of every round after that."), or the Clash round ("or at the end of round 4").
- At the table: the Storyteller kept progress and rounds on scrap paper.
- Fix: add "Progress ○○○" and "Round 1 2 3 4 …" rows to the mission tracker.
- Ruling tonight: scrap paper.

### 2.9 The first-night steps have no slot for a player making a new character (minor)

- Where: `21-ch09.html`: "Hand out characters. Each player takes a ready-made Bonded." Yet the step before it says "Print the six ready-made Bonded (Chapter 18) or one blank character sheet per player". Also, `12-ch02.html`'s step-by-step lists only "Frame and animal", "Human ratings", "Human perk", "Your Mark" and "The rest".
- At the table: Cara made her own Bonded. The first-night steps and their "about 15 minutes" make no room for that. It took about 12 to 15 minutes (reading six frames, eighteen animal perks and twelve human perks) while the other two waited. Cara also asked whether she gets to assign her animal's ratings too. The step list never says to copy the frame's ratings, Strengths, Weaknesses and animal perk onto the sheet, although the sheet has boxes for them. The answer ("As an animal, you use your frame’s ratings instead") is in the text below the steps.
- Fix: in Chapter 9, add "or makes one with Chapter 2 (about 10 to 15 minutes more; do it while the others read their characters)". In Chapter 2, add a step: "Copy your frame’s ratings, Strengths and Weaknesses, and your animal perk, onto the sheet."
- Ruling tonight: new characters are made right after the talk about the feel, before the practice rolls.

### 2.10 The practice roll has no dice count or Difficulty (minor)

- Where: `21-ch09.html`: "Explain the roll with one practice roll each: count the 5s and 6s, compare to the Difficulty."
- At the table: the Storyteller had to decide how many dice to roll and against what Difficulty.
- Fix: "Each player rolls their best human rating against Difficulty 2."
- Ruling tonight: exactly that (rolls 6 to 8). All three came up Partials, which turned out to be a good way to teach the Partial.

### 2.11 The Chapter 12 checklist leaves out scouting and "if the Hunt is Up" (minor)

- Where: `24-ch12.html`'s checklist ends with "At least one moment for human form". Every Part Three mission also has "Scouting: Sense, Difficulty 2." and a Threats line saying who arrives if the Hunt is Up, plus After the Mission results. The checklist asks for none of these.
- At the table: the Storyteller copied them from Part Three.
- Fix: add "Scouting (Sense, usually Difficulty 2)", "who arrives if the Hunt is Up" and "what each result means" to the checklist.
- Ruling tonight: Sense 2; Lady Vane's car arrives.

### 2.12 The Ideas table: one roll or two? (minor)

- Where: `24-ch12.html`, a table headed "d6 | The Hunt is… | At…", followed by "These are starting points, not finished missions".
- At the table: it isn't clear whether you roll one d6 for a whole row or one d6 per column.
- Fix: "Roll once for each column, or choose."
- Ruling tonight: one d6 per column (roll 28, roll 29: "moving Trophies in a van" at "the school fair").

### 2.13 Roll-offs don't cover ties (minor)

- Where: `21-ch09.html`: "they roll a die: the higher roll chooses first". The same rule is in `41-ch18.html` and `12-ch02.html`.
- At the table: a newcomer asked about ties before rolling. There was no tie (roll 1, roll 2: 2 against 6).
- Fix: add "(reroll ties)".
- Ruling tonight: reroll ties.

### 2.14 "A mission takes two or three hours" looks long (minor)

- Where: `11-ch01.html`: "A mission takes two or three hours." `21-ch09.html`: "A mission takes two to three hours."
- At the table: Pemberton's Pets took 19 rolls and the Fair took 15. With newcomers, description and rules lookups, I estimate about 60 to 70 minutes for each at a real table. A group planning its evening around this claim will finish early.
- Fix: time real tables. If they confirm it, say "about an hour of play, plus setup".
- Ruling tonight: none needed. The table had time for a second mission.

## 3. Play log

### 3.1 Setup

Times are what a real table would spend, estimated.

Before everyone arrives (Chapter 9, "about 15 minutes"): print the three Bonded pages, one blank character sheet, the mission tracker, the round card and the At the Table page. Gather dice and tokens. Read Pemberton's Pets (two pages) and note "Scent Limit: 7 with 3 players". About 15 minutes, as the book says.

At the table:

1. Talk about the feel (2 minutes). The table chose "creepy, but not cruel". Nobody minded snakes, which mattered later.
2. Hand out characters (2 minutes). Ana and Ben both wanted Maya, the jaguar. Chapter 9: "If two players want the same one, they roll a die: the higher roll chooses first." Roll 1 (Ana) was 2 and roll 2 (Ben) was 6, so Ben took Maya Reyes and Ana took Priya Shah, the barn owl. A newcomer asked about ties (issue 2.13).
3. Cara made a new character with Chapter 2 (12 to 15 minutes; issue 2.9):
   - Frame, roll 3: 6 = Reptiles.
   - Animal, roll 4: 3 = the second listed, a python (Coil).
   - Human ratings, by choice: Sneak 1, Force 1, Move 3, Sense 2, Wits 2.
   - Human perk, roll 5: [2, 3] = list A, row 3, Track Star (+1 die on Move rolls).
   - She asked whether Track Star works as a snake. It does, and the book answers that quickly: "Every perk works in any form unless it says otherwise."
   - Mark: a zig-zag birthmark on her left wrist; as a python, a zig-zag of pale scales.
   - Name: Nadia Ferris, 12. She loves the swimming baths.
   - Python form: Sneak 3, Force 3, Move 3, Sense 3; Strengths Water, Dark; Weakness Crowd.
4. Practice rolls (3 minutes; issue 2.10), best human rating against Difficulty 2. Roll 6 (Maya, Sneak 3), roll 7 (Priya, Wits 3) and roll 8 (Nadia, Move 3) each scored one hit: three Partials.
5. Give everyone 4 Wild and explain the four ways to spend it (3 minutes). Nobody is a Gamer or a Team Captain, so the team starts with 0 Edges.
6. Read the brief and show the map (5 minutes, counted in the mission).

Setup came to about 15 minutes of preparation plus 25 to 30 minutes at the table. Chapter 1's "under half an hour if you use the ready-made characters" holds. With one new character, the table time is right at half an hour.

What the newcomers asked that the book didn't answer quickly: what to roll for the practice roll; what happens on a tie; whether the animal row is theirs to fill in. The sheets have no place for progress or round counts (issue 2.8). Otherwise the sheets were complete, and the ready-made Bonded copy straight onto them.

### 3.2 Pemberton's Pets (Chapter 13)

Limit 7 for 3 players. On the Trail at Scent 4 ("Scent is at least half the Limit (round up)"; 7 ÷ 2 = 3.5, so 4).

| Moment | Scent | Edges | Wild (Maya / Priya / Nadia) | Hurt | Forms |
|---|---|---|---|---|---|
| Start | 0 | 0 | 4 / 4 / 4 | none | kid / kid / kid |
| After scouting and the walk in | 0 | 1 | 3 / 3 / 3 | none | jaguar / owl / python |
| After the coal chute | 0 | 2 | 3 / 2 / 3 | none | jaguar / owl / python |
| After the shop floor and Clash | 2 | 1 | 3 / 1 / 3 | none | jaguar / kid / python |
| After the office door | 3 | 1 | 2 / 0 / 3 | none | kid / kid / kid |
| After the cages | 3 | 0 | 2 / 0 / 2 | none | kid / kid / kid |
| End of the Escape | 3 | (1) | 1 / 0 / 1 | Priya 1 | jaguar / owl / python |

**Brief and map.** The Storyteller read the Read This Aloud and showed the whole map ("Let the players see the whole map."). The table argued for a few minutes. The chute (Dark, Narrow) suits the jaguar and the python. The skylight suits the owl but is a point obstacle, where every Partial costs Scent. They agreed on the chute if scouting let them choose.

**Scouting (roll 9).** Priya shifted to scout, Wild 4 to 3 ("Shifting to scout is out of sight, as it is between obstacles; it still costs Wild."). The question of whether the owl's High Strength applies came up here (issue 2.4); ruling: no tags. Barn owl Sense 4 gives 4 dice against "Scouting: Sense, Difficulty 2", with no Help. Result [5, 4, 5, 1]: 2 hits, a Success. "Success: the team picks the way in and gains an Edge." Edges 1. On the walk to the chute, Maya and Nadia shifted, Wild 3 each. That was a ruling (issue 2.3), backed by Chapter 4's "Jonah shifts into his bison on the way". Cara's "is it free?" question came up here (issue 2.1).

**Way in A, the coal chute** (group; Dark, Narrow; Sneak 2, Move 2). Chapter 5: "Each round, everyone who isn’t past yet rolls, and each gets past on their own Partial or better."

- Round 1, Maya, jaguar Sneak: 4 +1 (Dark is a Big Cat Strength) +1 (Hide-and-Seek Champ) = 6 dice. Difficulty 2 −1 for Night Rosettes ("In Dark places, your Sneak rolls are at −1 Difficulty") = 1. That is inside the Cap ("at most +2 dice and at most −1 Difficulty"). Roll 10: [1, 1, 6, 6, 2, 3], 2 hits with two 6s, a Critical. "If the extra isn’t needed (always so at a group obstacle), the team gains an Edge instead." Edges 2.
- Round 1, Priya, owl Move: 4 +1 (Silent Wings, "In Dark places, +1 die on Sneak and Move rolls") = 5 dice. Narrow is a Bird Weakness, so the Difficulty is 3 ("If any of its Weaknesses is, the roll is at +1 Difficulty"). Roll 11: 2 hits, a Partial (past, but the chute would then cost Scent). Ana Pushed, Wild 2 ("After you roll, you may spend 1 Wild to reroll every die that didn’t hit. Keep the new result."). Roll 13: [6, 2, 5, 2, 5], 3 hits, a Success. (Table slip: Ana decided to Push after Nadia had rolled. Chapter 3 says "Push a roll you just made", so the Push should have come first. It changed nothing.)
- Round 1, Nadia, python Move: 3 +1 (Dark) +1 (Track Star) = 5 dice against 2. Roll 12: 3 hits, a Success.
- The chute ended in round 1 with no Partial or Fail left standing (the Pushed result replaces the Partial), so "Scent rises once, when the obstacle ends: +1 if anyone got a Partial or a Fail" didn't trigger. Scent 0.

**Inside 1, the shop floor** (group; Dark; Sneak 2, Move 2; guarded by a Beater). The Storyteller reminded the table, as Chapter 13 asks: "If anyone Fails, he wakes, and it’s a Clash."

- With Edges at 2, the team spent one on Nadia. That was a table mistake (mine). Nadia was already at +2 dice from Dark and Track Star, so the Edge couldn't add a die. I caught it after the roll, which was correctly rolled with 5 dice. Ruling: the Edge isn't spent, following Chapter 3's example ("Jonah is already at the Cap of +2 dice, so Theo keeps his Wild"). The book handles this well; the Storyteller simply forgot the Cap.
- Round 1, Maya, 6 dice against 1 as before. Roll 14: [3, 3, 6, 2, 3, 6], a Critical. An Edge would be gained, but "The team holds at most 2 Edges at a time; any more are lost." Edges stay 2.
- Round 1, Priya, owl Move 4 +1 Silent Wings = 5 dice against 2. Roll 15: [2, 4, 4, 4, 3], a Fail. She Pushed, Wild 1. Roll 17: [3, 3, 4, 2, 4], still a Fail.
- Round 1, Nadia, python Move, 5 dice against 2. Roll 16: 3 hits, a Success.
- Chapter 5: "At a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then (+1 for any Partial or Fail); then the whole team is in the Clash, including anyone already past." Scent 1.

**Clash with the watchman** (Beater: Difficulty 2, Toughness 2, Harm 1, Chapter 10). The shop floor's Dark tag still applies, as in Chapter 6's lawn example. Nobody shifted ("Shift before the fight, not during it").

- Round 1, Priya Distracts, owl Move 4 +1 Silent Wings = 5 dice against 2. Roll 18: [5, 6, 2, 3, 6], 3 hits with two 6s. "A Success puts the next Strike against it this round at −1 Difficulty." What the Critical adds is undefined (issue 2.5); ruling: nothing.
- Round 1, Nadia Strikes, python Force 3 +1 Dark +1 Edge = 5 dice (Edges 1), at Difficulty 1. Roll 19: [6, 3, 6, 2, 4], a Critical: "Critical: 2 harm. When a threat has taken harm equal to its Toughness, it’s out." The Beater is out.
- "A Clash ends when every threat is out", so Maya never acted. "When a Clash ends, Scent rises once: +1". Scent 2. "If you beat the guards (or they pull back after round 4), the obstacle is cleared": everyone is past, Priya included. No Harm was dealt.

On the way to the office door, Priya shifted back to a kid, which is free ("Shifting back to human costs nothing") and was her one shift for that gap. Maya and Nadia stayed animals, a misjudgement they fixed the next round.

**Inside 2, the office door** (point, 2 progress; Locked; Force 3, Wits 2). Chapter 5: "Each round, one character rolls (any one of you, and it can be someone different each round) and the others may Help."

- Round 1, Priya, human Wits 3 +1 Brainiac = 4 dice against 2. The two animals couldn't Help ("in animal form you can’t help with Wits"). Roll 20: [3, 1, 4, 2], a Fail. Priya Pushed with her last Wild. Roll 21: [3, 1, 1, 6], 1 hit, a Partial: "Partial: as a Success, but Scent +1." Progress 1 of 2; Scent 3. In the same round, Maya and Nadia used their actions to shift back to kids so they could Help ("A round is everyone getting one action: one roll, a shift, a Patch Up, or freeing a friend"; "Shifting back to human costs nothing, but it also takes your action").
- Round 2, Priya 4 dice +1 Help (Maya, Wild 2) = 5 dice. Brainiac plus one Help is already the Cap, so a second Help or the Edge would have been wasted. Roll 22: [1, 6, 1, 5, 4], a Success. Progress 2 of 2: the door is open. Scent 3.

**Objective, the cages** (point, 3 progress; Locked, Narrow; Force 3, Wits 2). Everyone was human, so Narrow didn't matter ("In human form, tags don’t change your roll.").

- Round 1, Priya Wits 4 +1 Edge (Edges 0) = 5 dice against 2. Using the Edge instead of a Help saved Wild. Roll 23: [5, 4, 6, 4, 4], a Success. 1 of 3.
- Round 2, Priya Wits 4 +1 Help (Nadia, Wild 2) = 5 dice. Roll 24: [6, 2, 6, 5, 5], 4 hits with two 6s, a Critical: "as a Success, plus 1 extra progress". 3 of 3: the cages are open and the strays pour out. Scent 3.

On the way out, Maya became a jaguar (Wild 1) and Nadia a python (Wild 1). Priya had no Wild left: "Out of Wild? You can still shift into your animal by taking 1 Hurt instead, unless that would put you Down." Priya went to 1 Hurt and became an owl.

**Escape, out the back** (group; Dark, Open; Sneak 2, Move 2). Scent 3 is below 4, so it isn't On the Trail.

- Maya, 6 dice against 1. Roll 25: 4 hits, a Success.
- Priya, owl Move 4 +1 Open +1 Silent Wings = 6 dice against 2. Roll 26: [4, 2, 3, 1, 6, 6], a Critical. It gives an Edge with nothing left to spend it on (issue 2.7).
- Nadia, python Move, 5 dice against 2. Roll 27: 3 hits, a Success.
- "When everyone still free is past the last Escape obstacle, the mission ends." No Fail, so no Scent ("In the Escape, Partials cost no Scent.").

**Result: Win** ("The objective is done and nobody is Taken.") at Scent 3 of 7.

**After the Mission.** Read: "Win: the strays scatter across Wrenfield, and the posters come down one by one. Mr Rook knows somebody was here."

- Hunt track stays 0 ("After a Win, it doesn’t move.").
- Everyone marks 1 Growth ("After every mission, whatever the result, every character marks 1 Growth").
- Nobody is Exposed (nobody shifted in sight, nobody was Taken).
- Priya's Hurt clears ("All Hurt clears between missions.").
- Wild left over: Maya 1, Nadia 1. The team spent 10 of its 12.

Estimated real time: about 60 to 70 minutes, including roughly 10 minutes of rules lookups for issues 2.1, 2.3, 2.4 and 2.5.

### 3.3 The Chapter 12 mission: The Autumn Fair

#### Building it (about 35 minutes for this Storyteller)

**Idea.** Roll 28 gave 3, "moving Trophies in a van". Roll 29 gave 2, "the school fair" (one die per column, issue 2.12). After Pemberton's, the Hunt is moving three Trophies up to the Lodge, using the fair's traffic as cover. The job is to **steal** them.

**Checklist** (`24-ch12.html`, "Every Mission Has"):

- **A brief.** Read aloud: "The Wrenfield Middle autumn fair runs until nine: tombola, cake stall, a bouncy castle sagging in the dusk. Behind the gym, in the staff car park, a plain white van has been parked all evening with its engine ticking. Mr Rook from the pet shop is sitting in the front seat with a strongbox on his knees. Ms Quill says three Trophies are leaving town tonight. Get them before the van does." What's going on: Mr Rook (Huntsman) guards the van. His driver, a Beater, walks a Hound through the fair, watching for Bonded kids. The prize is a velvet roll holding three Trophy rings, small enough for a pocket or a beak.
- **A map that matches.** The school is in the middle. A, the front gate, is on the High Street side. B, the brook, runs under the fence at the west edge of the playing field and comes out behind the bike sheds. Both lead to 1, the fairground on the playground. Then 2, over the gym roof on the east side, drops down to ★, the van in the staff car park. E runs across the dark playing field to the north and into Wrenwood.
- **Two ways in with different tags and approaches.** Done (A: Crowd, Sneak/Wits; B: Water and Dark, Sneak/Move).
- **Two to four obstacles inside, then the objective.** Done: two, then the objective.
- **One or two Escape obstacles, each with at least two approaches.** Done: one, with Sneak 2 and Move 2.
- **Every obstacle fully listed; threat stats from Chapter 10.** See the table below.
- **A Limit for 3, 4 and 5 players, and a label.** Chapter 12 says: "Find the most similar mission in Part Three: same number of obstacles, similar Difficulties, similar guards." The Old Mill matches: two ways in, a group obstacle inside guarded by a Beater and a Hound, a dangerous point obstacle, an objective guarded by a Huntsman, and one Escape. Its Limits are 7/7/6, Standard. No obstacles were added or removed, so there's no step 2 adjustment. Pemberton's Pets has the same count, which raised issue 2.2.
- **At least one moment for human form.** Three: the front gate (Wits 2), the fairground (Wits 2, and Crowd is a Weakness for three frames) and the strongbox (Wits 2).

Difficulties follow "2: the normal Difficulty for anything worth rolling" for the obvious approach and "3: hard, the approach that works but isn’t the obvious one" for the off-angle one. Point or group follows "If one person could deal with it for everyone (open a door, find the path), make it a point obstacle". Two obstacles are guarded ("Guard one or two obstacles per mission"). Two are dangerous, where "a fall or a current makes sense".

| Where | Obstacle | Tags | Approaches (Difficulty) | Kind · Progress | Notes |
|---|---|---|---|---|---|
| Way in A | The front gate | Crowd | Sneak 3 · Wits 2 | Group | Mrs Okafor takes the £1 and knows every face, and who's meant to be grounded. |
| Way in B | The brook | Water, Dark | Sneak 2 · Move 2 | Group | Dangerous: a Fail deals 1 Hurt (fast after rain). |
| Inside 1 | The fairground | Crowd, Open | Sneak 2 · Move 3 · Wits 2 | Group | Guarded by a Beater and a Hound. Beating them clears it. |
| Inside 2 | Over the gym roof | High, Narrow | Move 2 · Sense 3 | Point · 2 | Dangerous: a Fail deals 1 Hurt (a fall). One finds the route, the rest follow. |
| Objective | The strongbox in the van | Locked | Force 3 · Wits 2 | Point · 3 | Guarded by a Huntsman (Mr Rook). Beating the guards doesn't clear it. A prize to carry out. |
| Escape | Across the playing field | Open, Dark | Sneak 2 · Move 2 | Group | — |

- Scent Limit: 7 with 3 players, 7 with 4, 6 with 5. Label: Standard.
- Scouting: Sense, Difficulty 2. Chapter 12 doesn't ask for this (issue 2.11).
- Threats: Beater (2 / 2 / 1), Hound (2 / 3 / 1; Tracker), Huntsman (3 / 4 / 2; Trophy).
- If the Hunt is Up: Lady Vane's car turns into the car park and the fair's floodlights cut out.
- After the Mission:
  - Win: Ms Quill knows how to break the rings, and three Bonds go home.
  - Costly Win: the rings are free, but a friend leaves in the van.
  - Loss: the van reaches Thornhill.

Tag check ("try to use every tag at least once, and don’t let one tag take over"): Dark (B, E), High (2), Narrow (2), Water (B), Open (1, E), Crowd (A, 1), Locked (★). No tag appears more than twice. For this team (Chapter 9, "Look at the team’s frames before a mission"), the python gets the brook, the owl the fair and the field, and the jaguar the dark field. The Crowd at the fair pushes the jaguar and the python into human form.

#### Playing it

Between missions: Wild back to 4 each, Hurt cleared, Edges 0, Growth 1 each. Scent starts at 0, since nobody was Exposed ("an Exposed character’s next mission starts at Scent 1"). Limit 7; On the Trail at 4.

| Moment | Scent | Edges | Wild (Maya / Priya / Nadia) | Hurt | Forms |
|---|---|---|---|---|---|
| Start | 0 | 0 | 4 / 4 / 4 | none | kid / kid / kid |
| After scouting and the walk in | 0 | 1 | 3 / 3 / 3 | none | jaguar / owl / python |
| After the brook | 0 | 1 | 3 / 3 / 3 | none | jaguar / owl / python |
| After the fairground | 1 | 0 | 3 / 2 / 3 | none | kid / owl / kid |
| After the gym roof | 1 | 0 | 2 / 2 / 2 | none | kid / kid / kid |
| After the strongbox | 1 | 0 | 1 / 1 / 1 | none | kid / kid / kid |
| End of the Escape | 1 | (1) | 0 / 0 / 0 | none | jaguar / owl / python |

**Scouting (roll 30).** Priya shifted to scout (Wild 3). Owl Sense 4, Difficulty 2, no tags. Result [2, 5, 1, 5], a Success: the team picks the way in, Edges 1. They chose B, the brook. On the walk in, Maya and Nadia shifted (Wild 3 each), under the same ruling as before (issue 2.3).

**Way in B, the brook** (group, dangerous; Water, Dark; Sneak 2, Move 2).

- Maya, jaguar Sneak 4 +1 Dark +1 Hide-and-Seek = 6 dice. Difficulty 2, −1 for Night Rosettes, +1 for Water (a Big Cat Weakness) = 2 ("If a place has both a Strength and a Weakness of yours, both apply."). Roll 31: 3 hits, a Success.
- Priya, owl Move 4 +1 Silent Wings = 5 dice against 2. Roll 32: 2 hits, a Success.
- Nadia, python Move 3 +1 (Water and Dark are both Strengths, but "It’s one die and one step at most") +1 Track Star = 5 dice against 2. Roll 33: 2 hits, a Success.
- All past in round 1: no Scent, no Hurt.

On the way to the fair, Maya and Nadia shifted back to kids, which is free ("Crowds are a Weakness for Big Cats, Heavies and Reptiles. A kid in a crowd is invisible; a jaguar is not."). Priya stayed an owl, since Birds have no Crowd Weakness and Open is a Strength.

**Inside 1, the fairground** (group; Crowd, Open; Sneak 2, Move 3, Wits 2; a Beater and a Hound). The Hound's Tracker applies to anyone's Sneak, kids included ("Sneak rolls at an obstacle a Hound guards are at +1 Difficulty").

- Priya, owl Move 4 +1 Open = 5 dice against 3. Roll 34: 1 hit, a Partial: she's past.
- Nadia, human Move 3 +1 Track Star +1 Help (Priya, already past, Wild 2: "Those already past can still Help") = 5 dice against 3. Roll 35: 2 hits, a Partial: past.
- Maya, human Sneak 3 +1 Hide-and-Seek +1 Edge (Edges 0) = 5 dice. Difficulty 2 +1 Tracker = 3 ("aren’t limited by the Cap"). Roll 36: 2 hits, a Partial: past.
- All past in round 1, so no Clash. The group obstacle ends with Scent +1 for the Partials. Scent 1.

On the way to the gym, Priya shifted back to a kid (free).

**Inside 2, over the gym roof** (point, 2 progress, dangerous; High, Narrow; Move 2, Sense 3).

- Round 1, Nadia, human Move 3 +1 Track Star +1 Help (Maya, Wild 2) = 5 dice against 2. Roll 37: [3, 3, 1, 5, 3], a Partial. Cara Pushed (Wild 2) to dodge the Scent. Roll 38: [3, 6, 6, 5, 1], 3 hits with two 6s, a Critical: 2 progress. The roof is done, with no Scent and no Hurt.

**Objective, the strongbox in the van** (point, 3 progress; Locked; Force 3, Wits 2; guarded by Mr Rook).

- Round 1, Priya, Wits 3 +1 Brainiac +1 Help (Nadia, Wild 1) = 5 dice against 2. Roll 39: [2, 3, 3, 6, 6], a Critical: 2 progress (2 of 3).
- Round 2, Priya +1 Help (Maya, Wild 1) = 5 dice. Roll 40: [4, 5, 4, 4, 2], a Partial: the third progress is made, but Scent +1. Ana Pushed (Priya Wild 1). Roll 41: [5, 5, 4, 1, 2], a Success. 3 of 3, with no Scent. Mr Rook never had a Fail to answer, so there was no Clash.
- Priya pocketed the velvet roll of rings.

On the way out, everyone shifted with their last Wild. Priya's prize dropped when she shifted ("If you shift, it drops at your feet: picking it up takes an action at an obstacle or in a Clash, but between obstacles it’s free"). She picked it up for free and carried it as an owl ("You can carry one small thing in your jaws, beak or claws").

**Escape, across the playing field** (group; Open, Dark; Sneak 2, Move 2). Scent 1, so it isn't On the Trail.

- Priya, owl Move 4 +1 Open +1 Silent Wings = 6 dice against 2. Roll 42: 1 hit, a Partial. She's past, and Partials cost no Scent in the Escape.
- Maya, jaguar Sneak, 6 dice against 1. Roll 43: a Success.
- Nadia, python Move, 5 dice against 2. Roll 44: a Critical (the Edge goes unused).

**Result: Win** at Scent 1 of 7.

**After the Mission.**

- The Hunt track stays 0.
- Everyone reaches 2 Growth and will choose an advance before the next mission ("When you reach 2, 4 and 6 Growth, choose one"). This wasn't played.
- The team spent all 12 Wild.

Estimated real time: 45 to 60 minutes of play, plus about 35 minutes for the Storyteller to build the mission beforehand.

## 4. What worked

- **The core roll is fast and hard to get wrong.** Count the 5s and 6s, compare, and "the result comes first, then its cost". After the practice rolls, nobody misread a result all night.
- **Point and group obstacles feel different, and the Scent accounting is clean.** "Rises once, when the obstacle ends" for group obstacles, and "Scent +1" for each Partial at a point obstacle, were applied without argument. The round card covers every step in order.
- **The Cap is well taught.** The Jonah example in Chapter 3 ("so Theo keeps his Wild") settled the Storyteller's own Edge mistake at once. It also made the players see that a Strength plus a perk leaves room for only one Help.
- **Forms are a real decision.** "In animal form you can’t help with Wits" made two players turn back into kids mid-obstacle at the office door so they could Help. The Crowd Weakness sent the jaguar and the python into human form at the fair. Chapter 4's "Human or Animal?" section plays out at the table exactly as written.
- **Scarce Wild has a safety valve.** Shifting by taking 1 Hurt when out of Wild was clear and got used.
- **The prize rules worked the first time.** It drops when you shift, is picked up for free between obstacles, and can be carried in a beak.
- **Chapter 1's example of play matches Chapter 13.** The same obstacle, Difficulties and characters appear in both. Players who read Chapter 1 recognise the shop floor at once.
- **The ready-made Bonded fit together well**, and Chapter 2's random rolls gave a playable, distinct character (python, Track Star) in a few minutes of rolling.
- **The Chapter 12 checklist and tag table are easy to follow.** The Ideas table gave a fun premise in two rolls, and the "Strong here / Weak here" table made it easy to give every frame a moment.
- **Chapter 3's advice to spend Wild works.** The table took it to heart and spent 22 of 24 Wild over the two missions.

## 5. How it felt

- **Losing was never a real risk.**
  - Scent peaked at 3 of 7 (Pemberton's) and 1 of 7 (the Fair).
  - No threat ever dealt Harm; the only Hurt all night was Priya paying for a shift.
  - The one tense moment was Priya's double Fail on the shop floor (roll 15, roll 17), which woke the watchman. The Clash then ended in its first round on a Critical Strike.
  - The dice ran hot: 9 Criticals in 34 mission rolls. But the main reason is pool size. Almost every roll was 5 or 6 dice, because a Strength plus a perk reaches the +2 Cap. At group obstacles a Partial gets you past, so only the Fail chance matters, and with 5 or 6 dice that is 9 to 13%.
  - Pemberton's is meant to be Easy, so this is fine for a first night. The Fair, built as Standard from the Old Mill, also played Easy. One game each is not a sample, though; a test at 5 players, or with less well-matched Bonded, would tell more.
- **Wild was spent.** The team spent 10 of 12 Wild at Pemberton's and all 12 at the Fair, mostly on Pushes and Helps at point obstacles, plus a last shift into animal form before the Escape.
- **Dominant tactics.** None broke the game, but together they meant the team never faced a hard choice:
  1. **A human with Wits 3 and Brainiac, plus one Help, beats every lock.** That is 5 dice against Difficulty 2 at the office door, the cages and the strongbox. Every Part Three objective except the Gala offers Wits 2, so Priya in human form is the answer to almost every objective.
  2. **Pushing Partials at point obstacles** is the cheapest way to control Scent (roll 21, roll 38, roll 41).
  3. **The last shift of the night is free.** Unspent Wild is lost and "All Hurt clears between missions", so it costs nothing real, whether paid in Wild or in Hurt.
  4. **The jaguar in the dark** rolls 6 dice against Difficulty 1 on every Dark Sneak (roll 10, roll 14, roll 25, roll 43). She never came close to failing.
- **Time at a real table.**
  - Setup: about 15 minutes before the players arrive and 25 to 30 at the table (one new character).
  - Pemberton's Pets: 60 to 70 minutes with newcomers.
  - The Fair: 45 to 60 minutes, plus 35 minutes of building beforehand.
  - So a first night of setup plus Pemberton's runs about an hour and a half, well under the book's "two or three hours" per mission (issue 2.14). The table could have played a second mission in the same evening.
