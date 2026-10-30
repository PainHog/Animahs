# Second Nature v0.1, Round 1, Test B: a rowdy table

A Storyteller and five experienced players ran the two Hard missions as a short campaign: "The Trophy Gala" (Chapter 16), then "The Lodge on the Hill" (Chapter 17), with the Chapter 8 campaign rules carried between them. The only rules source was the book: the HTML chapters in `book/src/chapters/`, read in filename order, and the built PDF `book/dist/Second_Nature_v0.1.pdf` for the maps, tables and sheets. The PDF text matches the HTML word for word on every page used here. Every roll came from `book/playtests/roll.mjs` and is in `book/playtests/round1-test-b-dice.md` (rolls 1 to 73; Gala 1 to 31, Lodge 32 to 73). No roll was invented, chosen or redone, and no roll used the wrong number of dice.

## 1. Verdict

CLEAN, narrowly: no blocker and no invented core-flow ruling at the table, but the dice never brought the Hunt Up or left anyone Netted, Down or Taken, so those paths went untested in play (issues 2 and 9 are gaps found by reading them).

## 2. Issues

Most severe first. Issues marked "found on reading" are on paths the dice never reached. The table looked them up when it planned for those paths, and they are graded as they would hit a table that reached them.

### Issue 1 (confusing): Do two or three Hounds' Trackers stack?

- **Where:** `22-ch10.html`, Hound: "Sneak rolls at an obstacle a Hound guards are at +1 Difficulty." `13-ch03.html`: "Things that make a roll harder, like a Weakness or a Hound’s Tracker, aren’t limited by the Cap, so a Difficulty can go above 4." The only "however many" rule is for tags (`12-ch02.html`: "It’s one die and one step at most, however many tags match.").
- **At the table:** both missions' key group obstacles have several Hounds: the Gala's dark exhibit halls have 2, and the Lodge's kennels have 3. The book doesn't say whether each Hound adds +1 Difficulty to Sneak. "Aren’t limited by the Cap" made one player argue for +2 and +3. The ruling changed a real result. With +3 at the kennels, Sam's roll 44 (3 hits) would have been against Difficulty 5: still a Partial and past, but no Critical, so no Edge. Without that Edge, only one of Jonah's roll 45 and Priya's roll 46 could have had one. Nobody could say either whether the Tracker covers Sneak rolls in a Clash at that obstacle (Distract or Slip Away by Sneak), or whether it stops once the Hounds are out. Nobody rolled Sneak in the deer-park Clash, so that part didn't bite.
- **Fix:** "+1 Difficulty, however many Hounds guard it. It applies to every Sneak roll at that obstacle, including in a Clash there, while any Hound there is still standing." Say the same for the Huntsman's Trophy.
- **Ruling to use tonight:** +1 in total, however many Hounds; it applies in a Clash at that obstacle while a Hound stands.

### Issue 2 (confusing, found on reading): What happens when a Fail at a guarded obstacle brings the Hunt Up?

- **Where:** `15-ch05.html`, When the Hunt Is Up: "Finish resolving the roll that did it. If that roll finished the objective, it’s finished." and "A Fail at a guarded obstacle doesn’t start a Clash any more: you’re just Taken." Guarded obstacles: "At a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then (+1 for any Partial or Fail); then the whole team is in the Clash".
- **At the table:** at the Trophy case (Scent 3 to 4 of 6), the table asked what happens when a Fail at a guarded obstacle is the very roll that brings the Hunt Up. At a point obstacle the Fail's own Scent +1 does it. At a group obstacle, the obstacle's rise "then" does it. "Finish resolving the roll that did it" suggests the Clash still starts. "You’re just Taken" suggests the roller goes into a cage instead. That's a choice between a fight and a Taken friend, and on a Hard mission with Scent one short of the Limit it is likely to come up. It didn't come up tonight: the dice never put Scent one short of the Limit at a guarded obstacle.
- **Fix:** add to When the Hunt Is Up: "The Fail that brings the Hunt Up still starts its Clash, and nobody is Taken for that roll. From then on, any Fail in the Clash means Taken."
- **Ruling to use tonight:** the Clash starts and the roller isn't Taken. Every later Fail means Taken.

### Issue 3 (confusing): If everyone Slips Away, do the guards stay?

- **Where:** `15-ch05.html`: "If you beat the guards (or they pull back after round 4), the obstacle is cleared, unless it says progress is still needed. In that case you keep the progress you’ve made and carry on rolling, without the guards." `16-ch06.html`: "A Clash ends when every threat is out, when nobody is left in it, or at the end of round 4. Then any threats still standing pull back to wait for the Masters."
- **At the table:** the Gala's Huntsman (Difficulty 3, Toughness 4, Harm 2) is the hardest thing in the book to beat. Looking for the cheapest way past him, the table read Chapter 6: start the Clash and have all five Slip Away in round 1. Nobody is left, the Clash ends, and the Huntsman "pull[s] back". The case can then be worked unguarded for +1 Scent. Chapter 5 only lists "beat the guards" or "after round 4" as ways to lose the guards. The question came up again at the Lodge cellar after Priya slipped away (roll 55). The table didn't use the trick, but nothing in the book stops it, and at a guarded point objective it beats fighting.
- **Fix:** pick one rule and say it in both chapters. Either "If everyone Slips Away at a point obstacle, the guards stay, and the next Fail there starts a new Clash", or add "or nobody is left in the Clash" to the Chapter 5 parenthesis.
- **Ruling to use tonight:** Chapter 6 as written: threats pull back however the Clash ends.

### Issue 4 (confusing): Choosing to start a Clash at a group obstacle (sentence order)

- **Where:** `15-ch05.html`: "You can also choose to start the Clash yourselves, before anyone rolls. At a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then (+1 for any Partial or Fail); then the whole team is in the Clash, including anyone already past."
- **At the table:** at the Lodge deer park the team declared a Clash before rolling. One player read the next sentence as applying to that case, so all five would have to roll the deer park first and pay its Scent. The sentence is about a Clash started by a Fail, but it sits right after the sentence about choosing one. This is core flow (how a Clash starts and what it costs), and it is easy to misread. It also hides how cheap the tactic is: with five players a group obstacle nearly always costs +1 Scent, and a quick chosen Clash costs the same +1 while clearing the obstacle for everyone.
- **Fix:** move the group-obstacle sentence to straight after "A Fail at a guarded obstacle starts a Clash", and add "If you start the Clash yourselves, nobody rolls the obstacle and it raises no Scent of its own."
- **Ruling to use tonight:** a chosen Clash starts before any roll. The obstacle raises no Scent; only the Clash's end does.

