# Second Nature, playtest round 1: drills

Rules source: the book only (`book/src/chapters/`, read in order, and `book/dist/Second_Nature_v0.1.pdf`, which was built after the last chapter edit and matches the HTML text). Every roll is in `book/playtests/round1-drills-dice.md` (rolls 1 to 122), labelled with its drill number. Characters are the six ready-made Bonded from Chapter 18. Where a drill says "set by hand", the starting state (Scent, Hurt, Wild, Netted, who has already rolled) was set before the drill. Where a character declined a Push or a Help, that choice was made to force the case being drilled, and it is noted.

## 1. Verdict

NOT CLEAN: two blockers (a Down character can stall a group obstacle forever; the campaign has two different "next missions" after a total wipe late in the Hunt track) and eight confusing rulings the table had to settle itself, most of them inside a mission (Clash endings, the Hunt going Up mid-obstacle, Down friends).

## 2. Issues

Issues are listed most severe first.

### Issue 1. A Down character at a group obstacle can never get past, so the obstacle never ends

- **Severity:** blocker.
- **Where:** `15-ch05.html`, Group obstacles: "Each round, everyone who isn’t past yet rolls, and each gets past on their own Partial or better. Those already past can still Help. When everyone is past, the obstacle is done." Also the Results box: "If anyone still isn’t past after the third round, Scent also rises by 1 at the end of every round after that." Against `17-ch07.html`, Down: "When your third Hurt box is marked, you’re Down. You can’t act until the scene ends." and "When the scene ends, if a friend is still standing and the Hunt isn’t Up, you get back up with 2 Hurt and you’re past the obstacle: your friends carried you."
- **What went wrong (Drill 1a, rolls 8 to 10):** at the Zoo's river culvert (dangerous group obstacle), Sam and Priya were both at 2 Hurt and Failed, so they went Down. Lucía was past. The Down pair can't roll, so they can't get past. The obstacle ends only "when everyone is past", and they only become past "when the scene ends". The scene is the obstacle, so it never ends. Read literally, Scent also climbs by 1 every round from round 4 until the Hunt is Up. After that the Down pair would be Taken at a scene end that still never comes. Chapter 19 ("Down at 3: out until the scene ends") and the round card (step 2: "Group: everyone not yet past rolls") repeat the same loop. This happens at the three dangerous ways in (culvert, millrace, ice-house tunnel), and at any dangerous group obstacle a Storyteller builds with Chapter 12.
- **Suggested fix:** in Chapter 5, add: "Down characters don’t roll and don’t count as not past: when everyone who can still act is past, the obstacle ends and Down friends are carried through (Chapter 7)." Have the round-3 rule count only characters who can roll. Mirror it in Chapter 19 and on the round card.
- **Ruling to use tonight:** the group obstacle ends when everyone who can still roll is past; Down friends then get up with 2 Hurt and are past (or are Taken if nobody is standing or the Hunt is Up).

### Issue 2. A total wipe that takes the Hunt track to 6 has two "next" missions

- **Severity:** blocker (campaign only, and narrow, but the table cannot choose the next mission from the rules).
- **Where:** `18-ch08.html`, The Hunt Track: "When it reaches 6, the Last Hunt comes early: the next mission is the Last Hunt." Everyone Taken: "If the whole team is Taken, play a Breakout next: every player makes a new Bonded (or takes a ready-made one), and the new team runs The Lodge on the Hill to free the old one."
- **What went wrong (Drill 9, paper campaign):** the Hunt track is at 4. The team is wiped (as in Drill 2 or Drill 8c), which is a Loss, so the track rises by 2 to 6. Both rules say what the next mission must be, and they disagree. Nothing in Chapter 8, Chapter 19 or the mission tracker ("at 6 the Last Hunt comes early") breaks the tie. It also matters whether the Last Hunt is played by a new team, whether the old team is still caged during it, and whether the full-moon deadline still applies.
- **Suggested fix:** state the priority in Chapter 8. For example: "If both happen, play the Breakout first; the Last Hunt is the mission after it." Or fold the two together: "The Last Hunt is played by the new team, and freeing the old one is an extra objective."
- **Ruling to use tonight:** play the Breakout first, then the Last Hunt (with its Limit lowered by 1, since the track is 4 or more).

### Issue 3. The Hunt goes Up between a guarded group round's Fail and the Clash it starts

