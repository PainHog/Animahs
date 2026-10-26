/**
 * The roll dialog: what the roll is for (the current obstacle, the Clash, scouting or a
 * free roll), the approach (with Gnaw and Clever Beak where they apply), the Difficulty and
 * place tags (defaulting from the obstacle), every automatic modifier with its source, Help
 * from friends who can, Edges, and the Cap applied — then the final dice and Difficulty and
 * the odds. Changing anything recomputes the plan with the shared rules (roll-plan.mjs).
 */
import { SYSTEM_PATH, TEMPLATES, APPS } from "../contracts.mjs";
import { APPROACHES, APPROACH_INFO, TAGS, TAG_INFO, CLASH_ACTIONS, CLASH_ACTION_ORDER, DIFF_MIN, DIFF_MAX, EDGE_MAX } from "../config.mjs";
import { approachOptions } from "../logic/roll-plan.mjs";
import { odds } from "../logic/dice.mjs";
import { threatsLeft } from "../logic/clash.mjs";
import { currentObstacle, progressOf } from "../logic/mission.mjs";
import { cantAct } from "../actors/actor-ops.mjs";
import { getState } from "../mission/store.mjs";
import { availableContexts, defaultChoices, reconcileChoices, helperOptions, planFor, contextInfo } from "./roll-context.mjs";
import { performRoll, modLabel } from "./rolls.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const pct = x => `${Math.round(100 * x)}%`;