### Issue 5 (confusing): Does the Fail that starts a Clash with a Trapper net the roller?

- **Where:** `22-ch10.html`, Trapper: "When you Fail against a Trapper, you’re Netted instead of Hurt (Chapter 7)." `32-ch14.html`: "If you Fail while the Trappers are there, they come at you with nets."
- **At the table:** Theo Failed at the Gala's dark exhibit halls (roll 11), where a Trapper is among the guards. Before deciding to Push, his player asked whether the Fail would net him on the spot, since the zoo text suggests it does. Then he'd be Netted from round 1 of the Clash. The same question would have come up at the Lodge cellar (2 Trappers) if the team hadn't started that Clash itself. Theo's Push (roll 12) made it moot.
- **Fix:** "Only a roll made against a Trapper in a Clash can net you. The Fail that starts the Clash doesn’t." Or the opposite, but say it in Chapter 7.
- **Ruling to use tonight:** the triggering Fail starts the Clash and nets nobody.

### Issue 6 (confusing): What is a scene when a Clash breaks out inside an obstacle? Is scouting a scene?

- **Where:** `15-ch05.html`: "A scene is one obstacle, or one Clash. “Once per scene” abilities come back at the start of every scene."
- **At the table:** at the Lodge cellar the team started a Clash at the objective, then worked the lock afterwards. Jonah had used Shaggy Coat in the Clash (roll 52), and Theo's Pack was unused. The players asked whether the Clash is its own scene, and whether the lock work afterwards is a new scene (so abilities come back) or the rest of the old one. Down recovery is answered elsewhere (`16-ch06.html`: "After a Clash, Down and Netted friends get back up..."). Once-per-scene abilities are not. The same question came up at both scouting rolls: can Theo use Pack on a scouting roll?
- **Fix:** "A Clash that breaks out at an obstacle is its own scene. When it ends, the obstacle carries on as a new scene. Scouting is a scene."
- **Ruling to use tonight:** exactly that fix. It changed no roll tonight: nobody took Hurt at the cage, and Pack wasn't used there.

### Issue 7 (confusing): Can the team split up?

- **Where:** `15-ch05.html`: "The way in. Every mission has two ways in. Scouting decides who picks." Point obstacles: "Progress adds up until the obstacle is cleared, then everyone goes through." Group obstacles: "Everyone has to get past it".
- **At the table:** this table was told to split up and tried twice at the Gala. First the humans proposed talking in at the front doors while the animals forced the loading bay. Then Sam wanted to scurry ahead to the Trophy case through the walls while the others crossed the halls. The book implies the team moves as one, but never says so, and has no procedure for two groups at two obstacles.
- **Fix:** one sentence in Chapter 5: "The team stays together: everyone takes the same way in and faces each obstacle in order."
- **Ruling to use tonight:** no splitting; one way in for everyone, and obstacles in order.

### Issue 8 (confusing): The summary page says Slip Away always makes you "past"

- **Where:** `42-ch19.html`: "Slip Away (Move or Sneak; you’re out and past)". `16-ch06.html`: "At a group obstacle you’re past it; at a point obstacle you wait, out of harm’s way, until the Clash ends."
- **At the table:** Priya slipped away at the Lodge cellar, a point obstacle (roll 55). The At the Table page, open in the middle of the table, said she was "past", which made a player ask whether she could go on to the Escape alone. Chapter 6 says she waits.
- **Fix:** Chapter 19: "Slip Away (Move or Sneak; you’re out: past a group obstacle, waiting at a point obstacle)".
- **Ruling to use tonight:** Chapter 6.

### Issue 9 (confusing, found on reading): Withdrawing during a Clash

- **Where:** `15-ch05.html`: "The team may Withdraw at any time: give up on the objective and go straight to the Escape." When the Hunt Is Up: "If the objective isn’t done, the team chooses: keep going, or Withdraw straight to the Escape (a Loss)."
- **At the table:** the Hunt was never Up, so nobody Withdrew. When planning for it, the table couldn't tell whether "at any time" includes the middle of a Clash, or what happens then to the Clash, a Netted or Down friend, and the end-of-Clash Scent.
- **Fix:** "You can Withdraw between obstacles, or at the end of a Clash round. If you Withdraw from a Clash, it ends as if nobody were left in it."
- **Ruling to use tonight:** Withdraw takes effect when the current scene ends.

### Issue 10 (minor): Taking the prize, and handing it over between obstacles

- **Where:** `15-ch05.html`: "One character carries it, in hand or in jaws. Handing it to a friend at the same obstacle takes your action, with no roll. If you shift, it drops at your feet: picking it up takes an action at an obstacle or in a Clash, but between obstacles it’s free." `34-ch16.html`: "When it opens, someone takes the pendant".
- **At the table:** Jonah's Critical opened the case (roll 18). Nobody knew whether taking the pendant costs an action, or whether it can be passed for free between obstacles, the way picking it up is.
- **Fix:** "Whoever opens it takes the prize, free. Between obstacles, passing it is free."
- **Ruling to use tonight:** as the fix.

### Issue 11 (minor): Group-obstacle rolls: one at a time or all together, and when to decide a Push

- **Where:** `15-ch05.html`: "Each round, everyone who isn’t past yet rolls". `13-ch03.html`: "After you roll, you may spend 1 Wild to reroll every die that didn’t hit."
- **At the table:** the Storyteller (me) rolled five players' dice as a batch at several group obstacles (rolls 4 to 8, 19 to 23, 27 to 30, 62 to 66, 67 to 71), and the players decided Pushes after seeing every result. At the galleries (rolls 19 to 23) that mattered. Priya's Fail, which couldn't be Pushed, was already on the table, so Maya and Theo knew a Push couldn't save the obstacle's Scent and kept their Wild. Rolling strictly one at a time, Maya would have had to decide first. The book doesn't say which is right. I'm logging the batching as my procedure slip as well as an issue.
- **Fix:** "At a group obstacle, players roll one at a time, in any order they like, and each decides on a Push before the next rolls."
- **Ruling to use tonight:** one at a time from here on.