- **Severity:** confusing (core flow; three readings with very different results).
- **Where:** `15-ch05.html`, Guarded obstacles: "At a group obstacle, finish the round’s rolls first, and the obstacle raises Scent for them then (+1 for any Partial or Fail); then the whole team is in the Clash, including anyone already past." Against the Hunt is Up box: "From now on, any Fail means you’re Taken, wherever you are. A Fail at a guarded obstacle doesn’t start a Clash any more: you’re just Taken." Chapter 19 (`42-ch19.html`) and the round card (`47-sheet-round.html`) instead time a group obstacle's Scent "when it ends", so a table using them raises it after the Clash.
- **What went wrong (Drill 3b run 2, rolls 52 to 61):** at the Hound patrol, Scent was 7 of 8. Priya Failed while the others passed. The round's +1 reached the Limit before the Clash. Reading A: the Fail came first, so the Clash happens, fought with the Hunt Up. Reading B: the Clash hasn't started, so Priya is "just Taken". Reading C: no Clash, and Priya is simply not past. With Chapter 19's timing, the Clash would be fought with the Hunt not yet Up, and the Limit reached only afterwards. I played reading A: everyone Slipped Away, and Priya and Lucía survived only by Pushing their Fails.
- **Suggested fix:** add one sentence to Chapter 5: "If that Scent brings the Hunt Up, the Clash still happens, fought with the Hunt Up." (Or the reverse, if that's the intent.) Change Chapter 19 and round card step 4 to say a guarded group obstacle raises its Scent before the Clash, not when it ends.
- **Ruling to use tonight:** the Clash happens, and it's fought with the Hunt Up (any Fail in it is Taken).

### Issue 4. A Clash's own Scent rise reaches the Limit while a friend is Down or Netted: up, or Taken?

- **Severity:** confusing (core flow; the text leans one way, but both triggers happen at the same moment).
- **Where:** `16-ch06.html`: "When a Clash ends, Scent rises once: +1, or +2 if it reached round 4, someone went Down, or someone shifted during it." `17-ch07.html`: "When the scene ends, if a friend is still standing and the Hunt isn’t Up, you get back up". `15-ch05.html`: "Anyone still Down or Netted when the scene ends is Taken."
- **What went wrong (Drill 3c, rolls 62 to 69):** in the mill grain store, Scent was 5 of 7. Maya went Down, so the Clash ended in round 2 with Scent +2, to 7. Whether Maya gets up or is Taken depends on which happens first. Going Down is itself what adds the extra Scent, so near the Limit it is often what puts the Down friend in the cage. Chapter 6 ("After a Clash, Down and Netted friends get back up if anyone is still standing and the Hunt isn’t Up") and the round card's step order point to Scent first, but no passage says so.
- **Suggested fix:** in Chapters 6 and 7, say "When a Clash ends, raise Scent first, then check Down and Netted friends" (or the reverse, if the designers want it gentler).
- **Ruling to use tonight:** raise the Clash's Scent first, then check Down and Netted friends.

### Issue 5. Everyone Taken after the objective is done: Costly Win or Loss?

- **Severity:** confusing.
- **Where:** `15-ch05.html`, How It Ends: Costly Win "The objective is done, but someone is Taken."; Loss "The objective isn’t done: you Withdrew, the prize was lost, or everyone was Taken." `17-ch07.html`: "If every character is Down, Netted or Taken at the same moment, nobody is left to help: everyone is Taken, and the mission is a Loss." `31-ch13.html`, After the Mission: "Loss: in the morning a grey van takes the cages up the hill."
- **What went wrong (Drill 8c, rolls 114 and 115):** the pet shop cages were open, the Hunt was Up, and two of four characters were already Taken. The last two Failed in the Escape, so everyone was Taken. Costly Win fits word for word (the objective is done, someone is Taken). The Loss line files "everyone was Taken" under "The objective isn’t done", which isn't true here. The mission's Loss text describes cages that never opened.
- **Suggested fix:** rewrite the Loss line as "The objective isn’t done (you Withdrew, or the prize was lost), or everyone was Taken, even if it was done", and give each mission a line for "the job was done but everyone was caught".
- **Ruling to use tonight:** a Loss (the Hunt track rises by 2, and a Breakout is next); narrate that the animals got out but the team didn't.

### Issue 6. Can Patch Up bring a Down friend back?

- **Severity:** confusing.
- **Where:** `17-ch07.html`, Patch Up: "Spend 1 Wild and your action to heal 1 Hurt, yours or a friend’s." Down: "When your third Hurt box is marked, you’re Down. You can’t act until the scene ends."
- **What went wrong (Drills 1a, 1b, 2):** each time a friend went Down, the table asked whether a Patch Up would bring them back. If it does, it would also have broken Drill 2's wipe and Issue 1's stall. Down is triggered by the third box but lasts "until the scene ends", and nothing says whether removing the box ends it.
- **Suggested fix:** add one line to Chapter 7, either "Patching Up a Down friend heals the Hurt, but they stay Down until the scene ends" or "A Down friend who is Patched Up is back up."
- **Ruling to use tonight:** the box heals, but the friend stays Down until the scene ends.

### Issue 7. "Nobody is left in it", and guards who pull back because everyone slipped away

- **Severity:** confusing.
- **Where:** `16-ch06.html`: "A Clash ends when every threat is out, when nobody is left in it, or at the end of round 4. Then any threats still standing pull back to wait for the Masters." and "If the Clash started at a guarded obstacle, beating the guards (or seeing them pull back) clears it, unless the obstacle still needs progress." `15-ch05.html`: "If you beat the guards (or they pull back after round 4), the obstacle is cleared, unless it says progress is still needed. In that case you keep the progress you’ve made and carry on rolling, without the guards."
- **What went wrong (Drill 5b, rolls 93 to 96):** at the Zoo crates, three characters Slipped Away and Sam was Netted. Does a Netted (or Down) character count as "left in it"? Read literally, he does: the Clash runs to round 4, both Trappers bite the only target each round, and it ends at +2 with Sam Down. Read the other way, the Clash ends at once at +1 and Sam is freed unhurt. Those who slipped away have no stated way back in to free him. Second, when everyone slips away at a point objective, Chapter 6 lets the guards' pulling back clear them, but Chapter 5 only says so for round 4. So it's unclear whether the team carries on "without the guards". If it does, slipping away (Difficulty 2, and a Partial still works) removes two Trappers far more cheaply than beating them.
- **Suggested fix:** say in Chapter 6 whether Down and Netted characters keep a Clash going. Align Chapters 5 and 6 on whether guards who pull back for any reason are gone.
- **Ruling to use tonight:** a Netted or Down character keeps the Clash going; guards who pull back for any reason are gone for the rest of that obstacle.

### Issue 8. Chapter 19 says the between-obstacles Shift or Patch Up is "free"

- **Severity:** confusing (the one-page summary contradicts the full rule).
- **Where:** `42-ch19.html`, Shifting: "Between obstacles, everyone may Shift or Patch Up once for free." Against `14-ch04.html`: "And as you move from one obstacle to the next, everyone may Shift or Patch Up once without it using an action." and its example: "Jonah shifts into his bison on the way, which costs him 1 Wild but no action".
- **What went wrong (Drills 3d, 7):** every Escape began with the between-obstacles shift. A table reading only Chapter 19 would shift (and Patch Up) without paying Wild. That's a large free gain, since Wild is the game's main resource.
- **Suggested fix:** in Chapter 19, write "once without using an action (it still costs Wild)".
- **Ruling to use tonight:** no action, but it still costs 1 Wild (shifting back is free, as always).

### Issue 9. Does the Hound Tracker stack, and does it apply in a Clash?

- **Severity:** confusing.
- **Where:** `22-ch10.html`, Hound: "Tracker: Sneak rolls at an obstacle a Hound guards are at +1 Difficulty." (The Huntsman's Trophy uses the same wording.)
- **What went wrong (Drills 4c and 6, rolls 73 to 80 and 97 to 98):** the Lodge kennels have 3 Hounds and the Gala halls 2. Is the Sneak Difficulty +1, or +1 per Hound (Sneak 5 at the kennels)? I ruled +1, and the results would have changed under +3: Sam's 3 hits with two 6s would drop from a Critical to a Partial (roll 73). It's also unstated whether the Tracker and Trophy apply to Sneak rolls in a Clash at that obstacle (Distract or Slip Away). I applied the Trophy to Maya's Slip Away, making it Difficulty 5.
- **Suggested fix:** "+1 Difficulty however many Hounds guard it, including Sneak rolls in a Clash there."
- **Ruling to use tonight:** one +1 per obstacle, and it applies to Sneak rolls in a Clash there.

### Issue 10. The rescue deadline, and the undefined "extra objective"

- **Severity:** confusing (campaign).
- **Where:** `18-ch08.html`: "The Hunt means to bind their Bond into a new Trophy on the next full moon, which in a campaign means within the next two missions." and "If a Taken friend isn’t rescued before the full moon, the Hunt makes their Trophy." Also: "or a Storyteller can add the rescue as an extra objective to another mission."
- **What went wrong (Drill 9):** Priya was Taken in mission 1, and mission 2 wasn't a rescue. The table couldn't tell whether a Lodge rescue in mission 3 is in time ("within the next two missions" could mean the moon falls during mission 3). The "extra objective" route has no rules: no obstacle, no progress, and no effect on Win, Costly Win or Loss if it fails.
- **Suggested fix:** "A Taken friend can be rescued on either of the next two missions; after the second, the Hunt makes their Trophy." Then give the extra objective as a point obstacle (say, 2 progress), and say that failing it doesn't change the mission's result.
- **Ruling to use tonight:** a rescue on either of the next two missions is in time; an extra-objective rescue is a 2-progress point obstacle, Locked, Force 3 or Wits 2.

### Issue 11. Chapter 19 says Slip Away always gets you past

- **Severity:** minor.
- **Where:** `42-ch19.html`: "Slip Away (Move or Sneak; you’re out and past)". Against `16-ch06.html`: "At a group obstacle you’re past it; at a point obstacle you wait, out of harm’s way, until the Clash ends."
- **What went wrong (Drill 5b):** at the Zoo crates (a point obstacle), Chapter 19 suggests the characters who slipped away are past the objective, which has no meaning there.
- **Suggested fix:** "(you’re out; at a group obstacle you’re also past)".
- **Ruling to use tonight:** at a point obstacle you're out of the Clash but not past; wait for it to end.

### Issue 12. The round-after-three Scent in the round the obstacle ends

- **Severity:** minor.
- **Where:** `15-ch05.html`: "If anyone still isn’t past after the third round, Scent also rises by 1 at the end of every round after that." and the Scent box: "It rises for Partials and Fails at obstacles, once at the end of each Clash, for a shift the Hunt can see, and for a poor scouting roll. Nothing else raises it."
- **What went wrong (Drill 4b, rolls 70 to 72):** Sam got past in round 6. Chapter 19 ("+1 for every round after the third") and the round card count round 6 too, giving Scent 2 to 6. Chapter 5 can be read as "only while someone is still not past at the round's end", giving 5. The Scent box's "Nothing else raises it" leaves this rise out.
- **Suggested fix:** "...at the end of each later round, including the one in which the last character gets past". Add it to the Scent list.
- **Ruling to use tonight:** count the round in which the last character gets past.

### Issue 13. Prize handling between obstacles, and at the very end

- **Severity:** minor.
- **Where:** `15-ch05.html`: "Handing it to a friend at the same obstacle takes your action, with no roll. If you shift, it drops at your feet: picking it up takes an action at an obstacle or in a Clash, but between obstacles it’s free." and "When everyone still free is past the last Escape obstacle, the mission ends."
- **What went wrong (Drills 7 and 7b, rolls 99 to 107 and 117 to 122):** Priya handed the pendant to Theo between Escape 1 and Escape 2, and no cost is given for that (only picking it up is free). In the variant with a guard on Escape 2, Theo's mid-Clash shift dropped the pendant. Had Maya not spent her action to pick it up, it would have lain on the steps when the last obstacle ended. There's no "between obstacles" after the last one, so nothing says whether it's lost.
- **Suggested fix:** "Handing it over between obstacles is free." and "A prize left lying when the mission ends is lost" (or "...is picked up as you leave").
- **Ruling to use tonight:** a hand-over between obstacles is free; a prize on the ground when the mission ends is lost.

### Issue 14. Withdraw "at any time"

- **Severity:** minor.
- **Where:** `15-ch05.html`: "The team may Withdraw at any time: give up on the objective and go straight to the Escape."
- **What went wrong (Drill 8, paper):** the earliest possible Loss is Withdrawing right after scouting, before the way in. The team would then run Escape obstacles on the far side of a building it never entered. Withdrawing mid-Clash doesn't say what happens to the Clash's Scent or to Down and Netted friends.
- **Suggested fix:** "Withdrawing before the way in ends the mission at once (a Loss). Withdrawing during a Clash ends it as if nobody were left in it."
- **Ruling to use tonight:** a Withdraw before the way in ends the mission with no Escape; a mid-Clash Withdraw ends the Clash (raise its Scent and check Down and Netted friends) and then goes to the Escape.

### Issue 15. Shaggy Coat against the Hurt paid to shift

- **Severity:** minor.
- **Where:** `14-ch04.html`: "Out of Wild? You can still shift into your animal by taking 1 Hurt instead, unless that would put you Down." `12-ch02.html`, Bison: "Once per scene, when you’d take Hurt, take 1 less." and "Animal perks work only in animal form."
- **What went wrong (Drill 6, paper):** Jonah, with no Wild, shifts by paying 1 Hurt. Is he a bison when the Hurt lands? If so, he gets one free shift every scene.
- **Suggested fix:** "The Hurt is paid before you change."
- **Ruling to use tonight:** Shaggy Coat doesn't reduce the Hurt paid to shift.

### Issue 16. What a "scene" is when a Clash interrupts a point obstacle

- **Severity:** minor.
- **Where:** `15-ch05.html`: "A scene is one obstacle, or one Clash. “Once per scene” abilities come back at the start of every scene."
- **What went wrong (Drills 1c and 5b):** at the Zoo crates, the obstacle, then the Clash, then the rest of the obstacle could be one, two or three scenes. That changes when once-per-scene perks (Pack, Shaggy Coat, Wily, Burst) come back. Chapter 6 settles the Down and Netted timing ("After a Clash"), but not this.
- **Suggested fix:** "A Clash that interrupts an obstacle is its own scene; the rest of the obstacle after it is a new scene."
- **Ruling to use tonight:** as in the suggested fix.

### Issue 17. The Zoo crates' nets

- **Severity:** minor.
- **Where:** `32-ch14.html`: "If you Fail while the Trappers are there, they come at you with nets." Against `17-ch07.html`: "When you Fail against a Trapper, you’re Netted instead of Hurt."
- **What went wrong (Drill 1c):** a table can read the crates' text as "a Fail at the crates nets you", but a Wits or Force roll at a lock isn't a roll against a Trapper. Chapters 15, 16 and 17 all say "it’s a Clash".
- **Suggested fix:** use the same wording as the other missions: "If anyone Fails while the Trappers are there, it’s a Clash."
- **Ruling to use tonight:** a Fail at the crates starts a Clash; nobody is Netted until they Fail against a Trapper in it.

### Issue 18. Small campaign gaps

- **Severity:** minor.
- **Where:** `18-ch08.html`: "After every mission, whatever the result, every character marks 1 Growth."; "A second human perk."; "A new character starts with Growth equal to the lowest in the group."; "Build it as a Hard mission (Chapter 12) at the place the campaign has been leading to."; "Win it, and ... Lose it, and the story isn’t over".
- **What went wrong (Drill 9, paper):**
  - Does a caged character mark Growth?
  - Can the second human perk repeat the first (two Football Players for +2 Force dice)?
  - In a Breakout everyone is new, so "the lowest in the group" has no group to measure against.
  - The Last Hunt has no Costly Win line, and Chapter 12 has no Hard-specific building steps beyond copying a Part Three Limit.
- **Suggested fix:** one sentence each.
- **Ruling to use tonight:**
  - Caged characters mark Growth.
  - The second perk must be different.
  - A Breakout team starts at the Taken team's lowest Growth.
  - A Costly Win at the Last Hunt counts as a Win.
  - Build the Last Hunt from the Lodge's Limit (7, then 6 if the track is 4 or more).

### Issue 19. What can a character who is already past, or who slipped away, still do?

- **Severity:** minor.
- **Where:** `15-ch05.html`: "Those already past can still Help." `16-ch06.html`: "at a point obstacle you wait, out of harm’s way, until the Clash ends."
- **What went wrong (Drills 1a and 5b):** Lucía was past the culvert and wanted to Patch Up a Down friend. At the crates, Theo had slipped away and wanted to free the Netted Sam. Only Help is mentioned.
- **Suggested fix:** list what past characters may do.
- **Ruling to use tonight:** characters past a group obstacle may Help, Patch Up and hand over the prize; characters who slipped away from a Clash may only Help, and can't re-enter it.

## 3. Drill log

Pools are written as dice and Difficulty, for example "5d vs 2". Characters: Maya (Jaguar), Theo (Coyote), Priya (Barn Owl), Sam (Brown Rat), Jonah (Bison), Lucía (Alligator), from Chapter 18.

### Drill 1. Failure states and recovery

**1a. Hurt to Down at a dangerous group obstacle.** Zoo, way in B, the river culvert (Water, Narrow, Dark; Sneak 2, Move 2; group; "Dangerous: a Fail deals 1 Hurt."). 3 players, Limit 8, Scent 0.
- **Run 1 (rolls 1 to 3):** Lucía, as an alligator, Sneaks with 5d vs 1 (Sneak 3, +1 for her Strength, +1 Swim Team; Lurker brings the Difficulty to 1), one hit, a Success. Sam the rat, 5d vs 2, Success. Priya, human with 2 Hurt (set by hand), Move 2d vs 2, one hit, a Partial, so she's past. The obstacle ends after round 1 at Scent +1 ("At a group obstacle, Scent rises once, when the obstacle ends"). No Down.
- **Run 2 (rolls 4 to 7):** Sam Fails, Pushes (roll 7) and gets a Success. Since "Keep the new result", the obstacle costs no Scent. No Down.
- **Run 3 (rolls 8 to 10):** Sam and Priya were both set by hand to human, 2 Hurt and 0 Wild, and Lucía didn't Help. Both Fail, take 1 Hurt each, and go Down. Lucía is past. The obstacle cannot end (Issue 1). Using tonight's ruling, it ends, both get up with 2 Hurt and are past, and Scent goes from 0 to 1. They were human, so neither is Stuck.

**1b. Down in animal form (Stuck).**
- **Run 1 (rolls 11 to 13):** the pet shop floor (Dark; Beater). The team chose to start the Clash before anyone rolled (Chapter 5: "You can also choose to start the Clash yourselves, before anyone rolls"). That costs no obstacle Scent, since there were no Partials or Fails. Sam the rat Distracts (4d vs 2), a Success. Jonah the bison Strikes at Difficulty 1, a Success (1 harm). Maya the jaguar Strikes, a Partial: 1 harm, which puts the Beater out, and 1 Hurt to Maya. The Clash ends in round 1, Scent +1. Beating the guard clears the obstacle. No Down.
- **Run 2 (rolls 14 to 20):** the mill grain store (Dark, Narrow; a Beater and a Hound), with the team starting the Clash. Sam the rat, at 2 Hurt (set), Distracts the Hound with Move (4d vs 2, counting his Narrow Strength) and Fails. He Pushes (roll 15) and gets one hit, a Partial: the Distract works, and the Hound's Harm takes him to 3 Hurt. He's Down as a rat, so he's Stuck. Jonah Strikes the Hound with 5d vs 2 (2, −1 for the Distract, +1 for his Narrow Weakness, which the Cap doesn't limit), a Partial. The Hound takes 1 harm, and Shaggy Coat cancels its bite. Maya's Partial and Lucía's Critical put the Beater out. In round 2, Maya Distracts the Hound (a Success) and Jonah's Critical puts it out. The Clash ends in round 2 at Scent +2 ("someone went Down"). Sam gets up with 2 Hurt, is past, and stays a rat until the mission ends (Chapter 4, Stuck). That's clean.

**1c. Netted and freed by a friend.**
- **Run 1 (rolls 21 to 26):** the Zoo crates (Locked; 2 Trappers; "Beating the guards doesn’t clear it"), with the team starting the Clash. Priya, human, gets two Partials while Distracting. Each one costs her 1 Hurt and doesn't net her ("a Partial does the job, but the threat’s Harm hits you"; the Net is only "When you Fail against a Trapper"). Jonah Strikes with 6d at the Cap (Force 4, Football Player, and Locked, a Heavy Strength in this place), a Critical. Theo puts the other Trapper out. The Clash ends in round 2 at +1, and the crates still need progress, so the team carries on "without the guards". Nobody was Netted.
- **Run 2 (rolls 27 to 28):** the Lodge cellar (2 Trappers). Lucía, human, Strikes on 1d and gets a Partial. Priya, human, Strikes on 1d (chosen to force the case) and Fails, so she's Netted instead of Hurt. Theo spends his action to free her, with no roll. That's clean.

**1d. Netted at the end of a scene with a friend standing (rolls 29 to 31).** The Zoo crates. Set by hand: Priya Netted, Trapper A on 1 harm. Jonah gets a Success, Theo's Critical puts A out, and in round 2 Jonah's Critical puts B out. The Clash ends in round 2 at +1. Priya is still Netted at the end of the scene, but friends are standing and the Hunt isn't Up, so she's freed. That's clean.

**1e. Down or Netted at the end of a scene with nobody standing.** In practice this case is always reached through Chapter 7's "Everyone at Once" (Drill 2). The moment the last character falls, everyone is Taken, before the scene ends. The scene-end clause in the Taken box is redundant but consistent.

**1f. Taken.** Drills 8 and 8c (Failing with the Hunt Up). **Exposed:** Drill 5 (Priya shifts during a Clash) and Drill 7b (Theo shifts during a Clash). Being Taken also Exposes you (Chapter 7). That's clean.

### Drill 2. Everyone Down, Netted or Taken at once (rolls 32 to 34)

The Lodge cellar, 3 players. Set by hand: Lucía Netted; Priya (human) and Theo (coyote) on 2 Hurt; two fresh Trappers. Priya Distracts with Move 2d vs 2 and Fails, so she's Netted. Theo Strikes with 3d vs 2, Fails, Pushes (roll 34) and Fails again, so he's Netted. All three are Netted at once. Chapter 7: "If every character is Down, Netted or Taken at the same moment, nobody is left to help: everyone is Taken, and the mission is a Loss." That's clean. (Before Theo's roll, the table asked whether a Patch Up could have kept someone standing; see Issue 6.)

