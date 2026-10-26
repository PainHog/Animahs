/**
 * The system's Actor document class. New Bonded get a linked token showing Wild and Hurt;
 * new threats get unlinked tokens (a Clash may need several Hounds from one actor).
 * Choosing an animal also sets its frame (the animal implies the frame).
 */
import { ANIMALS } from "../config.mjs";
import { SYSTEM_PATH } from "../contracts.mjs";
import { BaseActor } from "../foundry-classes.mjs";

export class MGActor extends BaseActor {
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate?.(data, options, user);
    if (allowed === false) return false;
    const bonded = this.type === "bonded";
    const proto = bonded
      ? { actorLink: true, disposition: 1, bar1: { attribute: "wild" }, bar2: { attribute: "hurt" } }
      : { actorLink: false, disposition: -1, bar1: { attribute: null }, bar2: { attribute: null } };
    const img = data.img && data.img !== "icons/svg/mystery-man.svg" ? data.img : `${SYSTEM_PATH}/assets/icons/${bonded ? "bonded" : (data.system?.kind ?? "beater")}.svg`;
    this.updateSource?.({ img, prototypeToken: foundry.utils.mergeObject(proto, data.prototypeToken ?? {}, { inplace: false }) });
    return allowed;
  }

  async _preUpdate(changes, options, user) {
    const allowed = await super._preUpdate?.(changes, options, user);
    if (allowed === false) return false;
    const animal = foundry.utils.getProperty(changes, "system.animal");
    if (this.type === "bonded" && animal && ANIMALS[animal]) foundry.utils.setProperty(changes, "system.frame", ANIMALS[animal].frame);
    return allowed;
  }
}
