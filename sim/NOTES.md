# Simulator notes (v0.1)

## What is modelled
- **Every rule in `docs/CORE-RULES.md` v0.1b:**
  - §1 the roll and the Cap;
  - §2 forms, tags, Strengths and Weaknesses;
  - §3 shifting, including paying with Hurt and being Stuck;
  - §4 Wild, Push, Help, Patch Up and Edges;
  - §6 point and group obstacles, guarded and dangerous obstacles, and Criticals;
  - §7 Clashes: Strike, Distract, freeing a Netted friend, unattended threats pressing, the 4-round limit and the one Scent rise;
  - §8 Scent, On the Trail and the Hunt is Up;
  - §9 Hurt, Down, Netted, Taken and Exposed;
  - §10 scouting, ways in, carrying the prize and results;
  - §11 random legal characters;
  - every perk in Tables 2 and 3, and every threat in Table 4.
- **Player decisions are policies** (`engine.mjs`):
  - each roll is chosen by expected value, with a Scent cost that grows near the Limit;
  - Help, Edges and Pushes are bought when they're worth more than the Wild they cost; the default `spend: "spendy"` follows the book's advice to spend Wild;
  - the team starts a Clash with guards when getting past them looks worse;
  - after the Hunt is Up, the team presses on only if the objective is already underway, and runs once a friend is Taken.

## What isn't modelled (abstractions)
- **No map:** moving between obstacles is free, and everyone is at every obstacle.
- **Slip Away and Withdraw (outside the Hunt-is-Up choice) are never used.** Both are always no better than fighting on.
- **The prize is never handed from one character to another.** The rules don't yet say whether it can be; see the gaps below.
- **Campaign rules (§12)** aren't simulated: Growth, the Hunt track, Exposed carry-over, rescues.
- **Scouting is one roll by the best Sense character.** Its value is the choice of way in plus Edges.

## Rule gaps found while building it (to settle in the chapters)
1. **Handing over the prize:** can the carrier pass it to a friend, and does that take an action? Rule A8 says to test hand-offs against every ability.
2. **Helping during a Clash:** Help doesn't use your action (§5), so in a Clash a character can Help a friend's Strike and still act themselves. The simulator allows it. Worth confirming that's intended.
3. **A Critical at a group obstacle** gives an Edge (§6, "if the extra progress isn't needed"). This is the main source of Edges (about 4 a mission); worth stating outright.
4. **Patch Up "on the way"** (§6) is free. Since Hurt clears between missions, healing matters little. If the chapters want healing to matter, Hurt has to matter more first.
5. **Distract** is only worth it for characters with Force 1. It's rarely chosen, so check whether it's dead content once Clashes are longer.
6. **The Gala's crowd obstacles** make three frames weaker there (Big Cats, Heavies, Reptiles). Intended (A9 spotlights), but the book's missions should spread Crowd across more than one mission.
