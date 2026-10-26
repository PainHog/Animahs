# Second Nature: core rules (v0.1c draft)

*Working title (DESIGN D2). These are the rules until chapters exist. The simulator follows this page and cites its § numbers. The tables after the rules hold the options and numbers. v0.1b includes the first simulator pass (DESIGN D24–D28; `book/REVIEW.md` rows 1–10). v0.1c adds the answers the chapters needed (DESIGN D31; rows 11–17), none of which changes a simulated mission.*

Kids aged 11–15 have **Bonded** with one animal each and can become it. They fight **the Gilded Hunt**, a secret society of rich trophy hunters who steal animal power and wear it as **Trophies**. Each session is one **mission** against the Hunt. One player is the **Storyteller**; the other 3–5 each play one Bonded kid.

**§1 The roll.** Roll d6s equal to your **rating** in the approach, plus any bonus dice. Each **5 or 6 is a hit**. The **Difficulty** (1–4) is the number of hits you need.
- **Fail:** no hits. **Partial:** at least one hit, but fewer than the Difficulty; you do it, at a cost. **Success:** hits ≥ Difficulty. **Critical:** a Success with two or more 6s.
- **The Cap:** from all sources together, a roll gets at most **+2 dice** and **−1 Difficulty**. Difficulty is never below 1. A rating of 0 means you can't roll that approach.
- **Order:** a roll's result comes first, then its cost, then everything else, including the Hunt being Up (§8).
- Nobody rolls against you: **threats never roll** (§7).

**§2 Approaches and forms.** The approaches are **Sneak** (hide, stalk, slip past), **Force** (fight, break, shove, scare), **Move** (run, climb, jump, fly, swim), **Sense** (notice, track, search, scout) and **Wits** (talk, plan aloud, use tools and machines, read).
- **Human form** uses your human ratings.
- **Animal form** uses your **frame's** ratings (Table 1). Wits is 0, so you can't roll it, and you can't speak, read or use hands or tools. You can carry one small thing in your jaws, beak or claws.
- **Places have tags:** Dark, High, Narrow, Water, Open, Crowd, Locked. In animal form, if any of your frame's **Strengths** is among the place's tags, you get **+1 die**; if any of its **Weaknesses** is, the roll is at **+1 Difficulty**. Human form has neither.

**§3 Shifting.**
- **Shifting into your animal** costs **1 Wild** and your action. Out of Wild, you can take 1 Hurt instead, unless that would put you Down. **Shifting back** costs nothing, but it also takes your action. There's no time limit on either form.
- **What comes with you:** your Hurt, your Wild and your human perk carry over. Your clothes and small personal things vanish into the Wild and come back when you do. Anything else you were holding drops at your feet.
- **In sight of the Hunt:** between obstacles you can always find cover, so a shift there is out of sight, unless the mission says you're being watched. A shift during a Clash is always in sight. If the Hunt can see you shift, Scent +1 (§8) and you're **Exposed** (§9).

**§4 Wild and Edges.**
- Each character starts every mission with **4 Wild** tokens. Spend 1 to:
  - **Shift** into your animal (§3);
  - **Push:** after a roll, reroll every die that didn't hit; once per roll, and the Cap doesn't apply;
  - **Help:** see §5;
  - **Patch Up:** heal 1 Hurt, yours or a friend's. It takes your action.
- **Unspent Wild is lost** when the mission ends, so spend it. Keeping Wild back is the commonest way to lose (`sim/REPORT.md` §6).
- **Edges:** a Critical or a good scouting roll can give the team an **Edge**. Spend it for +1 die on any roll (this counts towards the Cap). The team holds at most 2; any more are lost.

**§5 Help.** When a friend at the same obstacle rolls, you may spend 1 Wild to give **+1 die**. It doesn't use your action, but it has to be something your current form can do (in animal form you can't help a Wits roll). The Cap still applies.