### Issue 12 (minor): "At most two friends can usefully Help" isn't true when you have a bonus die

- **Where:** `13-ch03.html`: "Help counts towards the Cap, so at most two friends can usefully Help one roll." `12-ch02.html`: "A perk’s extra die counts towards the Cap (Chapter 3)."
- **At the table:** at the Lodge cage, Maya and Theo shifted back to human so they could both Help Priya's Wits (roll 60). Her Brainiac die already counts, so only one Help fits. I first planned six dice. Theo's Help had to be refused, after he'd spent his action shifting back for it.
- **Fix:** "...so at most two friends can usefully Help one roll, or one if you already have a bonus die."
- **Ruling to use tonight:** the Cap as written: +2 dice from everything.

### Issue 13 (minor): The free Shift between obstacles: which direction, and after scouting?

- **Where:** `15-ch05.html`: "Moving from one obstacle to the next is free, and on the way everyone may Shift or Patch Up once without using an action." `14-ch04.html`: "Shifting back to human costs nothing, but it also takes your action." Scouting: "Shifting to scout is out of sight, as it is between obstacles; it still costs Wild."
- **At the table:** after both scouting rolls, the scout (Priya, then Theo) wanted to shift back before the way in. Players asked whether shifting back counts as the free Shift, whether you could shift back and then into your animal in one gap, and whether scouting-to-way-in counts as a gap at all.
- **Fix:** "Between obstacles (and between scouting and the way in), everyone may make one free Shift, either way, or one Patch Up."
- **Ruling to use tonight:** as the fix.

### Issue 14 (minor): Does a Critical on a Distract or Slip Away give an Edge?

- **Where:** `13-ch03.html`: "You gain Edges from a Critical when the extra progress isn’t needed (Chapter 5)". `16-ch06.html` only defines a Critical for a Strike ("Critical: 2 harm").
- **At the table:** Priya's Distract in the deer park was a Critical (roll 38). A Clash has no progress, so the table didn't know whether "the extra isn’t needed" applies.
- **Fix:** "In a Clash, a Critical matters only on a Strike."
- **Ruling to use tonight:** no Edge.

### Issue 15 (minor): Kit and rescued friends in the Escape

- **Where:** `35-ch17.html`: "Kit is too weak to shift; he goes where you go, and doesn’t roll." and "A rescued character rejoins the team when you’re out, but doesn’t roll during the Escape."
- **At the table:** when the cage opened (roll 61), players asked whether Kit has to "get past" the lawn and the wall, whether he can be Taken (for example if the Hunt is Up, or everyone else is Down), and whether a rescued team member can Help or spend Wild on the way out.
- **Fix:** "Kit and rescued friends are past each Escape obstacle when the last of the team is. They can’t act or be Taken unless everyone else is."
- **Ruling to use tonight:** as the fix.

### Issue 16 (minor): The At the Table page has no prize rules

- **Where:** `42-ch19.html` has no line on the prize. `15-ch05.html` has the rules: handing it over takes an action, shifting drops it, picking it up is free between obstacles, and it's lost if the carrier is Taken. The Taken line ("the prize is lost with you") is the only mention.
- **At the table:** when Jonah handed the pendant to Theo on the museum steps (Escape 2, round 1), the table looked for the cost on the one-page summary, found nothing, and had to go back to Chapter 5.
- **Fix:** add to Chapter 19, A Mission: "Prize: one carrier. Handing it over takes an action; shifting drops it (picking it up takes an action, free between obstacles)."
- **Ruling to use tonight:** Chapter 5.

### Issue 17 (minor): Two Team Captains

- **Where:** `12-ch02.html`: "Team Captain: the team starts every mission with 1 Edge." and "Two players may have the same human perk." `18-ch08.html` Growth: "A second human perk."
- **At the table:** at the second campaign step, Jonah took Team Captain as his Growth choice. Do two Captains give 2 Edges at the start (2 is the maximum)?
- **Fix:** say whether it stacks.
- **Ruling to use tonight:** it stacks, up to the 2-Edge maximum.

### Issue 18 (minor): Do unspent Edges carry over to the next mission?

- **Where:** `13-ch03.html`: "The team holds at most 2 Edges at a time; any more are lost." Wild has an explicit rule ("Unspent Wild is lost when the mission ends"). Edges don't.
- **At the table:** asked at both campaign steps. It was moot (0 Edges left both times), but Team Captain's wording suggests a reset.
- **Fix:** "Unspent Edges are lost when the mission ends."
- **Ruling to use tonight:** lost at mission end.

### Issue 19 (minor, found on reading): "Nothing else raises it"

- **Where:** `15-ch05.html`, Scent: "It rises for Partials and Fails at obstacles, once at the end of each Clash, for a shift the Hunt can see, and for a poor scouting roll. Nothing else raises it." The same chapter adds: "If anyone still isn’t past after the third round, Scent also rises by 1 at the end of every round after that." Chapter 8 also starts a mission at Scent 1 after an Exposure.
- **At the table:** not reached (no group obstacle went past round 2). A table checking the Scent box against the round card would find the list incomplete.
- **Fix:** add "a group obstacle that runs past round 3" and "Exposed" to the list.
- **Ruling to use tonight:** both apply.

## 3. Play log

### Before play

- **Table:** a Storyteller and five experienced players. `11-ch01.html` allows "Three to five players and a Storyteller."
- **Characters (`41-ch18.html`):** Maya Reyes (jaguar, Night Rosettes, Hide-and-Seek Champ), Theo Park (coyote, Pack, Team Captain), Priya Shah (barn owl, Silent Wings, Brainiac), Sam Lindqvist (brown rat, Gnaw, Gamer) and Jonah Mensah (bison, Shaggy Coat, Football Player).
- **Lucía Ortega (alligator) sat out.** The Gala is "the Crowd mission" (`34-ch16.html`), and Reptiles have Crowd as their Weakness. She was kept ready as the replacement if anyone was Taken (`18-ch08.html`: "their player makes a new Bonded (or takes a ready-made one)"). She was never needed, so her perks (Lurker, Swim Team) went untested.
- **Talk about it first:** the table chose a "creepy-and-cold" Hunt (`21-ch09.html`).
- **Signals:** one bark means danger, two taps mean "here" (`14-ch04.html`: "Agree on simple signals before a mission").
- **Tracking on paper:** each sheet had Wild, Hurt, form and status. The mission tracker had Scent, Limit, half-Limit, Edges, way in, objective, prize carrier, Taken and Exposed, and the Hunt track.

