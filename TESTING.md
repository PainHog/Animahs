# Testing the Foundry system

## Automated

```
npm install
npm run check        # the validator (manifest, packs, templates) + node --test
```

`node --test` covers the shared rules (`module/logic/`), the mission reducer, character validation, the pack content against the rulebook, and the system booted on `tools/fake-foundry.mjs` with a GM and two players: sheets, the roll dialog and cards, Clashes, a whole mission, GM operations and their permission checks. The simulator check: `node sim/run.mjs --runs 300 --balance 0 --sweep 0 --out /tmp/x.md` gives the same report as before any change to the shared code.

After a rulebook change: `npm run build:sources && npm run build:packs`, then commit `packs/`.

## Manual two-client smoke test

The stand-in can't show layout, CSS, 3D dice or the canvas, so run this once per release in a real world (Foundry v13 and v14). Use two browsers: **GM** and **Player** (a Player role user, without permission to create actors). Turn on Dice So Nice if it's installed. Tick each step; note the Foundry version.

### Set-up
1. [ ] Install from the manifest URL (or the folder). The world starts with no console errors.
2. [ ] Compendiums: **Second Nature** folder with Ready-Made Bonded (6), Threats (5), Rules (4 journals), Missions (5). Journals open with tables and no art placeholders.
3. [ ] GM imports Maya, Theo, Priya and Jonah; gives Maya and Priya to the Player. Tokens of Bonded are linked and show Wild and Hurt bars.
4. [ ] Player opens Maya's sheet: both rating rows, Human highlighted, Night Rosettes and Hide-and-Seek Champ texts, 4 Wild pips, 3 Hurt boxes, no warnings.
5. [ ] Player changes a human rating to break 3, 2, 2, 1, 1 → a warning appears; changes it back → it goes.
6. [ ] GM creates a blank Bonded, opens **Character builder**, **Roll it all**: dice show, no animal repeats one in the world; **Use this** fills the sheet.

### Rolling (no mission)
7. [ ] Player clicks Maya's **Sneak** button: the dialog shows "A free roll", 4 dice vs 2, Hide-and-Seek Champ listed, Theo and Jonah as possible helpers, odds.
8. [ ] Tick Dark: nothing changes (human form). Tick both helpers: one is counted, "over the Cap" warning.
9. [ ] Roll: 3D dice (if installed), a card with faces, hits in green, the result. On a Fail/Partial: **Push (1 Wild)** and **Accept** for the Player only (the GM sees them too).
10. [ ] **Push**: misses reroll (dashed outline), Wild 4 → 3 on the sheet, the card updates on both clients.
11. [ ] Help from Theo (the GM's character): Theo's Wild drops by 1 on both clients (a GM operation; the Player doesn't own Theo).
12. [ ] Shift Maya into the jaguar: Wild −1, a shift card, the sheet's Animal row is highlighted, Wits can't be rolled. Shift back: free.

### A mission
13. [ ] GM: paw button in the token controls → Mission Tracker. Choose Pemberton's Pets, tick the four, **Start the mission**: Limit 6, Edges 1 (Theo is Team Captain), a start card. Player's tracker shows the same, without GM buttons.
14. [ ] Player rolls Priya's **Sense** (the dialog says Scouting, Difficulty 2). The tracker shows the result, Edges and who picks. GM: **Go in by way B** (the skylight).
15. [ ] Player rolls Wits for Priya: the dialog shows "Difficulty 2 here" and the tags High, Locked. Get a Partial and leave it: the card says it isn't final. GM rolls Jonah's Force: Priya's card becomes final, progress and Scent +1 appear on the tracker in that order.
16. [ ] **Next obstacle** (the shop floor, group, guarded). Get a Fail with a character who has no Wild: a "Clash!" card, a Beater on the tracker (a token if a scene is open).
17. [ ] **End the Clash round** without rolling against the Beater: a dialog asks who it hits (random default); Hurt appears on that sheet.
18. [ ] Strike the Beater out: the Clash ends (Scent +1, or +2 if someone went Down or shifted), then the shop floor's own +1; the tracker shows it cleared.
19. [ ] GM **+** on Scent to the Limit: "The Hunt is Up", Press on / Withdraw with advice. **Withdraw**: the Escape starts (On the Trail marked if at half the Limit).
20. [ ] Player Fails in the Escape and presses **Accept**: Taken on both clients (sheet status, tracker party list, a card).
21. [ ] The rest get past: the tracker shows Loss. **Finish the mission**: Hunt track 2, every sheet's Growth 1. **Close the mission**.

### Switches and edge cases
22. [ ] Settings: turn off **Apply Scent automatically** and **Apply Hurt and Netted**. Start the Zoo; fail in the river culvert: no Hurt, no Scent; the GM's card shows **Apply the outcome** and the tracker lists suggestions; applying them works.
23. [ ] Turn off **Players see the Mission Tracker**: the Player's tracker says it's hidden; the scene-control button disappears for them after a reload.
24. [ ] GM logs out; Player rolls and Accepts; GM logs back in: the roll is applied on ready.
25. [ ] Player with the GM offline tries to Help with Theo: "The Storyteller isn't connected" and nothing changes.
26. [ ] Custom mission: choose **A custom mission**, break it (remove the Escape) → a warning; fix it → it starts with your obstacles.
27. [ ] A threat actor's sheet: change the kind to Huntsman → Difficulty 3, Toughness 4, Harm 2.
