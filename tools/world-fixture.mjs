/**
 * Test support: boot the real system on the fake Foundry (tools/fake-foundry.mjs) with a
 * GM and two players, and make Bonded from the ready-made characters' numbers.
 * Lives in tools/ (not test/), so node --test does not run it as a test file.
 */
import * as Fake from "./fake-foundry.mjs";

export const GM = { id: "gmUser0000000000", name: "Storyteller", isGM: true };
export const P1 = { id: "player1000000000", name: "Ana" };
export const P2 = { id: "player2000000000", name: "Ben" };

/** The six ready-made Bonded (Chapter 18). */
export const READY = {
  maya:  { name: "Maya Reyes", system: { age: 12, animal: "jaguar", frame: "cats", perk: "hideseek", human: { sneak: 3, force: 1, move: 2, sense: 2, wits: 1 }, mark: "a fleck of gold in her left eye" } },
  theo:  { name: "Theo Park", system: { age: 13, animal: "coyote", frame: "canines", perk: "captain", human: { sneak: 1, force: 2, move: 3, sense: 1, wits: 2 } } },
  priya: { name: "Priya Shah", system: { age: 11, animal: "owl", frame: "birds", perk: "brainiac", human: { sneak: 1, force: 1, move: 2, sense: 2, wits: 3 } } },
  sam:   { name: "Sam Lindqvist", system: { age: 12, animal: "rat", frame: "critters", perk: "gamer", human: { sneak: 2, force: 1, move: 2, sense: 3, wits: 1 } } },
  jonah: { name: "Jonah Mensah", system: { age: 14, animal: "bison", frame: "heavies", perk: "football", human: { sneak: 1, force: 3, move: 2, sense: 1, wits: 2 } } },
  lucia: { name: "Lucía Ortega", system: { age: 13, animal: "gator", frame: "reptiles", perk: "swim", human: { sneak: 2, force: 1, move: 3, sense: 1, wits: 2 } } },
};

let booted = null;

/** Boot once per test file. Returns the fake's handles plus the system's API. */
export async function boot() {
  if (booted) return booted;
  const { game, CONFIG, log, Hooks } = Fake.installFoundry({ users: [GM, P1, P2] });
  await import("../module/morphgame.mjs");
  Hooks.callAll("init");
  Hooks.callAll("ready");
  await Fake.settle();
  const users = { gm: game.users.get(GM.id), p1: game.users.get(P1.id), p2: game.users.get(P2.id) };
  booted = { ...Fake, game, CONFIG, log, Hooks, users, api: game.morphgame };
  return booted;
}

/** Create a Bonded (as the GM) owned by a user. */
export async function makeBonded(key, owner, extra = {}) {
  const { asUser, users } = booted;
  const r = READY[key];
  return asUser(users.gm, () => Actor.create({
    name: r.name, type: "bonded",
    system: { ...structuredClone(r.system), ...(extra.system ?? {}) },
    ownership: { default: 0, ...(owner ? { [owner.id]: 3 } : {}) },
  }));
}

/** Run as a user and wait for every hook, write and render to finish. */
export async function as(user, fn) {
  const { asUser, settle } = booted;
  const out = await asUser(user, fn);
  await settle();
  return out;
}

/** The current mission state. */
export const state = () => booted.api.getState();
