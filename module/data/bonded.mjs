/**
 * The Bonded (player character) data model. §11 Making a character, §4 Wild,
 * §9 Hurt and statuses, §12 Growth; usage stamps for once-per-scene animal perks.
 * Rules come from module/logic/ (Foundry-free); this file only declares the data
 * and derives what the sheet and the dice need.
 */
import {
  FRAME_ORDER, ANIMAL_ORDER, PERK_ORDER, APPROACHES, FRAMES, ANIMALS, PERKS, HURT_BOXES, WILD_MAX,
  HUMAN_RATING_MAX, GROWTH_MAX, GROWTH_PICK_ORDER, STATUSES, TAGS,
} from "../config.mjs";
import { frameOf, perksOf, wildMax, validateBonded } from "../logic/character.mjs";

const fields = () => foundry.data.fields;

export class BondedData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = fields();
    const int = (initial, min, max, extra = {}) => new f.NumberField({ required: true, nullable: false, integer: true, initial, min, max, ...extra });
    const rating = initial => int(initial, 0, HUMAN_RATING_MAX);
    return {
      age: new f.NumberField({ required: false, nullable: true, integer: true, initial: 12, min: 0, max: 99 }),
      mark: new f.StringField({ initial: "" }),
      loves: new f.StringField({ initial: "" }),
      notes: new f.HTMLField({ initial: "" }),
      frame: new f.StringField({ initial: "", blank: true, choices: ["", ...FRAME_ORDER] }),
      animal: new f.StringField({ initial: "", blank: true, choices: ["", ...ANIMAL_ORDER] }),
      perk: new f.StringField({ initial: "", blank: true, choices: ["", ...PERK_ORDER] }),
      perk2: new f.StringField({ initial: "", blank: true, choices: ["", ...PERK_ORDER] }),
      human: new f.SchemaField({
        sneak: rating(3), force: rating(2), move: rating(2), sense: rating(1), wits: rating(1),
      }),
      form: new f.StringField({ initial: "human", blank: false, choices: ["human", "animal"] }),
      wild: new f.SchemaField({ value: int(4, 0, WILD_MAX), max: int(4, 0, WILD_MAX) }),
      hurt: new f.SchemaField({ value: int(0, 0, HURT_BOXES), max: int(HURT_BOXES, 0, HURT_BOXES) }),
      status: new f.SchemaField(Object.fromEntries(STATUSES.map(s => [s, new f.BooleanField({ initial: false })]))),
      growth: new f.SchemaField({
        value: int(0, 0, GROWTH_MAX),
        picks: new f.ArrayField(new f.SchemaField({
          type: new f.StringField({ initial: "wild", blank: false, choices: GROWTH_PICK_ORDER }),
          approach: new f.StringField({ initial: "", blank: true, choices: ["", ...APPROACHES] }),
          tag: new f.StringField({ initial: "", blank: true, choices: ["", ...TAGS] }),
        })),
      }),
      usage: new f.ObjectField({ initial: {} }),
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData?.();
    const c = this.toCharacter();
    this.frameKey = c.frame;
    this.frameInfo = FRAMES[c.frame] ?? null;
    this.animalInfo = ANIMALS[this.animal] ?? null;
    this.perkKeys = c.perks;
    this.wildSense = c.wildSense;
    this.wild.max = wildMax(c);
    this.hurt.max = HURT_BOXES;
    this.animalRatings = Object.fromEntries(APPROACHES.map(a => [a, a === "wits" ? 0 : (FRAMES[c.frame]?.ratings[a] ?? 0)]));
    this.problems = validateBonded(c);
  }

  /** Plain character data for the rules logic (module/logic/). */
  toCharacter() {
    const picks = (this.growth?.picks ?? []).map(p => ({ type: p.type, approach: p.approach || undefined, tag: p.tag || undefined }));
    const c = {
      frame: "", animal: this.animal, perk: this.perk, perk2: this.perk2,
      human: { ...this.human }, age: this.age, growth: this.growth?.value ?? 0, picks,
    };
    c.frame = frameOf({ animal: this.animal, frame: this.frame });
    if (this.frame && this.animal && ANIMALS[this.animal] && this.frame !== ANIMALS[this.animal].frame) c.frameStored = this.frame;
    c.perks = perksOf(c);
    c.wildSense = picks.find(p => p.type === "wildsense")?.tag ?? null;
    c.form = this.form;
    c.wild = this.wild?.value ?? 0;
    c.hurt = this.hurt?.value ?? 0;
    c.status = { ...(this.status ?? {}) };
    c.usage = { ...(this.usage ?? {}) };
    return c;
  }

  /** Can this character act (not Down, Netted or Taken)? */
  get canAct() { return !this.status.down && !this.status.netted && !this.status.taken; }

  /** Has a human perk (either slot)? */
  hasPerk(key) { return [this.perk, this.perk2].includes(key) && !!PERKS[key]; }
}
