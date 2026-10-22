/**
 * Aggregates mission results into the numbers DESIGN D22 asks for, and runs the issue
 * detectors (sim/README.md §6).
 */
import { median } from "./stats.mjs";

export class Tally {
  constructor() {
    this.n = 0;
    this.win = 0; this.costly = 0; this.loss = 0;
    this.taken = 0; this.huntUp = 0; this.huntUpIn = 0; this.scent = 0;
    this.rolls = { fail: 0, partial: 0, success: 0, crit: 0 };
    this.clashes = 0; this.clashRounds = 0; this.clashRound4 = 0;
    this.downs = 0; this.nets = 0; this.exposed = 0; this.pushes = 0; this.freePushes = 0; this.helps = 0; this.patches = 0;
    this.edgesGained = 0; this.edgesUsed = 0; this.maxRoundsHit = 0; this.overdraws = 0; this.shiftsSeen = 0;
    this.chars = 0; this.shifts = 0; this.shiftedOnce = 0; this.rollsAnimal = 0; this.rollsHuman = 0;
    this.spentFrac = []; this.stuck = 0;
    this.fires = {}; this.present = {};
    this.scoutFail = 0; this.withdrew = 0;
  }

  add(r) {
    this.n++;
    this[r.result]++;
    this.taken += r.taken;
    if (r.huntUp) { this.huntUp++; if (r.huntUpAt === "in") this.huntUpIn++; }
    this.scent += r.scent;
    for (const k in this.rolls) this.rolls[k] += r.st.rolls[k];
    this.clashes += r.st.clashes;
    this.clashRounds += r.st.clashRounds.reduce((a, b) => a + b, 0);
    this.clashRound4 += r.st.clashRound4;
    this.downs += r.st.downs; this.nets += r.st.nets; this.pushes += r.st.pushes; this.freePushes += r.st.freePushes;
    this.helps += r.st.helps; this.patches += r.st.patches; this.edgesGained += r.st.edgesGained; this.edgesUsed += r.st.edgesUsed;
    this.maxRoundsHit += r.st.maxRoundsHit; this.overdraws += r.st.overdraws; this.shiftsSeen += r.st.shiftsSeen;
    if (r.st.scout === "fail" || r.st.scout === "partial") this.scoutFail++;
    this.withdrew += r.st.withdrew;
    for (const c of r.chars) {
      this.chars++;
      this.shifts += c.shifts;
      if (c.shifts > 0) this.shiftedOnce++;
      this.rollsAnimal += c.rollsAnimal; this.rollsHuman += c.rollsHuman;
      this.spentFrac.push(c.wildSpent / c.wildStart);
      if (c.exposed) this.exposed++;
      if (c.stuck) this.stuck++;
      for (const k of [c.animal, c.perk]) this.present[k] = (this.present[k] ?? 0) + 1;
    }
    for (const [k, v] of Object.entries(r.st.fires)) this.fires[k] = (this.fires[k] ?? 0) + v;
    return this;
  }

  merge(o) {
    for (const k of Object.keys(this)) {
      if (k === "rolls") for (const j in this.rolls) this.rolls[j] += o.rolls[j];
      else if (k === "spentFrac") this.spentFrac.push(...o.spentFrac);
      else if (k === "fires" || k === "present") for (const [j, v] of Object.entries(o[k])) this[k][j] = (this[k][j] ?? 0) + v;
      else this[k] += o[k];
    }
    return this;
  }

  get summary() {
    const n = this.n || 1, ch = this.chars || 1;
    const rolls = Object.values(this.rolls).reduce((a, b) => a + b, 0) || 1;
    const sf = this.spentFrac;
    return {
      n: this.n,
      win: this.win / n, costly: this.costly / n, loss: this.loss / n,
      taken: this.taken / n, huntUp: this.huntUp / n, huntUpIn: this.huntUpIn / n, scent: this.scent / n,
      crit: this.rolls.crit / rolls, fail: this.rolls.fail / rolls, partial: this.rolls.partial / rolls,
      rollsPerMission: rolls / n,
      clashes: this.clashes / n, clashRounds: this.clashes ? this.clashRounds / this.clashes : 0,
      clashRound4: this.clashes ? this.clashRound4 / this.clashes : 0,
      downs: this.downs / n, nets: this.nets / n, exposed: this.exposed / n,
      pushes: this.pushes / n, freePushes: this.freePushes / n, helps: this.helps / n, patches: this.patches / n,
      edgesGained: this.edgesGained / n, edgesUsed: this.edgesUsed / n,
      shifts: this.shifts / ch, shiftedOnce: this.shiftedOnce / ch,
      animalShare: this.rollsAnimal / ((this.rollsAnimal + this.rollsHuman) || 1),
      spentMedian: median(sf), spentHalf: sf.filter(x => x >= 0.5).length / (sf.length || 1),
      stuck: this.stuck / n, maxRoundsHit: this.maxRoundsHit / n, overdraws: this.overdraws / n, shiftsSeen: this.shiftsSeen / n,
      scoutFail: this.scoutFail / n, withdrew: this.withdrew / n,
    };
  }
}
