/**
 * A mission on the fake Foundry, end to end: the Storyteller starts Pemberton's Pets from
 * the tracker, a player scouts, the team goes in by the skylight, rolls are applied by the
 * GM's client as they become final (progress, Scent, Edges), a Fail on the shop floor wakes
 * the watchman (End Round starts the Clash), End Round asks who the unattended threat goes for, the
 * Clash and the obstacle raise Scent in the book's order, the Hunt comes Up, the team
 * Withdraws, the result is a Loss and the Hunt track rises by 2. Automation switched off
 * leaves a one-click Apply. Players see the tracker read-only.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, makeBonded, as, state } from "../tools/world-fixture.mjs";
import { FLAG, SETTINGS, SYSTEM_ID, APPS } from "../module/contracts.mjs";

const W = await boot();
const { game, users, log, api, diceQueue, renderMessage, clickButton, buttonLabels, dialogResponders, fakeForm } = W;
const card = m => m.flags[FLAG].card;
const last = () => game.messages.at(-1);

const maya = await makeBonded("maya", users.p1);
const theo = await makeBonded("theo", users.p2);
const priya = await makeBonded("priya", users.p1);
const jonah = await makeBonded("jonah", users.p2);
const party = [maya, theo, priya, jonah];

test("the Storyteller starts a mission from the tracker", async () => {
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.gm, () => tracker.render());
  assert.match(tracker.element.innerHTML, /Pemberton/);
  await as(users.gm, () => tracker.runAction("start", { mission: "petshop", party: party.map(a => a.id).join(",") }));
  const S = state();
  assert.equal(S.status, "scout");
  assert.equal(S.name, "Pemberton's Pets");
  assert.equal(S.limit, 6, "Limit for 4 players");
  assert.equal(S.edges, 1, "Theo is Team Captain");
  assert.ok(party.every(a => a.system.wild.value === a.system.wild.max && a.system.hurt.value === 0));
  assert.match(last().content, /the mission begins/);
  // players can't start or steer a mission
  await as(users.p1, () => api.startMission({ missionKey: "zoo" }));
  assert.equal(state().catalogKey, "petshop");
});

test("scouting: the dialog defaults to Sense against 2; a Success picks the way and gains an Edge", async () => {
  const dlg = new api.apps.RollDialog({ actor: priya });
  await W.asUser(users.p1, () => dlg.render());
  const ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.equal(dlg.choices.context, "scout");
  assert.equal(dlg.choices.approach, "sense");
  assert.equal(ctx.plan.difficulty, 2);
  diceQueue.push(5, 5);                        // Sense 2 as a kid: a Success
  await as(users.p1, () => dlg.submit({}));
  const S = state();
  assert.equal(S.status, "way");
  assert.equal(S.edges, 2);
  assert.equal(S.wayPick, "team");
  await as(users.gm, () => api.automation.act(api.mission.chooseWay, 1));
  assert.equal(api.mission.currentObstacle(state()).id, "skylight");
});

test("a point obstacle: a pending Partial is applied when the next roll comes; progress and Scent", async () => {
  // Priya, human Wits 3 + Brainiac: 4 dice vs 2 — one hit: Partial (pending: she could Push)
  diceQueue.push(5, 1, 1, 1);
  await as(users.p1, () => api.performRoll(priya, { context: "obstacle", approach: "wits", difficulty: 2, tags: ["high", "locked"], helpers: [], edges: 0 }));
  const first = last();
  assert.equal(card(first).final, false);
  assert.equal(state().scent, 0, "not applied while pending");
  const ob = api.mission.currentObstacle(state());
  assert.equal(state().progress[ob.uid].points, 0);
  // Jonah rolls next (human Force 3 + Football Player = 4 dice vs 3): 5 6 6 1 is a Critical.
  // Priya's Partial becomes final and is applied first: 1 progress, Scent +1; then Jonah's
  // Critical: 1 progress (the extra isn't needed) and an Edge (already 2: lost).
  diceQueue.push(5, 6, 6, 1);
  await as(users.p2, () => api.performRoll(jonah, { context: "obstacle", approach: "force", difficulty: 3, tags: ["high", "locked"], helpers: [], edges: 0 }));
  assert.equal(card(first).final, true);
  assert.equal(card(last()).result, "crit");
  const S = state();
  assert.equal(S.progress[ob.uid].points, 2, "Priya's Partial and Jonah's Critical: 2 progress");
  assert.equal(S.scent, 1, "the Partial costs Scent +1");
  assert.equal(S.progress[ob.uid].ended, true, "the skylight is open");
  assert.equal(card(last()).final, true);
});

test("the tracker for a player: read-only, with Roll buttons; GM controls only for the GM", async () => {
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.p1, () => tracker.render());
  const html = tracker.element.innerHTML;
  assert.doesNotMatch(html, /data-action="next"/);
  assert.doesNotMatch(html, /data-action="scent"/);
  await W.asUser(users.gm, () => tracker.render());
  assert.match(tracker.element.innerHTML, /data-action="next"/);
  // the setting hides it from players
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.trackerForPlayers, false));
  const view = await W.asUser(users.p1, () => tracker._prepareContext({}));
  assert.equal(view.canSee, false);
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.trackerForPlayers, true));
  assert.deepEqual([...log.missingI18n], []);
});

test("the shop floor: a Fail wakes the watchman (a Clash); End Round asks who he hits", async () => {
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));
  let S = state();
  const ob = api.mission.currentObstacle(S);
  assert.equal(ob.id, "floor");
  const scentBefore = S.scent;
  // Maya sneaks past as a kid (Sneak 3 + perk = 4 dice) — a Success
  diceQueue.push(5, 5, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "obstacle", approach: "sneak", difficulty: 2, tags: ["dark"], helpers: [], edges: 0 }));
  // Theo fails with no Wild left to Push: final at once, and the Beater wakes
  await as(users.gm, () => theo.update({ "system.wild.value": 0 }));
  diceQueue.push(1, 1);
  await as(users.p2, () => api.performRoll(theo, { context: "obstacle", approach: "sneak", difficulty: 2, tags: ["dark"], helpers: [], edges: 0 }));
  assert.equal(state().clash, null, "the round's rolls finish first");
  await as(users.gm, () => api.endRound());
  S = state();
  assert.ok(S.clash, "a Clash");
  assert.equal(S.clash.threats[0].key, "beater");
  assert.match(game.messages.find(m => /A Clash!/.test(m.content))?.content ?? "", /Beater/);
  // the dialog now rolls against the Beater
  const dlg = new api.apps.RollDialog({ actor: jonah, approach: "force" });
  assert.equal(dlg.choices.context, "clash");
  assert.equal(dlg.choices.action, "strike");
  assert.equal(dlg.choices.difficulty, 2);
  // round 1: nobody rolls against the Beater; End Round: the Storyteller picks Priya
  dialogResponders.push(opts => opts.ok.callback(null, { form: fakeForm({ [`target-${S.clash.threats[0].id}`]: priya.id }) }));
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.gm, () => tracker.render());
  await as(users.gm, () => tracker.runAction("endRound"));
  assert.equal(priya.system.hurt.value, 1, "the unattended Beater hits Priya");
  assert.equal(state().clash.round, 2);
  // round 2: Jonah strikes (Force 3 + Football = 4 dice vs 2): a Critical, 2 harm: out
  diceQueue.push(6, 6, 1, 1);
  await as(users.p2, () => api.performRoll(jonah, { context: "clash", action: "strike", threatId: S.clash.threats[0].id, approach: "force", difficulty: 2, tags: ["dark"], helpers: [], edges: 0 }));
  S = state();
  assert.equal(S.clash, null, "the Beater is out: the Clash ends");
  const causes = S.ledger.filter(e => e.serial >= 0).map(e => e.cause);
  assert.deepEqual(causes.slice(-2), ["group", "clash"], "the shop floor's rise comes before the Clash, then the Clash's");
  assert.equal(S.scent, scentBefore + 2);
  assert.equal(S.progress[ob.uid].ended, true, "beating the guard clears the shop floor");
});

test("in a Clash a shift is in sight: Exposed, and the Clash rises by 2", async () => {
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));   // the office door
  await as(users.gm, () => api.automation.startClash(["hound"]));
  let S = state();
  assert.ok(S.clash);
  await as(users.p1, () => api.shift(maya));
  assert.equal(maya.system.status.exposed, true);
  assert.equal(state().clash.anyShifted, true);
  const before = state().scent;
  await as(users.gm, () => api.automation.endClash());
  S = state();
  assert.equal(S.scent, Math.min(S.limit, before + 2));
});

test("the Hunt is Up: press on or Withdraw; any Fail is Taken; the result and the Hunt track", async () => {
  await as(users.gm, () => api.automation.act(api.mission.adjustScent, 10));
  let S = state();
  assert.equal(S.huntUp, true);
  assert.equal(S.huntUpChoice, "pending");
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.gm, () => tracker.render());
  assert.match(tracker.element.innerHTML, /The Hunt is Up/);
  assert.match(tracker.element.innerHTML, /data-action="pressOn"/);
  await as(users.gm, () => tracker.runAction("withdraw"));
  S = state();
  assert.equal(S.status, "escape");
  // Maya fails in the Escape with the Hunt Up: Taken (she has Wild, so she accepts it)
  diceQueue.push(1, 1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "obstacle", approach: "move", difficulty: 2, tags: ["dark", "open"], helpers: [], edges: 0 }));
  const m = last();
  assert.equal(card(m).final, false);
  clickButton(renderMessage(m, users.p1), "Accept", users.p1);
  await W.settle();
  assert.equal(maya.system.status.taken, true);
  for (const a of [theo, priya, jonah]) {
    diceQueue.push(5, 5, 5, 5, 5);
    await as(a === priya ? users.p1 : users.p2, () => api.performRoll(a, { context: "obstacle", approach: "move", difficulty: 2, tags: ["dark", "open"], helpers: [], edges: 0 }));
  }
  S = state();
  assert.equal(S.status, "done");
  assert.equal(S.result, "loss");
  await as(users.gm, () => tracker.runAction("finish"));
  S = state();
  assert.equal(S.campaign.huntTrack, 2);
  assert.ok(party.every(a => a.system.growth.value === 1), "every character marks 1 Growth");
  assert.equal(S.campaign.exposedNext, true);
  await as(users.gm, () => tracker.runAction("close"));
  assert.equal(state().status, "idle");
  assert.equal(state().campaign.huntTrack, 2, "the campaign carries on");
});

test("automation off: the outcome waits for the Storyteller's one click", async () => {
  diceQueue.length = 0;
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.autoScent, false));
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.autoHurt, false));
  await as(users.gm, () => api.startMission({ missionKey: "zoo", actorIds: [theo.id, priya.id, jonah.id] }));
  let S = state();
  assert.equal(S.scent, 0, "Exposed last time: suggested, not applied");
  assert.equal(S.suggested[0].kind, "scent");
  await as(users.gm, () => api.automation.act(api.mission.chooseWay, 1, { auto: { scent: false } }));   // the culvert: dangerous
  await as(users.gm, () => theo.update({ "system.wild.value": 0 }));
  diceQueue.push(1, 1, 1);
  await as(users.p2, () => api.performRoll(theo, { context: "obstacle", approach: "move", difficulty: 2, tags: ["water", "narrow", "dark"], helpers: [], edges: 0 }));
  const m = last();
  assert.equal(theo.system.hurt.value, 0, "Hurt suggested, not applied");
  assert.ok(buttonLabels(m, users.gm).includes("Apply the outcome"));
  clickButton(renderMessage(m, users.gm), "Apply the outcome", users.gm);
  await W.settle();
  assert.equal(theo.system.hurt.value, 1);
  // the tracker lists the Scent suggestion; Apply it
  S = state();
  const i = S.suggested.findIndex(s => s.kind === "scent");
  await as(users.gm, () => api.automation.resolveSuggestion(i, true));
  assert.equal(state().scent, 1);
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.autoScent, true));
  await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.autoHurt, true));
});

test("a custom mission: edited as data in the tracker, checked, remembered, run", async () => {
  await as(users.gm, () => api.automation.act(api.mission.endMission));
  await as(users.gm, () => api.automation.finishMission());
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.gm, () => tracker.render());
  const { blankMission } = await import("../module/logic/missions.mjs");
  const mine = { ...blankMission(), name: "The Swimming Baths", label: "hard", limit: { 3: 6, 4: 6, 5: 5 } };
  mine.inside[0] = { id: "pool", name: "The deep end", kind: "group", tags: ["water"], approaches: { move: 2, sneak: 3 }, guards: ["hound"] };
  // a broken one first: refused with the problems listed
  dialogResponders.push(opts => opts.ok.callback(null, { form: fakeForm({ mission: JSON.stringify({ ...mine, escape: [] }) }) }));
  await as(users.gm, () => tracker.runAction("start", { mission: "custom", party: `${theo.id},${priya.id},${jonah.id}` }));
  assert.ok(log.warnings.some(w => /Escape needs at least one obstacle/.test(w)));
  dialogResponders.push(opts => opts.ok.callback(null, { form: fakeForm({ mission: JSON.stringify(mine) }) }));
  await as(users.gm, () => tracker.runAction("start", { mission: "custom", party: `${theo.id},${priya.id},${jonah.id}` }));
  const S = state();
  assert.equal(S.name, "The Swimming Baths");
  assert.equal(S.limit, 6);
  assert.equal(S.catalogKey, "custom");
  await as(users.gm, () => api.automation.act(api.mission.chooseWay, 0));
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));
  assert.equal(api.mission.currentObstacle(state()).name, "The deep end");
  assert.match(game.settings.get(SYSTEM_ID, SETTINGS.customMission), /Swimming Baths/, "remembered for next time");
});

test("the scene-control button and the tracker app id", async () => {
  const controls = { tokens: { tools: { select: {} } } };
  await W.asUser(users.gm, () => W.Hooks.callAll("getSceneControlButtons", controls));
  assert.equal(controls.tokens.tools.mgTracker.button, true);
  await W.asUser(users.gm, () => controls.tokens.tools.mgTracker.onChange());
  await W.settle();
  assert.ok(foundry.applications.instances.get(APPS.tracker)?.rendered);
});

test("nothing logged an error", () => { assert.deepEqual(log.errors, []); assert.deepEqual([...log.missingI18n], []); });