**§6 Scenes, rounds and obstacles.**
- **Time:** a **round** is everyone getting one action. A **scene** is one obstacle or one Clash, and once-per-scene abilities come back each scene. Moving between obstacles is free, and on the way each character may Shift or Patch Up once without using an action.
- **Obstacles** give their tags, the approaches that work with a Difficulty for each, and the **progress** they need.
  - At a **point** obstacle, one character rolls each round (others may Help), and progress adds up.
  - At a **group** obstacle, everyone who isn't past yet rolls each round, and each gets past on their own Partial or better.
- **Results at an obstacle:**
  - **Success:** 1 progress.
  - **Critical:** 1 progress, plus 1 extra progress or an Edge.
  - **Partial:** 1 progress, and Scent +1 (in the Escape, a Partial costs no Scent).
  - **Fail:** no progress, and Scent +1. A **dangerous** obstacle also deals 1 Hurt on a Fail.
  - **A group obstacle raises Scent once, when it ends:** +1 if anyone got a Partial or a Fail (in the Escape, only a Fail counts). If anyone still isn't past after the third round, Scent +1 at the end of every round after that.
- **Guarded obstacles:** a Fail starts a **Clash** with the guards (§7), unless the Hunt is Up (then the Fail means you're Taken, §8). You can also choose to start the Clash. Beating the guards clears the obstacle, unless it says progress is still needed.

**§7 Clashes.** Threats have **Difficulty**, **Toughness** and **Harm** (Table 4). Each round, everyone in the Clash takes one action, in any order the players like:
- **Strike** (Force): Success 1 harm; Critical 2 harm. When a threat has taken harm equal to its Toughness, it's out.
- **Distract** (Sneak or Move): a Success puts the next Strike against that threat this round at −1 Difficulty.
- **Slip Away** (Move or Sneak): a Success takes you out of the Clash, and you go on.
- **Or** Shift, Patch Up, or free a Netted friend (no roll).

Against a threat, **a Partial does the job but its Harm hits you; a Fail just hits you**. At the end of each round, **each threat nobody rolled against deals its Harm to one character** of the Storyteller's choice.

The Clash ends when every threat is out, when nobody is left in it, or **at the end of round 4**, when any threats still standing pull back. **When it ends, Scent rises once:** +1, or +2 if it reached round 4, someone went Down, or someone shifted during it (they're Exposed).

**§8 Scent.** The Hunt's **Scent** runs from 0 to the mission's **Limit**, which each mission gives for 3, 4 and 5 players (Table 5). It rises only as §3, §6, §7 and §10 say, and **it never goes down**. The Limit never moves during a mission.
- **On the Trail** (Scent at or above half the Limit, rounded up, when an Escape obstacle begins): that Escape obstacle is at +1 Difficulty.
- **The Hunt is Up** (Scent reaches the Limit): the Masters arrive. Finish resolving the roll that did it. From then on, **any Fail means you're Taken**, wherever you are, and anyone still Down or Netted when the scene ends is Taken. If the objective isn't done, the team chooses: keep going, or Withdraw to the Escape (§10; a Loss). Scent past the Limit is lost.
- *Good advice: press on only if you're already working on the objective, and run the moment a friend is Taken.*

**§9 Hurt and worse.**
- **Hurt:** everyone has 3 boxes in every form, and Hurt never lowers your dice. It clears between missions.
- **Down** (3 Hurt): you can't act until the scene ends. Then you're back up with 2 Hurt and past the obstacle, if a friend is still standing and the Hunt isn't Up. Otherwise you're **Taken**. If you go Down in animal form, you're **Stuck** in it until the mission ends.
- **Netted:** you can't act until a friend frees you (their action, no roll). When the scene ends you're freed, if a friend is still standing and the Hunt isn't Up; otherwise you're Taken.
- **Taken:** the Hunt cages you, and you're out for the mission. If you were carrying the prize, it's lost.
- **Rescued:** a character freed during a mission rejoins the team once it's out, and doesn't roll in the Escape.
- **Exposed:** the Hunt knows your face and your **Mark**. In a campaign, your next mission starts at Scent 1.
- **Everyone Down, Netted or Taken at once:** everyone is Taken, and the mission is a Loss.

**§10 A mission.**
1. **Scout:** one character rolls Sense against the mission's scouting Difficulty. Success: the team picks one of the two ways in and gains an Edge. Critical: as Success, but two Edges. Partial: the team picks, but Scent starts at 1. Fail: the Storyteller picks, and Scent starts at 1.
2. **Way in,** then **obstacles,** then the **objective** (an obstacle; a prize to steal must then be carried out). One character carries the prize. Handing it to a friend at the same obstacle takes an action, with no roll; shifting drops it (§3); if its carrier is Taken, the prize and the objective are lost.
3. **Escape:** group obstacles.
4. **The team may Withdraw** at any time and go straight to the Escape; that's a Loss.

**Results:** **Win:** the objective is done and nobody is Taken. **Costly Win:** it's done, but someone is Taken. **Loss:** it isn't done.

**§11 Making a character.**
1. **Frame and animal:** choose them, or roll a d6 for the frame (Table 1) and a d6 for the animal (1–2 the first, 3–4 the second, 5–6 the third, in Table 2). No two characters in a group have the same animal; if two players want the same one, roll off.
2. **Human ratings:** put 3, 2, 2, 1 and 1 into Sneak, Force, Move, Sense and Wits.
3. **Human perk:** choose one, or roll two d6 (Table 3).
4. **Your Mark:** one feature that shows in both forms.
5. **The rest:** a name, an age (11–15), and something you love about your town. Start with 4 Wild and 0 Hurt.

**§12 Campaign (drafted, not yet simulated).** Six missions, then the Last Hunt as the seventh.
- **The Hunt track** (0–6) rises by 2 for a Loss and by 1 for a Costly Win, and never goes down. At 6, the next mission is the Last Hunt.
- **The Last Hunt** is a Hard mission. With the Hunt track at 4 or more, its Limit is 1 lower.
- **Growth:** after each mission, mark 1 Growth. At 2, 4 and 6, choose one: +1 Wild (to a maximum of 6, counting the Gamer perk); a second human perk; +1 to a human rating (to a maximum of 3); or **Wild Sense** (one of your frame's Strengths also works in human form). Only +1 to a rating can be chosen again, for a different rating.
- **Taken characters** can be rescued on a later mission. At the next full moon (within two missions) the Hunt makes them a Trophy: they lose their Bond but keep their memories, and freeing the Trophy gives the Bond back.
- **New characters** join at the start of a mission, never during one, with Growth equal to the lowest in the group. When a Taken friend is rescued, their player chooses which character to keep.
- **Everyone Taken:** the next mission is a Breakout, played by new Bonded.
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
| Hound (bred by the Hunt) | 2 | 3 | 1 | **Tracker:** Sneak rolls at an obstacle a Hound guards are at +1 Difficulty. |
| Trapper | 2 | 2 | 1 | **Net:** when you Fail against a Trapper, you're Netted instead of Hurt. |
| Huntsman (wears a Trophy) | 3 | 4 | 2 | **Trophy:** Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty. |
| Master of the Hunt | — | — | — | Arrives only when the Hunt is Up (§8); never fought in v0.1. |

## Table 5: Mission labels and Limits
A mission's **label** comes from simulated results, not intentions (DESIGN-RULES A20). Each mission gives its Scent **Limit** for 3, 4 and 5 players; the scouting Difficulty is 2.

| Label | What it means (simulated, DESIGN D22) | The v0.1 test missions: Limit for 3 / 4 / 5 players |
|---|---|---|
| Easy | about 9 in 10 wins; losses rare | Pemberton's Pets 7 / 6 / 5 |
| Standard | about 3 in 4 wins; about 1 in 10 lost | The Zoo After Dark 8 / 8 / 8 · The Old Mill 7 / 7 / 6 |
| Hard | a little over half won cleanly; about 1 in 5 lost | The Trophy Gala 6 / 6 / 6 · The Lodge on the Hill 7 / 7 / 7 |