export class RollDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: ["morphgame", "mg-roll-dialog"],
    tag: "form",
    window: { title: "MG.RollDialog.title", icon: "fa-solid fa-dice-six", resizable: true },
    position: { width: 480, height: "auto" },
    form: { handler: RollDialog.#onSubmit, submitOnChange: false, closeOnSubmit: true },
    actions: { cancel: RollDialog.#onCancel },
  };

  static PARTS = { main: { template: `${SYSTEM_PATH}/${TEMPLATES.rollDialog}` } };

  /**
   * @param {object} options  { actor, choices? , approach?, context?, action?, threatId? }
   */
  constructor(options = {}) {
    super({ ...options, id: `${APPS.rollDialog}-${options.actor?.id ?? "x"}` });
    this.actor = options.actor;
    this.choices = options.choices ?? defaultChoices(this.actor, options);
    this.result = null;
    this._done = new Promise(resolve => { this._resolve = resolve; });
  }

  get title() { return L("MG.RollDialog.title", { name: this.actor?.name ?? "" }); }

  /** Open the dialog; resolves with the roll's chat message, or null if cancelled. */
  static async open(actor, opts = {}) {
    const existing = foundry.applications.instances.get(`${APPS.rollDialog}-${actor.id}`);
    if (existing) await existing.close();
    const app = new RollDialog({ actor, ...opts });
    await app.render({ force: true });
    return app._done;
  }

  /** Change some choices (what the form's change events do) and re-render. */
  async updateChoices(values = {}, changed = null) {
    const state = getState();
    const next = { ...this.choices, ...values };
    if ("difficulty" in values) next.difficulty = Math.max(DIFF_MIN, Math.min(DIFF_MAX, Number(values.difficulty) || this.choices.difficulty));
    if ("edges" in values) next.edges = Number(values.edges) || 0;
    const key = changed ?? Object.keys(values).find(k => values[k] !== this.choices[k]) ?? null;
    this.choices = reconcileChoices(this.actor, next, key, state);
    if (this.rendered) await this.render();
    return this.choices;
  }

  /** The form's values as choices. */
  _readForm() {
    const FDE = foundry.applications.ux?.FormDataExtended ?? globalThis.FormDataExtended;
    const obj = FDE ? new FDE(this.element).object : {};
    const out = {};
    for (const k of ["context", "approach", "action", "threatId"]) if (k in obj && obj[k] !== undefined) out[k] = obj[k];
    if ("difficulty" in obj) out.difficulty = obj.difficulty;
    if ("edges" in obj) out.edges = obj.edges;
    if (TAGS.some(t => `tag.${t}` in obj)) out.tags = TAGS.filter(t => obj[`tag.${t}`]);
    const helpKeys = Object.keys(obj).filter(k => k.startsWith("help."));
    if (helpKeys.length) out.helpers = helpKeys.filter(k => obj[k]).map(k => k.slice(5));
    return out;
  }

  /** ApplicationV2: a form control changed. */
  _onChangeForm(formConfig, event) {
    const name = event?.target?.name ?? "";
    const changed = name.startsWith("tag.") ? "tags" : name.startsWith("help.") ? "helpers" : (name || null);
    this.updateChoices(this._readForm(), changed);
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const state = getState();
    const actor = this.actor;
    const ch = this.choices;
    const s = actor.system;
    const plan = planFor(actor, ch, state);
    const info = contextInfo(state, ch);
    const listed = ch.context === "obstacle" ? info?.base ?? {} : null;
    const opts = approachOptions(s.toCharacter(), s.form, ch.tags ?? []);
    const allowed = ch.context === "clash" ? CLASH_ACTIONS[ch.action]?.approaches ?? APPROACHES : APPROACHES;
    const approaches = opts.filter(o => allowed.includes(o.approach)).map(o => {
      let label = `${L(APPROACH_INFO[o.approach].label)} (${o.rating})`;
      if (o.gnaw) label += ` — ${L("MG.Roll.gnaw")}`;
      if (o.beak) label += ` — ${L("MG.Roll.beak")}`;
      if (listed && listed[o.approach] != null) label += ` · ${L("MG.RollDialog.listed", { d: listed[o.approach] + (info.trail ? 1 : 0) })}`;
      return { key: o.approach, label, selected: o.approach === ch.approach, disabled: !o.canRoll };
    });
    const contexts = availableContexts(state, actor).map(c => ({
      key: c.key, selected: c.key === ch.context,
      label: c.key === "obstacle" ? L("MG.RollDialog.ctxObstacle", { name: c.name }) : L(`MG.RollDialog.ctx.${c.key}`),
    }));
    const mods = plan.mods.map(m => modLabel(m));
    if (plan.trail) mods.push({ text: L("MG.Mod.trail"), cls: "bad" });
    const helpers = helperOptions(actor, ch, state).map(h => ({
      ...h, label: h.free ? L("MG.RollDialog.helpFree", { name: h.name }) : h.name,
      reasonLabel: h.ok ? "" : L(`MG.Reason.${h.reason}`),
      counted: plan.helpersUsed.some(u => u.id === h.id),
    }));
    const edgesMax = Math.min(EDGE_MAX, state.edges ?? 0);
    const o = plan.canRoll ? odds(plan.pool, plan.difficulty) : null;
    const warnings = [];
    const blocked = cantAct(actor);
    if (blocked) warnings.push(L(`MG.Reason.${blocked}`));
    if (ch.context === "obstacle" && listed && listed[ch.approach] == null) warnings.push(L("MG.RollDialog.notListed"));
    if (ch.context === "obstacle" && info?.kind === "group" && progressOf(state, currentObstacle(state)?.uid)?.past?.includes(actor.id)) warnings.push(L("MG.RollDialog.alreadyPast"));
    if (!plan.canRoll) warnings.push(L(`MG.Reason.${plan.reason}`));
    if (plan.boosts.some(b => !b.counted)) warnings.push(L("MG.RollDialog.overCap"));
    const threats = ch.context === "clash" ? threatsLeft(state.clash).map(t => ({
      id: t.id, selected: t.id === ch.threatId,
      label: L("MG.RollDialog.threatLine", { name: t.name, d: t.diff, left: t.tough - t.harmTaken, harm: t.harm }),
    })) : [];
    return Object.assign(ctx, {
      actorName: actor.name, img: actor.img,
      formLabel: L(s.form === "animal" ? "MG.Form.animal" : "MG.Form.human"),
      contexts, approaches,
      difficulty: ch.difficulty, diffMin: DIFF_MIN, diffMax: DIFF_MAX,
      tags: TAGS.map(t => ({ key: t, label: L(TAG_INFO[t].label), checked: (ch.tags ?? []).includes(t) })),
      isClash: ch.context === "clash",
      actions: CLASH_ACTION_ORDER.map(a => ({ key: a, label: L(CLASH_ACTIONS[a].label), selected: a === ch.action })),
      threats,
      info, trail: !!plan.trail,
      guards: (info?.guards ?? []).join(", "),
      mods, hasMods: mods.length > 0,
      helpers, hasHelpers: helpers.length > 0,
      edgesMax, edgeOptions: Array.from({ length: edgesMax + 1 }, (_, n) => ({ n, selected: n === Number(ch.edges) })),
      plan, canRoll: plan.canRoll && !blocked,
      capDice: plan.dice.capped, capDiff: plan.down.capped,
      summary: plan.canRoll ? L("MG.RollDialog.summary", { pool: plan.pool, d: plan.difficulty }) : "",
      chances: o ? L("MG.RollDialog.odds", { partial: pct(1 - o.fail), success: pct(o.success + o.crit), crit: pct(o.crit) }) : "",
      warnings,
    });
  }

  static async #onSubmit(event, form, formData) {
    await this.updateChoices(formData?.object ? this._mapFormData(formData.object) : {});
    this.result = await performRoll(this.actor, this.choices);
    this._resolve(this.result);
  }

  /** FormDataExtended's flat object → choices. */
  _mapFormData(obj) {
    const out = {};
    for (const k of ["context", "approach", "action", "threatId", "difficulty", "edges"]) if (obj[k] !== undefined) out[k] = obj[k];
    if (TAGS.some(t => `tag.${t}` in obj)) out.tags = TAGS.filter(t => obj[`tag.${t}`]);
    if (Array.isArray(obj.tags)) out.tags = obj.tags;
    const helpKeys = Object.keys(obj).filter(k => k.startsWith("help."));
    if (helpKeys.length) out.helpers = helpKeys.filter(k => obj[k]).map(k => k.slice(5));
    if (Array.isArray(obj.helpers)) out.helpers = obj.helpers;
    return out;
  }

  static #onCancel() { this.close(); }

  async _onClose(options) {
    await super._onClose?.(options);
    this._resolve(this.result);
  }
}

/** Open the roll dialog for an actor (the sheet's Roll buttons, the tracker, macros). */
export const rollDialog = (actor, opts) => RollDialog.open(actor, opts);