### Mission 1: The Trophy Gala (Hard)

**Setup.** `34-ch16.html` sets the Limit: "Scent Limit: 6 with 3 players · 6 with 4 · 6 with 5." On the Trail at 3 ("Scent is at least half the Limit (round up)", `15-ch05.html`).

- Wild: Maya 4, Theo 4, Priya 4, Sam 5 (`12-ch02.html` Gamer: "start every mission with 1 extra Wild").
- Edges: 1 from Team Captain ("the team starts every mission with 1 Edge").
- Scent 0. Everyone human, 0 Hurt.

**Scouting (rolls 1 and 2).** `15-ch05.html`: "one character rolls Sense against the mission’s scouting Difficulty (2 in every mission in this book). Shifting to scout is out of sight, as it is between obstacles; it still costs Wild. Friends may Help."

- Priya shifted to owl (Wild 4 to 3) for Sense 4. Theo, human, Helped, describing how he pointed out the guard's torch at the side door (Wild 4 to 3). Five dice against 2.
- Roll 1 gave 1 hit, a Partial. Priya Pushed (`13-ch03.html`: "spend 1 Wild to reroll every die that didn’t hit"; Wild 3 to 2).
- The Push (roll 2) also gave 1 hit. Partial: "the team picks the way in, but Scent starts at 1." **Scent 1.**

**Choosing the way in.** The rowdy players proposed splitting: the humans talk in at the front doors while the animals force the loading bay (issue 7; ruling: one way in for all).

- They picked Way in B, the loading bay: Dark, Locked; Sneak 3, Force 3, Wits 2; point, 2 progress.
- One point roll per round beats five group rolls at the Crowd doors.
- On the way, Priya shifted back to human and Maya shifted to jaguar (Wild 4 to 3). `15-ch05.html`: "on the way everyone may Shift or Patch Up once without using an action" (issue 13 for the gap after scouting).

**Loading bay, round 1 (roll 3).** `15-ch05.html`: "Each round, one character rolls ... and the others may Help."

- Maya rolled Sneak 4, +1 die for Dark (a Big Cat Strength, `12-ch02.html`: "you get +1 die"), +1 for Hide-and-Seek Champ. Night Rosettes took Sneak 3 down to 2 ("In Dark places, your Sneak rolls are at −1 Difficulty").
- That's exactly the Cap: "at most +2 dice and at most −1 Difficulty" (`13-ch03.html`).
- 2 hits, two 6s: a Critical ("a Success with two or more 6s among the dice"). `15-ch05.html`: "Critical: as a Success, plus 1 extra progress." That makes 2 of 2. The bay is open and no Scent is added. **Scent 1.**

**Inside 1, the ballroom (rolls 4 to 8).** Crowd, Open; Sneak 2, Wits 2; group. `15-ch05.html`: "Each round, everyone who isn’t past yet rolls, and each gets past on their own Partial or better."

On the way, Theo shifted to coyote (Wild 3 to 2) and Sam to rat (5 to 4). Maya stayed a jaguar to save Wild for the halls.

- **Maya** (roll 4): jaguar Sneak 4 +1 Hide-and-Seek, +1 from Theo's Pack ("Once per scene, Help without spending Wild"), against 2 +1 for Crowd (a Big Cat Weakness). 1 hit: Partial.
- **Theo** (roll 5): coyote Sneak 3 +1 (Open and Crowd are both Canine Strengths, "one die and one step at most") against 2. Partial.
- **Priya** (roll 6): human Wits 3 +1 Brainiac against 2. 3 hits with two 6s: a Critical. At a group obstacle "the extra isn’t needed", so the team gains an Edge.
- **Sam** (roll 7): rat Sneak 4 +1 Crowd against 2 +1 Open. Partial.
- **Jonah** (roll 8): human Wits 2 +1 Edge against 2. Success. The animals couldn't Help him (`13-ch03.html`: "in animal form you can’t help with Wits"), so the team spent its Edge.

Everyone was past in round 1, so nobody Pushed. Three Partials would all have had to become Successes to save the Scent. "At a group obstacle, Scent rises once, when the obstacle ends: +1 if anyone got a Partial or a Fail." **Scent 2. Edges 1** (0 after Jonah, then +1 from Priya).

**Inside 2, the dark exhibit halls (rolls 9 to 14).** Dark, High; Sneak 2, Move 2, Sense 3; group; 2 Hounds and a Trapper.

- Tracker: issue 1 stopped play here. Ruling: +1 to Sneak in total.
- On the way, Priya shifted to owl (Wild 2 to 1) and Jonah to bison (4 to 3), so the bison would be ready if it came to a Clash (`16-ch06.html`: "Shift before the fight, not during it").
- Theo stayed a coyote. High is his Weakness, but at a group obstacle only "at least a Partial" matters, and his odds of that were the same in either form.

The rolls:

- **Maya** (roll 9): Sneak 4 +1 Dark/High +1 Hide-and-Seek against 2 +1 Tracker −1 Night Rosettes = 2. 3 hits: Success.
- **Priya** (roll 10): owl Move 4 +1 High +1 Silent Wings ("In Dark places, +1 die on Sneak and Move rolls") against 2. Success.
- **Theo** (roll 11): coyote Sense 4 +1 Edge against 3 +1 for High. 0 hits: a Fail. A Fail here "starts a Clash" (`15-ch05.html`). The table asked whether the Fail would net him (issue 5; ruling: no). Theo Pushed (Wild 2 to 1), and roll 12 gave 1 hit: a Partial, so he's past.
- **Sam** (roll 13): rat Sneak 4 against 2 +1 Tracker. Partial.
- **Jonah** (roll 14): bison Move 3 +1 Pack against 2. Partial.

