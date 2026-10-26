/**
 * The Mission Tracker (ApplicationV2): the Scent track with its Limit and the On the Trail
 * mark, the Hunt is Up, Edges, scouting and the way in, the obstacle sequence and the
 * current obstacle (tags, approaches and Difficulties, guards, progress or who's past,
 * rounds), the Clash (threats, harm, round, End Round with targets), the party, the prize,
 * suggestions when an automation is off, the result and the campaign Hunt track.
 * The Storyteller drives it; players get a read-only view (setting trackerForPlayers)
 * with Roll buttons for the obstacle's approaches.
 */
import { SYSTEM_ID, SETTINGS, TEMPLATES, SYSTEM_PATH, APPS, HOOKS, FLAG, CARD } from "../contracts.mjs";
import {
  APPROACH_INFO, TAG_INFO, THREATS, FIGHTABLE_THREATS, LABELS, HUNT_TRACK_MAX, EDGE_MAX, STATUS_INFO, STATUSES, PARTY_SIZES,
} from "../config.mjs";
import * as M from "../logic/mission.mjs";
import { MISSIONS, missionById, missionTitle, limitFor, blankMission, validateMission } from "../logic/missions.mjs";
import { unattended } from "../logic/clash.mjs";
import { onTheTrail } from "../logic/scent.mjs";
import { getState, isWriter } from "../mission/store.mjs";
import * as A from "../mission/automation.mjs";
import { partyRoster } from "../actors/actor-ops.mjs";
import { rollDialog } from "../dice/roll-dialog.mjs";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const setting = key => game.settings.get(SYSTEM_ID, key);
const tagList = tags => (tags ?? []).map(t => L(TAG_INFO[t]?.label ?? t)).join(", ");

