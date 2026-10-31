# Second Nature: core rules (v0.1c, approved 2026-10-27)

*Working title (DESIGN D2). These are the rules until chapters exist. The simulator follows this page and cites its § numbers. The tables after the rules hold the options and numbers. v0.1b includes the first simulator pass (DESIGN D24–D28; `book/REVIEW.md` rows 1–10). v0.1c adds the answers the chapters needed (DESIGN D31; rows 11–21), and the rulings from the first playtests (D34; rows 22–27). None of them changes a simulated mission's numbers.*

Kids aged 11–15 have **Bonded** with one animal each and can become it. They fight **the Gilded Hunt**, a secret society of rich trophy hunters who steal animal power and wear it as **Trophies**. Each session is one **mission** against the Hunt. One player is the **Storyteller**; the other 3–5 each play one Bonded kid.

**§1 The roll.** Roll d6s equal to your **rating** in the approach, plus any bonus dice. Each **5 or 6 is a hit**. The **Difficulty** (usually 1–4) is the number of hits you need. Weaknesses and threats' traits aren't limited by the Cap, so they can push it higher.
- **Fail:** no hits. **Partial:** at least one hit, but fewer than the Difficulty; you do it, at a cost. **Success:** hits ≥ Difficulty. **Critical:** a Success with two or more 6s.
- **The Cap:** from all sources together, a roll gets at most **+2 dice** and **−1 Difficulty**. Difficulty is never below 1. A rating of 0 means you can't roll that approach.
- **Order:** a roll's result comes first, then its cost, then everything else, including the Hunt being Up (§8).
- Nobody rolls against you: **threats never roll** (§7).

**§2 Approaches and forms.** The approaches are **Sneak** (hide, stalk, slip past), **Force** (fight, break, shove, scare), **Move** (run, climb, jump, fly, swim), **Sense** (notice, track, search, scout) and **Wits** (talk, plan aloud, use tools and machines, read).
- **Human form** uses your human ratings.
- **Animal form** uses your **frame's** ratings (Table 1). Wits is 0, so you can't roll it, and you can't speak, read or use hands or tools. You can carry one small thing in your jaws, beak or claws.
- **Places have tags:** Dark, High, Narrow, Water, Open, Crowd, Locked. In animal form, if any of your frame's **Strengths** is among the place's tags, you get **+1 die**; if any of its **Weaknesses** is, the roll is at **+1 Difficulty**. Human form has neither.

**§3 Shifting.**
- **Shifting into your animal** costs **1 Wild** and your action. Out of Wild, you can take 1 Hurt instead, unless that would put you Down; you pay it as a kid, before you change, so animal perks don't reduce it. **Shifting back** costs nothing, but it also takes your action. There's no time limit on either form.
- **What comes with you:** your Hurt, your Wild and your human perk carry over. Your clothes and small personal things vanish into the Wild and come back when you do. Anything else you were holding drops at your feet.
- **In sight of the Hunt:** between obstacles you can always find cover, so a shift there is out of sight, unless the mission says you're being watched. A shift taken as your action at an obstacle is out of sight too. A shift during a Clash is always in sight. If the Hunt can see you shift, Scent +1 (§8) and you're **Exposed** (§9).

**§4 Wild and Edges.**
- Each character starts every mission with **4 Wild** tokens. Spend 1 to:
  - **Shift** into your animal (§3);
  - **Push:** after a roll, reroll every die that didn't hit; once per roll, and the Cap doesn't apply;
  - **Help:** see §5;
  - **Patch Up:** heal 1 Hurt, yours or a friend's. It takes your action.
- **Unspent Wild is lost** when the mission ends, so spend it. Keeping Wild back is the commonest way to lose (`sim/REPORT.md` §6).
- **Edges:** a Critical at an obstacle or a good scouting roll can give the team an **Edge**. Spend it for +1 die on any roll (this counts towards the Cap). The team holds at most 2; any more are lost. Each Team Captain gives one at the start (two give 2). Unspent Edges are lost when the mission ends.