### Drill 3. The Hunt is Up

**3a. On a point obstacle, pressing on (rolls 35 to 42).** The pet shop, 4 players, Limit 6, Scent 5 (set).
1. At the office door, Priya (human, Wits 3 plus Brainiac, 4d vs 2) gets a Critical: 2 progress clears it, with no Scent.
2. At the cages (3 progress), round 1 is a Partial: 1 progress, and Scent +1 reaches 6. The Hunt is Up. "Finish resolving the roll that did it" and Chapter 3's "the result comes first" make the order clear.
3. The objective isn't done, so the team chooses. Following the advice ("Press on only if you’re already working on the objective"), they press on.
4. Round 2, with Theo Helping as a human: 5d, a Success, 2 of 3.
5. Round 3 is a Partial, 3 of 3, and the cages open. The extra Scent is lost ("Any Scent past the Limit is lost").
6. The Escape (Out the back) is On the Trail and has the Hunt Up. Everyone takes the free shift (paying Wild). Priya the owl rolls 6d vs 3, Theo the coyote and Jonah the bison 4d vs 3 each, and Maya the jaguar Sneaks with 6d vs 2 (2, +1 On the Trail, −1 Night Rosettes). All four get Partials and all are past, costing no Scent ("In the Escape, Partials cost no Scent"). It's a Win, with the Hunt Up on the last roll.