export class MissionTracker extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: APPS.tracker,
    classes: ["morphgame", "mg-tracker"],
    window: { title: "MG.Tracker.title", icon: "fa-solid fa-paw", resizable: true },
    position: { width: 560, height: 760 },
    actions: {
      start: MissionTracker.#onStart, chooseWay: MissionTracker.#onChooseWay, next: MissionTracker.#onNext,
      escape: MissionTracker.#onEscape, withdraw: MissionTracker.#onWithdraw, pressOn: MissionTracker.#onPressOn,
      endRound: MissionTracker.#onEndRound, startClash: MissionTracker.#onStartClash, endClash: MissionTracker.#onEndClash,
      scent: MissionTracker.#onScent, edge: MissionTracker.#onEdge, hunt: MissionTracker.#onHunt,
      progress: MissionTracker.#onProgress, past: MissionTracker.#onPast, carrier: MissionTracker.#onCarrier,
      watched: MissionTracker.#onWatched, finish: MissionTracker.#onFinish, close: MissionTracker.#onCloseMission,
      endMission: MissionTracker.#onEndMission, suggestion: MissionTracker.#onSuggestion, finalize: MissionTracker.#onFinalize,
      rollFor: MissionTracker.#onRollFor, journal: MissionTracker.#onJournal, freeClash: MissionTracker.#onFreeClash,
    },
  };

  static PARTS = { main: { template: `${SYSTEM_PATH}/${TEMPLATES.tracker}`, scrollable: [""] } };

  get title() { return L("MG.Tracker.title"); }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    return Object.assign(ctx, trackerView(getState(), game.user));
  }

  static async #onStart(event, target) {
    const el = this.element;
    const missionKey = target.dataset.mission ?? el?.querySelector?.("[name=mission]")?.value ?? "petshop";
    const ids = target.dataset.party ? target.dataset.party.split(",")
      : (el?.querySelectorAll?.("input[data-party]") ?? []).filter(i => i.checked).map(i => i.dataset.party);
    const size = Number(target.dataset.size ?? el?.querySelector?.("[name=partySize]")?.value) || null;
    if (missionKey === "custom") {
      const mission = await promptCustomMission();
      if (!mission) return null;
      return startMissionFor({ mission, actorIds: ids, partySize: size });
    }
    return startMissionFor({ missionKey, actorIds: ids, partySize: size });
  }
  static #onChooseWay(event, target) { return A.act(M.chooseWay, Number(target.dataset.way), autoOpts()); }
  static #onNext() { return A.advance(M.nextObstacle); }
  static #onEscape() { return A.advance(M.startEscape); }
  static #onWithdraw() { return A.advance(M.withdraw); }
  static #onPressOn() { return A.act(M.pressOn); }
  static #onEndRound() { return endRoundWithTargets(); }
  static #onStartClash() { return A.startClash(); }
  static async #onFreeClash(event, target) {
    const keys = (target.dataset.threats ?? "").split(",").filter(k => FIGHTABLE_THREATS.includes(k));
    return A.startClash(keys.length ? keys : await promptThreats());
  }
  static #onEndClash() { return A.endClash(); }
  static #onScent(event, target) { return A.act(M.adjustScent, Number(target.dataset.delta)); }
  static #onEdge(event, target) { return A.act(M.setEdges, getState().edges + Number(target.dataset.delta)); }
  static #onHunt(event, target) { return A.act(M.setHuntTrack, getState().campaign.huntTrack + Number(target.dataset.delta)); }
  static #onProgress(event, target) { return A.act(M.adjustProgress, Number(target.dataset.delta)); }
  static #onPast(event, target) {
    const S = getState();
    const p = M.progressOf(S, M.currentObstacle(S)?.uid);
    return A.act(M.markPast, target.dataset.actor, !(p?.past ?? []).includes(target.dataset.actor));
  }
  static #onCarrier(event, target) {
    const id = target.dataset.actor ?? this.element?.querySelector?.("[name=carrier]")?.value ?? null;
    return A.act(M.setCarrier, id || null);
  }
  static #onWatched() { return A.act(M.setWatched, !getState().watched); }
  static #onFinish() { return A.finishMission(); }
  static #onCloseMission() { return A.act(M.closeMission); }
  static async #onEndMission() {
    const ok = await DialogV2.confirm({ window: { title: L("MG.Tracker.endMission") }, content: `<p>${L("MG.Tracker.endMissionConfirm")}</p>` });
    if (ok) return A.act(M.endMission);
    return null;
  }
  static #onSuggestion(event, target) { return A.resolveSuggestion(Number(target.dataset.index), target.dataset.accept === "1"); }
  static #onFinalize() { return A.advance(S => ({ state: S, effects: [] })); }
  static #onRollFor(event, target) {
    const actor = rollerFor(game.user);
    if (!actor) { ui.notifications.warn(L("MG.Notify.noCharacter")); return null; }
    return rollDialog(actor, { approach: target.dataset.approach ?? null, context: target.dataset.context ?? null, action: target.dataset.clashAction ?? null, threatId: target.dataset.threat ?? null });
  }
  static async #onJournal() {
    const S = getState();
    const j = S.journalUuid ? await fromUuid(S.journalUuid) : null;
    return j?.sheet?.render(true);
  }
}

/* ------------------------------------------------------------------ the Storyteller's helpers */

const autoOpts = () => ({ auto: { scent: setting(SETTINGS.autoScent) } });

/** The Bonded this user rolls for (their assigned character, or the first they own). */
export function rollerFor(user) {
  const S = getState();
  const ids = S.party?.map(p => p.id) ?? [];
  const own = game.actors.filter(a => a.type === "bonded" && a.testUserPermission(user, "OWNER"));
  if (user.character && own.includes(user.character)) return user.character;
  return own.find(a => !user.isGM && ids.includes(a.id)) ?? own.find(a => !user.isGM) ?? (user.isGM ? null : own[0]) ?? null;
}

/** The default party: player-owned Bonded who aren't Taken. */
export function defaultParty() {
  return game.actors.filter(a => a.type === "bonded" && a.hasPlayerOwner && !a.system.status.taken);
}

/**
 * Start a mission from the catalog (or a custom one). opts: { missionKey, actorIds, partySize,
 * mission (custom data), lastHunt, journalUuid }.
 */
