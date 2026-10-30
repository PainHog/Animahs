# Testing the Foundry system

## Automated

```
npm install
npm run check        # the validator (manifest, packs, templates) + node --test
```

`node --test` covers the shared rules (`module/logic/`), the mission reducer, character validation, the pack content against the rulebook, and the system booted on `tools/fake-foundry.mjs` with a GM and two players: sheets, the roll dialog and cards, Clashes, a whole mission, GM operations and their permission checks, and the Starter adventure imported and played from the tracker to the result on the Zoo's scene (`test/foundry-starter.test.mjs`). The simulator check: `node sim/run.mjs --runs 300 --balance 0 --sweep 0 --out /tmp/x.md` gives the same report as before any change to the shared code.

After a rulebook change: `npm run build:sources && npm run build:packs`, then commit `packs/`.

## The 15-minute check (do this first)

Two browser windows: **GM** (Gamemaster) and **Player** (a Player-role user). Foundry v13 or v14. If a step goes wrong, note the step number, what you saw and any red error in the browser console (F12).

1. [ ] Install the system, create a world with it, log in as GM. No red errors in the console.
2. [ ] Compendium Packs tab, **Second Nature** folder: open **Second Nature: Starter**, press **Import Adventure**, accept. Folders appear for the Bonded, the Hunt, Missions, Rules and Scenes.
3. [ ] Actors: Maya's portrait shows on her sheet. Give Maya to the Player (right-click → Configure Ownership → Owner).
4. [ ] Scenes: open **The Zoo After Dark** and activate it. The zoo map fills the scene; a gold pin sits above each lettered marker; the GM sees faded Hounds by marker 3 and Trappers by ★. In the Player's window, neither the pins nor the Hounds and Trappers show.
5. [ ] GM: click the pin by marker A. The zoo's journal opens.
6. [ ] GM: the paw button in the token controls opens the **Mission Tracker** with *The Zoo After Dark* already chosen. Tick Maya, Theo, Priya and Jonah and press **Start the mission**. A chat card says the mission begins; the Scent track shows a Limit of 8.
7. [ ] Player: on Maya's sheet press **Roll** for Sense. The dialog says Scouting, Sense, Difficulty 2. Roll. The tracker updates in both windows.
8. [ ] GM: choose way A, then roll for Theo, Priya and Jonah from the tracker; Player rolls for Maya. When everyone is past, **Next obstacle**. Keep going to the Hound patrol (marker 3).
9. [ ] At the patrol: Maya's Sneak dialog shows Difficulty 3 (the Hounds' Tracker). Keep rolling until someone Fails (or set Maya's Wild to 0 and Fail), let everyone roll, then press **End round**. The two Hounds by marker 3 become visible to the Player and a Clash starts.
10. [ ] Strike the Hounds until both are out (Strike buttons, **End Clash round** between rounds). Each out Hound is hidden again. The Clash ends by itself.
11. [ ] Next obstacle (the crates, guarded by the Trappers), roll until it's open; **Start the Escape**, roll everyone across the moat. The tracker shows the result; **Finish the mission**. Everyone's sheet shows 1 Growth.
12. [ ] Player: nothing above threw an error or asked for permission they shouldn't need.

The automated version of this run is `test/foundry-starter.test.mjs` (on the stand-in Foundry). The full checklist below goes through everything else.

## Manual two-client smoke test

The stand-in can't show layout, CSS, 3D dice or the canvas, so run this once per release in a real world (Foundry v13 and v14). Use two browsers: **GM** and **Player** (a Player role user, without permission to create actors). Turn on Dice So Nice if it's installed. Tick each step; note the Foundry version.

### Set-up
1. [ ] Install from the manifest URL (or the folder). The world starts with no console errors.
2. [ ] Compendiums: **Second Nature** folder with Second Nature: Starter (1 adventure), Ready-Made Bonded (6), Threats (5), Rules (4 journals), Missions (5). Journals open with tables and no art placeholders; each mission opens on its map.
2a. [ ] **Import Adventure** on the Starter: folders for the Bonded, the Hunt, Missions, Rules and Scenes; 11 actors with portraits (the Master keeps its icon), 9 journals, 6 scenes with thumbnails. Importing a second time offers to update, and makes no duplicates.
2b. [ ] Open the **Wrenfield** scene: the map fills it; five pins sit just above the numbered places, and each opens that mission's journal. Open **The Zoo After Dark**: a pin above every marker; the GM sees the two Hounds beside 3 and the two Trappers beside ★ as hidden (faded) tokens; the Player sees neither the pins nor the tokens.
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