**3a-W. On a point obstacle, Withdrawing (rolls 43 to 47).** At the office door at Scent 5, a Partial makes 1 of 2 progress, and the Hunt is Up at an inside obstacle. The team Withdraws straight to the Escape. They take the free shift. The Escape rolls are a Partial, a Success, a Partial and a Partial, so all are past. It's a Loss (they Withdrew), and nobody was Taken. That's clean.

**3b. In a group obstacle.**
- **Run 1 (rolls 48 to 51):** the Zoo Hound patrol, Scent 7 of 8. Sam (human) gets a Partial. Priya (human, 2d) gets two 6s, a Critical. Lucía (human, 3d) gets three 6s, a Critical. Jonah gets a Partial. All are past, there's no Clash, and the team gains 2 Edges. The obstacle ends, and its +1 reaches 8. The Hunt is Up as the obstacle ends, with everyone already past. That's clean: "a roll that succeeds and also hits the Limit" resolves the rolls first and the Scent after.
- **Run 2 (rolls 52 to 61):** Sam gets a Success, Lucía and Jonah Partials, and Priya Fails (no Push, to force the case). The round's +1 reaches the Limit before the Clash (Issue 3). Playing reading A, the Clash is fought with the Hunt Up, and everyone Slips Away with Move. Sam's Partial gets him out with 1 Hurt. Jonah's Critical gets him out. Priya and Lucía Fail, which would mean Taken, but both Push (rolls 60 and 61) and get Partials: out, with 1 Hurt each. Nobody is left, so the Clash ends in round 1 (its +1 is lost), and all are past, since "At a group obstacle you’re past it".