export function startMissionFor({ missionKey = "petshop", actorIds = null, partySize = null, mission = null, lastHunt = false, journalUuid = null } = {}) {
  if (!isWriter()) { ui.notifications.warn(L("MG.Notify.gmOnly")); return null; }
  const m = mission ?? (missionKey === "custom" ? blankMission() : missionById(missionKey));
  if (!m) { ui.notifications.warn(L("MG.Notify.noMission")); return null; }
  const actors = (actorIds?.length ? actorIds.map(id => game.actors.get(id)) : defaultParty()).filter(a => a?.type === "bonded");
  if (!actors.length) { ui.notifications.warn(L("MG.Notify.noParty")); return null; }
  const party = actors.map(a => ({ id: a.id, name: a.name, perks: a.system.perkKeys, exposed: a.system.status.exposed }));
  let journal = journalUuid;
  if (!journal) journal = game.journal?.find?.(j => j.flags?.[FLAG]?.mission === m.id)?.uuid ?? null;
  return A.startMission({ id: foundry.utils.randomID(12), mission: m, party, partySize: partySize ?? party.length, lastHunt, journalUuid: journal, ...autoOpts() });
}

/**
 * End the round. In a Clash, each threat nobody rolled against deals its Harm to one
 * character of the Storyteller's choice: a prompt (setting threatTargets) with a random
 * friend still in the Clash preselected.
 */
export async function endRoundWithTargets() {
  const S = getState();
  let targets = {};
  if (S.clash) {
    const fighters = M.clashFighters(S, partyRoster(S));
    const free = unattended(S.clash);
    const pick = () => fighters[Math.floor(Math.random() * fighters.length)];
    for (const t of free) targets[t.id] = pick();
    if (free.length && fighters.length && setting(SETTINGS.threatTargets) === "prompt") {
      const chosen = await promptTargets(free, fighters, targets);
      if (chosen === null) return null;
      targets = chosen;
    }
  }
  return A.endRound(targets);
}

/** Ask the Storyteller who each unattended threat goes for (defaults preselected). */
export async function promptTargets(threats, fighters, defaults) {
  const names = Object.fromEntries(fighters.map(id => [id, game.actors.get(id)?.name ?? id]));
  const content = await foundry.applications.handlebars.renderTemplate(`${SYSTEM_PATH}/${TEMPLATES.targets}`, {
    threats: threats.map(t => ({
      id: t.id, name: t.name, harm: t.harm,
      options: fighters.map(id => ({ id, name: names[id], selected: id === defaults[t.id] })),
    })),
  });
  return DialogV2.prompt({
    window: { title: L("MG.Tracker.targetsTitle") },
    content,
    rejectClose: false,
    ok: {
      label: L("MG.Tracker.targetsOk"),
      callback: (event, button) => {
        const out = {};
        for (const t of threats) out[t.id] = button.form.elements[`target-${t.id}`]?.value || defaults[t.id];
        return out;
      },
    },
  });
}

/**
 * A custom mission (Ch 12): the Storyteller edits the mission as data, starting from the
 * last one they used (or a blank one); it is checked before it starts.
 */
export async function promptCustomMission() {
  let json = "";
  try { json = game.settings.get(SYSTEM_ID, SETTINGS.customMission) || ""; } catch { json = ""; }
  if (!json) json = JSON.stringify(blankMission(), null, 2);
  const content = `<div class="morphgame mg-custom"><p>${L("MG.Tracker.customHint")}</p><textarea name="mission" rows="22" style="width:100%;font-family:monospace">${foundry.utils.escapeHTML(json)}</textarea></div>`;
  const text = await DialogV2.prompt({
    window: { title: L("MG.Tracker.customMission") }, content, rejectClose: false, position: { width: 620 },
    ok: { label: L("MG.Tracker.start"), callback: (e, button) => button.form.elements.mission?.value ?? "" },
  });
  if (!text) return null;
  let raw;
  try { raw = JSON.parse(text); } catch (err) { ui.notifications.warn(L("MG.Notify.customJson", { error: err.message })); return null; }
  const { mission, problems } = validateMission(raw);
  if (problems.length) { ui.notifications.warn(L("MG.Notify.customProblems", { list: problems.join("; ") })); return null; }
  await game.settings.set(SYSTEM_ID, SETTINGS.customMission, text);
  return mission;
}

