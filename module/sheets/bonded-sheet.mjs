/**
 * The Bonded sheet: both rating rows with the current form highlighted, Strengths and
 * Weaknesses, perk texts, Wild pips and Hurt boxes (click to spend or restore), status
 * toggles, Shift, Patch Up and Free buttons, one Roll button per approach, Growth picks,
 * and warnings when the character breaks §11 (ratings not 3, 2, 2, 1, 1; the same animal
 * as another Bonded; and so on).
 */
import { SYSTEM_PATH, TEMPLATES, OPS } from "../contracts.mjs";
import {
  APPROACHES, APPROACH_INFO, FRAMES, FRAME_ORDER, ANIMALS, ANIMAL_ORDER, PERKS, PERK_ORDER, TAG_INFO,
  STATUSES, STATUS_INFO, GROWTH_PICKS, HURT_BOXES, WILD_MAX,
} from "../config.mjs";
import { validateBonded, canPick, growthPicksEarned } from "../logic/character.mjs";
import { approachOptions } from "../logic/roll-plan.mjs";
import { usedThisScene } from "../logic/usage.mjs";
import { shift, shiftCost, patchUp, freeNetted, toggleStatus, hurtUpdate, currentClock, partyActors, cantAct } from "../actors/actor-ops.mjs";
import { rollDialog } from "../dice/roll-dialog.mjs";
import { runOp } from "../net/gm-ops.mjs";
import { getState } from "../mission/store.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const tagList = tags => tags.map(t => L(TAG_INFO[t].label)).join(", ");

