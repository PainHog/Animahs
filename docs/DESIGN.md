# Morph Game (codename): design document

This is a living document. **§1 Pitch** is Richard's own. **§3 Decisions** logs every design decision with its status: **draft** (in force for the simulator and the next draft, open to Richard's revision) or **approved** (signed off by Richard). §4 and §5 note where each flag and question was settled. "Morph Game" is a codename; the working title is in §3.

## 1. Pitch (Richard Moore, 2026-10-22)

> **Animorphs TTRPG**
>
> The concept is that we create character frames based around type of animal, then give each specific animal a special perk. So a player would be trying to save the world against "blank" and they would find they have the ability to morph into a Jaguar. So they would get the cat character frame, a human perk (hightened intelligence, football player, etc), then the specific animal perk, for jaguar is the ability to hide in any dark environment.
>
> its based on the animorphs books and will need a new name for sure.

### What the pitch settles
- **Players are people who discover they can morph into an animal,** and use it to save the world from an enemy that isn't named yet.
- **A character is built from three parts:**
  1. a **character frame** for the type of animal, e.g. the cat frame;
  2. a **human perk**, e.g. heightened intelligence or football player;
  3. an **animal perk** for the specific animal, e.g. the jaguar can hide in any dark environment.
- **It's inspired by the *Animorphs* books.** It needs a new name and original specifics (§2).

## 2. Name and rights check (2026-10-22; risk flags, not legal advice)

### 2.1 *Animorphs* is a live, actively guarded property: don't use the name or its distinctive elements
- **"ANIMORPHS" is a Scholastic trademark.** It's on Scholastic's own trademark list, with a new filing as recently as 2024.
- **The series is very active.** A Disney+ live-action series is in development with Scholastic and Ryan Coogler's Proximity Media, announced in 2026. Graphic novel adaptations ran 2020–2025.
- **Never use any of the following, in the book, art, code or store pages:**
  - the name *Animorphs*, or anything that reads as it;
  - the Yeerks: parasitic slugs that enter the brain through the ear, the hosts called "Controllers", and the feeding pool;
  - the Andalites: blue centaur aliens with a tail blade;
  - Visser Three, the Ellimist and Crayak, the Hork-Bajir, the Taxxons, the Chee, "The Sharing";
  - the morphing cube (the Escafil Device);
  - acquiring an animal by touching it;
  - the **two-hour limit**, after which you're trapped as the animal for good;
  - thought-speak;
  - the dying alien at a construction site who gives the kids the power;
  - the series' covers, where a person morphs into an animal across the cover.
- **Free to use:** the genre idea itself, ordinary people who can turn into animals and fight a hidden threat. That idea is old (folklore, *Invasion of the Body Snatchers*, many games).
- **The rule for this project:** the enemy, the origin of the power, how morphing works, and its limits and costs must all be **original**.

### 2.2 Other games already in this space, so the design needs to stand apart
- ***Beasts*:** a Powered by the Apocalypse game about teenagers who turn into animals to fight a secret invasion. It's openly inspired by Animorphs, was crowdfunded, and is still in development (2025). **The name "Beasts" is taken.**
- ***Idiot Teenagers With A Death Wish*:** a Forged in the Dark Animorphs-inspired game on itch.io.
- ***Morphs in the Dark*:** a Blades in the Dark hack run at conventions. Avoid "Morphs" names.

**What sets this game apart:** Richard's **frame plus two-perk build** (an animal-type frame, a human perk and a specific-animal perk), and whatever tone, enemy and structure the interview settles.

### 2.3 The name
Brainstorm a distinctive title during the interview, avoiding "Animorphs", "Morph(s)", "Beasts" and "Shifters". Then run a full search (DriveThruRPG, itch.io, Steam, the USPTO and the UK IPO) before any store page, cover or logo.

## 3. Decisions log
Each entry: the decision, the options weighed (the chosen one first), why, and its status. **Draft** decisions are in force for `docs/CORE-RULES.md` and the simulator until Richard revises them; a revision is logged as a new entry, never by editing an old one.