/** Ask which threats a free Clash has (the Storyteller starts a Clash outside a guarded obstacle). */
async function promptThreats() {
  const content = `<div class="morphgame">${FIGHTABLE_THREATS.map(k => `<label class="mg-field">${L(THREATS[k].label)} <input type="number" name="n-${k}" value="0" min="0" max="5"/></label>`).join("")}</div>`;
  const out = await DialogV2.prompt({
    window: { title: L("MG.Tracker.freeClash") }, content, rejectClose: false,
    ok: { label: L("MG.Tracker.startClash"), callback: (e, button) => FIGHTABLE_THREATS.flatMap(k => Array(Number(button.form.elements[`n-${k}`]?.value) || 0).fill(k)) },
  });
  return out ?? [];
}

/* ------------------------------------------------------------------ the view */

/** Everything the tracker shows, for one user. */
export function trackerView(S, user) {
  const isGM = !!user.isGM;
  const canSee = isGM || setting(SETTINGS.trackerForPlayers);
  const roster = partyRoster(S);
  const running = M.isRunning(S);
  const ob = M.currentObstacle(S);
  const view = M.obstacleView(S);
  const p = ob ? M.progressOf(S, ob.uid) : null;
  const half = Math.ceil(S.limit / 2);
  const nameOf = id => game.actors.get(id)?.name ?? S.party.find(x => x.id === id)?.name ?? id;
  const out = {
    isGM, canSee, running, status: S.status, statusLabel: L(`MG.Tracker.status.${S.status}`),
    idle: S.status === "idle", done: S.status === "done",
    showSetup: isGM && (S.status === "idle" || (S.status === "done" && S.finished)),
  };
  if (!canSee) return out;
  // set-up
  if (out.showSetup) {
    const party = defaultParty();
    out.setup = {
      missions: [...MISSIONS.map(m => ({ key: m.id, label: `${missionTitle(m)} (${L(LABELS[m.label].label)}, ${L("MG.Tracker.limits", { a: m.limit[3], b: m.limit[4], c: m.limit[5] })})` })),
        { key: "custom", label: L("MG.Tracker.customMission") }],
      party: game.actors.filter(a => a.type === "bonded").map(a => ({ id: a.id, name: a.name, checked: party.includes(a), taken: a.system.status.taken })),
      sizes: PARTY_SIZES.map(n => ({ n, selected: n === Math.max(3, Math.min(5, party.length || 4)) })),
    };
  }
  // header
  out.header = {
    name: S.name, label: L(LABELS[S.label]?.label ?? "MG.Label.standard"), limit: S.limit, size: S.partySize, scent: S.scent, half,
    pips: Array.from({ length: S.limit }, (_, i) => ({ n: i + 1, filled: i < S.scent, half: i + 1 === half, limit: i + 1 === S.limit })),
    trailNow: running && onTheTrail(S.scent, S.limit), huntUp: S.huntUp, watched: S.watched,
    choice: S.huntUpChoice === "pending" ? { suggest: M.suggestPressOn(S), suggestLabel: L(`MG.Tracker.suggest.${M.suggestPressOn(S)}`) } : null,
    exposedStart: S.exposedStart,
  };
  out.edges = { n: S.edges, max: EDGE_MAX, pips: Array.from({ length: EDGE_MAX }, (_, i) => ({ filled: i < S.edges })) };
  // scouting and the way in
  if (S.status === "scout" || S.status === "way") {
    out.scout = {
      rolled: !!S.scout, result: S.scout ? L(`MG.Result.${S.scout.result}`) : "",
      picks: S.wayPick ? L(`MG.Tracker.picks.${S.wayPick}`) : "", diff: S.scoutDiff,
      ways: S.ways.map((w, i) => ({ way: i, letter: i === 0 ? "A" : "B", obstacles: w.map(o => obstacleLine(o)) })),
    };
  }
  // the sequence
  out.obstacles = S.obstacles.map((o, i) => ({
    name: o.name, section: L(`MG.Tracker.section.${o.section}`), line: obstacleLine(o),
    state: i < S.current ? "done" : i === S.current ? "current" : "next",
    ended: !!S.progress[o.uid]?.ended, current: i === S.current,
  }));
  // the current obstacle
  if (view && p) {
    const pending = M.pendingAtObstacle(S, roster).map(r => r.name);
    out.current = {
      name: view.name, kind: L(`MG.Tracker.kind.${view.kind}`), isGroup: view.kind === "group", section: L(`MG.Tracker.section.${view.section}`),
      tags: tagList(view.tags) || "—",
      approaches: Object.entries(view.approaches).map(([a, d]) => ({ key: a, label: L(APPROACH_INFO[a].label), d, base: view.baseApproaches[a], raised: d !== view.baseApproaches[a] })),
      trail: view.trail, dangerous: view.dangerous, objective: !!view.objective,
      guards: (view.guards ?? []).map(k => L(THREATS[k].label)).join(", "), guardsActive: view.guardsActive, guarded: (view.guards?.length ?? 0) > 0,
      progress: view.kind === "group" ? null : { points: p.points, need: view.progress, pips: Array.from({ length: view.progress }, (_, i) => ({ filled: i < p.points })) },
      past: view.kind === "group" ? roster.map(r => ({ id: r.id, name: r.name, past: p.past.includes(r.id), out: r.down || r.netted || r.taken })) : null,
      pending: pending.join(", "), round: p.round, ended: p.ended, cleared: p.cleared,
      roundCost: view.kind === "group" && p.round >= 3 && pending.length > 0,
      escape: view.section === "escape", last: S.current === S.obstacles.length - 1,
      canEscape: view.section !== "escape" && S.objectiveDone,
      canWithdraw: view.section !== "escape" && !S.objectiveDone,
    };
  }
  // the Clash
  if (S.clash) {
    const c = S.clash;
    out.clash = {
      round: c.round, max: 4,
      threats: c.threats.map(t => ({
        id: t.id, name: t.name, d: t.diff, harm: t.harm, tough: t.tough, harmTaken: t.harmTaken, out: t.out,
        coiled: t.coiled, struck: c.struck.includes(t.id), distracted: c.distracted.includes(t.id),
        pips: Array.from({ length: t.tough }, (_, i) => ({ filled: i < t.harmTaken })),
      })),
      fighters: M.clashFighters(S, roster).map(nameOf).join(", "),
      left: c.left.map(nameOf).join(", "),
      unattended: unattended(c).map(t => t.name).join(", "),
      rise: c.round >= 4 || c.anyDown || c.anyShifted ? 2 : 1,
      flags: [c.anyDown ? L("MG.Tracker.clashDown") : "", c.anyShifted ? L("MG.Tracker.clashShifted") : ""].filter(Boolean).join(" · "),
    };
  }
  // the party
  out.party = roster.map(r => {
    const a = game.actors.get(r.id);
    return {
      id: r.id, name: r.name, img: a?.img, form: L(r.form === "animal" ? "MG.Form.animal" : "MG.Form.human"),
      wild: a?.system.wild.value ?? 0, wildMax: a?.system.wild.max ?? 0, hurt: r.hurt,
      statuses: STATUSES.filter(k => r[k]).map(k => L(STATUS_INFO[k].label)).join(", "),
      carrier: S.carrier === r.id,
    };
  });
  out.prize = S.carry ? {
    carrier: S.carrier ? nameOf(S.carrier) : "", dropped: S.prizeDropped, lost: S.prizeLost,
    options: [{ id: "", name: "—", selected: !S.carrier }, ...roster.filter(r => !r.taken).map(r => ({ id: r.id, name: r.name, selected: S.carrier === r.id }))],
  } : null;
  out.objectiveDone = S.objectiveDone;
  out.withdrawn = S.withdrawn;
  out.pending = game.messages.filter(m => { const c = m.flags?.[FLAG]?.card; return c?.kind === CARD.roll && !c.final && c.missionId === S.id; }).length;
  out.suggestions = S.suggested.map((s, index) => ({ index, text: suggestionText(s, nameOf) }));
  out.result = S.result ? { key: S.result, label: L(`MG.MissionResult.${S.result}`), hint: L(`MG.Notice.resultHint.${S.result}`), finished: S.finished,
    rise: { win: 0, costly: 1, loss: 2 }[S.result] } : null;
  out.campaign = {
    track: S.campaign.huntTrack, max: HUNT_TRACK_MAX,
    pips: Array.from({ length: HUNT_TRACK_MAX }, (_, i) => ({ n: i + 1, filled: i < S.campaign.huntTrack })),
    history: S.campaign.history.slice(-8).map(h => ({ name: h.name, result: L(`MG.MissionResult.${h.result}`) })),
    lastHunt: S.campaign.huntTrack >= HUNT_TRACK_MAX,
  };
  out.log = S.log.slice(-14).reverse().map(l => logText(l));
  out.canRoll = !!rollerFor(user) && running;
  return out;
}