export class BondedSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["morphgame", "mg-sheet", "mg-bonded"],
    position: { width: 680, height: 820 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      ...ownerOnly({
        roll: BondedSheet.#onRoll,
        shift: BondedSheet.#onShift,
        wildPip: BondedSheet.#onWildPip,
        hurtBox: BondedSheet.#onHurtBox,
        status: BondedSheet.#onStatus,
        patchUp: BondedSheet.#onPatchUp,
        freeNetted: BondedSheet.#onFree,
        builder: BondedSheet.#onBuilder,
        addPick: BondedSheet.#onAddPick,
        removePick: BondedSheet.#onRemovePick,
        handPrize: BondedSheet.#onHandPrize,
      }),
      tracker: BondedSheet.#onTracker,
    },
  };

  static PARTS = { sheet: { template: `${SYSTEM_PATH}/${TEMPLATES.bondedSheet}`, scrollable: [""] } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const actor = this.document;
    const s = actor.system;
    const c = s.toCharacter();
    const F = FRAMES[c.frame];
    const A = ANIMALS[s.animal];
    const clock = currentClock();
    const isAnimal = s.form === "animal";
    const owner = actor.isOwner;
    const others = game.actors.filter(a => a.type === "bonded" && a.id !== actor.id && !a.system.status.taken).map(a => a.system.toCharacter());
    const problems = validateBonded(c, { others }).map(p => L(`MG.Problem.${p.code}`, {
      ...p, approach: p.approach ? L(APPROACH_INFO[p.approach].label) : "", animal: p.animal && ANIMALS[p.animal] ? L(ANIMALS[p.animal].label) : (p.animal ?? ""),
    }));
    const tags = []; // the sheet rolls without a place; the dialog fills tags in
    const humanOpts = approachOptions(c, "human", tags);
    const animalOpts = approachOptions(c, "animal", tags);
    const ratings = APPROACHES.map((a, i) => ({
      key: a, label: L(APPROACH_INFO[a].label), hint: L(APPROACH_INFO[a].hint),
      human: s.human[a], animal: s.animalRatings[a],
      humanName: `system.human.${a}`,
      canRoll: (isAnimal ? animalOpts[i] : humanOpts[i]).canRoll || (a === "wits" && isAnimal && s.animal === "raven") || (a === "force" && isAnimal && s.animal === "rat"),
      now: isAnimal ? s.animalRatings[a] : s.human[a],
    }));
    const sc = shiftCost(actor, isAnimal ? "human" : "animal");
    const shiftLabel = isAnimal ? L("MG.Sheet.shiftBack") : L("MG.Sheet.shiftInto", { animal: A ? L(A.label) : L("MG.Sheet.animal") });
    const shiftNote = sc.ok ? L(`MG.Sheet.shiftCost.${isAnimal ? "none" : sc.cost}`) : L(`MG.Reason.${sc.reason}`);
    const friends = partyActors().filter(a => a.id !== actor.id);
    const patchTargets = [actor, ...friends].filter(a => a.system.hurt.value > 0 && !a.system.status.taken).map(a => ({ id: a.id, name: a.id === actor.id ? L("MG.Sheet.yourself") : a.name }));
    const freeTargets = friends.filter(a => a.system.status.netted).map(a => ({ id: a.id, name: a.name }));
    const picks = (s.growth.picks ?? []).map((p, idx) => ({
      idx, label: p.type === "rating" ? L("MG.Growth.ratingOn", { approach: L(APPROACH_INFO[p.approach]?.label ?? p.approach) })
        : p.type === "wildsense" ? L("MG.Growth.wildsenseOn", { tag: L(TAG_INFO[p.tag]?.label ?? p.tag) }) : L(GROWTH_PICKS[p.type].label),
    }));
    const earned = growthPicksEarned(s.growth.value);
    const pickTypes = ["wild", "perk", "rating", "wildsense"].map(type => {
      const probe = type === "rating" ? { type, approach: APPROACHES.find(a => canPick(c, { type, approach: a }).ok) ?? "sneak" }
        : type === "wildsense" ? { type, tag: F?.strengths.find(t => canPick(c, { type, tag: t }).ok) ?? "" } : { type };
      return { type, label: L(GROWTH_PICKS[type].label), hint: L(GROWTH_PICKS[type].hint), ok: canPick(c, probe).ok };
    });
    const perkLine = key => key && PERKS[key] ? { label: L(PERKS[key].label), text: L(PERKS[key].textLabel), human: PERKS[key].form === "human" } : null;
    return Object.assign(ctx, {
      actor, system: s, owner, isGM: game.user.isGM, editable: this.isEditable,
      name: actor.name, img: actor.img,
      isAnimal, formLabel: L(isAnimal ? "MG.Form.animal" : "MG.Form.human"),
      frameOptions: [{ key: "", label: L("MG.Sheet.chooseFrame"), selected: !c.frame }, ...FRAME_ORDER.map(k => ({ key: k, label: L(FRAMES[k].label), selected: c.frame === k }))],
      animalOptions: [{ key: "", label: L("MG.Sheet.chooseAnimal"), selected: !s.animal },
        ...ANIMAL_ORDER.filter(k => !c.frame || ANIMALS[k].frame === c.frame).map(k => ({
          key: k, label: `${L(ANIMALS[k].label)} (${L(FRAMES[ANIMALS[k].frame].label)})`, selected: s.animal === k,
          taken: others.some(o => o.animal === k),
        }))],
      perkOptions: [{ key: "", label: L("MG.Sheet.choosePerk"), selected: !s.perk }, ...PERK_ORDER.map(k => ({ key: k, label: L(PERKS[k].label), selected: s.perk === k }))],
      perk2Options: [{ key: "", label: L("MG.Sheet.choosePerk"), selected: !s.perk2 }, ...PERK_ORDER.filter(k => k !== s.perk).map(k => ({ key: k, label: L(PERKS[k].label), selected: s.perk2 === k }))],
      hasPerk2: (s.growth.picks ?? []).some(p => p.type === "perk") || !!s.perk2,
      frame: F ? { label: L(F.label), strengths: tagList(F.strengths), weaknesses: tagList(F.weaknesses) } : null,
      animal: A ? {
        label: L(A.label), perk: L(A.perkLabel), text: L(A.textLabel), scene: A.scene,
        used: A.scene && usedThisScene(s.usage, s.animal, clock),
      } : null,
      perks: [perkLine(s.perk), perkLine(s.perk2)].filter(Boolean),
      wildSense: s.wildSense ? L("MG.Sheet.wildSenseLine", { tag: L(TAG_INFO[s.wildSense].label) }) : "",
      ratings,
      wild: { value: s.wild.value, max: s.wild.max },
      wildPips: Array.from({ length: Math.max(s.wild.max, s.wild.value) }, (_, i) => ({ n: i + 1, filled: i < s.wild.value })),
      hurtBoxes: Array.from({ length: HURT_BOXES }, (_, i) => ({ n: i + 1, filled: i < s.hurt.value })),
      statuses: STATUSES.map(k => ({ key: k, label: L(STATUS_INFO[k].label), hint: L(STATUS_INFO[k].hint), active: !!s.status[k] })),
      shift: { label: shiftLabel, note: shiftNote, disabled: !sc.ok || !owner },
      canAct: !cantAct(actor),
      patchTargets, hasPatchTargets: patchTargets.length > 0,
      freeTargets, hasFreeTargets: freeTargets.length > 0,
      carrying: getState().carrier === actor.id,
      handTargets: friends.filter(a => !a.system.status.taken).map(a => ({ id: a.id, name: a.name })),
      growth: { value: s.growth.value, earned, left: Math.max(0, earned - picks.length), picks, pickTypes },
      pickApproaches: APPROACHES.map(a => ({ key: a, label: L(APPROACH_INFO[a].label) })),
      pickTags: (F?.strengths ?? []).map(t => ({ key: t, label: L(TAG_INFO[t].label) })),
      problems, hasProblems: problems.length > 0,
      wildMaxCap: WILD_MAX,
    });
  }

  /** The animal implies the frame; a frame that doesn't fit the animal clears it. */
  _processFormData(event, form, formData) {
    const data = super._processFormData ? super._processFormData(event, form, formData) : foundry.utils.expandObject(formData.object);
    return fixFrameAnimal(this.document, data);
  }

  static async #onRoll(event, target) { return rollDialog(this.document, { approach: target.dataset.approach }); }
  static async #onShift() { return shift(this.document); }
  static async #onWildPip(event, target) {
    const n = Number(target.dataset.n);
    const v = this.document.system.wild.value;
    return this.document.update({ "system.wild.value": Math.max(0, Math.min(WILD_MAX, n <= v ? n - 1 : n)) });
  }
  static async #onHurtBox(event, target) {
    const n = Number(target.dataset.n);
    const v = this.document.system.hurt.value;
    return this.document.update(hurtUpdate(this.document, n <= v ? n - 1 : n));
  }
  static async #onStatus(event, target) { return toggleStatus(this.document, target.dataset.key); }
  static async #onPatchUp(event, target) {
    const t = game.actors.get(target.dataset.target) ?? this.document;
    return patchUp(this.document, t);
  }
  static async #onFree(event, target) { return freeNetted(this.document, game.actors.get(target.dataset.target)); }
  static async #onBuilder() {
    const { CharacterBuilder } = await import("../apps/character-builder.mjs");
    return new CharacterBuilder({ actor: this.document }).render({ force: true });
  }
  static async #onAddPick(event, target) {
    const actor = this.document;
    const type = target.dataset.type;
    const pick = { type, approach: "", tag: "" };
    if (type === "rating") pick.approach = target.dataset.approach ?? this.element?.querySelector?.("[data-pick=approach]")?.value ?? "";
    if (type === "wildsense") pick.tag = target.dataset.tag ?? this.element?.querySelector?.("[data-pick=tag]")?.value ?? "";
    const v = canPick(actor.system.toCharacter(), { type, approach: pick.approach || undefined, tag: pick.tag || undefined });
    if (!v.ok) { ui.notifications.warn(L(`MG.Reason.${v.reason}`)); return null; }
    const up = { "system.growth.picks": [...actor.system.growth.picks, pick] };
    if (type === "rating") up[`system.human.${pick.approach}`] = actor.system.human[pick.approach] + 1;
    return actor.update(up);
  }
  static async #onRemovePick(event, target) {
    const actor = this.document;
    const idx = Number(target.dataset.index);
    const picks = [...actor.system.growth.picks];
    const [p] = picks.splice(idx, 1);
    if (!p) return null;
    const up = { "system.growth.picks": picks };
    if (p.type === "rating" && p.approach) up[`system.human.${p.approach}`] = Math.max(0, actor.system.human[p.approach] - 1);
    if (p.type === "perk") up["system.perk2"] = "";
    return actor.update(up);
  }
  static async #onTracker() { return game.morphgame?.openTracker?.(); }
  /** §10: handing the prize to a friend at the same obstacle takes your action, no roll. */
  static async #onHandPrize(event, target) { return runOp(OPS.handPrize, { actorId: this.document.id, toId: target.dataset.target }); }
}

/** Sheet actions only for the actor's owners (an observer's click would be refused anyway). */
export function ownerOnly(actions) {
  return Object.fromEntries(Object.entries(actions).map(([name, fn]) => [name, function (event, target) {
    if (!this.document?.isOwner) { ui.notifications.warn(game.i18n.localize("MG.Reason.notOwner")); return null; }
    return fn.call(this, event, target);
  }]));
}

/** Keep frame and animal consistent in submitted sheet data. */
export function fixFrameAnimal(actor, data) {
  const sys = data.system ?? {};
  const animalChanged = "animal" in sys && sys.animal !== actor.system.animal;
  const frameChanged = "frame" in sys && sys.frame !== actor.system.frameKey;
  if (animalChanged && sys.animal && ANIMALS[sys.animal]) sys.frame = ANIMALS[sys.animal].frame;
  else if (frameChanged) {
    const animal = "animal" in sys ? sys.animal : actor.system.animal;
    if (animal && ANIMALS[animal]?.frame !== sys.frame) sys.animal = "";
  }
  if ("perk2" in sys && sys.perk2 && sys.perk2 === (sys.perk ?? actor.system.perk)) sys.perk2 = "";
  data.system = sys;
  return data;
}
