/**
 * GM-authoritative operations. Players write only their own actors and their own chat
 * messages; anything else (a friend's Wild when they Help, the team's Edges, a friend's
 * Hurt when you Patch them Up, a card the clicker didn't write) is a named operation the
 * active GM runs after checking it (the Heisty Spideys design, §8).
 *
 * Transport: CONFIG.queries[QUERY] on the GM's client, reached with User#query. The query
 * handler is not told who sent it, so the request carries the sender's userId and the GM
 * checks that user is connected and owns the actor named; core's own timeout doesn't stop
 * the requester waiting, so run() races the query against its own timer.
 */
import { QUERY } from "../contracts.mjs";

const registry = new Map();
const recent = [];             // request ids already applied (a retry never applies twice)
const RECENT_MAX = 200;
const TIMEOUT_MS = 10000;

/**
 * Register an operation: check(args, user) → { ok, reason }, apply(args, user) → result.
 * Both run on the active GM's client.
 */
export function registerOp(name, { check, apply }) {
  if (registry.has(name)) throw new Error(`GM operation ${name} registered twice`);
  registry.set(name, { check, apply });
}

export const registeredOps = () => [...registry.keys()];

/** The query handler (registered in init). */
export async function handleQuery(data) {
  if (!game.user?.isGM) return { ok: false, reason: "notGM" };
  const { op, args = {}, userId, requestId } = data ?? {};
  const user = game.users.get(userId);
  if (!user || !user.active) return { ok: false, reason: "unknownUser" };
  if (requestId && recent.includes(requestId)) return { ok: true, duplicate: true };
  return execute(op, args, user, requestId);
}

async function execute(op, args, user, requestId) {
  const entry = registry.get(op);
  if (!entry) return { ok: false, reason: "unknownOp" };
  let verdict;
  try { verdict = await entry.check(args, user); }
  catch (err) { console.error(err); return { ok: false, reason: "checkFailed" }; }
  if (!verdict?.ok) return { ok: false, reason: verdict?.reason ?? "refused" };
  if (requestId) { recent.push(requestId); if (recent.length > RECENT_MAX) recent.shift(); }
  try { return { ok: true, result: await entry.apply(args, user) }; }
  catch (err) { console.error(err); return { ok: false, reason: "applyFailed" }; }
}

/**
 * Run an operation: directly when this client is the active GM, otherwise by asking the
 * active GM. Returns { ok, reason?, result? }. Never throws.
 */
export async function runOp(op, args = {}) {
  const gm = game.users.activeGM;
  if (game.user.isGM && (!gm || gm.id === game.user.id)) return execute(op, args, game.user, null);
  if (!gm) {
    ui.notifications.warn(game.i18n.localize("MG.Notify.noGM"));
    return { ok: false, reason: "noGM" };
  }
  const requestId = foundry.utils.randomID(16);
  let timer;
  try {
    const answer = await Promise.race([
      gm.query(QUERY, { op, args, userId: game.user.id, requestId }, { timeout: TIMEOUT_MS }),
      new Promise(resolve => { timer = setTimeout(() => resolve({ ok: false, reason: "timeout" }), TIMEOUT_MS); }),
    ]);
    if (!answer?.ok) ui.notifications.warn(game.i18n.format("MG.Notify.opRefused", { reason: game.i18n.localize(`MG.Reason.${answer?.reason ?? "refused"}`) }));
    return answer ?? { ok: false, reason: "noAnswer" };
  } catch (err) {
    console.error(err);
    ui.notifications.warn(game.i18n.localize("MG.Notify.noGM"));
    return { ok: false, reason: "noGM" };
  } finally {
    clearTimeout(timer);
  }
}

/** Does this user own this actor? (The trust check every operation starts from.) */
export const owns = (user, actor) => !!actor && (user.isGM || actor.testUserPermission(user, "OWNER"));

/** Register the query handler (init). */
export function registerQueries() {
  CONFIG.queries ??= {};
  CONFIG.queries[QUERY] = handleQuery;
}