All past in round 1, so there was no Clash. Group-obstacle rise +1. **Scent 3**, which already means On the Trail for the Escape. **Edges 0.**

**The objective: the Trophy case (rolls 15 to 18).** Locked, Crowd; Force 3, Wits 3; point, 3 progress; a Huntsman guards it, "Beating the guards doesn’t clear it. A prize to carry out."

On the way, Maya, Priya and Jonah shifted back to human (free). Jonah is better human here: a bison is weak in a Crowd. The table looked ahead:

- Issue 2: what if a Fail brings the Hunt Up here?
- Issue 3: everyone Slips Away so the Huntsman pulls back. They noted the trick and declined it. Five Slip Away rolls at Difficulty 3 risk several Harm-2 Partials.

The rolls:

- **Round 1** (roll 15): Sam, rat. Gnaw ("Against Locked things, your Force rating is 3"), +1 Crowd (a Critter Strength), +1 Pack, against 3. 3 hits: Success, 1 of 3.
- **Round 2** (roll 16): Priya, human. Wits 3 +1 Brainiac +1 Help from Maya (Wild 3 to 2), at the Cap, against 3. 0 hits: a Fail, which would mean Scent 4 and a Clash with the Huntsman.
  - She Pushed with her last Wild (1 to 0). Roll 17 gave 2 hits with two 6s: a Partial, since a Critical needs a Success.
  - That's 2 of 3. "Partial: as a Success, but Scent +1." **Scent 4.**
- **Round 3** (roll 18): Jonah, human. Force 3 +1 Football Player +1 Help from Sam (Wild 4 to 3) against 3. 3 hits, two 6s: a Critical. The case is open (3 of 3), and the extra progress isn't needed, so the team gains an Edge (**Edges 1**).
- Jonah took the pendant (issue 10; ruling: free for whoever opens it). Prize carrier: Jonah.

**Escape 1, the galleries (rolls 19 to 26).** Dark, High; Sneak 2, Move 2; group. Scent 4 is at least 3, so they're On the Trail: "that Escape obstacle is at +1 Difficulty for every approach." `15-ch05.html`: "In the Escape, Partials cost no Scent. Only Fails count."

On the way:

- Maya shifted to jaguar (Wild 2 to 1).
- Priya had 0 Wild, so she shifted to owl by taking 1 Hurt (`14-ch04.html`: "Out of Wild? You can still shift into your animal by taking 1 Hurt instead, unless that would put you Down"). Priya: Hurt 1.
- Jonah stayed human so he kept the pendant (`14-ch04.html`: anything you hold "drops at your feet when you shift").

Round 1:

- **Maya** (roll 19): Sneak 6 dice against 2 +1 −1 = 2. 0 hits: Fail.
- **Priya** (roll 20): owl Move 6 dice against 3. 0 hits: Fail.
- **Theo** (roll 21): coyote Move 3 against 2 +1 +1 High. 0 hits: Fail.
- **Sam** (roll 22): rat Sneak 4 against 3. Partial.
- **Jonah** (roll 23): human Move 2 +1 Pack +1 Edge against 3. Partial. **Edges 0.**

Priya couldn't Push, so the obstacle's one Fail rise was already certain. Pushing couldn't save Scent, and Fails before round 4 cost nothing more, so Maya and Theo kept their Wild. (This is where my batch rolling mattered: issue 11.)

Round 2:

- **Maya** (roll 24): 3 hits, three 6s. Critical: past, and an Edge. **Edges 1.**
- **Priya** (roll 25): 2 of 3, Partial. Past.
- **Theo** (roll 26): 1 of 4, Partial. Past.

The obstacle ends, and there were Fails, so +1. **Scent 5 of 6.**

**Escape 2, the museum steps (rolls 27 to 31).** Open, Crowd; Sneak 2, Move 2; group; On the Trail (+1).

On the way, Sam spent his free action Patching Up Priya (`17-ch07.html`: "Spend 1 Wild and your action to heal 1 Hurt, yours or a friend’s. You can also Patch Up once on the way between obstacles without using an action"). Sam: Wild 3 to 2. Priya: Hurt 1 to 0.

Round 1:

- **Jonah** handed the pendant to Theo, whom crowds see as a dog with something in his mouth. `15-ch05.html`: "Handing it to a friend at the same obstacle takes your action, with no roll." Jonah didn't roll. Prize carrier: Theo.
- **Theo** (roll 27): coyote Move 3 +1 Open/Crowd +1 Edge against 3. Partial. **Edges 0.**
- **Maya** (roll 28): jaguar Sneak 4 +1 Hide-and-Seek against 2 +1 +1 Crowd. Partial.
- **Priya** (roll 29): owl Move 4 +1 Open against 3. Partial.
- **Sam** (roll 30): rat Sneak 4 +1 Crowd +1 Pack against 2 +1 +1 Open. Partial.

Round 2:

- **Jonah** (roll 31): human Move 2, +1 Help each from Sam and Maya (Sam 2 to 1, Maya 1 to 0), against 3. Partial. Past.

There were no Fails at the steps, so no rise. `15-ch05.html`: "When everyone still free is past the last Escape obstacle, the mission ends." **Final Scent 5 of 6.**

**Result: Win.** `15-ch05.html`: "The objective is done and nobody is Taken."

- Unspent Wild lost: Theo 1, Sam 1, Jonah 3. 16 of 21 tokens were spent.
- End-of-mission Hurt: none (Priya was patched).
- Nobody shifted in sight and nobody was Taken, so nobody is Exposed.

### Campaign step (Chapter 8)

- Hunt track: "After a Win, it doesn’t move." It stays at **0**.
- Growth: "After every mission, whatever the result, every character marks 1 Growth." Everyone is at 1, so there are no choices yet ("When you reach 2, 4 and 6 Growth, choose one").
- Exposed: nobody, so the Lodge starts at Scent 0.
- Taken friends: none, so there's no replacement and no friend in the Lodge cage.
- Hurt: "All Hurt clears between missions" (`17-ch07.html`). Wild resets.
- Edges: none left. The table asked whether they would carry over (issue 18).
- Rumour: the Storyteller chose 5 from the rumour table (`23-ch11.html`) to lead into the Lodge brief.

### Mission 2: The Lodge on the Hill (Hard)