### D1 · 2026-10-22 · approved (Richard's pitch): Premise and the three-part character
Characters are built from an animal-type **frame**, a **human perk** and a specific-**animal perk**. No *Animorphs* specifics (§2.1).

### D2 · 2026-10-22 · draft: Working title *Second Nature* (Q1)
- **Decision:** the working title is ***Second Nature***.
- **Options:** *Second Nature*; *Kindred of the Wild*; *Not Your Trophy*.
- **Why:** it says what the game is about (becoming an animal until it's second nature) without "Animorphs", "Morph", "Beasts" or "Shifters". A web check on 2026-10-22 found no tabletop RPG with this title. It's a common phrase, so the full search in §2.3 (DriveThruRPG, itch.io, Steam, USPTO, UK IPO) is still needed before any store page, cover or logo. *Kindred of the Wild* is a 1902 public-domain book title and less distinctive. The repository name *Animahs* is not used as a title: it starts like *Animorphs*, and *Anima: Beyond Fantasy* is an existing RPG.

### D3 · 2026-10-22 · draft: The enemy is the Gilded Hunt (Q1, flag 6)
- **Decision:** the enemy is **the Gilded Hunt**, a centuries-old secret society of rich trophy hunters.
  - They trap the power of Bonded animals and wear it as **Trophies** (a ring, a brooch, the head of a cane) that lend them stolen animal traits.
  - Members pass as respectable townsfolk. They use hired **Beaters**, bred **Hounds** and **Trappers**. Members who wear a Trophy are **Huntsmen**; their leaders are **Masters**.
  - **Their goal is the Last Hunt:** binding the Old Wild itself, so that every animal, and then every person, comes to heel.
  - **How they find the players:** using the Wild near the Hunt leaves a **Scent** they can follow (D15).
  - **Hidden or open:** hidden between missions (who in town is a member?), open clashes during them.
- **Options:** the Gilded Hunt; the Collectors (aliens quietly building a zoo of Earth species); the Hush (a sound-borne thing that makes people docile).
- **Why:**
  - it isn't alien, which sets it apart from *Animorphs*, *Beasts* and *Idiot Teenagers With A Death Wish*;
  - no parasites, no controlled hosts and no recruiting front club (§2.1); Hunt members are willing people;
  - hunters are the natural enemy of animals, so the theme and the threat line up;
  - capture rather than death keeps the stakes real for a 10+ table (D5);
  - Trophies make the Hunt a mirror of the players: they *take* animal power, the players *become* animals.

### D4 · 2026-10-22 · draft: The power comes from the Old Wild (Q1)
- **Decision:** the power is **the Old Wild**, the living wildness in every animal. When the Hunt began its push towards the Last Hunt, the Wild woke a handful of young people on one strange night, **the Waking**. Each met the eyes of one animal and **Bonded** with it. One animal per person, for life. Nobody chooses it, touches it or collects it.
- **Options:** the Old Wild; a lab accident (too close to *Maximum Ride*); a crashed alien vault (too close to the books' dying alien and its gift).
- **Why:** it's original, it has a folklore feel without borrowing any real culture's "spirit animal" beliefs, and it gives the Hunt a reason to hunt the players: their Bond is the trophy it wants.

### D5 · 2026-10-22 · draft: Ages 10 and up, adventure peril (Q1, flag 8)
- **Decision:**
  - **ages 10 and up**, with the peril of a good family adventure film;
  - characters get hurt and can be **Taken** by the Hunt, and a Taken character can be rescued; no gore, and no player-character death by default;
  - the change is played as **wonder with comedy** (new senses, clumsy first steps), never body horror.
- **Options:** 10+ family adventure; 13+ war and horror like the books; 8+ light comedy.
- **Why:** it matches Richard's earlier family games, it leaves the darker teen space to *Beasts* and *Idiot Teenagers…*, and it keeps the stakes real.

### D6 · 2026-10-22 · draft: Present-day town, 3–5 players, 2–3 hour missions (Q1)
- **Decision:** **present day, an ordinary town** (the group's own, or the book's sample town), with the Hunt's places hidden in it: an estate, a museum, a zoo, a mill, shops. **3–5 players and a Storyteller.** One mission fills a **2–3 hour session**.
- **Options:** a present-day town; a 1980s town; a fantasy village.
- **Why:** it's the easiest setting for a 10+ table to picture, and phones and cameras give the Hunt modern tools. The 1980s look is crowded with similar shows.

### D7 · 2026-10-22 · draft: A campaign of one-shot missions; one animal per character, for life (Q1, flag 3)
- **Decision:** a **campaign of missions building to the Last Hunt, where every mission also plays as a one-shot**. **Each character has one animal, for life**; advancement deepens the Bond instead of adding animals (D18).
- **Options:** one animal for life; several animals collected over a campaign; a new animal each mission.
- **Why:** one animal makes the frame and perks the character's identity, keeps every frame and animal testable in the simulator, sets the game apart from the books' collecting, and makes the group's make-up matter: every frame needs a spotlight.

### D8 · 2026-10-22 · draft: The engine is a d6 pool, a 5 or 6 is a hit (Q2)
- **Decision:**
  - **Roll a pool of d6s: each 5 or 6 is a hit.** The pool is your rating in the approach, in your current form, plus any bonus dice.
  - **Difficulty 1–4** is the number of hits needed.
  - **Results:** **Fail** = no hits. **Partial** = some hits, but fewer than the Difficulty: you do it, at a cost. **Success** = hits at least equal to the Difficulty. **Critical** = a Success with two or more 6s.
  - **The Cap:** one roll gets at most **+2 dice and −1 Difficulty** from all sources together.
  - **Push:** after a roll, spend 1 Wild to reroll every die that didn't hit, once per roll. A Push isn't a bonus die, so the Cap doesn't limit it.
  - **No opposed rolls, and threats never roll.** A threat has a Difficulty, and it hurts you when you Fail or get a Partial against it.
- **Options:** the *Heisty Spideys* d6 pool; *Don't Get Forked*'s trait die plus risk die; *Nine Lives Gang*'s push-your-luck; a Blades-style best-die roll.
- **Why:**
  - plain d6s suit a 10+ table, and the most dice anyone rolls is six;
  - the *Heisty* core is proven, and its balance fixes are built in from the start: hits on 5–6, small pools, a hard Cap on bonuses, Partials that cost, and two rolls for most obstacles (`docs/reference/heisty-balance.md` §4);
  - a Blades-style roll would read like the two Blades-based *Animorphs*-inspired games (§2.2);
  - each form is one row of ratings, so both forms fit on one sheet (flag 5).

### D9 · 2026-10-22 · draft: Five approaches, place tags and six frames (Q3, flag 2)
- **Decision:**
  - **Five approaches:** **Sneak** (hide, stalk, slip past), **Force** (fight, break, shove, scare), **Move** (run, climb, jump, fly, swim), **Sense** (notice, track, search, scout) and **Wits** (talk, plan aloud, use tools and machines, read). Wits is **human form only**.
  - **Human form:** each player puts 3, 2, 2, 1 and 1 into the five approaches.
  - **Places have tags:** **Dark, High, Narrow, Water, Open, Crowd, Locked.**
  - **Six frames.** Each sets your animal-form ratings (Wits 0), two **Strengths** (+1 die when the place has one of them) and one or two **Weaknesses** (+1 Difficulty when the place has one of them). The numbers are in `docs/CORE-RULES.md`.
    - **Big Cats:** sneaking and pouncing; strong in Dark and High places; weak in Water and Crowds.
    - **Canines:** noses and stamina; strong in Open places and Crowds (people see a dog); weak up High.
    - **Birds:** flight and eyes; strong High and in the Open; weak in Narrow places.
    - **Critters:** tiny and unnoticed; strong in Narrow places and Crowds; weak in the Open.
    - **Heavies:** raw strength; strong in the Open and against Locked things; weak in Narrow places and Crowds.
    - **Reptiles:** patient ambushers; strong in Water and the Dark; weak in Crowds and up High.
  - **Animals are their real size,** and the frame says what the body can do.
- **Options:** six frames; four broad frames (predators, flyers, small, big); ten narrow frames.
- **Why:**
  - six covers the pitch's examples (cats, birds of prey, bears, small creatures, reptiles) and fits a d6 table;
  - the tags give every frame places where it's best and places where it's worst, so no frame is always the answer (A6, A9), and the shipped missions must use every tag;
  - insects are left out of v0.1 because they would out-sneak and out-scout everyone (A6), and sea animals because they would be useless on land (A9).

### D10 · 2026-10-22 · draft: Three animals per frame; animal perks never skip a roll (Q4, flag 1)
- **Decision:**
  - **Three animals per frame, 18 in all.** Each has one **animal perk** that works only in animal form.
  - **An animal perk never skips a roll.** It lowers a Difficulty, adds a die, gives a free Push once per scene, gives a once-per-scene effect, or lets you try something your frame normally can't (and you still roll for it).
  - **The jaguar's "hide in any dark environment" becomes Night Rosettes:** in Dark places, your Sneak rolls are at −1 Difficulty. Every other animal perk follows the same rule.
  - **Getting your animal:** choose it, or roll (a d6 for the frame, a d6 for the animal). **No two characters in a group share an animal**; if two players want the same one, roll off. Frames may repeat.
- **Options:** choose or roll; roll only; find your animal during the first mission.
- **Why:** A8 (nothing skips a roll for free); choosing or rolling at the table keeps setup under 30 minutes (A27).

### D11 · 2026-10-22 · draft: Twelve human perks that mostly work in any form (Q5)
- **Decision:** **twelve human perks**, each one short effect.
  - Most work **in any form**: it's still you in there, so the football player's tackle works when you're a bear.
  - The few that need speech or hands say **human form** and are a little stronger. They give a reason to stay human now and then.
  - Choose one, or roll two d6.
- **Options:** work in any form; human form only; half strength in animal form.
- **Why:** it follows §6's suggestion (the person stays in the animal), so the human side matters in every scene. The balance between human and animal perks is measured by the simulator (D22).

### D12 · 2026-10-22 · draft: Shifting costs Wild and an action, with no time limit (Q6, flags 4–5)
- **Decision:**
  - **Shifting into your animal costs 1 Wild and your action. Shifting back is free, but it also takes your action.** There's **no time limit** on staying in animal form.
  - **Out of Wild,** you can still shift into your animal by taking 1 Hurt, unless that would put you Down.
  - **You become the real animal at its real size.** Your clothes and small personal things go with you and come back when you return; anything else you're holding drops.
  - **What carries over:** your Hurt, your Wild and your human perk. **What doesn't:** your human ratings; the animal uses its frame's ratings.
  - **In animal form you can't speak, read, or use hands or tools** (no Wits rolls), and you can carry one small thing in your jaws, beak or claws. Characters in animal form talk to each other only with simple signals the group agrees on.
  - **Shifting where the Hunt can see you** raises Scent by 1 and leaves you Exposed (D17).
  - **Stuck:** if you go Down in animal form, you can't shift back until the mission ends.
- **Options:** a Wild cost and no time limit; a time limit plus an Instinct track; free shifting that only raises Scent.
- **Why:**
  - it's original: no two-hour rule, no touching, no thought-speak (§2.1);
  - every shift costs something (A5), and the cost is paid going in, so there's no timer to track;
  - Wits obstacles, Crowds and Weaknesses make human form the better choice some of the time, so shifting is never always right or always wrong. The simulator measures this (D22);
  - two rows of ratings keep both forms on one sheet (A28).

### D13 · 2026-10-22 · draft: Help, group obstacles and Edges (Q7)
- **Decision:**
  - **Help:** a friend at the same obstacle spends 1 Wild to give you +1 die. It doesn't use their action. They must be able to do it in their current form, and it counts towards the Cap.
  - **Group obstacles:** everyone rolls and gets through on their own result. Scent rises **at most once per round**, if anyone gets a Partial or a Fail.
  - **Edges:** a Critical or a good scouting roll can give the team an **Edge**: +1 die on any one roll, counting towards the Cap. The team holds at most 2.
  - **Order of resolution:** the roll's result comes first, then its cost, then everything else.
- **Options:** Help costs Wild but not your action; Help costs your action; free Help from one helper only.
- **Why:** in the earlier games, helpers who spent a resource without spending their action made the best teamwork; the Cap stops bonuses stacking.

### D14 · 2026-10-22 · draft: Time, obstacles, Clashes and scouting (Q8)
- **Decision:**
  - **Time:** a **round** is everyone getting one action. A **scene** is one obstacle or one Clash; once-per-scene abilities come back each scene. Moving between obstacles is free, and on the way each character may Shift or Patch Up once.
  - **Obstacles** list their tags, the approaches that work with a Difficulty for each, the **progress** needed (usually 2), whether they're **point** (one roll a round, by anyone) or **group** (everyone has to get past), and whether they're **guarded**.
    - Success: 1 progress. Critical: 1 progress plus 1 extra progress or an Edge. Partial: 1 progress, and Scent +1. Fail: no progress, and Scent +1; some obstacles also deal 1 Hurt.
    - **Failing at a guarded obstacle starts a Clash** with its guards. Beating the guards clears the obstacle unless it says otherwise. You can also choose to start the Clash yourself.
  - **Clashes:**
    - threats have **Difficulty**, **Toughness** and **Harm**;
    - **Strike** = a Force roll against the threat's Difficulty. Success: 1 harm. Critical: 2 harm. Partial: 1 harm, and you take the threat's Harm. Fail: you take its Harm;
    - **Distract** = a Sneak or Move roll against its Difficulty. A Success puts the next Strike against it this round at −1 Difficulty;
    - **Slip Away** = a Move or Sneak roll against its Difficulty. A Success takes you out of the Clash;
    - at the end of each round, **each threat nobody rolled against hurts one character** of the Storyteller's choice;
    - **a Clash lasts at most 4 rounds;** after that, any threats still standing pull back;
    - **a Clash raises Scent once, when it ends:** +1, or +2 if it reached round 4, someone went Down, or someone shifted in sight of the Hunt.
  - **Hurt never lowers your dice** (A2).
  - **Scouting:** once per mission, before going in, one character rolls Sense against the mission's scouting Difficulty. Success: the team picks its way in and gains an Edge. Critical: two Edges. Partial: the team picks its way in, but Scent starts at 1. Fail: the Storyteller picks the way in, and Scent starts at 1.
- **Options:** only players roll; threats roll attack pools; a side-initiative system.
- **Why:** one roll covers both sides, so fights don't drag (A24), there are no opposed rolls, and the Storyteller's load fits on one card (A29). Scouting gives Sense-heavy frames a spotlight before the first obstacle.

### D15 · 2026-10-22 · draft: Scent is the mission's threat track (Q9)
- **Decision:**
  - **Scent** is one track per mission, from 0 to the mission's **Limit**. The Limit is set by the mission's label and the party size, and it never moves during a mission.
  - **It rises by 1** for each Partial or Fail at an obstacle (at most once per round at a group obstacle), once for each Clash (+1 or +2, D14), for each shift in sight of the Hunt (outside a Clash), and for a poor scouting roll.
  - **It never goes down.**
  - **On the Trail** (Scent at or above half the Limit, rounded up): every Escape obstacle is at +1 Difficulty.
  - **The Hunt is Up** (Scent reaches the Limit): the Masters arrive. If the objective isn't done, it's lost. Everyone goes straight to the Escape, and **during the Escape a Fail means you're Taken**. Scent past the Limit is lost.
- **Options:** one Scent track with two thresholds; separate Alert and Time tracks; Scent per character.
- **Why:** every state is defined (A1); there are no penalties that climb inside one event (A2); nothing lowers it cheaply (A3); and it's the mission's clock, which the simulator must show binding (A22).

### D16 · 2026-10-22 · draft: Wild is the one resource (Q10)
- **Decision:**
  - **Wild** comes as tokens. Each character starts every mission with **4** (to be tuned in the simulator).
  - Spend 1 Wild to **Shift** into your animal, **Push** a roll, **Help** a friend, or **Patch Up** (heal 1 Hurt, yours or a friend's; it takes your action).
  - Unspent Wild is lost when the mission ends, and the book tells players to spend it.
  - **Edges** work as in D13.
- **Options:** one resource per character; separate Shift and Push pools; one shared group pool.
- **Why:** with one resource behind every choice, each spend is a real trade (A5–A7). The simulator checks that it gets spent.

### D17 · 2026-10-22 · draft: Hurt, Down, Netted, Taken, Exposed and how a mission ends (Q11)
- **Decision:**
  - **Hurt:** 3 boxes, the same for every character in every form. Hurt clears between missions.
  - **Down** (3 Hurt): you're out until the scene ends. Then you're back up with 2 Hurt, if a friend is still standing and the Hunt isn't Up. Otherwise you're **Taken**.
  - **Netted** (by a Trapper): you can't act until a friend spends their action to free you. If the scene ends first, you're Taken.
  - **Taken:** you're out for the rest of the mission, caged by the Hunt. In a campaign you can be rescued on a later mission.
  - **Exposed:** the Hunt saw you shift, or Took you. It knows your face and your **Mark** (the one feature that shows in both your forms). In a campaign, your next mission starts at Scent 1.
  - **Stuck:** see D12.
  - **Everyone Down, Netted or Taken at once:** the mission ends, everyone is Taken, and it's a Loss.
  - **Giving up:** the team may **Withdraw** at any time and go straight to the Escape. The mission is a Loss, so withdrawing is never better than fighting on (A4).
  - **Results:** **Win** = the objective is done and nobody is Taken. **Costly Win** = it's done, but someone is Taken. **Loss** = it isn't done.
- **Options:** capture-based failure; injury and death; failure that only means being exposed.
- **Why:** real stakes for a 10+ table without death; losing costs something at every stage (A4); and "everyone down" is defined.

### D18 · 2026-10-22 · draft: Missions, the campaign and advancement (Q12)
- **Decision:**
  - **A mission:** briefing → scouting → one of two ways in → 2–4 obstacles → the objective → the Escape (1–2 obstacles) → the result.
  - **A campaign:** about six missions, then the Last Hunt. A campaign **Hunt track** (0–6) rises by 2 for a Loss and by 1 for a Costly Win; at 6, the Last Hunt comes early.
  - **Advancement:** after each mission, mark 1 Growth. At 2, 4 and 6 Growth, choose one: +1 Wild (to a maximum of 6); a second human perk; +1 to a human rating (to a maximum of 3); or **Wild Sense** (one of your frame's Strengths also works in human form).
  - **Endings:** the Last Hunt decides whether the Old Wild stays free.
  - v0.1 drafts the campaign rules but doesn't simulate them; the simulator plays single missions.
- **Options:** a mission campaign with a Hunt track; a single long story; one-shots only.
- **Why:** it supports both one-shots and campaigns (D7), and advancement grows the one Bond instead of adding animals.

### D19 · 2026-10-22 · draft: Party size is tested every run (Q13)
- **Decision:** the simulator runs **3, 4 and 5 players** for every mission. Any per-size adjustment (for example to the Scent Limit) comes from the results and is written into the rules outright. Duplicate frames are allowed; duplicate animals aren't.
- **Why:** A21.

### D20 · 2026-10-22 · draft: Five test missions, as simulator data (Q14)
- **Decision:** v0.1 has **five test missions** as simulator data (`sim/scenarios.mjs`): one Easy, two Standard and two Hard. They're draft content for the book later. Each has:
  - two ways in;
  - every obstacle's approaches and Difficulties, and every threat's stats;
  - an Escape that more than one approach can solve.

  Across the five, every place tag is used, so every frame has a spotlight (A9, A25). There's no generator in v0.1; maps come with the chapters.
- **Why:** balance needs scenarios to measure; the book's versions follow once the core is approved.

### D21 · 2026-10-22 · draft: The first night (Q15)
- **Decision:**
  - **What the table needs:** six d6 per player (the biggest pool is 6); about 6 Wild tokens per player (beads or coins); a printed **Scent track** and a marker; six **pre-made characters** (one per frame); a Storyteller **round card** for Clashes; a one-page **At the Table** reference.
  - **Two players want the same animal:** roll off; the loser picks another animal (the frame can be the same).
  - **What players see:** the mission map and the two ways in. They learn an obstacle's Difficulties when they reach it or scout it.
  - **Setup target:** under 30 minutes (A27).
- **Why:** A27–A29.

### D22 · 2026-10-22 · draft: Simulator targets, agreed before tuning (Q16)
| Measure | Target |
|---|---|
| Win (objective done, nobody Taken) | Easy 85–95%, Standard 70–80%, Hard 50–62% |
| Loss (objective not done) | Easy ≤ 5%, Standard 5–15%, Hard 12–30% |
| Taken per mission | Hard 0.3–0.8 |
| The Hunt is Up (the clock binds, A22) | Easy ≤ 15%, Standard 15–40%, Hard 30–60% |
| Criticals / Fails (share of all rolls) | 15–25% / 8–15% |
| Wild (A7) | the median character spends at least half |
| Morphing | ≥ 85% of characters shift at least once a mission; 1.2–3.0 shifts per character; 50–80% of rolls made in animal form |
| Frame and animal balance (A6, A9) | each within ±4 points of the average win rate |
| Human perks | each worth at least +1.5 points against having no perk, and within ±3 points of the perk average |
| Party size (A21) | the win rate at each label within ±5 points across 3, 4 and 5 players |
| Clashes (A24) | 3 rounds or fewer on average; under 5% reach round 4 |

### D23 · 2026-10-22 · draft: Art direction and Foundry (Q17)
- **Decision:**
  - **Art:** painterly naturalism. Animals are true to life (ART-CHECKLIST 21–22); colour is warm, like a storybook; the kids are drawn as ordinary kids.
  - **The change is a swirl of light and leaves that hides the body.** Never a half-changed body, and never a person-to-animal sequence across a cover (§2.1, ART-CHECKLIST 24–25).
  - **Foundry:** book first. The Foundry system is built once the core rules are approved; the skeleton stays as it is.
- **Options:** painterly naturalism; cartoon; photo-real.
- **Why:** true-to-life animals are the draw; cartoon would undercut the stakes; photo-real is hard to keep consistent across a character's two forms.

## 4. Early flags: where the pitch meets the lessons in `DESIGN-RULES.md`
These aren't decisions. They're the first things to settle, because each one has already caused trouble in an earlier game.

1. **"Hide in any dark environment" skips a roll** (A8).
   - Read literally, the jaguar perk automatically succeeds at hiding wherever it's dark. That's the kind of ability that broke earlier games (the Spitting Spider jam, the Ghost's Spectral pass).
   - **Options:** turn animal perks into bonuses (extra dice, a lower Difficulty, a free retry) rather than automatic successes; or keep an automatic effect but limit it (once per scene, costs a resource, only while unseen).
   - Apply the same rule to every animal perk.
2. **Animals are wildly unequal** (A6, A9). An elephant, a mouse, a hawk and a jaguar differ hugely in size, speed, strength and stealth.
   - Decide how far frames even this out, so that no frame or animal dominates and none is a trap.
   - The simulator must test every frame and animal pick.
   - Every frame needs a spotlight in the scenarios you ship: something the hawk, the mouse and the bear each do best. Don't, for example, ship missions where flying is always the answer.
3. **One animal, or many?** The pitch has each player find one animal (a jaguar). The books' characters collected many.
   - Is it one animal per character, a few, or growth over a campaign?
   - That decides whether this is a **one-shot or a campaign game**, and how advancement works (Part B).
4. **The morph needs an original cost and limit** (A5, A7, §2.1). Don't copy the two-hour rule.
   - How long does a morph take, and what does it cost (a resource, time, noise, exposure)?
   - What can't you do in animal form?
   - Does the human perk work while morphed?
   - Make sure morphing is never free, and that it's never always the wrong choice.
5. **Two forms means two sets of numbers.**
   - Define what carries over between human and animal form (injuries, what you're carrying, clothes, the human perk) and what doesn't.
   - Keep it to one sheet that's quick at the table (A28).
6. **The enemy has to be original** (§2.1). Decide whether it's alien, supernatural or something else; whether it's hidden or open (paranoia and infiltration versus open battle); and how it detects and fights morphers (A25, Part B).
7. **Combat and stealth both matter.** A jaguar fights and hides; a hawk scouts.
   - Every approach needs real rules: fighting with no death spiral (A2) and fights that don't drag (A24), plus sneaking and scouting.
   - Party size matters too: 3–5 players need coverage without a must-have frame (A21).
8. **Tone and age.** The books are written for middle-grade readers but deal with war, horror and loss. Decide the age range, how dark it gets, and whether the transformation itself is played as wonder, comedy or body horror. That decision affects the art too.

## 5. Open questions for the design interview (DESIGN-RULES Part B, matched to this game)
1. **Identity:**
   - the title (brainstorm options; §2.3);
   - the enemy (original; §2.1);
   - where the power comes from;
   - tone and age range (flag 8);
   - setting and time period;
   - number of players, session length;
   - one-shot or campaign (flag 3).
2. **Engine:** reuse a proven engine or build new, with the trade-offs for a game with two forms and both stealth and combat:
   - Heisty Spideys' d6 pool, with Successes on 5–6;
   - Don't Get Forked's trait die plus a risk die;
   - Nine Lives Gang's push-your-luck;
   - something new.
3. **Character frames:**
   - which frames exist (cats, canines, birds of prey, bears, small creatures, reptiles, aquatic…);
   - what a frame sets (size, speed, senses, attacks, toughness);
   - how many frames there are.
4. **Animals:** how many per frame, what each animal's perk does (flag 1), and how a player gets their animal: chosen, rolled or found in play.
5. **Human perks:** the list, what each does, whether it applies in animal form, and its balance against animal perks.
6. **Morphing:** time, cost, limits, what carries over, and failure or getting stuck (flag 4). It must be original.
7. **The roll and teamwork:** what's rolled in each form, group checks, helping, the bonus cap from all sources, and whether there are opposed rolls.
8. **Conflict:** stealth and detection, combat (turn order, damage, no death spirals), chases, and enemy stat blocks.
9. **Threat:** what the enemy's advance looks like (a track, a clock or exposure), every state at its limit, and one event, one rise.
10. **Resources:** how they're earned and spent, and whether a spend is ever free or never the better choice.
11. **Failure:** hurt, captured, exposed (the enemy learns who you are), trapped in a form. How a character recovers, what "everyone down" means, and whether you can give up.
12. **Structure:** missions, a campaign arc, advancement (new animals?) and endings.
13. **Party size:** 3, 4 and 5 players, and frame coverage.
14. **Ready-made content:** missions or scenarios with maps (two ways in each), enemy roster, and generators if any (A25–A26).
15. **The first night:** dice, sheets, pre-made characters, a Storyteller round card, and setup under 30 minutes (A27–A29).
16. **Simulator targets:** win and loss rates per difficulty and party size; frame and animal balance; morph use.
17. **Art direction** (photo-real, painterly or cartoon; the look of morphing) and **Foundry** (from day one, or book first?).

## 6. Suggestions (for discussion, not decisions)
- **The frame + human perk + animal perk build is the game's hook.** Make it the centrepiece of the rulebook and the character sheet: three slots, readable at a glance.
- **A strong original twist would help it stand apart** from the existing Animorphs-inspired games. For example, a lighter, family-friendly tone, a non-alien enemy, a one-shot "night of the change" format, or a team built so that every frame matters.
- **The human perk keeps the person in the animal.** A football player's tackle or a genius's planning that still helps while morphed makes the human side matter in every scene.