function obstacleLine(o) {
  const appr = Object.entries(o.approaches ?? {}).map(([a, d]) => `${L(APPROACH_INFO[a].label)} ${d}`).join(" · ");
  const bits = [L(`MG.Tracker.kind.${o.kind}`), tagList(o.tags) || "—", appr];
  if (o.kind !== "group") bits.push(L("MG.Tracker.progressNeed", { n: o.progress }));
  if (o.guards?.length) bits.push(L("MG.Tracker.guardedBy", { list: o.guards.map(k => L(THREATS[k].label)).join(", ") }));
  if (o.dangerous) bits.push(L("MG.Tracker.dangerous"));
  return bits.join(" · ");
}

function suggestionText(s, nameOf) {
  if (s.kind === "scent") return L("MG.Tracker.suggestScent", { n: s.delta, cause: L(`MG.Cause.${s.cause}`) });
  const e = s.effect;
  return L(`MG.Tracker.suggestEffect.${e.type}`, { name: nameOf(e.actorId), n: e.amount ?? 1 });
}

/** One log entry in words. */
export function logText(l) {
  const d = { ...l.d };
  if (d.cause) d.cause = L(`MG.Cause.${d.cause}`);
  if (d.result) d.result = ["win", "costly", "loss"].includes(d.result) ? L(`MG.MissionResult.${d.result}`) : L(`MG.Result.${d.result}`);
  if (d.why) d.why = L(`MG.Cause.${d.why}`);
  if (d.picks) d.picks = L(`MG.Tracker.picks.${d.picks}`);
  return L(l.k, d);
}

