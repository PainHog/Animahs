/**
 * The roll flow on the fake Foundry, as real users on their own clients: the roll dialog
 * builds the plan, the roll uses Foundry's Roll, the card shows the faces and result, and
 * its buttons (Push, Burst, Wily, Charge, Accept) change it — paying from the right actor,
 * through a GM operation when the clicker doesn't own what changes. Permission checks too.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, makeBonded, as } from "../tools/world-fixture.mjs";
import { FLAG, OPS, QUERY } from "../module/contracts.mjs";

const W = await boot();
const { game, users, log, api, diceQueue, renderMessage, clickButton, buttonLabels } = W;
const card = m => m.flags[FLAG].card;
const last = () => game.messages.at(-1);

const maya = await makeBonded("maya", users.p1);
const theo = await makeBonded("theo", users.p2);
const jonah = await makeBonded("jonah", users.p2);

test("the dialog: defaults, modifiers with sources, Help candidates, the Cap, odds", async () => {
  const dlg = new api.apps.RollDialog({ actor: maya, approach: "sneak" });
  await W.asUser(users.p1, () => dlg.render());
  let ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.equal(ctx.contexts[0].key, "free", "no mission: a free roll");
  assert.equal(ctx.plan.pool, 4, "Sneak 3 + Hide-and-Seek Champ");
  assert.deepEqual(ctx.mods.map(m => m.text), ["Hide-and-Seek Champ: +1 die"]);
  assert.deepEqual(ctx.helpers.map(h => [h.name, h.ok]), [["Theo Park", true], ["Jonah Mensah", true]]);
  assert.match(ctx.chances, /At least a Partial 80%/);
  // tick Dark and Water: human form ignores tags
  await W.asUser(users.p1, () => dlg.updateChoices({ tags: ["dark", "water"] }));
  ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.equal(ctx.plan.pool, 4);
  // two helpers: one fits under the Cap (+1 perk +1 help), the other isn't spent
  await W.asUser(users.p1, () => dlg.updateChoices({ helpers: [theo.id, jonah.id] }));
  ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.equal(ctx.plan.pool, 5);
  assert.deepEqual(ctx.plan.helpersUsed.map(h => h.id), [theo.id]);
  assert.ok(ctx.warnings.some(w => /over the Cap/.test(w)));
  assert.deepEqual([...log.missingI18n], []);
  await W.asUser(users.p1, () => dlg.close());
});

test("roll → card → Push: faces, hits highlighted, result, 1 Wild, misses rerolled", async () => {
  diceQueue.push(5, 1, 2, 3);
  const dlg = new api.apps.RollDialog({ actor: maya, approach: "sneak" });
  await W.asUser(users.p1, () => dlg.render());
  await as(users.p1, () => dlg.submit({}));
  const m = last();
  assert.equal(m.author, users.p1.id);
  assert.equal(m.rolls.length, 1, "a Foundry Roll on the message (Dice So Nice shows it)");
  let c = card(m);
  assert.deepEqual(c.faces, [5, 1, 2, 3]);
  assert.equal(c.result, "partial");
  assert.equal(c.final, false, "a Partial that could be Pushed is pending");
  assert.match(m.content, /mg-die hit/);
  assert.deepEqual(buttonLabels(m, users.p1), ["Push (1 Wild)", "Accept"]);
  assert.deepEqual(buttonLabels(m, users.p2), [], "Ben doesn't own Maya: no buttons");
  diceQueue.push(6, 6, 1);
  clickButton(renderMessage(m, users.p1), "Push", users.p1);
  await W.settle();
  c = card(m);
  assert.deepEqual(c.faces, [5, 6, 6, 1]);
  assert.equal(c.result, "crit");
  assert.equal(c.push.by, "wild");
  assert.equal(c.final, true);
  assert.equal(maya.system.wild.value, 3);
  assert.equal(m.rolls.length, 2);
  assert.deepEqual(buttonLabels(m, users.p1), [], "pushed once: no more Push");
});

test("Help is paid by the helper through the GM; Coyote's Pack is free once per scene", async () => {
  diceQueue.push(1, 1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [theo.id], edges: 0 }));
  assert.equal(theo.system.wild.value, 3, "Theo paid 1 Wild");
  assert.equal(card(last()).pool, 5);
  assert.deepEqual(card(last()).helpers.map(h => h.name), ["Theo Park"]);
  // Theo as a coyote: Pack pays once this scene
  await as(users.p2, () => api.shift(theo));
  assert.equal(theo.system.wild.value, 2);
  diceQueue.push(1, 1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [theo.id], edges: 0 }));
  assert.equal(theo.system.wild.value, 2, "Pack: no Wild");
  assert.equal(card(last()).helpers[0].free, true);
  diceQueue.push(1, 1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [theo.id], edges: 0 }));
  assert.equal(theo.system.wild.value, 1, "Pack is used up this scene: 1 Wild");
  // a coyote can't help a Wits roll from animal form
  diceQueue.push(1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "wits", difficulty: 2, tags: [], helpers: [theo.id], edges: 0 }));
  assert.equal(card(last()).helpers.length, 0);
  assert.equal(theo.system.wild.value, 1);
});

test("Red Fox Wily, Cheetah Burst, Hippopotamus Charge", async () => {
  const kit = await as(users.gm, () => Actor.create({ name: "Kit", type: "bonded", ownership: { default: 0, [users.p2.id]: 3 },
    system: { animal: "fox", frame: "canines", perk: "scout", form: "animal", wild: { value: 0, max: 4 } } }));
  diceQueue.push(1, 2, 3);                      // Sneak 3 as a fox: a Fail, no Wild to Push
  await as(users.p2, () => api.performRoll(kit, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [], edges: 0 }));
  const mk = last();
  assert.equal(card(mk).final, false, "Wily is still possible");
  assert.deepEqual(buttonLabels(mk, users.p2), ["Wily: make it a Partial", "Accept"]);
  clickButton(renderMessage(mk, users.p2), "Wily", users.p2);
  await W.settle();
  assert.equal(card(mk).result, "partial");
  assert.equal(card(mk).final, true);
  diceQueue.push(1, 2, 3);
  await as(users.p2, () => api.performRoll(kit, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [], edges: 0 }));
  assert.equal(card(last()).final, true, "Wily used this scene: the Fail is final");
  // Cheetah: Burst is a free Push on Move
  const zed = await as(users.gm, () => Actor.create({ name: "Zed", type: "bonded", ownership: { default: 0, [users.p1.id]: 3 },
    system: { animal: "cheetah", frame: "cats", perk: "trackstar", form: "animal" } }));
  diceQueue.push(1, 2, 3, 4);                   // Move 3 + Track Star
  await as(users.p1, () => api.performRoll(zed, { context: "free", approach: "move", difficulty: 2, tags: [], helpers: [], edges: 0 }));
  const mz = last();
  assert.deepEqual(buttonLabels(mz, users.p1), ["Push (1 Wild)", "Burst (free Push)", "Accept"]);
  diceQueue.push(5, 6, 1, 1);
  clickButton(renderMessage(mz, users.p1), "Burst", users.p1);
  await W.settle();
  assert.equal(card(mz).result, "success");
  assert.equal(zed.system.wild.value, 4, "no Wild for Burst");
  assert.equal(card(mz).push.by, "burst");
  // Hippopotamus: Charge turns a Force Success into a Critical, once per scene
  const hip = await as(users.gm, () => Actor.create({ name: "Hal", type: "bonded", ownership: { default: 0, [users.p1.id]: 3 },
    system: { animal: "hippo", frame: "heavies", perk: "scout", form: "animal", wild: { value: 0, max: 4 } } }));
  diceQueue.push(5, 6, 1, 1);
  await as(users.p1, () => api.performRoll(hip, { context: "free", approach: "force", difficulty: 2, tags: [], helpers: [], edges: 0 }));
  const mh = last();
  assert.equal(card(mh).result, "success");
  assert.deepEqual(buttonLabels(mh, users.p1), ["Charge: count as a Critical"]);
  clickButton(renderMessage(mh, users.p1), "Charge", users.p1);
  await W.settle();
  assert.equal(card(mh).result, "crit");
  assert.equal(card(mh).charge, true);
});

test("GM operations check who is asking", async () => {
  diceQueue.push(1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [], edges: 0 }));
  const m = last();
  const ask = (user, op, args) => W.asUser(user, () => game.users.activeGM.query(QUERY, { op, args, userId: user.id, requestId: `r${Math.random()}` }));
  // Ben may not change Maya's card, nor make Theo pay for Maya's roll
  assert.deepEqual(await ask(users.p2, OPS.cardPatch, { messageId: m.id, patch: { result: "crit" } }), { ok: false, reason: "notOwner" });
  assert.deepEqual(await ask(users.p2, OPS.payHelp, { rollerId: maya.id, helpers: [theo.id] }), { ok: false, reason: "notOwner" });
  // Ana may not patch fields outside the whitelist
  assert.deepEqual(await ask(users.p1, OPS.cardPatch, { messageId: m.id, patch: { pool: 9 } }), { ok: false, reason: "badPatch" });
  // no Edges to spend
  assert.deepEqual(await ask(users.p1, OPS.spendEdges, { actorId: maya.id, n: 1 }), { ok: false, reason: "noEdges" });
  // an unknown user is refused outright
  const forged = await W.asUser(users.p1, () => game.users.activeGM.query(QUERY, { op: OPS.heal, args: {}, userId: "nobody" }));
  assert.deepEqual(forged, { ok: false, reason: "unknownUser" });
  // and Ben's client can't push Maya's card
  assert.equal(await W.asUser(users.p2, () => api.push(m)), null);
  // the same request id never applies twice
  await as(users.gm, () => jonah.update({ "system.hurt.value": 2 }));
  const rq = { op: OPS.heal, args: { healerId: theo.id, targetId: jonah.id }, userId: users.p2.id, requestId: "same-id" };
  await W.asUser(users.p2, () => game.users.activeGM.query(QUERY, rq));
  await W.asUser(users.p2, () => game.users.activeGM.query(QUERY, rq));
  assert.equal(jonah.system.hurt.value, 1);
});

test("no GM connected: a request is refused politely, nothing changes", async () => {
  users.gm.active = false;
  const before = theo.system.wild.value;
  diceQueue.push(1, 1, 1, 1, 1);
  await as(users.p1, () => api.performRoll(maya, { context: "free", approach: "sneak", difficulty: 2, tags: [], helpers: [theo.id], edges: 0 }));
  users.gm.active = true;
  assert.equal(theo.system.wild.value, before);
  assert.equal(card(last()).helpers.length, 0, "unpaid Help isn't counted");
  assert.ok(log.warnings.some(w => /isn't connected/.test(w)));
});

test("nothing logged an error", () => { assert.deepEqual(log.errors, []); assert.deepEqual([...log.missingI18n], []); });
