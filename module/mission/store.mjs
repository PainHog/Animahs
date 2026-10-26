/**
 * The mission state store. The state is one hidden world setting; only the active GM
 * writes it, and every write goes through one promise queue so two quick events can
 * never overwrite each other. Each write is a pure reducer from module/logic/mission.mjs.
 * Every client hears about a change through the setting's onChange (HOOKS.missionChanged).
 */
import { SYSTEM_ID, SETTINGS } from "../contracts.mjs";
import { normalizeState } from "../logic/mission.mjs";

let queue = Promise.resolve();

/** The current mission state (normalized; never null). */
export function getState() {
  try { return normalizeState(game.settings.get(SYSTEM_ID, SETTINGS.missionState)); }
  catch { return normalizeState(null); }
}

/** Is this client the one that writes (the active GM)? */
export const isWriter = () => !!game.user?.isGM && (game.users.activeGM?.id ?? game.user.id) === game.user.id;

/**
 * Queue a change on the active GM. `fn(state)` may be async and returns a new state
 * (or { state, ...extra }); the new state is saved, and whatever `fn` returned is passed back.
 */
export function mutate(fn) {
  if (!isWriter()) return Promise.reject(new Error("Only the active GM writes the mission state."));
  const run = queue.then(async () => {
    const prev = getState();
    const out = await fn(prev);
    const next = out?.state ?? out;
    if (next && next !== prev && JSON.stringify(next) !== JSON.stringify(prev)) await game.settings.set(SYSTEM_ID, SETTINGS.missionState, next);
    return out;
  });
  queue = run.catch(err => { console.error(err); });
  return run;
}

/** Run work in the store's queue without writing (to keep ordering with writes). */
export function queued(fn) {
  const run = queue.then(fn);
  queue = run.catch(err => { console.error(err); });
  return run;
}

/** Wait until every queued change has been written. */
export const idle = () => queue;