**3c. In a Clash, and a Success whose Clash rise hits the Limit (rolls 62 to 69).** The mill grain store, Limit 7, Scent 5, with the team starting the Clash. Maya the jaguar, on 2 Hurt, Strikes the Beater and Fails (no Push). She's Down, and Stuck. Theo Distracts the Hound (a Partial, 1 Hurt). Lucía's Critical puts the Beater out. Jonah Fails, Pushes (roll 66) and gets a Partial: the Hound takes 1 harm, and Shaggy Coat cancels its bite. In round 2, Theo's Distract Succeeds, Jonah Succeeds, and Lucía's Success puts the Hound out. The Clash ends, and someone went Down, so Scent +2 brings it to 7: the Hunt is Up. Whether Maya is Taken depends on the order (Issue 4). Under tonight's ruling (Scent first), she is Taken, and the mission can at best be a Costly Win.

**3d. In the Escape.** See 3a above. Fails mean Taken (Drills 8 and 8c). "If you’re already in the Escape, carry on." That's clean.

**3e. A Partial that hits the Limit in the Escape.** This can't happen: "In the Escape, Partials cost no Scent. Only Fails count." The Escape can only reach the Limit through a Fail (when the obstacle ends) or the round-after-three rule. Checked in Drill 7 (rolls 99 to 107: Theo's Fail was Pushed into a Partial, so there was no Scent). That's clean.

