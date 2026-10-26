/**
 * The threat sheet (Table 4, Ch 10): kind, Difficulty, Toughness, Harm, special, harm taken.
 * Changing the kind fills in that kind's rulebook numbers.
 */
import { SYSTEM_PATH, TEMPLATES } from "../contracts.mjs";
import { THREATS, THREAT_ORDER } from "../config.mjs";
import { ThreatData } from "../data/threat.mjs";
import { ownerOnly } from "./bonded-sheet.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));

export class ThreatSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["morphgame", "mg-sheet", "mg-threat"],
    position: { width: 460, height: 520 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: ownerOnly({ harmBox: ThreatSheet.#onHarmBox, resetKind: ThreatSheet.#onResetKind }),
  };

  static PARTS = { sheet: { template: `${SYSTEM_PATH}/${TEMPLATES.threatSheet}` } };

  async _prepareContext(options) {
    const ctx = await super._prepareContext(options);
    const s = this.document.system;
    const T = THREATS[s.kind] ?? THREATS.beater;
    return Object.assign(ctx, {
      name: this.document.name, img: this.document.img, system: s, owner: this.document.isOwner,
      kindOptions: THREAT_ORDER.map(k => ({ key: k, label: L(THREATS[k].label), selected: k === s.kind })),
      fightable: s.fightable,
      specialName: T.specialName ? L(`MG.Threat.${s.kind}.specialName`) : "",
      specialRule: L(T.specialLabel),
      harmBoxes: s.toughness ? Array.from({ length: s.toughness }, (_, i) => ({ n: i + 1, filled: i < s.harmTaken })) : [],
      out: s.out,
      rulebook: L("MG.ThreatSheet.rulebook", { d: T.diff ?? "—", t: T.tough ?? "—", h: T.harm ?? "—" }),
    });
  }

  /** A new kind brings its Table 4 numbers. */
  _processFormData(event, form, formData) {
    const data = super._processFormData ? super._processFormData(event, form, formData) : foundry.utils.expandObject(formData.object);
    return applyKindDefaults(this.document, data);
  }

  static async #onHarmBox(event, target) {
    const n = Number(target.dataset.n);
    const v = this.document.system.harmTaken;
    return this.document.update({ "system.harmTaken": n <= v ? n - 1 : n });
  }
  static async #onResetKind() {
    const d = ThreatData.kindDefaults(this.document.system.kind);
    return this.document.update({ "system.difficulty": d.difficulty, "system.toughness": d.toughness, "system.harm": d.harm, "system.special": d.special, "system.harmTaken": 0 });
  }
}

/** When submitted data changes the kind, use that kind's numbers. */
export function applyKindDefaults(actor, data) {
  const sys = data.system ?? {};
  if (sys.kind && sys.kind !== actor.system.kind) Object.assign(sys, ThreatData.kindDefaults(sys.kind), { harmTaken: 0 });
  data.system = sys;
  return data;
}
