# Playtest round 2, Test A: verification and a fresh first night

- Date: 2026-10-30. Book: Second Nature v0.1, the HTML chapters in `book/src/chapters/` read in order, and `book/dist/Second_Nature_v0.1.pdf` for the maps and sheets. The PDF was built at 19:50:54, after the last chapter edit (19:50:48), and its text matches the HTML. Nothing else was read except the two round-1 reports, for part 1.
- Table: a Storyteller who has read the book once, and three new players: Dev, Elif and Finn.
- Dice: every roll is in `book/playtests/round2-a-dice.md` (63 rolls); "roll N" below means line N of that log. The log was started afresh after the machine restart, so roll 1 is the first roll of this session.
- Played: setup by Chapter 9 (Finn made a new character with Chapter 2), The Zoo After Dark (Chapter 14), then a mission built with Chapter 12, "The Deep End", played the same way.

## 1. Verdict

CLEAN: no blocker and no invented core-flow ruling in setup, two missions and a 4-round Huntsman Clash; two confusing gaps remain (Chapter 12's labels don't cover every mission, and "you’re past the obstacle" after Down at a point obstacle), and the Hunt was again never Up, so Taken, Netted, Withdraw and the prize went untested.

## 2. Verification table (part 1)

Statuses: **fixed** (the problem is gone), **partly fixed** (some of it remains), **not changed**, **changed differently** (resolved, but not the way round 1 suggested or ruled).

### 2.1 Round 1, Test A (`round1-test-a.md`)

| # | Issue | Status | New passage |
|---|---|---|---|
| 2.1 | Ch19 called the between-obstacles shift "for free" | partly fixed | `42-ch19.html`: "Between obstacles, each may Shift or Patch Up once as a free action (it still costs Wild)." `14-ch04.html`: "everyone may Shift or Patch Up once without it using an action (it still costs the Wild; shifting back counts as a Shift)". Still unchanged in `15-ch05.html`: "Moving from one obstacle to the next is free, and on the way everyone may Shift or Patch Up once without using an action." That isn't wrong, but it still says nothing about Wild. |
| 2.2 | Chapter 12 couldn't settle a Limit or a label | fixed (new gap: issue 3.1) | `24-ch12.html`: "Count the obstacles the team will face: one way in, every obstacle inside, the objective, and each Escape obstacle." "The Limit for 3 players is the number of obstacles plus 2 for an Easy or Standard mission, or the number of obstacles for a Hard one. Use the same Limit for 4 and 5 players." I checked all five Part Three missions: 5+2=7, 6+2=8, 5+2=7, 6 and 7, all matching their 3-player Limits, as "Step 3 gives every mission in Part Three its Limit for 3 players" says. |
| 2.3 | Shifting before the way in; does the scout's shift use it up? | changed differently | `14-ch04.html`: "The gap between scouting and the way in counts as between obstacles." `15-ch05.html`: "it still costs Wild, but it doesn’t use up the scout’s free Shift before the way in." Round 1 suggested the opposite (the scout's shift uses it up). The question is settled. |
| 2.4 | Scouting had no stated tags | fixed (small new gap: issue 3.9) | `15-ch05.html`: "Scouting happens outside the place, so it has no tags: Strengths, Weaknesses and place perks don’t count, but a perk for Sense rolls does." |
| 2.5 | A Critical on Distract or Slip Away had no effect | fixed (wording clash: issue 3.6) | `16-ch06.html`: "A Critical on Distract or Slip Away works like a Success; Edges come only from obstacles." |
| 2.6 | Ch19's Slip Away contradicted Ch6 | fixed | `42-ch19.html`: "Slip Away (Move or Sneak; you’re out: past a group obstacle, waiting at a point one)". |
| 2.7 | End-of-mission bookkeeping scattered; Edges unstated | fixed | `15-ch05.html`: "When it’s over: unspent Wild and Edges are lost and Hurt clears. In a campaign, the result moves the Hunt track, everyone marks 1 Growth, and Exposed and Taken characters carry over (Chapter 8)." `13-ch03.html`: "Edges you haven’t spent are lost when the mission ends, like Wild." (Chapter 19 still says only "Unspent Wild is lost.") |
| 2.8 | No place on the sheets for progress or round counts | fixed | `46-sheet-mission.html`: "This obstacle: progress", "Round (Scent +1 from round 3 while anyone isn’t past)", "Clash round (ends after 4)". All three are in the PDF too. |
| 2.9 | First-night steps had no slot for a new character | fixed | `21-ch09.html`: "A player who’d rather make their own does it now, with Chapter 2’s steps; allow ten minutes." `12-ch02.html`: "Copy your frame’s animal ratings (Wits 0), its Strengths and Weaknesses, and your animal’s perk onto your sheet." |
| 2.10 | The practice roll had no dice count or Difficulty | changed differently | `21-ch09.html`: "Explain the roll with one practice roll each: three dice against Difficulty 2." (Round 1 suggested "best human rating".) It worked well (rolls 6 to 8). |
| 2.11 | The checklist left out scouting, "if the Hunt is Up" and results | fixed | `24-ch12.html`: "A scouting Difficulty (2 unless the place is unusually hard to watch).", "Who arrives if the Hunt is Up (a Master, and who brings them).", "After the Mission: what a Win, a Costly Win and a Loss each change in town." |
| 2.12 | Ideas table: one roll or two? | fixed | `24-ch12.html`: "Roll a d6 for each column, or pick." |
| 2.13 | Roll-offs didn't cover ties | fixed | `12-ch02.html`: "(roll again on a tie)"; the same words are in `21-ch09.html` and `41-ch18.html`. |
| 2.14 | "Two or three hours" looked long | partly fixed (issue 3.4) | `11-ch01.html`: "A mission takes one to two hours, a little more for a Hard one with a big group." But `21-ch09.html` (Pacing) still says: "A mission takes two to three hours." |

### 2.2 Round 1, drills (`round1-drills.md`)