/** Open (or bring up) the tracker. */
export async function openTracker() {
  if (!game.user.isGM && !setting(SETTINGS.trackerForPlayers)) { ui.notifications.warn(L("MG.Notify.trackerHidden")); return null; }
  const app = foundry.applications.instances.get(APPS.tracker) ?? new MissionTracker();
  return app.render({ force: true });
}

/** Re-render the tracker wherever it's open (mission state or actors changed). */
export function refreshTracker() {
  const app = foundry.applications.instances.get(APPS.tracker);
  if (app?.rendered) app.render();
}

/** Scene-control button (v13: controls is a record; v12: an array). */
export function onSceneControls(controls) {
  const tool = {
    name: "mgTracker", title: "MG.Tracker.title", icon: "fa-solid fa-paw", button: true,
    visible: game.user.isGM || setting(SETTINGS.trackerForPlayers),
    onChange: () => openTracker(), onClick: () => openTracker(),
  };
  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token" || c.name === "tokens");
    tokens?.tools?.push(tool);
  } else if (controls?.tokens) {
    tool.order = Object.keys(controls.tokens.tools ?? {}).length;
    controls.tokens.tools ??= {};
    controls.tokens.tools.mgTracker = tool;
  }
}

export function registerTrackerHooks() {
  Hooks.on(HOOKS.missionChanged, refreshTracker);
  Hooks.on("updateActor", actor => { if (actor.type === "bonded") refreshTracker(); });
  Hooks.on("createChatMessage", refreshTracker);
  Hooks.on("updateChatMessage", refreshTracker);
  Hooks.on("getSceneControlButtons", onSceneControls);
}

export { limitFor };
