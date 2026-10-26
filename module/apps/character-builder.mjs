/**
 * The character builder (§11): pick frame, animal and human perk and place 3, 2, 2, 1, 1 —
 * or roll it all by the book (a d6 for the frame, a d6 for the animal, two d6 for the perk),
 * rerolling an animal another Bonded in the world already has.
 */
import { SYSTEM_PATH, TEMPLATES, APPS } from "../contracts.mjs";
import { FRAMES, FRAME_ORDER, ANIMALS, PERKS, PERK_ORDER, APPROACHES, APPROACH_INFO, TAG_INFO, HUMAN_SPREAD, animalsOf } from "../config.mjs";
import { rollCharacter, validateBonded } from "../logic/character.mjs";
import { rollD6 } from "../foundry-classes.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));

export class CharacterBuilder extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: ["morphgame", "mg-builder"],
    tag: "form",
    window: { title: "MG.Builder.title", icon: "fa-solid fa-wand-magic-sparkles", resizable: true },
    position: { width: 520, height: "auto" },
    form: { handler: CharacterBuilder.#onSubmit, submitOnChange: false, closeOnSubmit: true },
    actions: { roll: CharacterBuilder.#onRollAll, cancel: CharacterBuilder.#onCancel },
  };

  static PARTS = { main: { template: `${SYSTEM_PATH}/${TEMPLATES.builder}` } };

  constructor(options = {}) {
    super({ ...options, id: `${APPS.builder}-${options.actor?.id ?? "x"}` });
    this.actor = options.actor;
    const s = this.actor.system;
    this.draft = { frame: s.frameKey || "", animal: s.animal || "", perk: s.perk || "", human: { ...s.human }, dice: [] };
  }

  get title() { return L("MG.Builder.title", { name: this.actor?.name ?? "" }); }

  /** Animals other Bonded in the world already have (§11: no two the same). */
  takenAnimals() {
    return game.actors.filter(a => a.type === "bonded" && a.id !== this.actor.id && a.system.animal && !a.system.status.taken).map(a => a.system.animal);
  }

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const d = this.draft;
    const taken = this.takenAnimals();
    const problems = validateBonded({ ...d, perk2: "", growth: 0, picks: [] }, { others: taken.map(animal => ({ animal })) })
      .map(p => L(`MG.Problem.${p.code}`, { animal: p.animal && ANIMALS[p.animal] ? L(ANIMALS[p.animal].label) : "", approach: "" }));
    return Object.assign(ctx, {
      frames: FRAME_ORDER.map((k, i) => ({ key: k, label: `${i + 1}. ${L(FRAMES[k].label)}`, selected: d.frame === k,
        line: `${L("MG.Sheet.strengths")}: ${FRAMES[k].strengths.map(t => L(TAG_INFO[t].label)).join(", ")} · ${L("MG.Sheet.weaknesses")}: ${FRAMES[k].weaknesses.map(t => L(TAG_INFO[t].label)).join(", ")}` })),
      animals: (d.frame ? animalsOf(d.frame) : Object.keys(ANIMALS)).map(k => ({
        key: k, label: `${L(ANIMALS[k].label)} · ${L(ANIMALS[k].perkLabel)}`, text: L(ANIMALS[k].textLabel), selected: d.animal === k, taken: taken.includes(k),
      })),
      perks: PERK_ORDER.map((k, i) => ({ key: k, label: `${i < 6 ? "A" : "B"}${(i % 6) + 1}. ${L(PERKS[k].label)}`, text: L(PERKS[k].textLabel), selected: d.perk === k })),
      ratings: APPROACHES.map(a => ({ key: a, label: L(APPROACH_INFO[a].label), options: [3, 2, 1].map(n => ({ n, selected: d.human[a] === n })) })),
      spread: HUMAN_SPREAD.join(", "),
      dice: d.dice.map(x => `${L(`MG.Builder.die.${x.what}`)} ${x.roll}`).join(" · "),
      problems, ok: problems.length === 0,
    });
  }

  _onChangeForm(formConfig, event) {
    const FDE = foundry.applications.ux?.FormDataExtended;
    if (!FDE) return;
    this.applyValues(new FDE(this.element).object);
    this.render();
  }

  /** Set draft values from the form ({ frame, animal, perk, "human.sneak": n, … }). */
  applyValues(obj) {
    const d = this.draft;
    if (obj.frame !== undefined && obj.frame !== d.frame) { d.frame = obj.frame; if (d.animal && ANIMALS[d.animal]?.frame !== d.frame) d.animal = ""; }
    else if (obj.animal !== undefined && obj.animal) { d.animal = obj.animal; d.frame = ANIMALS[obj.animal]?.frame ?? d.frame; }
    if (obj.perk !== undefined) d.perk = obj.perk;
    for (const a of APPROACHES) if (obj[`human.${a}`] !== undefined) d.human[a] = Number(obj[`human.${a}`]);
    return d;
  }

  /** §11 by the dice (Foundry's Roll, so the dice show), duplicate animals rerolled. */
  async rollAll() {
    const roll = await rollD6(40);
    const faces = roll.dice[0].results.map(r => r.result);
    let i = 0;
    const d6 = () => faces[i++] ?? (1 + Math.floor(Math.random() * 6));
    const r = rollCharacter(d6, this.takenAnimals());
    Object.assign(this.draft, { frame: r.frame, animal: r.animal, perk: r.perk, human: r.human, dice: r.dice.filter(x => x.what !== "rating") });
    if (this.rendered) await this.render();
    return this.draft;
  }

  /** Write the draft to the actor. */
  async apply() {
    const d = this.draft;
    return this.actor.update({
      "system.frame": d.frame, "system.animal": d.animal, "system.perk": d.perk,
      ...Object.fromEntries(APPROACHES.map(a => [`system.human.${a}`, d.human[a]])),
    });
  }

  static async #onSubmit(event, form, formData) {
    if (formData?.object) this.applyValues(formData.object);
    await this.apply();
  }
  static #onRollAll() { return this.rollAll(); }
  static #onCancel() { return this.close(); }
}