**Setup.** `35-ch17.html` sets the Limit: "Scent Limit: 7 with 3 players · 7 with 4 · 7 with 5." On the Trail at 4 (half of 7, rounded up).

- Wild: Maya 4, Theo 4, Priya 4, Sam 5, Jonah 4.
- Edges: 1 (Team Captain).
- Scent 0. Everyone human.

**Scouting (roll 32).** Theo shifted to coyote (Wild 4 to 3) and Sam, human, Helped (5 to 4). Sense 4 +1 against 2: 4 hits, one 6. Success: "the team picks the way in and gains an Edge." **Edges 2**, the maximum.

**Choosing the way in.** The table picked Way in A, the deer park: Open, Dark; Sneak 2, Move 2; group; 2 Hounds; "Beating them clears it."

- They didn't take Way in B, the ice-house tunnel, which is the only dangerous obstacle in either mission.
- On the way, Jonah shifted to bison, Maya to jaguar and Priya to owl (Wild 4 to 3 each). Sam stayed human.
- The rowdy table chose to start the fight. `15-ch05.html`: "You can also choose to start the Clash yourselves, before anyone rolls." A player then read the next sentence as requiring everyone to roll the obstacle first (issue 4; ruling: no rolls, no obstacle Scent).
- Hounds: "Difficulty 2, Toughness 3, Harm 1" (`22-ch10.html`). The place's tags apply to rolls in the Clash, as in the `16-ch06.html` lawn example.

**Deer-park Clash, round 1 (rolls 33 to 37).** `16-ch06.html`: "Against a threat, a Partial does the job, but the threat’s Harm hits you. A Fail just hits you."

- **Priya** (roll 33) Distracted Hound 1: owl Move 4 +1 Open +1 Silent Wings (Dark) against 2. Partial. The Distract works ("puts the next Strike against it this round at −1 Difficulty"), and Hound 1 bites her for 1 Hurt.
- **Jonah** (roll 34) Struck Hound 1: Force 4 +1 Open +1 Football Player against 2 −1 = 1. Success: 1 harm (Hound 1 at 1 of 3).
- **Theo** (roll 35) Struck Hound 2: Force 3 +1 Open +1 Edge against 2. 0 hits, a Fail. He Pushed (Wild 3 to 2), and roll 37 gave 3 hits: Success, 1 harm (Hound 2 at 1 of 3).
- **Maya** (roll 36) Struck Hound 1: Force 3 +1 Dark +1 Edge against 2. Partial: 1 harm (Hound 1 at 2 of 3), and she takes 1 Hurt. **Edges 0.**
- **Sam** shifted into his rat as his action (Wild 4 to 3). `14-ch04.html`: "A shift during a Clash is always in sight." `16-ch06.html`: "Anyone who shifted during it is Exposed." **Sam Exposed.**

Both Hounds were rolled against, so there were no end-of-round bites ("each threat that nobody rolled against deals its Harm").

**Deer-park Clash, round 2 (rolls 38 to 40).**

- **Priya** (roll 38) Distracted Hound 2: 3 hits with two 6s. A Critical, which adds nothing to a Distract (issue 14; ruling: no Edge).
- **Theo** (roll 39) Struck Hound 2 at Difficulty 1: 3 hits, three 6s. Critical: "2 harm". Hound 2 is out.
- **Jonah** (roll 40) Struck Hound 1: Success. Hound 1 is out.

"A Clash ends when every threat is out." It ended in round 2, before Maya and Sam acted. "+2 if ... someone shifted during it." **Scent 2.** "If you beat the guards ... the obstacle is cleared." Nobody rolled Sneak, so the Tracker-in-a-Clash question (issue 1) didn't come up.

- Hurt: Priya 1, Maya 1.
- Wild: Maya 3, Theo 2, Priya 3, Sam 3, Jonah 3.

**Inside 1, the kennels (rolls 41 to 45).** Narrow, Dark; Sneak 2, Move 3, Sense 3; group; 3 Hounds. Tracker +1 in total (issue 1 ruling). Nobody shifted.

- **Maya** (roll 41): Sneak 6 dice against 2 +1 −1 = 2. Success.
- **Priya** (roll 42): owl Move 4 +1 Silent Wings against 3 +1 Narrow (a Bird Weakness). 4 hits, two 6s: Critical, and an Edge. **Edges 1.**
- **Theo** (roll 43): coyote Sense 4 against 3. Partial.
- **Sam** (roll 44): rat Sneak 4 +1 Narrow against 2 +1 Tracker. 3 hits, two 6s: Critical, and an Edge. **Edges 2.** Under a stacking Tracker this would have been a Partial with no Edge (issue 1).
- **Jonah** (roll 45): bison Sense 3 +1 Pack +1 Edge against 3 +1 Narrow. Partial. **Edges 1.**

All past in round 1. +1. **Scent 3.**

**Inside 2, the servants' door (rolls 46 and 47).** Locked; Force 3, Wits 2; point, 2 progress.

- On the way, Priya shifted back to human (free).
- Round 1 (roll 46): Priya, Wits 3 +1 Brainiac +1 Edge against 2. 1 hit: Partial. **Edges 0.**
- She Pushed (Wild 3 to 2). Roll 47 gave 3 hits, two 6s: a Critical (one 6 was kept from the first roll; "Keep the new result"). That's 2 progress, 2 of 2, door open. Both progress were needed, so no Edge, and the Push removed the Partial's Scent. **Scent 3.**

**Inside 3, the trophy hall (rolls 48 and 49).** High, Dark; Sense 2; point, 2 progress.

- Round 1 (roll 48): Theo, coyote. Sense 4 +1 Help from Maya, the jaguar sniffing the draught behind the panel (Wild 3 to 2). Success, 1 of 2.
- Round 2 (roll 49): Sam, rat. Sense 3 +1 Pack +1 Help from Jonah (Wild 3 to 2). Success, 2 of 2. **Scent 3.**

**The objective: the cellar cage.** Locked, Narrow; Force 3, Wits 2; point, 3 progress; 2 Trappers; "Beating the guards doesn’t clear it."

- The table brought up issue 3 again, then started the Clash themselves, so a Fail at the locks later couldn't net anyone.
- Trappers: "Difficulty 2, Toughness 2, Harm 1". Net: "When you Fail against a Trapper, you’re Netted instead of Hurt."
- The bison's Locked Strength (+1 die) and Narrow Weakness (+1 Difficulty) apply to every roll in this place.