### Drill 4. On the Trail, long group obstacles, guarded group obstacles

**4a. On the Trail from the start of the Escape.** In Drill 3a (Scent 6, Limit 6, half is 3) and Drill 7 (Scent 5 of 6), every Escape approach was at +1 Difficulty. Paper check: at the Gala, if Escape 1 starts at Scent 2, a Fail there raises Scent to 3 when it ends, so Escape 2 begins On the Trail. The mission tracker's "Half the Limit (On the Trail)" field and Chapter 19 agree. That's clean.

**4b. A group obstacle past round 3 (rolls 70 to 72).** The Zoo night keeper (Sneak 3, Wits 2; group). Set by hand: after round 3, Sam (human) is still not past, and Scent is 2.
- Round 4: 3d vs 3 (with Theo Helping), a Fail. End of round, Scent +1, to 3.
- Round 5: a Fail. Scent +1, to 4.
- Round 6 (with Priya Helping): a Partial, so he's past. Round 6 adds +1 (5), and the obstacle's end adds +1 for Partials and Fails (6).

The stricter reading gives 5 (Issue 12).

**4c. A guarded group obstacle where one character Fails while the others pass.** The Lodge kennels (3 Hounds; Narrow, Dark). Run 1 (rolls 73 to 76) and run 2 (rolls 77 to 80) produced no Fail. The Tracker was ruled +1 in total (Issue 9). For example, Sam the rat rolled 5d vs 3, and Maya rolled 6d vs 2 (2, +1 Tracker, −1 Night Rosettes). Two of four Partials, so the obstacle ends at +1 each time. The Fail-while-others-pass case came up in Drill 3b run 2 (rolls 52 to 55), and Chapter 5 answers it exactly. The round finishes first, then the obstacle's single +1 Scent, and then "the whole team is in the Clash, including anyone already past". The Chapter 6 example (Lucía on the lawn) matches. That's clean, apart from Issue 3's timing in Chapter 19 and on the round card.

### Drill 5. Clashes

