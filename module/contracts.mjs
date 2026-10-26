/**
 * SECOND NATURE — Cross-package contracts.
 * Constants only: no imports, no Foundry globals, no logic. Every name that two
 * parts of the system must agree on (setting keys, chat-card kinds, GM operation
 * names, hook names, flag scopes, template paths) is declared here once and
 * imported everywhere, so the parts cannot drift apart; test/contracts.test.mjs
 * asserts each one is actually used. Change it only on purpose, together with
 * every user of it.
 */
export const SYSTEM_ID = "morphgame";
/** Flag scope for documents (flags["morphgame"]). */
export const FLAG = "morphgame";
/** CONFIG.queries handler name for GM-authoritative operations. */
export const QUERY = "morphgame.op";
/** Socket channel (system.json "socket": true). */
export const SOCKET = "system.morphgame";
/** Where the system's files live once installed. */
export const SYSTEM_PATH = "systems/morphgame";

/** World/client setting keys. */
export const SETTINGS = Object.freeze({
  migrationVersion: "systemMigrationVersion",
  missionState: "missionState",
  autoProgress: "autoProgress",
  autoScent: "autoScent",
  autoHurt: "autoHurt",
  autoClash: "autoClash",
  autoTaken: "autoTaken",
  autoWild: "autoWild",
  autoGrowth: "autoGrowth",
  threatTargets: "threatTargets",
  trackerForPlayers: "trackerForPlayers",
  trackerAutoOpen: "trackerAutoOpen",
  rulesReminders: "rulesReminders",
});

/** Chat-card kinds (flags.morphgame.card.kind). */
export const CARD = Object.freeze({
  roll: "roll",       // a roll: faces, result, Push / Burst / Wily / Charge / Antler Sweep / Accept
  shift: "shift",     // a shift into or out of animal form
  notice: "notice",   // a short notice: Patch Up, freeing a friend, Hurt, Down, Taken, Scent, results
});

/** GM-authoritative operation names (CONFIG.queries QUERY → { op, args, userId, requestId }). */
export const OPS = Object.freeze({
  payHelp: "help.pay",                 // a roller's helpers pay 1 Wild each (or Coyote's Pack)
  spendEdges: "mission.spendEdges",    // the team spends Edges on a roll
  heal: "actor.heal",                  // Patch Up a friend you don't own
  freeNetted: "actor.freeNetted",      // free a Netted friend
  handPrize: "mission.handPrize",      // the carrier hands the prize to a friend
  cardPatch: "card.patch",             // Push / Wily / Charge / Sweep on a card the clicker didn't author
  acceptCard: "card.accept",           // finalize a pending roll card
});

/** Hooks this system fires (other modules may listen). */
export const HOOKS = Object.freeze({
  rollResolved: "morphgame.rollResolved",       // (message, card) — a roll card was created or changed
  missionChanged: "morphgame.missionChanged",   // (state, previous)
  shifted: "morphgame.shifted",                 // (actor, fromForm, toForm)
});

/** Template paths (relative to SYSTEM_PATH). */
export const TEMPLATES = Object.freeze({
  bondedSheet: "templates/actor/bonded-sheet.hbs",
  threatSheet: "templates/actor/threat-sheet.hbs",
  rollDialog: "templates/apps/roll-dialog.hbs",
  tracker: "templates/apps/mission-tracker.hbs",
  builder: "templates/apps/character-builder.hbs",
  targets: "templates/apps/clash-targets.hbs",
  rollCard: "templates/chat/roll-card.hbs",
  noticeCard: "templates/chat/notice-card.hbs",
});

/** Application ids. */
export const APPS = Object.freeze({
  tracker: "morphgame-tracker",
  rollDialog: "morphgame-roll",
  builder: "morphgame-builder",
});