**Cellar Clash, round 1 (rolls 50 to 55).**

- **Sam** (roll 50) Distracted Trapper 1: rat Sneak 4 +1 Narrow against 2. Partial. The Distract works, and Sam takes 1 Hurt. It's a Partial, not a Fail, so no net.
- **Jonah** (roll 51) Struck Trapper 1: Force 4 +1 Locked +1 Football Player against 2 +1 Narrow −1 Distract = 2. 0 hits: a Fail, which would Net him. He Pushed (Wild 2 to 1), and roll 52 gave a Partial: 1 harm (Trapper 1 at 1 of 2).
  - He took 1 Hurt, and Shaggy Coat cancelled it ("Once per scene, when you’d take Hurt, take 1 less").
- **Theo** (roll 53) Struck Trapper 2: coyote Force 3 against 2. Partial: 1 harm, and Theo takes 1 Hurt.
- **Maya** (roll 54) Struck Trapper 2: Success. Trapper 2 is out.
- **Priya** (roll 55), human, Slipped Away from Trapper 1: Move 2 against 2. Partial. She's out, but it's a point obstacle, so "you wait, out of harm’s way, until the Clash ends". The summary page said "past" (issue 8). She takes 1 Hurt (now 2).

Trapper 1 was rolled against, so there were no end-of-round attacks.

**Cellar Clash, round 2 (rolls 56 and 57).**

- **Sam** (roll 56) Distracted Trapper 1: Partial. He takes 1 Hurt (now 2).
- **Jonah** (roll 57) Struck at Difficulty 2: Success. Trapper 1 is out.

The Clash ended in round 2, with nobody Down and no shift: +1. **Scent 4.** The guards are beaten, and "you keep the progress you’ve made and carry on rolling, without the guards". That's 0 of 3 so far. The players asked whether Shaggy Coat and Pack come back now (issue 6; ruling: the Clash was its own scene, and the cage carries on as a new one).

**Cellar cage, without guards (rolls 58 to 61).**

- **Round 1** (roll 58): Priya, Wits 3 +1 Brainiac against 2. 0 hits. She Pushed (Wild 2 to 1), and roll 59 gave a Success: 1 of 3.
  - In the same round, Maya and Theo shifted back to human as their actions so they could Help her Wits. `14-ch04.html`: "So is a shift you take as your action at an obstacle", which means out of sight. Shifting back is free.
- **Round 2** (roll 60): Priya, +1 Brainiac +1 Help from Maya (Wild 2 to 1). Theo's Help was refused: "A perk’s extra die counts towards the Cap" (issue 12). Success: 2 of 3.
- **Round 3** (roll 61): Priya, +1 Brainiac +1 Help from Theo (Wild 2 to 1). Success: 3 of 3. The cage is open.

`35-ch17.html`: "Kit is too weak to shift; he goes where you go, and doesn’t roll" (issue 15 on Kit in the Escape). **Scent 4**, so all of the Lodge's Escape is On the Trail (4 is half of 7, rounded up).

**Escape 1, the lawn (rolls 62 to 66).** Open; Sneak 3, Move 2; group; +1 On the Trail.

On the way:

- Theo shifted to coyote (Wild 1 to 0) and Priya to owl (1 to 0).
- Sam Patched Up Priya as his free action (Sam 3 to 2; Priya Hurt 2 to 1).

Round 1:

- **Theo** (roll 62): coyote Move 3 +1 Open against 3. Partial.
- **Jonah** (roll 63): bison Move 3 +1 Open against 3. Partial.
- **Priya** (roll 64): owl Move 4 +1 Open against 3. Partial.
- **Maya** (roll 65): human Sneak 3 +1 Hide-and-Seek against 4. Partial.
- **Sam** (roll 66): rat Sneak 4 +1 Pack against 3 +1 +1 Open. Partial.

All past. In the Escape, Partials cost no Scent. **Scent 4.**

**Escape 2, the wall (rolls 67 to 73).** High; Force 3, Move 2; group; +1. On the way, Maya shifted to jaguar (Wild 1 to 0).

Round 1:

- **Priya** (roll 67): owl Move 4 +1 High against 3. Fail.
- **Theo** (roll 68): coyote Move 3 against 2 +1 +1 High. Partial.
- **Jonah** (roll 69): bison Force 4 +1 Football Player against 4, breaking the rotten gate. Partial.
- **Maya** (roll 70): jaguar Move 3 +1 High against 3. Critical: an Edge. **Edges 1.**
- **Sam** (roll 71): rat Move 3 +1 Pack against 3. Fail.

Round 2:

- **Priya** (roll 72): Move 4 +1 High +1 Edge against 3. Partial. **Edges 0.**
- **Sam** (roll 73): Move 3 +1 Help from Jonah (Wild 1 to 0) against 3. Success.

Everyone is past, so the mission ends. The obstacle had Fails, so +1 as it ends. **Final Scent 5 of 7.**

**Result: Win.** Kit is free, and nobody was Taken.

- Unspent Wild lost: Sam 2. 19 of 21 tokens were spent.
- End Hurt: Priya 1, Maya 1, Theo 1, Sam 2, Jonah 0. It all clears.
- Exposed: Sam.

### Campaign step after the Lodge

- Hunt track: Win, so it stays at **0**.
- Growth: everyone reaches 2 and chooses (`18-ch08.html`):
  - Maya: Wild Sense (Dark: "It now works in human form too").
  - Theo: +1 to human Sense (1 to 2; "to a maximum of 3").
  - Priya: +1 Wild (starts at 5).
  - Sam: +1 Wild (starts at 6: "to a maximum of 6, counting the Gamer perk"). The sheet's six Wild pips fit.
  - Jonah: a second human perk, Team Captain (issue 17).
- Exposed: Sam, so "The next mission starts at Scent 1 ... After that mission, Exposed clears."
- Kit is home. There's no Taken friend to carry.

### What was exercised, and what wasn't

**Exercised in play:**