**§5 Help.** When a friend at the same obstacle rolls, you may spend 1 Wild to give **+1 die**. It doesn't use your action, but it has to be something your current form can do (in animal form you can't help a Wits roll, not even a Raven). The Cap still applies, so with a bonus die already in, only one friend's Help adds anything.

**§6 Scenes, rounds and obstacles.**
- **Time:** a **round** is everyone getting one action. A **scene** is one obstacle, one Clash, or scouting; when a Clash breaks out at an obstacle, the rest of the obstacle after it is a new scene. Once-per-scene abilities come back each scene. Moving between obstacles is free, and on the way (including between scouting and the way in) each character may Shift (either way) or Patch Up once without using an action; it still costs the Wild. A shift to scout doesn't use up that free Shift.
- **The team stays together:** everyone takes the same way in and faces the same obstacle at the same time.
- **Obstacles** give their tags, the approaches that work with a Difficulty for each, and the **progress** they need.
  - At a **point** obstacle, one character rolls each round (others may Help), and progress adds up.
  - At a **group** obstacle, everyone who isn't past yet rolls each round, one at a time in any order (each decides on a Push before the next rolls), and each gets past on their own Partial or better. Down and Netted characters can't roll: the obstacle is done when everyone who can act is past, and the Down and Netted then get up, are freed or are Taken as the scene ends (§9). Those already past can still Help, Patch Up and free a Netted friend.
- **Results at an obstacle:**
  - **Success:** 1 progress.
  - **Critical:** 1 progress, plus 1 extra progress; if the extra isn't needed (always so at a group obstacle), the team gains an Edge instead.
  - **Partial:** 1 progress, and Scent +1 (in the Escape, a Partial costs no Scent).
  - **Fail:** no progress, and Scent +1. A **dangerous** obstacle also deals 1 Hurt on a Fail.
  - **A group obstacle raises Scent once, when it ends:** +1 if anyone got a Partial or a Fail (in the Escape, only a Fail counts). From the third round on, if anyone still isn't past at the end of a round, Scent +1.