| # | Issue | Status | New passage |
|---|---|---|---|
| 1 | A Down character stalls a group obstacle forever | fixed | `15-ch05.html`: "Down and Netted characters can’t roll: when everyone who can act is past, the obstacle is done, and the Down and Netted get up or are freed, or are Taken, as the scene ends (Chapter 7)." (Chapter 19 and round card step 2 weren't changed to match, but they don't contradict it.) |
| 2 | A wipe to track 6 had two "next missions" | fixed | `18-ch08.html`: "The Breakout comes first even if the Hunt track has just reached 6: the Last Hunt follows it." |
| 3 | Hunt Up between a guarded group Fail and its Clash | fixed | `15-ch05.html`: "Finish resolving the roll that did it as if the Hunt weren’t Up yet: if it finished the objective, it’s finished; if it was a Fail at a guarded obstacle, its Clash still starts." The timing now agrees: `42-ch19.html` "raises Scent once as it ends, or before a guarded Fail’s Clash"; round card step 4 "Group obstacle ending, or a guarded Fail’s Clash about to start?" |
| 4 | Clash Scent vs Down friends: which first? | fixed | `16-ch06.html`: "The Clash’s Scent rises first; then the scene ends. Down and Netted friends get back up if anyone is still standing (slipping away counts) and the Hunt isn’t Up (Chapter 7); so if that rise brings the Hunt Up, they’re Taken." |
| 5 | Everyone Taken after the objective: Costly Win or Loss? | partly fixed | `15-ch05.html`: Costly Win "someone (not everyone) is Taken"; Loss "or everyone was Taken, even after the objective was done." `42-ch19.html`: "Loss: not done, or everyone Taken." `31-ch13.html` Loss now reads "in their cages or rounded up again". The other four missions' Loss lines still describe a job that wasn't done, for example `32-ch14.html` "the truck leaves for Thornhill" and `35-ch17.html` "the cellar stays locked". |
| 6 | Can Patch Up bring a Down friend back? | fixed | `17-ch07.html`: "Patching Up a Down friend lowers their Hurt, but they stay Down until the scene ends." |
| 7 | "Nobody is left in it", and guards pulling back | fixed | `16-ch06.html`: "or when nobody who can act is left in it (everyone has slipped away or is Down, Netted or Taken), and then the guards are still there." and "If it ended because nobody was left, the guards are still on guard: at a group obstacle, those who slipped away are past; at a point obstacle, the next Fail there starts a new Clash with them." (Round 1's ruling went the other way; the book has now chosen.) |
| 8 | Ch19's between-obstacles shift "free" | fixed | `42-ch19.html`: "as a free action (it still costs Wild)". |
| 9 | Does the Hound Tracker stack, and apply in a Clash? | partly fixed (issue 3.7) | `22-ch10.html` Hound: "Sneak rolls at an obstacle a Hound guards, and in a Clash with a Hound, are at +1 Difficulty: +1 in all, however many Hounds there are." The Huntsman's Trophy is unchanged ("Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty."), and the round card still has "Tracker: Sneak +1 Difficulty where it guards". |
| 10 | Rescue deadline and the undefined extra objective | partly fixed (issue 3.11) | `18-ch08.html`: "the rescue can come on either of the next two missions, and after that it’s too late" and "one more point obstacle before the Escape: a locked cage, Force 3 or Wits 2, 3 progress, guarded or not." Still unsaid: what failing it does to the result. |
| 11 | Ch19 said Slip Away always gets you past | fixed | As 2.6 above. |
| 12 | The round-after-three Scent in the round the obstacle ends | changed differently (wording: issue 3.8) | `15-ch05.html`: "And from the third round on, if anyone still isn’t past at the end of a round, Scent rises by 1." The rise now starts at round 3 (it used to start at round 4), and the round in which the last character gets past no longer counts. Round 1's ruling was that it counts. The Scent list now includes it. |
| 13 | Prize hand-over between obstacles; a prize left lying at the end | fixed | `15-ch05.html`: "Handing it to a friend at the same obstacle takes your action, with no roll; between obstacles it’s free." and "So is a prize nobody is carrying when the last Escape obstacle is behind you." |
| 14 | Withdraw "at any time" | fixed (leftover: issue 3.5) | `15-ch05.html`: "The team may Withdraw at any time outside a Clash ... (In a Clash, Slip Away or see it through first.) Withdrawing before the way in just means going home: a Loss, with no Escape to cross." |
| 15 | Shaggy Coat vs the Hurt paid to shift | fixed | `14-ch04.html`: "You pay it as a kid, before you change, so animal perks don’t reduce it." |
| 16 | What a scene is when a Clash interrupts a point obstacle | fixed | `15-ch05.html`: "Scouting is a scene too, and when a Clash breaks out at an obstacle, the rest of the obstacle after it is a new scene." |
| 17 | The Zoo crates' nets | fixed | `32-ch14.html`: "If anyone Fails while the Trappers are there, it’s a Clash, and in it their nets come out." `22-ch10.html`: "When you Fail against a Trapper in a Clash ... The Fail that starts a Clash doesn’t net you." |
| 18 | Small campaign gaps | fixed | `18-ch08.html`: "A Taken character marks Growth after the mission like everyone else."; "A second human perk (a different one)."; "The new characters start with the old team’s lowest Growth."; "Win it, or win it at a cost". `24-ch12.html` now has Hard criteria and a Hard Limit. |
| 19 | What can a character who is past, or who slipped away, do? | partly fixed | `15-ch05.html`: "Those already past can still Help, Patch Up and free a Netted friend." Nothing says what someone who slipped away from a Clash may do, apart from `16-ch06.html` counting them as standing "(slipping away counts)". |

### 2.3 Summary

Of the 33 round-1 issues:

- **24 fixed.**
- **3 changed differently**, all resolved: Test A 2.3 and 2.10, drills 12.
- **6 partly fixed:** Test A 2.1 and 2.14, drills 5, 9, 10 and 19.
- **None not changed.**

The new wording opened a handful of small contradictions, which are listed with the play issues below (3.4 to 3.9 and 3.11).

## 3. New issues

Most severe first. No blockers: two are confusing and ten are minor. Issues 3.1, 3.2, 3.3, 3.10 and 3.12 came up in play or building; the rest came from reading the fixes against the other chapters, Chapter 19 and the sheets.

### 3.1 Chapter 12's three labels don't cover every mission (confusing)

- **Where:** `24-ch12.html`: "Choose the label from the obstacles. Easy: Difficulty 2 nearly everywhere, at most one guarded obstacle, no Huntsman. Standard: a Difficulty 3 or two, two guarded obstacles, one Escape obstacle. Hard: two Escape obstacles, and guards that bite: a Huntsman, three Hounds together, or three guarded obstacles." Then: "The Limit for 3 players is the number of obstacles plus 2 for an Easy or Standard mission, or the number of obstacles for a Hard one."
- **What happened:** my first draft of The Deep End guarded only the objective, with Mr Rook (a Huntsman), and had one Escape obstacle. That isn't Easy (it has a Huntsman), isn't Standard (only one guarded obstacle) and isn't Hard (only one Escape). I added the Beater and Hound at the pool hall, partly to make it fit Standard. Other common shapes don't fit either:
  - two Escape obstacles with gentle guards (Hard needs both);
  - three guarded obstacles with one Escape;
  - one guarded obstacle with several Difficulty 3s.

  The label moves the Limit by 2, so a wrong guess matters. Part Three only works out because the Old Mill (a Huntsman, one Escape) is called Standard. The text never says that "one Escape" outranks "a Huntsman".
- **Suggested fix:** make it an order of checks. For example: "Two Escape obstacles and guards that bite: Hard. Otherwise, a Huntsman, any Difficulty 3s, or two or more guarded obstacles: Standard. Otherwise: Easy."
- **Ruling tonight:** not needed for the final design, which is plainly Standard. For the first draft I'd have ruled "a Huntsman is never Easy", so Standard.

### 3.2 "You’re past the obstacle" after Down, at a point obstacle that still needs progress (confusing)

- **Where:** `17-ch07.html`: "When the scene ends, if a friend is still standing and the Hunt isn’t Up, you get back up with 2 Hurt and you’re past the obstacle: your friends carried you." Against `15-ch05.html`: "Progress adds up until the obstacle is cleared, then everyone goes through." and "you keep the progress you’ve made and carry on rolling, without the guards".
- **What happened:** Jonah went Down in the Clash at the Deep End's cage (roll 58). The Clash ended after round 4 with the cage at 2 of 3. He got back up "past the obstacle", but nobody was past anything: the cage still needed a roll. The table asked whether Jonah, being "past", could still roll Force or Help with the last progress. Slip Away was carefully fixed for exactly this point-versus-group difference ("past a group obstacle, waiting at a point one"), but Down wasn't. Chapter 19's version drops "past" entirely.
- **Suggested fix:** "you get back up with 2 Hurt and carry on with the team (at a group obstacle, you’re past it)".
- **Ruling tonight:** Jonah is up and with the team, and may roll or Help in the rest of the obstacle. It didn't change anything, as Ollie rolled the last progress (roll 60).

### 3.3 Can a threat nobody rolled against hit a Down character? (minor)

- **Where:** `16-ch06.html`: "At the end of each round, each threat that nobody rolled against deals its Harm to one character in the Clash, chosen by the Storyteller." `21-ch09.html`: "Pick whoever the threat would really go for, such as the one who just hit it or the one closest to it".
- **What happened:** in round 4 against Mr Rook, Jonah was Down and the two kids (2 dice each against Difficulty 3) had no way to touch him. If nobody rolls, Rook's Harm 2 goes to "one character in the Clash". The one who "just hit it" was Jonah, who was Down. If a Down character can be chosen, the hit is wasted, and leaving a threat alone costs nothing whenever a friend is Down.
- **Suggested fix:** "to one character in the Clash who can still act".
- **Ruling tonight:** only standing characters can be chosen. Rook hit Sam for 2.

### 3.4 Chapter 9 still says a mission takes two to three hours (minor)

- **Where:** `21-ch09.html` (Pacing): "A mission takes two to three hours." Against `11-ch01.html`: "A mission takes one to two hours, a little more for a Hard one with a big group." In the same chapter, "At the Table (about 15 minutes)" includes "allow ten minutes" for a new character, which leaves five minutes for everything else.
- **What happened:** the Zoo took about 65 to 75 minutes and the Deep End about 55 to 65 (section 5), so Chapter 1 is right. Setup at the table took about 25 minutes with one new character.
- **Suggested fix:** "A mission takes one to two hours." And "At the Table (about 15 minutes, 25 if someone makes a character)".
- **Ruling tonight:** none needed.

### 3.5 Chapter 7 says "You can always Withdraw" (minor)

- **Where:** `17-ch07.html`: "You can always Withdraw: abandon the objective and head straight for the Escape (Chapter 5)." Against `15-ch05.html`: "The team may Withdraw at any time outside a Clash".
- **What happened:** didn't come up. A player reading Chapter 7 in the middle of the Huntsman Clash would think they could Withdraw out of it.
- **Suggested fix:** "You can Withdraw at any time outside a Clash".
- **Ruling tonight:** Chapter 5.

### 3.6 Chapter 6 says "Edges come only from obstacles" (minor)

- **Where:** `16-ch06.html`: "A Critical on Distract or Slip Away works like a Success; Edges come only from obstacles." Against `13-ch03.html`: "You gain Edges from a Critical when the extra progress isn’t needed (Chapter 5), from a good scouting roll (Chapter 5), and from the Team Captain perk." Scouting isn't an obstacle ("Scouting is a scene too"), and the team got 2 Edges from it tonight (roll 41).
- **Suggested fix:** "Clash rolls never gain Edges."
- **Ruling tonight:** Chapter 3.

### 3.7 The round card doesn't match the new Hound Tracker, and the Huntsman's Trophy wasn't updated with it (minor)

- **Where:** `47-sheet-round.html`: "Tracker: Sneak +1 Difficulty where it guards" and "Trophy: Sneak +1 Difficulty where it guards". `22-ch10.html` Hound: "and in a Clash with a Hound, are at +1 Difficulty: +1 in all, however many Hounds there are." Huntsman: "Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty."
- **What happened:** at the pool hall (roll 48) the round card was enough. A table using only the card won't know the Tracker follows the Hounds into a Clash. Neither text says whether a Trophy and a Tracker at the same obstacle add up to +2.
- **Suggested fix:** copy the Chapter 10 Hound wording onto the card. For the Huntsman, say whether the Trophy works in a Clash and whether it stacks with a Tracker.
- **Ruling tonight:** Chapter 10. A Trophy and a Tracker together would be +2 (they're different threats). Not tested.

### 3.8 Chapter 5's Scent list words the round-3 rise more loosely than its rule (minor)

- **Where:** `15-ch05.html` Scent box: "once when a group obstacle ends (and every round it runs from the third on)". Against the same chapter's Results: "from the third round on, if anyone still isn’t past at the end of a round, Scent rises by 1." The round in which the last character gets past is a round the obstacle "runs", but at its end everyone is past.
- **Suggested fix:** "(and at the end of every round from the third on in which anyone still isn’t past)".
- **Ruling tonight:** the Results wording. It didn't come up (no group obstacle went past round 2).

### 3.9 Scouting: "place perks" isn't defined, and Keen Eyes reads as a Sense perk (minor)

- **Where:** `15-ch05.html`: "Strengths, Weaknesses and place perks don’t count, but a perk for Sense rolls does." `12-ch02.html` Peregrine Falcon: "In Open or High places, your Sense rolls are at −1 Difficulty."
- **What happened:** Ollie's Good Dog ("In Crowds") was clearly out, and Finn didn't ask. But Keen Eyes is literally a perk for Sense rolls, and a falcon player would ask.
- **Suggested fix:** "place perks (any perk that needs a tag, such as Keen Eyes or Night Owl) don’t count".
- **Ruling tonight:** a perk that needs a tag doesn't work, because scouting has no tags.

### 3.10 After a Fail starts a Clash at a group obstacle, the rest of that round's rolls barely matter (minor)

- **Where:** `15-ch05.html`: "When a Fail starts it at a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then (+1 for any Partial or Fail); then the whole team is in the Clash, including anyone already past."
- **What happened:** at the Zoo's Hound patrol, Jonah Failed and Pushed into another Fail (rolls 19 and 20). Ollie and Sam still had to roll (rolls 21 and 22), but every way a Clash can end leaves the team past the patrol, and the +1 was already certain. The only thing at stake was an Edge from a Critical. Elif asked "why am I rolling?"
- **Suggested fix:** say why it matters ("a Critical still gains an Edge"), or let the others skip their roll once a Clash is certain.
- **Ruling tonight:** they rolled, as written.

### 3.11 The added rescue obstacle and the new Limit count (minor)

- **Where:** `18-ch08.html`: "a Storyteller can add the rescue to another mission as one more point obstacle before the Escape: a locked cage, Force 3 or Wits 2, 3 progress, guarded or not." `24-ch12.html`: "Count the obstacles the team will face: one way in, every obstacle inside, the objective, and each Escape obstacle."
- **What happened:** didn't come up. But with Chapter 12's new count, a Storyteller adding the cage will ask whether the Limit goes up by 1, and whether failing (or skipping) the rescue changes Win, Costly Win or Loss.
- **Suggested fix:** "Add 1 to the mission’s Limit. The rescue doesn’t change the mission’s result; a friend not freed stays Taken."
- **Ruling tonight:** not needed.

### 3.12 Chapter 12's "per-size Limit" sentence points the other way from the rule after it (minor)

- **Where:** `24-ch12.html`: "Group obstacles are harder with more players, point obstacles easier; that’s what the per-size Limit is for." Then: "Use the same Limit for 4 and 5 players." and "If bigger groups find it easy, take 1 off their Limit only." Part Three's Easy mission runs 7/6/5.
- **What happened:** when building, I didn't know whether a mission heavy in group obstacles (like the Deep End, with three) should get a higher 5-player Limit, as the first sentence suggests. The rule says no.
- **Suggested fix:** "Start with the same Limit for every size; playtesting may move the 4- and 5-player Limits (more group obstacles: bigger groups need more; more point obstacles: less)."
- **Ruling tonight:** 7/7/7, as the rule says.

## 4. Play log

### 4.1 Setup (Chapter 9)

**Before everyone arrives** (about 15 minutes, as `21-ch09.html` says):

- Printed Jonah's and Sam's pages (Chapter 18), one blank character sheet, the mission tracker, the round card and the At the Table page.
- Chapter 9 says "Read Pemberton’s Pets (Chapter 13), the Easy mission". This test plays the Zoo instead, so I read Chapter 14 and noted "Scent Limit: 8 with 3 players". On the Trail is at 4.

**At the table:**

1. **Talk about the feel** (2 minutes). The table chose "creepy-and-cold", and nothing was taken out.
2. **Hand out characters.** Dev and Elif both wanted Jonah, the bison. Chapter 9: "the higher roll chooses first (roll again on a tie)". Roll 1 (Dev) was 3 and roll 2 (Elif) was 1, so Dev took Jonah Mensah and Elif took Sam Lindqvist, the brown rat.
3. **Finn made a character** with Chapter 2's steps (about 10 minutes, as "allow ten minutes" says):
   - Frame, roll 3: 2, Canines. Animal, roll 4: 4, "3–4 the second", so the Shepherd Dog (Good Dog: "In Crowds, your Sneak and Sense rolls are at −1 Difficulty").
   - Human ratings, by choice ("Put 3, 2, 2, 1 and 1"): Sneak 1, Force 1, Move 2, Sense 2, Wits 3.
   - Human perk, roll 5: [1, 5], so list A, row 5: Brainiac ("(human form): +1 die on Wits rolls").
   - Mark: a brown patch over his left eye; as a dog, a dark patch over the left eye. Name: Ollie Grant, 12. He loves the bandstand in the park.
   - The new step "Copy your frame’s animal ratings (Wits 0), its Strengths and Weaknesses, and your animal’s perk onto your sheet" meant Finn didn't have to ask what goes in the animal row: Sneak 3, Force 3, Move 3, Sense 4; Strengths Open, Crowd; Weakness High.
4. **Practice rolls**, "three dice against Difficulty 2": roll 6 (Dev) a Fail, roll 7 (Elif) a Success, roll 8 (Finn) a Partial. One of each, which taught the whole result ladder in a minute.
5. **Wild:** "Give everyone 4 Wild (5 for a Gamer)". Jonah 4, Sam 5, Ollie 4. Nobody is a Team Captain, so Edges start at 0.
6. **Read the brief and show the map** ("Show them the map and the two ways in"). The Zoo map in the PDF matches the table: A on the fence by the car park, B the culvert off the river path, 1 the aviary walkway, 2 the staff gate, 3 the lawns, ★ the loading dock, E the moat.

Setup came to about 25 minutes at the table. Nobody asked a rules question that the book didn't answer at once.

### 4.2 The Zoo After Dark (Chapter 14)

Limit 8 (3 players). On the Trail at 4 ("Scent is at least half the Limit (round up)").

| Moment | Scent | Edges | Wild (Jonah / Sam / Ollie) | Hurt (J / S / O) | Forms |
|---|---|---|---|---|---|
| Start | 0 | 0 | 4 / 5 / 4 | 0 / 0 / 0 | kid / kid / kid |
| After scouting (roll 9) and the gap | 0 | 1 | 3 / 3 / 3 | 0 / 0 / 0 | bison / rat / dog |
| After the fence (rolls 10 to 13) | 1 | 1 | 3 / 3 / 2 | 0 / 0 / 0 | bison / rat / dog |
| After Find the Trappers (14, 15) | 1 | 1 | 2 / 2 / 2 | 0 / 0 / 0 | bison / rat / dog |
| After the night keeper (16 to 18) | 2 | 0 | 2 / 2 / 2 | 0 / 0 / 0 | bison / rat / kid |
| After the Hound patrol and its Clash (19 to 29) | 4 | 0 | 1 / 1 / 1 | 0 / 1 / 1 | bison / rat / dog |
| After the crates (30 to 33) | 5 | 0 | 0 / 1 / 1 | 0 / 1 / 1 | bison / rat / kid |
| End of the Escape (34 to 37) | 6 | 0 | 0 / 0 / 0 | 0 / 1 / 1 | bison / rat / kid |

**Scouting (roll 9).** Ollie shifted to scout (Wild 3). `15-ch05.html`: "Shifting to scout is out of sight ... it still costs Wild, but it doesn’t use up the scout’s free Shift before the way in." Scouting has no tags, so dog Sense 4. Sam Helped as a kid (Wild 4): "Friends may Help." That made 5 dice against 2, for 2 hits: a Success, "the team picks the way in and gains an Edge". Edges 1.

**The choice of way in.** At a group obstacle any hit gets you past ("each gets past on their own Partial or better"). So the table compared dice counts, not Difficulties:

- **The fence** (Open, High) gives the bison 4 dice and the dog 4 dice (at +1 Difficulty for High), and isn't dangerous.
- **The culvert** (Water, Narrow, Dark) gives the rat 5 dice but the bison only 3, and "a Fail deals 1 Hurt".

They chose A, the fence. In the gap ("The gap between scouting and the way in counts as between obstacles"), Jonah shifted to bison and Sam to rat, 1 Wild each (Jonah 3, Sam 3). Ollie, already a dog, kept his free shift unused.

**Way in A, the perimeter fence** (group; Open, High; Sneak 3, Move 2). `15-ch05.html`: "Roll one at a time, in any order; each player decides on a Push before the next one rolls."

- **Jonah:** bison Move 3, +1 for Open ("if any of your frame’s Strengths is among the place’s tags, you get +1 die"), so 4 dice against 2. Roll 10: two 6s, a Critical: "If the extra isn’t needed (always so at a group obstacle), the team gains an Edge instead." Edges 2.
- **Ollie:** dog Move 3 +1 Open, so 4 dice. "If any of its Weaknesses is, the roll is at +1 Difficulty" makes it 3 for High ("If a place has both a Strength and a Weakness of yours, both apply."). Roll 11 was a Fail, and Finn Pushed before Sam rolled (Wild 2). Roll 12: two hits against 3, a Partial, so he's past. It had two 6s, but "Critical: a Success with two or more 6s".
- **Sam:** rat Sneak 4 against 3 +1 (Open is a Critter Weakness), so Difficulty 4. With Edges at the cap of 2, the team spent one on him (Edges 1), for 5 dice. Roll 13 was a Partial, so he's past.
- All past in round 1. "At a group obstacle, Scent rises once, when the obstacle ends: +1 if anyone got a Partial or a Fail." Scent 1.

**Inside 1, Find the Trappers** (point, 2 progress; High, Open, Dark; Sense 2). The dog has Open +1 die but High +1 Difficulty. The bison has Open and no matching Weakness, so Jonah rolled: Sense 3 +1 Open +1 Help (Sam, Wild 2) = 5 dice against 2, which is the Cap ("at most +2 dice"). Roll 14 was a Partial ("as a Success, but Scent +1"). Dev Pushed (Wild 2). Roll 15: three hits with two 6s, a Critical, "as a Success, plus 1 extra progress". That made 2 of 2, with no Scent.

**Inside 2, the night keeper** (group; no tags; Sneak 3, Wits 2). "An animal can’t talk, so it’s Sneak or nothing for them."

- Ollie used his free gap shift to turn back into a kid ("shifting back counts as a Shift"). Jonah stayed a bison: his pass chance (2 dice either way) was the same as a kid's, and the patrol was next.
- **Ollie:** Wits 3 +1 Brainiac = 4 dice against 2. Roll 16 was a Success.
- **Sam:** rat Sneak 4 against 3. Roll 17 was a Partial, so he's past. Elif didn't Push, since Jonah's weak Sneak made the obstacle's +1 almost certain anyway.
- **Jonah:** bison Sneak 2 +1 Edge (Edges 0) = 3 dice against 3. Roll 18 was a Partial, so he's past.
- All past in round 1. Scent 2.

**Inside 3, the Hound patrol** (group; Open, Dark; Sneak 2, Move 2, Sense 3; 2 Hounds). Chapter 6 says "Shift before the fight, not during it", so Ollie shifted to dog in the gap (Wild 1). The Tracker ("Sneak rolls at an obstacle a Hound guards ... are at +1 Difficulty") made everyone choose Move.

- **Jonah:** bison Move 4 dice against 2. Roll 19 was a Fail. Dev Pushed (Wild 1), and roll 20 was still a Fail. "A Fail at a guarded obstacle starts a Clash".
- `15-ch05.html`: "finish the round’s rolls first, and the obstacle raises Scent for them then". Ollie rolled 4 dice for roll 21, a Success, and Sam rolled 3 dice against 3 for roll 22, a Partial. Both are past, but "the whole team is in the Clash, including anyone already past" (issue 3.10). The obstacle's +1 made Scent 3.

**Clash with 2 Hounds** (Difficulty 2, Toughness 3, Harm 1, from `22-ch10.html`). The patrol's Open and Dark tags still apply, as in Chapter 6's lawn example. The Tracker would apply to Sneak "in a Clash with a Hound", but nobody Sneaked.

- **Round 1:**
  - Sam Distracted Hound A: rat Move 3 dice against 3 (Open Weakness). Roll 23 was a Partial: "Against a threat, a Partial does the job, but the threat’s Harm hits you." Sam is on Hurt 1.
  - Jonah Struck A: Force 4 +1 Open +1 Football Player = 6 dice against 1 (Distracted). Roll 24 was a Critical: "Critical: 2 harm". A is on 2 of 3.
  - Ollie Struck B: Force 3 +1 Open = 4 dice against 2. Roll 25 was a Partial: 1 harm, and Ollie is on Hurt 1.
  - Both Hounds were rolled against, so neither bit at the end of the round.
- **Round 2:**
  - Sam Distracted A again. Roll 26 was a Partial: it works, and Sam is on Hurt 2, one box from Down and from being Stuck as a rat.
  - Jonah Struck A: 6 dice against 1. Roll 27 was a Success, and A is out.
  - Ollie Struck B. Roll 28 was a Success: B is on 2 of 3.
- **Round 3:**
  - Sam, on Hurt 2, used his action to Patch Up himself ("Shift, Patch Up, or free a Netted friend (no roll)"), going to Wild 1 and Hurt 1.
  - Jonah Struck B: 6 dice against 2. Roll 29 was a Success, and B is out.
- "A Clash ends when every threat is out". "When a Clash ends, Scent rises once: +1" (no round 4, nobody Down, no shift during it). Scent 4, so the Escape will be On the Trail. "If the Clash started at a guarded obstacle, beating the guards ... clears it."

**Objective, the crates** (point, 3 progress; Locked; Force 3, Wits 2; 2 Trappers, "Beating the guards doesn’t clear it"). Ollie used his gap shift to become a kid again (free). Nobody else could Help him: "in animal form you can’t help with Wits".

- **Round 1:** Ollie Wits 3 +1 Brainiac = 4 dice against 2. Roll 30 was a Success: 1 of 3.
- **Round 2:** Jonah Force 4 +1 Locked +1 Football Player = 6 dice against 3, which is the Cap. Roll 31 was a Partial, and Dev Pushed his last Wild (Wild 0). Roll 32 was still a Partial: 2 of 3, Scent 5.
- **Round 3:** Ollie again with 4 dice. Roll 33 was a Success: 3 of 3, and the snow leopards bound into the dark. No Fail, so the Trappers never came at anyone, and the Net went untested.

**Escape, across the moat** (group; Water, Open; Sneak 2, Move 2). "On the Trail: if, when an Escape obstacle begins, Scent is at least half the Limit (round up), that Escape obstacle is at +1 Difficulty for every approach." Scent 5 is at least 4, so every approach is +1. Nobody shifted. Ollie stayed a kid, keeping his Wild.

- **Round 1:**
  - Jonah: bison Move 3 +1 Open = 4 dice against 3. Roll 34 was a Fail, with no Wild to Push, so he isn't past.
  - Sam: rat Sneak 4 against 2 +1 Trail +1 Open = 4. Roll 35 was a Partial, so he's past ("In the Escape, Partials cost no Scent").
  - Ollie: kid Move 2 +1 Help (Sam, Wild 0) = 3 dice against 3. Roll 36 was a Partial, so he's past.
- **Round 2:** Jonah got 4 dice +1 Help = 5 dice against 3. Roll 37 was a Partial, so he's past. The Help was Ollie's ("Those already past can still Help"; Ollie's Wild 0); see the slip below.
- The Escape ends: Scent +1 for round 1's Fail ("Only Fails count"), so Scent 6.

**Result: Win** ("The objective is done and nobody is Taken.") at Scent 6 of 8.

**After the Mission** (`32-ch14.html`): "the snow leopards are back in their enclosure by morning, and the truck leaves empty. Dr Hale starts checking who’s been visiting the zoo."

- Hunt track stays at 0 ("After a Win, it doesn’t move").
- Everyone marks 1 Growth.
- Nobody is Exposed: every shift was between obstacles ("Between obstacles you can always find cover") and nobody shifted in the Clash.
- Hurt clears.
- All 13 Wild were spent: 4 shifts, 4 Pushes, 4 Helps and 1 Patch Up.

**Table slip (mine).** I tracked Sam's Wild one too high from the scouting Help on (I forgot the Help when he shifted), and noticed only when re-checking the log after the second mission. The table above is corrected. The one roll it touches is roll 37: Sam had no Wild left by then, so the Help on that roll is Ollie's, who had exactly 1. The dice count (5) and the result are unchanged.

Estimated real time: 65 to 75 minutes with newcomers, of which about 5 minutes went on rules lookups (the "both apply" Strength-and-Weakness rule at the fence, and the guarded-group order at the patrol). Both were found at once.

### 4.3 The Chapter 12 mission: The Deep End

#### Building it (about 25 minutes)

**Idea** (`24-ch12.html`, "Roll a d6 for each column, or pick"): roll 38 gave 2, "stealing a Bonded kid’s family pet to lure them out", and roll 39 gave 1, "the swimming baths after closing". After the Zoo, Dr Hale's questions have led the Hunt to the Lindqvists' house. Mr Rook has taken Pickle, Sam's family cat, and caged her in the plant room of Wrenfield Swimming Baths, as bait. The job is to **free** her.

**Checklist** ("Every Mission Has"):

- **A brief.** Read aloud: "The Wrenfield Otters' late training is finishing and parents are crowding the foyer with car keys. Somewhere behind the pool, a cat is yowling. Sam's mum put up a poster this morning: PICKLE, GINGER, VERY FRIENDLY. The poster was gone by lunchtime. Tonight someone sent you a photo of the plant-room door, and the man beside it is wearing a gold ring." What's going on: Mr Rook (Huntsman, Hawkseye Ring) waits by the cage. A night attendant (Beater) and a Hound walk the poolside. Rook doesn't want the cat; he wants whoever comes for it.
- **A map that matches.** A, the foyer, on the street side. B, the outflow drain, from the river into the plant-room sump. Both lead to 1, the pool hall. Then 2, up the diving tower and along the roof girders. Then ★, the plant room. E is the staff car park behind it.
- **Two ways in with different tags and approaches.** A: Crowd, Sneak 3 / Wits 2. B: Water, Narrow, Dark, Sneak 2 / Move 2, dangerous.
- **Two to four obstacles inside, then the objective.** Two, then the objective.
- **One or two Escape obstacles, each with at least two approaches.** One: Sneak 2 / Move 2.
- **For every obstacle, everything listed; threat stats from Chapter 10.** See the table below.
- **A Limit for 3, 4 and 5 players, and a label.** Step 1, the count ("one way in, every obstacle inside, the objective, and each Escape obstacle"): 1 + 2 + 1 + 1 = 5. Step 2, the label: Difficulty 3s (yes), two guarded obstacles (yes), one Escape (yes), so Standard (see issue 3.1 for the first draft). Step 3: 5 + 2 = 7, "Use the same Limit for 4 and 5 players" (issue 3.12). This took two minutes, against round 1's half hour of hunting for a "most similar" mission.
- **A scouting Difficulty.** 2.
- **Who arrives if the Hunt is Up.** Lady Vane's grey car pulls into the car park, the pool's underwater lights snap on, and Mr Rook steps into the plant-room doorway.
- **After the Mission.**
  - Win: Pickle is curled on Sam's bed by midnight, but Mr Rook now knows which house the rat lives in.
  - Costly Win: Pickle's home, but a friend is in the boot of Lady Vane's car.
  - Loss: Pickle goes up to the Lodge as bait, and the next brief writes itself.
- **At least one moment for human form.** The foyer (Wits 2, and a bison is no good in a crowd) and the cage (Wits 2).

Difficulty and kind follow Chapter 12: "2: the normal Difficulty", "3: hard, the approach that works but isn’t the obvious one"; "If one person could deal with it for everyone ... make it a point obstacle"; "Guard one or two obstacles per mission"; "A dangerous obstacle (a fast river, a high beam) deals 1 Hurt on a Fail".

| Where | Obstacle | Tags | Approaches (Difficulty) | Kind · Progress | Notes |
|---|---|---|---|---|---|
| Way in A | The foyer | Crowd | Sneak 3 · Wits 2 | Group | Parents and swimmers leaving. |
| Way in B | The outflow drain | Water, Narrow, Dark | Sneak 2 · Move 2 | Group | Dangerous: a Fail deals 1 Hurt. |
| Inside 1 | The pool hall | Water, Open | Sneak 2 · Move 2 · Sense 3 | Group | Guarded by a Beater and a Hound. Beating them clears it. |
| Inside 2 | The girders | High, Narrow | Move 2 · Sense 3 | Point · 2 | Dangerous: a Fail deals 1 Hurt (a fall onto the tiles). |
| Objective | Pickle's cage in the plant room | Locked, Dark | Force 3 · Wits 2 | Point · 3 | Guarded by a Huntsman (Mr Rook). Beating the guards doesn't clear it. |
| Escape | The staff car park | Open, Dark | Sneak 2 · Move 2 | Group | — |

Scent Limit: 7 with 3 players, 7 with 4, 7 with 5. Label: Standard. Scouting: Sense, Difficulty 2. Threats: Beater (2 / 2 / 1), Hound (2 / 3 / 1, Tracker), Huntsman (3 / 4 / 2, Trophy).

**Tag check** ("try to use every tag at least once, and don’t let one tag take over"): Crowd (A), Water (B, 1), Narrow (B, 2), Dark (B, ★, E), Open (1, E), High (2), Locked (★). For this team (Chapter 9, "Look at the team’s frames before a mission"):

- the dog gets the foyer (Crowd) and the poolside (Open);
- the rat gets the drain and the girders (Narrow);
- the bison gets the poolside and the cage (Open, Locked);
- the foyer's Crowd keeps the bison human.

#### Playing it

Between missions: Wild back to 4 / 5 / 4, Hurt cleared, Edges 0, Growth 1 each. Scent starts at 0, since nobody was Exposed. Limit 7; On the Trail at 4.

| Moment | Scent | Edges | Wild (Jonah / Sam / Ollie) | Hurt (J / S / O) | Forms |
|---|---|---|---|---|---|
| Start | 0 | 0 | 4 / 5 / 4 | 0 / 0 / 0 | kid / kid / kid |
| After scouting (40, 41) and the gap | 0 | 2 | 4 / 3 / 2 | 0 / 0 / 0 | kid / rat / dog |
| After the foyer (42 to 45) | 0 | 0 | 4 / 2 / 2 | 0 / 0 / 0 | kid / rat / dog |
| After the pool hall (46 to 48) | 0 | 1 | 3 / 2 / 2 | 0 / 0 / 0 | bison / rat / dog |
| After the girders (49, 50) | 0 | 0 | 2 / 2 / 2 | 0 / 0 / 0 | bison / rat / dog |
| Cage, before the Clash (51 to 54) | 1 | 0 | 1 / 1 / 1 | 0 / 0 / 0 | bison / kid / kid |
| End of the Clash (55 to 58) | 3 | 0 | 0 / 0 / 0 | 2, Stuck / 2 / 0 | bison / kid / kid |
| After the cage (60) | 3 | 0 | 0 / 0 / 0 | 2 / 2 / 0 | bison / kid / kid |
| End of the Escape (61 to 63) | 3 | 0 | 0 / 0 / 0 | 2 / 2 / 1 | bison / kid / dog |

**Scouting (rolls 40, 41).** Ollie shifted to scout (Wild 3) and Sam Helped as a kid (Wild 4): 5 dice against 2. Roll 40 was a Partial ("the team picks the way in, but Scent starts at 1"). Finn Pushed (Wild 2). Roll 41 kept the 6 and rerolled the misses for three 6s: "Critical: the team picks the way in and gains two Edges." Edges 2, Scent 0.

**The choice of way in.** The table picked A, the foyer. It isn't dangerous, the dog's Good Dog and the rat's Crowd Strength both work there, and Jonah can talk as a kid. In the gap Sam shifted to rat (Wild 3). Ollie stayed a dog, and Jonah stayed a kid.

**Way in A, the foyer** (group; Crowd; Sneak 3, Wits 2). Edges are capped at 2 ("any more are lost"), so the team spent them before anyone could roll a Critical.

- **Jonah:** kid Wits 2 +2 Edges = 4 dice against 2, which is the Cap. Roll 42 was a Success. Edges 0.
- **Ollie:** dog Sneak 3 +1 Crowd, against 3 −1 for Good Dog = 2. Roll 43 was a Success.
- **Sam:** rat Sneak 4 +1 Crowd = 5 dice against 3. Roll 44 was a Partial, the only one in the round, so Elif Pushed (Wild 2). Roll 45 was a Success.
- No Partial or Fail stands, so the foyer costs no Scent.

**Inside 1, the pool hall** (group; Water, Open; Sneak 2, Move 2, Sense 3; a Beater and a Hound). Jonah shifted to bison in the gap (Wild 3).

- **Jonah:** bison Move 3 +1 Open = 4 dice against 2. Roll 46 was a Critical, so he's past, and Edges go to 1.
- **Ollie:** dog Move 3 +1 Open = 4 dice against 2. Roll 47 was a Critical, so he's past, and Edges go to 2.
- **Sam:** rat Sneak 4 +1 Edge (Edges 1) = 5 dice against 2 +1 Tracker +1 Open = 4. The Tracker isn't capped ("Things that make a roll harder ... aren’t limited by the Cap"). Roll 48: four hits, a Success.
- No Partial or Fail, so no Scent. The guards never looked up.

**Inside 2, the girders** (point, 2 progress; High, Narrow; Move 2, Sense 3; dangerous). The rat has the Narrow Strength and no High Weakness. The bison (Narrow) and the dog (High) are both at +1 Difficulty here.

- **Round 1:** Sam Move 3 +1 Narrow +1 Edge (Edges 0) = 5 dice against 2. Roll 49 was a Success: 1 of 2.
- **Round 2:** Sam with 4 dice +1 Help (Jonah, Wild 2, steadying the ladder) = 5 dice. Roll 50 was a Success: 2 of 2.
- No Scent and no Hurt.

**Objective, Pickle's cage** (point, 3 progress; Locked, Dark; Force 3, Wits 2; Mr Rook). In the gap Ollie and Sam both shifted back to kids (free), so they could work and Help with Wits.

- **Round 1:** Ollie Wits 3 +1 Brainiac +1 Help (Sam, Wild 1) = 5 dice against 2. Roll 51 was a Fail. Finn Pushed (Wild 1). Roll 52 had two 6s, a Critical: 2 progress (2 of 3).
- **Round 2:** Jonah, bison Force 4 +1 Locked +1 Football Player = 6 dice against 3. Roll 53 was a Fail. Dev Pushed (Wild 1), and roll 54 was still a Fail. The Fail gives "Scent +1", so Scent is 1, and "A Fail at a guarded obstacle starts a Clash with the guards".

**Clash with Mr Rook** (Huntsman: Difficulty 3, Toughness 4, Harm 2). This is where the night got hard:

- The kids roll 2 dice at most, and "Success: hits equal to or more than the Difficulty" means 2 dice can never beat Difficulty 3. A kid's Distract or Strike can only be a Partial ("the threat’s Harm hits you") or a Fail ("A Fail just hits you"), so it costs 2 Hurt every time.
- The bison is already at the Cap, so Help adds nothing to his rolls.
- So Jonah rolled against Rook each round, so that he never got a free hit. The kids kept their actions for Patch Ups.
- The cage's Locked tag gives the bison his Strength die on a Strike there (Chapter 2's tag rule; Chapter 6's lawn example applies tags in a Clash).

Round by round:

- **Round 1:** Jonah Struck with 6 dice against 3. Roll 55 was a Partial, and Dev Pushed his last Wild (Wild 0). Roll 56 was still a Partial: 1 harm (Rook on 1 of 4), and Rook's Harm 2 is reduced by Shaggy Coat ("Once per scene, when you’d take Hurt, take 1 less") to 1. Sam Patched Up Jonah (Sam's Wild 0, Jonah's Hurt 0): "Spend 1 Wild and your action to heal 1 Hurt, yours or a friend’s."
- **Round 2:** Jonah Struck. Roll 57 was a Fail: Harm 2 (the Coat is spent for this scene), so Jonah is on Hurt 2. Ollie Patched him (Ollie's Wild 0, Jonah's Hurt 1). The team now has no Wild at all.
- **Round 3:** with nobody able to Patch, the choice was to let a kid take Rook's attention (a certain 2 Hurt) or let Jonah strike (32% clean). Because the Clash was certain to reach round 4, Jonah going Down would cost no extra Scent ("+2 if it reached round 4, someone went Down, or someone shifted during it"), so Jonah Struck. Roll 58 was a Partial: Rook is on 2 of 4, and Jonah takes Harm 2 to Hurt 3. "When your third Hurt box is marked, you’re Down." He's a bison, so he's Stuck: "If you go Down while in animal form ... you’re Stuck as your animal until the mission ends."
- **Round 4:** neither kid can hurt Rook or get away without taking his Harm. The kids ducked behind the boiler and nobody rolled. "At the end of each round, each threat that nobody rolled against deals its Harm to one character in the Clash, chosen by the Storyteller." The Storyteller chose Sam (issue 3.3), who is on Hurt 2.
- **End of round 4:** "at the end of round 4, when any threats still standing pull back to wait for the Masters". Scent +2, for both round 4 and Jonah's Down ("+2 if it reached round 4, someone went Down"; it doesn't stack). Scent 3.
- "The Clash’s Scent rises first; then the scene ends." The kids are standing and the Hunt isn't Up, so Jonah gets back up with 2 Hurt (issue 3.2).
- `15-ch05.html`: "If you beat the guards (or they pull back after round 4), the obstacle is cleared, unless it says progress is still needed. In that case you keep the progress you’ve made and carry on rolling, without the guards."

**Rest of the cage** (a new scene: "the rest of the obstacle after it is a new scene"). Ollie Wits 3 +1 Brainiac = 4 dice against 2, with nobody able to Help. Roll 60 was a Success: 3 of 3. Pickle shot out between Rook's ankles.

**Escape, the staff car park** (group; Open, Dark; Sneak 2, Move 2). Scent 3 is below 4, so it isn't On the Trail. Nobody had Wild. "Out of Wild? You can still shift into your animal by taking 1 Hurt instead, unless that would put you Down."

- Ollie paid 1 Hurt and became a dog (Hurt 1).
- Sam, on Hurt 2, couldn't pay (it would put him Down), so he stayed a kid.
- Jonah was Stuck as a bison.
- Rolls: Jonah 4 dice against 2 (roll 61), a Partial. Ollie 4 dice against 2 (roll 62), a Success. Sam, roll 63, 2 hits; see the slip below.
- All past. "In the Escape, Partials cost no Scent."

**Result: Win** at Scent 3 of 7.

**After the Mission:**

- Win: Pickle is home, and Mr Rook knows the house.
- Hunt track stays at 0.
- Everyone reaches 2 Growth and will choose an advance next time; not played.
- Nobody is Exposed: no shift in the Clash.
- Jonah's Stuck ends with the mission, and Hurt clears.
- All 13 Wild were spent: 3 shifts, 5 Pushes, 3 Helps and 2 Patch Ups, plus one shift paid in Hurt.

**Table slips (mine).** All of them come from the same Wild error as in the Zoo: Sam's Wild was one too high from the scouting Help on. The table above is corrected.

- **Round 3:** in play, I had Sam make a second Patch Up on Jonah, which he couldn't afford. With the correct count, Jonah was on Hurt 1 when he rolled roll 58, so that Partial put him Down in round 3.
- **Roll 59:** I had rolled it as a round 4 Strike by Jonah, who by then was Down and couldn't act. It is void: its result isn't used, and no roll replaced it, because round 4 needed none.
- **Roll 63:** I rolled it as a rat with 4 dice. With the correct Hurt, Sam couldn't shift, so it should have been 2 dice as a kid (Sneak or Move 2, against 2). Following the dice rule, I kept the result (2 hits): past either way.
- **Rolls 61 to 63:** these were made in one go. Nobody had Wild, so no Push decision was skipped.

None of this changed the result. If anything, it made the Clash harsher than I first played it.

Estimated real time: 55 to 65 minutes of play, of which the Huntsman Clash took about 20 (working out that the kids can't touch him took a while), plus about 25 minutes of building.

## 5. What worked, and how it felt

### 5.1 What worked

- **The round-1 fixes removed every question that slowed the first table.** Nobody asked whether a gap shift is free, whether scouting has tags, whether the scout's shift uses up the gap, what a Critical Distract does, or whether Edges carry over. Each answer is now one sentence in the right place.
- **Chapter 12's new Limit steps are fast and checkable.** Count, label, add 2: two minutes, and all five Part Three missions fit the formula. The checklist now produces a complete mission page (scouting, who arrives, results).
- **Setup flows.** "Allow ten minutes" and the new "Copy your frame’s animal ratings" step made the new character painless. "Three dice against Difficulty 2" gave a Fail, a Success and a Partial (rolls 6 to 8), and taught the whole ladder.
- **"Roll one at a time ... decides on a Push before the next one rolls"** removed round 1's ordering slip, and made the Edge timing a real choice (spend before the Criticals come, because of the cap of 2).
- **The Clash end order is now unambiguous.** Round 4 ended, Scent +2 once, then the scene ended and the Down bison got up, then "carry on rolling, without the guards". It played straight off the round card.
- **Point and group obstacles feel different.** At group obstacles the table learned to compare dice counts, not Difficulties, because "Partial or better gets you past". At point obstacles, every Partial was weighed against a Push.
- **Forms stayed a real decision.** Jonah stayed a kid for the foyer and a bison for the patrol. Ollie switched four times. Sam turned back into a kid at the cage, just to be able to Help with Wits.
- **The Huntsman is frightening.** Difficulty 3 against kids' two dice means they can't touch him. The team had to protect the bison with Patch Ups and wait out round 4. Every Wild token went into that fight, and it was the best scene of the night.

### 5.2 How it felt

- **Risk of losing: real in the Zoo, not quite there in the Deep End.**
  - The Zoo reached Scent 6 of 8, with an On the Trail Escape, and Jonah Failed it with no Wild to Push (roll 34). A Fail at that point would have been one Scent from the Hunt Up.
  - The Deep End stayed at Scent 3 of 7 thanks to a hot start: from roll 41 to roll 50, every result was a Success or a Critical once Pushes are counted. But the cage and its Clash took the team's last six Wild, put Jonah Down and left Sam on Hurt 2. Had the cage needed one more roll and it Failed, the team would have had no Wild left for anything.
  - Over the night there were 7 Criticals in 52 mission rolls (rolls 9 to 37 and 40 to 63, without the void roll 59).
  - The Hunt was never Up, so Taken, Netted, Withdraw and the prize remain untested in round 2.
- **Wild spent: all 26 of 26:** 7 shifts, 9 Pushes, 7 Helps and 3 Patch Ups, plus one shift paid in Hurt. Five of the nine Pushes improved the result (rolls 12, 15, 41, 45 and 52).
- **Dominant tactics:**
  1. **Push every Fail and most Partials at point obstacles**, and every Fail at a guarded obstacle (rolls 15, 20, 32, 41, 52, 54).
  2. **Spend Edges first at group obstacles.** The cap of 2 wastes a Critical's Edge otherwise, and a scouting Critical (2 Edges) must be spent at once (rolls 13, 42, 48 and 49).
  3. **Against a guard at an objective that still needs progress, outlast it.** A guard that pulls back after round 4 clears the obstacle just as beating it does. Once round 4 is certain, going Down costs no extra Scent ("it doesn’t stack"), and being Stuck in animal form usually costs nothing either. The team never needed to hurt Mr Rook, only to keep someone rolling against him.
  4. **The bison at the Cap and the Brainiac kid** handled every Force or Strike and every lock (6 dice and 4 to 5 dice respectively).
  5. **The last shift is paid in Hurt** (Ollie, before the car park), as round 1 also found. It costs nothing, because Hurt clears.
- **Time at a real table:**
  - Setup: about 15 minutes before the players arrive and 25 at the table, with one new character.
  - The Zoo: 65 to 75 minutes.
  - Building the Deep End: about 25 minutes.
  - The Deep End: 55 to 65 minutes.
  - A first night of setup plus the Zoo runs about an hour and a half. That fits Chapter 1's "one to two hours" and "about two hours for a first night with one mission", and not Chapter 9's "two to three hours" (issue 3.4).