- Scouting: a Partial with a Push, and a Success.
- A point way in and a guarded group way in.
- Point and group obstacles.
- Criticals that gave extra progress (rolls 3, 47) and Criticals that gave Edges (rolls 6, 18, 24, 42, 44, 70).
- The Edge maximum of 2 (rolls 32 and 44).
- Partial Scent at a point obstacle (roll 17), and the single group-obstacle rise.
- Escape Partials costing nothing, and On the Trail on all four Escape obstacles.
- The Cap, on both dice and Difficulty, including refusing a Help (roll 60).
- Seven Pushes (rolls 2, 12, 17, 37, 47, 52, 59).
- Help with Wild and with Pack. Edges from the Captain, scouting and Criticals.
- Shifts: between obstacles, as an action at an obstacle, in a Clash (Exposed, +2), and with no Wild by taking Hurt.
- Patch Up between obstacles, twice.
- Clash actions: Strike (Success, Partial and Critical), Distract (Partial and Critical), Slip Away (Partial, at a point obstacle).
- Choosing to start a Clash, twice. Guards beaten at a group obstacle and at a point objective.
- The prize: taken, carried and handed over.
- Every animal perk and human perk of the five Bonded in play.
- The Win result, the Hunt track, Growth to 1 and to 2 with choices, and Exposed going into the campaign.

**Not reached by the dice:**

- The Hunt Up, keep going or Withdraw, and a Fail while the Hunt is Up.
- Netted and freeing a Netted friend.
- Down and Stuck.
- Taken, the prize lost, a replacement character, and rescuing a Taken team member.
- Costly Win and Loss, and movement on the Hunt track.
- A dangerous obstacle.
- Round 4 of a Clash, and a group obstacle past round 3.
- A Slip Away Success.

Issues 2, 3, 5, 9, 15 and 19 come from the table reading ahead on those paths.

## 4. What worked

- **The roll is fast.** The rule of result first, then cost, never confused anyone, and nobody needed the odds table after the first few rolls.
- **The Cap works.** It's easy to apply, it bit at the right moment (roll 60), and it kept the best pools at six dice without making them silly.
- **Form choice mattered almost every gap:**
  - Priya flipping between owl and human for Wits.
  - Maya and Theo giving up an action to go human just to Help a Wits roll.
  - Jonah staying human at the Crowd case.
  - Theo noticing that High cost him nothing at a group obstacle.
- **The two missions play differently.** The Gala's Spotlights are accurate: Canines and Critters own the ballroom and steps, and Cats and Birds the halls and galleries. The Lodge's kennels and cellar punished the bison exactly as its Spotlights warn ("the cellar is too Narrow for a Heavy to work in").
- **Point obstacles are where the tension is.** The Trophy case, with a Huntsman waiting and Scent at 3 and then 4, was the best ten minutes of the night. Every Push there felt like a real decision.
- **Clashes are clean.** The Distract-then-Strike combination ran exactly like the `16-ch06.html` example. "Every threat needs somebody rolling against it" drove who did what, and both Clashes were over in two rounds.
- **The paperwork holds up.** The mission tracker and character sheet held everything we tracked. The round card and At the Table page agreed with the chapters on every point used, except issues 8 and 16. The maps match the obstacle tables.
- **The campaign step is quick.** It took about ten minutes, and the Growth choices were easy to read.

## 5. How it felt

**Was losing a real risk?** At the Gala, yes. Scent reached 5 of 6, and the hinge was roll 16. If Priya hadn't had a Wild left for the Push, her Fail at the case would have meant Scent 4 and a Clash with the Huntsman (Difficulty 3, Toughness 4, Harm 2) with the case still shut. That Clash's end would have added 1 or 2, and the Hunt would very likely have been Up before the pendant came out.

At the Lodge, no. A Limit of 7 with a Scent 0 start and a Successful scout gave a lot of room. Scent reached 5 only as the mission ended.

Five experienced players with full Wild turned two Hard missions into two Wins. The Hard label held better at the Gala (Limit 6) than at the Lodge.

**Was Wild spent?** Yes: 16 of 21 tokens at the Gala and 19 of 21 at the Lodge. Mostly it went on shifts (7, then 8), then Helps (5, then 6), then Pushes (3, then 4), plus one Patch Up each. Four Pushes (rolls 12, 17, 47, 59) each saved a key roll. The book's advice to spend is right.

**Was there a dominant tactic?** Several strong habits, none quite game-breaking:

- **Big pools are routine.** Perk plus Strength gave Maya and Priya six dice in their places, routinely. There were ten Criticals in 73 rolls, almost all from five- and six-dice pools, so Edges flowed: 9 were gained over the two missions, counting the Captain's.
- **Theo's Pack is a free Help nearly every scene.** He gave 9 free Helps in 14 obstacle and Clash scenes. It's the strongest perk at a five-player table.
- **At an unguarded group obstacle, never Push after the first Fail.** The obstacle's Scent rises once, whoever Fails. Once one Partial (or, in the Escape, one Fail) is in, every other Fail is a free reroll until round 4.
- **With five players, group obstacles cost +1 almost whatever you do.** One Partial among five rolls is close to certain, so the Difficulty there hardly matters, and only "at least a Partial" counts. That's why starting the Clash at a guarded group obstacle (the deer park) is as cheap as sneaking it, if the fight is quick.
- **The Escape is safe unless the Hunt is already Up before it.** Partials are free, Fails only mean another round, and the last obstacle's Scent rise lands as the mission ends. On the Trail is the only Escape pressure.
- **The all-Slip-Away trick (issue 3) could become the answer to every guarded objective** if a table spots it.

**Did anything break?** No rule stopped play. The ruling that changed the most was Tracker stacking (issue 1): it decided one Critical and the Edges after it. The biggest gap in this test is what it couldn't reach. The Hunt was never Up, and nobody was Netted, Down, Stuck or Taken, so those rules and the Taken-friend campaign rules still need a table whose dice go badly. Test A or C, or a re-run of this one, should aim there.

**How long would it take?** The Gala was 31 rolls with one prize hand-over and no Clash. The Lodge was 42 rolls with two short Clashes. At a real table of five, with arguing over forms before each obstacle, I'd expect the Gala to take about 1.5 to 2 hours and the Lodge 2 to 2.5 hours, plus about 15 minutes for each campaign step. That's within the book's "two or three hours" a mission.
