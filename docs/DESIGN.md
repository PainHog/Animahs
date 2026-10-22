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
