/**
 * Threat data model (Table 4, Ch 10): Beater, Hound, Trapper, Huntsman and the Master
 * of the Hunt, with Difficulty, Toughness, Harm, a special rule and the harm taken
 * in the current Clash. Threats never roll (§1).
 */
import { THREAT_ORDER, THREATS } from "../config.mjs";

export class ThreatData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    const num = (initial, min, max) => new f.NumberField({ required: false, nullable: true, integer: true, initial, min, max });
    return {
      kind: new f.StringField({ initial: "beater", blank: false, choices: THREAT_ORDER }),
      difficulty: num(2, 1, 6),
      toughness: num(2, 1, 12),
      harm: num(1, 0, 6),
      harmTaken: new f.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0, max: 12 }),
      special: new f.StringField({ initial: "" }),
      notes: new f.HTMLField({ initial: "" }),
    };
  }

  /** The Table 4 numbers for a kind (what "use the rulebook numbers" resets to). */
  static kindDefaults(kind) {
    const T = THREATS[kind] ?? THREATS.beater;
    return { difficulty: T.diff, toughness: T.tough, harm: T.harm, special: T.special };
  }

  prepareDerivedData() {
    super.prepareDerivedData?.();
    const T = THREATS[this.kind] ?? THREATS.beater;
    this.info = T;
    this.fightable = T.fightable !== false;
    this.out = this.fightable && this.toughness != null && this.harmTaken >= this.toughness;
    this.left = this.toughness != null ? Math.max(0, this.toughness - this.harmTaken) : null;
  }
}