**5a, 5d, 5e. Unattended threats, round 4, and a shift during a Clash (rolls 81 to 92).** The Lodge kennels, 3 Hounds (Difficulty 2, Toughness 3, Harm 1), with the team starting the Clash.
1. Round 1: Priya shifts into her owl as her action (in sight, so she's Exposed). Sam Slips Away from Hound B with a Partial: he's out and past the kennels, with 1 Hurt. Maya Succeeds against Hound A, and Lucía gets a Partial (1 Hurt). Nobody rolled against Hound C, so at the end of the round it bites the Storyteller's choice, Priya (1 Hurt).
2. Round 2: Maya's Critical puts Hound A out. Priya, now an owl, Distracts C with 5d vs 3 (her Narrow Weakness), a Success. Lucía Strikes C at Difficulty 1, a Success. Hound B was unattended, so it bites Lucía (2 Hurt).
3. Round 3: Priya Distracts B, a Success, but nobody Strikes B, so it's wasted. Maya Fails against C (1 Hurt). Lucía's Critical puts C out.
4. Round 4: Priya's Distract Fails (2 Hurt). Maya and Lucía each Succeed against B, bringing it to 2 of 3 harm.
5. Round 4 ends, so the Clash ends and B pulls back. Scent +2 (it reached round 4 and someone shifted; the +2 doesn't stack). Priya is Exposed. Because the guards pulled back after round 4, the kennels are cleared.

All clean, and the round card matched each step.

**5b. Slip Away at a point obstacle, and everyone slipping away (rolls 93 to 96).** The Zoo crates. Set by hand: Priya has just Failed at 1 of 3 progress, so the Clash starts. Priya slips away with a Partial (1 Hurt) and waits "out of harm’s way". Jonah slips away with a Partial (Shaggy Coat cancels the Hurt). Theo slips away with a Success. Sam Fails (no Push) and is Netted. Played literally (Issue 7): Sam is still "in it". Both Trappers are unattended in rounds 2 and 3, and each round deals 2 Harm to the only target, so Sam goes Down in round 3. The Clash ends after round 4 at +2. Friends are standing, so Sam gets up with 2 Hurt and is freed. The team then carries on at 1 of 3 progress, and Chapter 6 says the guards are gone. Slip Away at a group obstacle (past) ran cleanly in Drills 3b and 5.

**5c. A Trapper's Net.** Drills 1c, 1d and 2: a Partial against a Trapper deals Hurt, a Fail nets, a friend frees you with their action, and you're freed at scene end. That's clean (apart from Issue 17's wording at the crates).

### Drill 6. Limits

- **The Cap on dice:** Jonah at 6d (Drill 1c) and Maya at 6d (Drill 6), with Help refused because it was over the Cap, as in Chapter 3's example. That's clean.
- **The Cap on Difficulty:** Jonah's Distracted Strike at the grain store was 2, −1, +1 Weakness = 2 (Drill 1b, roll 16). Maya at the kennels was 2, +1 Tracker, −1 Night Rosettes (roll 74). Penalties aren't capped, and the bonus is capped at −1. That's clean.
- **Difficulty above 4 (rolls 97 and 98):** the Gala Trophy case Clash. Maya the jaguar Slips Away from the Huntsman with Sneak: 3, +1 Trophy, +1 Crowd Weakness = Difficulty 5. Her pool is 6d at the Cap (Sneak 4, Hide-and-Seek Champ, an Edge). Three hits with three 6s is a Partial, not a Critical, because there's no Success. She Pushes (roll 98) and gets 4 hits, still a Partial. She can't Push again ("You can Push a roll only once"). She's out and takes the Huntsman's Harm 2. Chapter 3 explicitly allows "a Difficulty can go above 4". That's clean.
- **Push once per roll:** roll 98, clean. **Help from animal form on a Wits roll:** Chapters 3 and 4 both forbid it, and even a Raven "can’t Help with Wits". In Drill 3a, Theo stayed human to Help Priya's Wits roll. That's clean.
- **Edges over 2:** applied to roll 73. Had the team held 2 Edges (Team Captain plus a scouting Success), Sam's kennel Critical would make 3, and "any more are lost". That's clean.
- **A shift with no Wild:** pay 1 Hurt, "unless that would put you Down", so at 2 Hurt you can't. That's clean, apart from the Shaggy Coat question (Issue 15).
- **The free Shift or Patch Up between obstacles:** used before every Escape. Chapter 19's "for free" is wrong (Issue 8).

### Drill 7. The prize

- **Carried, dropped by a shift between obstacles, and handed over (rolls 99 to 107):** the Gala, 4 players, Limit 6, Scent 5 (set), the case open and Priya holding the pendant.
  1. On the way out, Priya takes the free shift into her owl. The pendant drops, she picks it up for free between obstacles, and carries it in her beak ("one small thing").
  2. Escape 1 (the galleries) is On the Trail, Difficulty 3 for most. Priya gets a Partial, Maya a Critical (+1 Edge) and Lucía a Success. Theo Fails, then Pushes (roll 103) into a Partial. With no Fails left, Escape 1 costs no Scent.
  3. Between obstacles, Priya hands the pendant to Theo (no cost is given, so I ruled it free; Issue 13). Theo shifts into his coyote, the pendant drops, and he picks it up in his jaws for free. Maya and Lucía shift back to human because of their Crowd Weakness (free, no Wild).
  4. Escape 2: Theo, with the Edge, gets a Partial, and the other three get Partials too. It's a Win.
- **Dropped by a shift in a Clash (rolls 117 to 122):** this can't happen in the book's missions, because the Gala has no guarded obstacle after the case, and the case's own Clash happens before it opens. I ran it on a Chapter 12-legal variant with Escape 2 guarded by a Beater, Scent 3.
  1. Set by hand: Theo, human and carrying, has just Failed, so Scent +1 (4) and the Clash starts.
  2. Round 1: Theo shifts (the pendant drops, and he's Exposed). Maya spends her action picking it up ("picking it up takes an action at an obstacle or in a Clash"). Priya Distracts, a Success that goes unused.
  3. Round 2: Priya gets a Partial (1 Hurt). Maya tries to Slip Away and Fails (1 Hurt). Theo Strikes at Difficulty 1, a Success.
  4. Round 3: Priya Fails (2 Hurt). Theo gets a Partial: the Beater is out, and Theo takes 1 Hurt.
  5. The Clash ends in round 3 at +2 (from the shift), so Scent is 6 and the Hunt is Up. The guard is beaten, the steps are cleared, and the mission ends.

  It's a Win, and Theo is Exposed. If nobody had picked up the pendant, nothing says what happens to it (Issue 13).
- **Carrier Taken:** Drill 8 run 2 (roll 113).

### Drill 8. Every way a mission ends

- **Win at the last moment:** Drill 3a (rolls 39 to 42) and Drill 7 (rolls 104 to 107), with the final Escape rolls all Partials.
- **Costly Win at the last moment (rolls 108 to 110):** Gala Escape 2, the Hunt Up (Scent 6, set), On the Trail, three humans with no Wild. Priya (2d vs 3) and Sam (2d vs 3) Fail, so both are Taken. Theo, carrying the pendant, gets a Partial and is past. Everyone still free is past, so the mission ends. The objective is done and someone was Taken: a Costly Win, decided on the last roll. That's clean.
- **Loss at the last moment (rolls 111 to 113):** the same setup. Priya and Sam get Partials, and Theo, the carrier, Fails and is Taken. "If the carrier is Taken, the prize is lost, and so is the objective." It's a Loss on the final roll. That's clean.
- **Everyone Taken after the objective is done (rolls 114 and 115):** the pet shop Escape with the cages open and the Hunt Up. Two of four characters were already Taken. Priya and Jonah (2d vs 3 each) both Fail, so everyone is Taken. The result is a Costly Win by one line and a Loss by two others (Issue 5).
- **The first possible moment:**
  - A Win can't come earlier than the last Escape obstacle; the mission structure has no shortcut.
  - The earliest Loss is a Withdraw right after scouting (Issue 14), or a wipe at a guarded way in such as the Lodge deer park (the mechanism of Drill 2).
  - The earliest Costly Win needs the Hunt Up early, since a lone character can only be Taken by Failing with the Hunt Up, or by being Down or Netted at a scene end with the Hunt Up. Starting Scent is at most 1 and every Limit is at least 5, so the earliest case is a long way-in group obstacle. For example, the pet shop coal chute with 5 players (Limit 5) reaches the Limit at the end of round 7 through the round-after-three rule, and the first Fail in round 8 is Taken.
  - All of this follows the book.

### Drill 9. Campaign carry-over (paper campaign, one roll)

1. **Mission 1, the pet shop:** a Costly Win. Priya is Taken, and so Exposed. Hunt track 0 to 1. Everyone marks 1 Growth (does Priya, in her cage? Issue 18). Priya's player takes Sam as a replacement. He joins at the start of mission 2 ("never during one") with Growth 1, the lowest in the group.
2. **Mission 2, the Zoo:** it starts at Scent 1 ("If anyone ended a mission Exposed ... The next mission starts at Scent 1"). Scouting (roll 116): Theo the coyote, 4d vs 2, gets a Partial, so the team picks the way in and Scent starts at 1. That makes 1, not 2 ("That’s only ever 1: it doesn’t add to a poor scouting roll’s Scent 1"). That's clean. Say the result is a Loss: track 3. Everyone reaches Growth 2 and picks. Maya: +1 Wild (5). Jonah: +1 human Sense (to 2; the maximum is 3). Sam: +1 Wild (6, with Gamer; "to a maximum of 6, counting the Gamer perk"). Theo wants Team Captain again as his second perk, which isn't forbidden (Issue 18). "You can’t choose the same thing twice" held for the Growth options.
3. **Rescue in time:** mission 3 is the Lodge, and Kit and Priya are freed. Priya "rejoins the team when you’re out, but doesn’t roll during the Escape". Her player chooses Priya or Sam from now on. Whether mission 3 was in time is unclear (Issue 10). **Not in time:** if mission 3 isn't a rescue, Priya's Trophy is made after it. She loses her Bond, and freeing the Trophy later gives it back. That's clean.
4. **The Hunt track to 6:** suppose mission 3 is a Loss (5) and mission 4 a Costly Win (6). Mission 5 is then the Last Hunt, early. The track never goes down. The Last Hunt is built on the Lodge's Limit, 7, lowered to 6 because the track is 4 or more. Chapter 12 has no Hard-specific steps, and there's no Costly Win line (Issue 18).
5. **Breakout:** in mission 4, from track 4, everyone is Taken (as in Drill 2). It's a Loss, so the track goes to 6, and both the Breakout and the Last Hunt claim the next mission (Issue 2). The Breakout team's Growth "equal to the lowest in the group" has no reference group (Issue 18).

### Drill 10. Cross-checks: Chapter 19, the round card and the sheets against the full chapters

- **Drill 1 (Down, Netted, Stuck):** Chapter 19's Hurt and Worse box and round card step 5 match Chapter 7, but both leave out "you’re past the obstacle", and neither resolves Issue 1. The character sheet has Stuck and Netted boxes and "Hurt (3 = Down)", matching.
- **Drill 2:** Chapter 19 says "Everyone down at once: everyone Taken." It leaves out "and the mission is a Loss", which is minor and covered in Chapter 7.
- **Drill 3:** Chapter 19 and the round card say "any Fail means Taken", and the mission tracker says the same. Chapter 19 leaves out "Finish resolving the roll that did it" and "A Fail at a guarded obstacle doesn’t start a Clash any more"; Chapter 3's Order of Things covers the first.
- **Drill 4:** On the Trail matches across Chapter 5, Chapter 19 and the mission tracker. On the round-after-three rule, Chapter 19 and the round card agree with each other, and Chapter 5 is the looser wording (Issue 12). The guarded group obstacle's Scent timing differs: Chapter 19 and the round card say "when it ends", while Chapter 5 says before the Clash (Issue 3).
- **Drill 5:** the round card's Clash steps match Chapter 6 exactly, including "a Trapper nets instead" and "(they’re Exposed)". Chapter 19's Slip Away wording is off for point obstacles (Issue 11).
- **Drill 6:** Chapter 19's Cap, Push and Help match Chapter 3. Its between-obstacles "for free" contradicts Chapters 4 and 7 (Issue 8). The character sheet's note ("Spend Wild to Shift (1), Push (1), Help (1) or Patch Up (1)") matches, but leaves out the Hurt-paid shift.
- **Drill 7:** Chapter 19 says "Taken: out for the mission; the prize is lost with you." That matches. The mission tracker's "Prize carried by" field helped.
- **Drill 8:** Chapter 19's A Mission box has the same Win, Costly Win and Loss conflict as Chapter 5 (Issue 5).
- **Drill 9:** the mission tracker's Hunt track row matches Chapter 8. The sheet's Growth row (at 2, 4, 6) matches. Nothing in Part Four mentions the Breakout or the rescue deadline.

## 4. What worked

- **The core roll** (count 5s and 6s against a Difficulty, Partial in between) never needed a second look in 122 rolls. The Cap (+2 dice, −1 Difficulty, penalties uncapped) and Push-once were applied without argument, including a Difficulty-5 roll and a Push that stayed a Partial.
- **"Result first, then cost"** (Chapter 3's Order of Things and Chapter 5's "Finish resolving the roll that did it") settled every case where a finishing roll also reached the Limit (Drills 3a and 3b run 1).
- **The guarded group obstacle sequence** (finish the round, one Scent rise, then everyone, including those past, is in the Clash) is precise in Chapter 5 and matches the Chapter 6 example.
- **Clash mechanics** ran cleanly through a full 4-round fight with three Hounds and a mid-Clash shift: unattended threats, Distract, Slip Away at a group obstacle, the round-4 pull-back clearing the obstacle, and the single +2 that doesn't stack. The round card was enough to run it without opening Chapter 6.
- **Netted** is well bounded: a Partial against a Trapper deals Hurt, a Fail nets, a friend frees you with an action, and you're freed at scene end. Everyone-at-once is unambiguous and quick.
- **Stuck, Exposed, and Exposed plus poor scouting giving only Scent 1** all read cleanly in every place they appear.
- **The Escape rules** (Partials free, Fails cost Scent, Fails mean Taken when the Hunt is Up, On the Trail at half the Limit, rounded up) were fast and tense. Deciding a Costly Win and a Loss on the final die worked exactly as written.
- **The prize rules** (it drops when you shift, pick-up is free between obstacles, a carrier who is Taken loses the objective) produced the intended choices about who carries it in which form.
- **The PDF matches the HTML source**, and the mission tables and the sheets (character sheet, mission tracker, round card) agree with the chapters everywhere except the points listed in Issues 3, 8, 11 and 12.