- **Guarded obstacles:** a Fail starts a **Clash** with the guards (§7), unless the Hunt is Up (then the Fail means you're Taken, §8). You can also choose to start the Clash before anyone rolls; then it begins at once. When a Fail starts it at a group obstacle, finish the round's rolls first and raise the obstacle's Scent for them (+1 for any Partial or Fail); then the whole team is in the Clash, including anyone already past. Rolls after the Clash count towards the obstacle's own rise when it ends. Beating the guards (or seeing them pull back after round 4) clears the obstacle, unless it says progress is still needed (progress already made is kept). The Fail that starts a Clash isn't a roll against a threat, so it can't get you Netted.

**§7 Clashes.** Threats have **Difficulty**, **Toughness** and **Harm** (Table 4). Each round, everyone in the Clash takes one action, in any order the players like:
- **Strike** (Force): Success 1 harm; Critical 2 harm. When a threat has taken harm equal to its Toughness, it's out.
- **Distract** (Sneak or Move): a Success puts the next Strike against that threat this round at −1 Difficulty.
- **Slip Away** (Move or Sneak): a Success takes you out of the Clash. At a group obstacle you're past it; at a point obstacle you wait, out of harm's way, until the Clash ends.
- **Or** Shift, Patch Up, or free a Netted friend (no roll).

A Critical on Distract or Slip Away works like a Success (Edges come only from obstacles).

Against a threat, **a Partial does the job but its Harm hits you** (even if it puts the threat out); **a Fail just hits you**. At the end of each round, **each threat nobody rolled against deals its Harm to one character still standing in the Clash** (not Down, Netted or slipped away) of the Storyteller's choice. Once you've slipped away you take no part in the Clash, not even Help. Help can come before or after the helper's own action.

The Clash ends when every threat is out; **at the end of round 4**, when any threats still standing pull back; or when nobody who can act is left in it (everyone has slipped away or is Down, Netted or Taken), and then the guards are still on guard: at a group obstacle those who slipped away are past, and at a point obstacle the next Fail there starts a new Clash. **When it ends, Scent rises once:** +1, or +2 if it reached round 4, someone went Down, or someone shifted during it (they're Exposed). Then the scene ends (§9), so if that rise brings the Hunt Up, anyone Down or Netted is Taken.

**§8 Scent.** The Hunt's **Scent** runs from 0 to the mission's **Limit**, which each mission gives for 3, 4 and 5 players (Table 5). It rises only as §3, §6, §7 and §10 say, and **it never goes down**. The Limit never moves during a mission.
- **On the Trail** (Scent at or above half the Limit, rounded up, when an Escape obstacle begins): that Escape obstacle is at +1 Difficulty.
- **The Hunt is Up** (Scent reaches the Limit): the Masters arrive. Finish resolving the roll that did it as if the Hunt weren't Up (a guarded Fail still starts its Clash). From then on, **any Fail means you're Taken**, wherever you are, a Fail in a Clash included, and anyone still Down or Netted when the scene ends is Taken. If the objective isn't done, the team chooses: keep going, or Withdraw to the Escape (§10; a Loss). Scent past the Limit is lost.
- *Good advice: press on only if you're already working on the objective, and run the moment a friend is Taken.*

**§9 Hurt and worse.**
- **Hurt:** everyone has 3 boxes in every form, and Hurt never lowers your dice. It clears between missions.
- **Down** (3 Hurt): you can't act until the scene ends; a Patch Up lowers your Hurt but doesn't get you up. Then you're back up with 2 Hurt (and past it, at a group obstacle), if a friend is still standing and the Hunt isn't Up. Otherwise you're **Taken**. If you go Down in animal form, you're **Stuck** in it until the mission ends.
- **Netted:** you can't act until a friend frees you (their action, no roll). When the scene ends you're freed, if a friend is still standing and the Hunt isn't Up; otherwise you're Taken.
- **Taken:** the Hunt cages you, and you're out for the mission. If you were carrying the prize, it's lost. You're also Exposed.
- **Rescued:** a character freed during a mission goes with the team: they don't roll or Help, can't be Taken unless everyone else is, don't count towards "everyone Taken", and rejoin the team once it's out. Anyone Taken on the same mission is out of reach until another one.
- **Exposed:** the Hunt knows your face and your **Mark**. In a campaign, your next mission starts at Scent 1 (only 1, however many were Exposed, and not on top of a poor scouting roll's Scent 1).
- **Everyone Down, Netted or Taken at once:** everyone is Taken, and the mission is a Loss.

**§10 A mission.**
1. **Scout:** one character rolls Sense against the mission's scouting Difficulty (no place tags, so Strengths, Weaknesses and place perks don't count). Success: the team picks one of the two ways in and gains an Edge. Critical: as Success, but two Edges. Partial: the team picks, but Scent starts at 1. Fail: the Storyteller picks, and Scent starts at 1.
2. **Way in,** then **obstacles,** then the **objective** (an obstacle; a prize to steal must then be carried out). When the objective is done, one character there takes the prize (no action) and carries it. Handing it to a friend at the same obstacle takes an action, with no roll; between obstacles it's free. A shift drops it (§3): picking it up takes an action at an obstacle or in a Clash, and is free between obstacles. If its carrier is Taken, or nobody is carrying it when the last Escape obstacle is behind the team, the prize and the objective are lost.
3. **Escape:** group obstacles.
4. **The team may Withdraw** at any time outside a Clash and go straight to the Escape (before the way in, it just goes home); that's a Loss.

**Results:** **Win:** the objective is done and nobody is Taken. **Costly Win:** it's done, but someone (not everyone) is Taken. **Loss:** it isn't done, or everyone is Taken (what they did stays done, but it counts as a Loss). Afterwards unspent Wild and Edges are lost and Hurt clears.

**§11 Making a character.**
1. **Frame and animal:** choose them, or roll a d6 for the frame (Table 1) and a d6 for the animal (1–2 the first, 3–4 the second, 5–6 the third, in Table 2). No two characters in a group have the same animal; if two players want the same one, roll off (again on a tie).
2. **Human ratings:** put 3, 2, 2, 1 and 1 into Sneak, Force, Move, Sense and Wits.
3. **Human perk:** choose one, or roll two d6 (Table 3).
4. **Your Mark:** one feature that shows in both forms.
5. **The rest:** a name, an age (11–15), and something you love about your town. Start with 4 Wild and 0 Hurt.

**§12 Campaign (drafted, not yet simulated).** Six missions, then the Last Hunt as the seventh.
- **The Hunt track** (0–6) rises by 2 for a Loss and by 1 for a Costly Win, and never goes down. At 6, the next mission is the Last Hunt.
- **The Last Hunt** is a Hard mission. With the Hunt track at 4 or more, its Limit is 1 lower.
- **Growth:** after each mission, mark 1 Growth. At 2, 4 and 6, choose one: +1 Wild (to a maximum of 6, counting the Gamer perk); a second, different human perk; +1 to a human rating (to a maximum of 3); or **Wild Sense** (one of your frame's Strengths also works in human form). Only +1 to a rating can be chosen again, for a different rating. Taken characters mark Growth too.
- **Taken characters** can be rescued on either of the next two missions (as the mission, or as one more point obstacle before the Escape: a locked cage, Force 3 or Wits 2, 3 progress, +1 to the Limit; failing it doesn't change the result); after that the Hunt makes them a Trophy: they lose their Bond but keep their memories, and freeing the Trophy gives the Bond back.
- **New characters** join at the start of a mission, never during one, with Growth equal to the lowest in the group; a Taken character's animal still counts for "no two the same". When a Taken friend is rescued, their player chooses which character to keep.
- **Everyone Taken:** the next mission is a Breakout, played by new Bonded with the old team's lowest Growth. It comes first even if the Hunt track has just reached 6; the Last Hunt follows it.
- **The Last Hunt's results:** a Win or a Costly Win keeps the Old Wild free (and frees anyone Taken that night); a Loss ends the campaign with the Wild chained.
- **Results carry over:** a mission's Win, Costly Win or Loss may change the next mission (an extra guard, a new ally).

---

## Table 1: Frames (animal-form ratings; Wits is always 0)
| d6 | Frame | Sneak | Force | Move | Sense | Strengths (+1 die) | Weaknesses (+1 Difficulty) |
|---|---|---|---|---|---|---|---|
| 1 | Big Cats | 4 | 3 | 3 | 2 | Dark, High | Water, Crowd |
| 2 | Canines | 3 | 3 | 3 | 4 | Open, Crowd | High |
| 3 | Birds | 2 | 1 | 4 | 4 | High, Open | Narrow |
| 4 | Critters | 4 | 1 | 3 | 3 | Narrow, Crowd | Open |
| 5 | Heavies | 2 | 4 | 3 | 3 | Open, Locked | Narrow, Crowd |
| 6 | Reptiles | 3 | 3 | 3 | 3 | Water, Dark | Crowd |

## Table 2: Animals and animal perks (animal form only)
| Frame | Animal | Perk |
|---|---|---|
| Big Cats | Jaguar | **Night Rosettes:** in Dark places, your Sneak rolls are at −1 Difficulty. |
| | Snow Leopard | **Ambush:** your first Strike in each Clash is at −1 Difficulty. |
| | Cheetah | **Burst:** once per scene, Push a Move roll without spending Wild. |
| Canines | Coyote | **Pack:** once per scene, Help without spending Wild. |
| | Shepherd Dog | **Good Dog:** in Crowds, your Sneak and Sense rolls are at −1 Difficulty. |
| | Red Fox | **Wily:** once per scene, when your roll Fails, it becomes a Partial instead. |
| Birds | Peregrine Falcon | **Keen Eyes:** in Open or High places, your Sense rolls are at −1 Difficulty. |
| | Barn Owl | **Silent Wings:** in Dark places, +1 die on Sneak and Move rolls. |
| | Raven | **Clever Beak:** against Locked things you can roll Wits in animal form (rating 2) to work latches, keys and switches. |
| Critters | House Mouse | **Tiny:** in Narrow places, your Sneak and Move rolls are at −1 Difficulty. |
| | Brown Rat | **Gnaw:** against Locked things, your Force rating is 3. |
| | Grey Squirrel | **Leaper:** in High places, your Move rolls are at −1 Difficulty. |
| Heavies | Bison | **Shaggy Coat:** once per scene, when you'd take Hurt, take 1 less. |
| | Moose | **Antler Sweep:** once per scene, when your Strike against a Beater or Hound Succeeds, it's out at once. |
| | Hippopotamus | **Charge:** once per scene, when a Force roll Succeeds, it counts as a Critical. |
| Reptiles | Alligator | **Lurker:** in Water, your Sneak and Force rolls are at −1 Difficulty. |
| | Python | **Coil:** when your Strike Succeeds, the next roll anyone makes against that threat this Clash is at −1 Difficulty. |
| | Komodo Dragon | **Taste the Air:** +1 die on Sense rolls, and a Hound's Tracker doesn't affect you. |

## Table 3: Human perks (roll two d6: the first picks the list, 1–3 for A and 4–6 for B; the second picks the row)
Every perk works in any form unless it says otherwise. A perk's die counts towards the Cap.

| | A (1–3) | B (4–6) |
|---|---|---|
| 1 | **Football Player:** +1 die on Force rolls. | **Team Captain:** the team starts every mission with 1 Edge. |
| 2 | **Hide-and-Seek Champ:** +1 die on Sneak rolls. | **Animal Whisperer:** +1 die on rolls against Hounds, or to get past an obstacle they guard. |
| 3 | **Track Star:** +1 die on Move rolls. | **Swim Team:** +1 die on rolls in Water. |
| 4 | **Scout:** +1 die on Sense rolls. | **Gymnast:** +1 die on rolls in High places. |
| 5 | **Brainiac** (human form): +1 die on Wits rolls. | **Night Owl:** +1 die on rolls in Dark places. |
| 6 | **Gamer:** start every mission with 1 extra Wild. | **Drama Kid:** +1 die on rolls in Crowds. |

## Table 4: Threats
| Threat | Difficulty | Toughness | Harm | Special |
|---|---|---|---|---|
| Beater (hired hand) | 2 | 2 | 1 | — |
| Hound (bred by the Hunt) | 2 | 3 | 1 | **Tracker:** Sneak rolls at an obstacle a Hound guards, or in a Clash with a Hound, are at +1 Difficulty (+1 in all, however many Hounds). |
| Trapper | 2 | 2 | 1 | **Net:** when you Fail against a Trapper in a Clash, you're Netted instead of Hurt (the Fail that starts a Clash doesn't net you). |
| Huntsman (wears a Trophy) | 3 | 4 | 2 | **Trophy:** Sneak rolls at an obstacle a Huntsman guards, or in a Clash with a Huntsman, are at +1 Difficulty (+1 in all, however many Huntsmen; it adds to a Hound's Tracker). |
| Master of the Hunt | — | — | — | Arrives only when the Hunt is Up (§8); never fought in v0.1. |

## Table 5: Mission labels and Limits
A mission's **label** comes from simulated results, not intentions (DESIGN-RULES A20). Each mission gives its Scent **Limit** for 3, 4 and 5 players; the scouting Difficulty is 2.

| Label | What it means (simulated, DESIGN D22) | The v0.1 test missions: Limit for 3 / 4 / 5 players |
|---|---|---|
| Easy | about 9 in 10 wins; losses rare | Pemberton's Pets 7 / 6 / 5 |
| Standard | about 3 in 4 wins; about 1 in 10 lost | The Zoo After Dark 8 / 8 / 8 · The Old Mill 7 / 7 / 6 |
| Hard | a little over half won cleanly; about 1 in 5 lost | The Trophy Gala 6 / 6 / 6 · The Lodge on the Hill 7 / 7 / 7 |
