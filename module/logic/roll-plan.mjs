/**
 * The roll plan (Foundry-free): what a character rolls, and why.
 *
 *  - rating for a form, approach and place (§2; Raven's Clever Beak; Brown Rat's Gnaw),
 *  - the character's own modifiers: frame Strengths and Weaknesses (§2), animal
 *    perks (Table 2), human perks (Table 3), Wild Sense (§12), threat specials
 *    (Table 4: Tracker, Trophy), Distract (§7) and Coil (Python),
 *  - the Cap (§1): from all sources together at most +2 dice and −1 Difficulty;
 *    things that make a roll harder are not capped; Difficulty never below 1,
 *  - Help and Edges (§4, §5), which count towards the Cap.
 *
 * The simulator (sim/engine.mjs) uses rating / optionsFor / selfMods / finalPool,
 * the Foundry roll dialog uses buildRollPlan on top of the same functions, so the
 * table and the balance numbers can never disagree.
 *
 * A character here is plain data: { frame, animal, perk, perks?, human, wildSense? }
 * where `perks` (if present) lists every human perk (a second one comes from Growth)
 * and `wildSense` is the frame Strength that also works in human form (§12).
 */
import { FRAMES, PERKS, APPROACHES, CAP_DICE, CAP_DIFF, DIFF_MIN, CLASH_ACTIONS } from "../config.mjs";

/** Every human perk a character has (one, or two with Growth). */
export const perkList = c => (Array.isArray(c.perks) ? c.perks : [c.perk]).filter(Boolean);

/** §2 The rating for an approach in a form at a place. */
export function rating(c, form, approach, tags) {
  if (form === "human") return c.human?.[approach] ?? 0;
  if (approach === "wits") return c.animal === "raven" && tags.includes("locked") ? 2 : 0; // Raven: Clever Beak
  return FRAMES[c.frame]?.ratings[approach] ?? 0;
}

/**
 * One rollable option for an approach at Difficulty D, or null if the rating is 0.
 * Brown Rat, Gnaw: against Locked things, your Force rating is 3.
 */
export function optionFor(c, form, approach, D, tags) {
  if (form === "animal" && c.animal === "rat" && tags.includes("locked") && approach === "force") {
    return { approach, rollAs: "force", D, rating: 3, gnaw: true };
  }
  const r = rating(c, form, approach, tags);
  return r > 0 ? { approach, rollAs: approach, D, rating: r } : null;
}

/** Options at an obstacle for character c in a form: [{ approach, rollAs, D, rating, gnaw? }]. */
export function optionsFor(c, form, ob) {
  const out = [];
  for (const [a, D] of Object.entries(ob.approaches)) {
    const o = optionFor(c, form, a, D, ob.tags);
    if (o) out.push(o);
  }
  return out;
}

/**
 * The character's own modifiers for a roll, each with its source (before Help and Edges).
 * ctx: { tags, guardKeys, threat ({key}), action ("strike"|"distract"|"slip"|null),
 *        firstStrike, distracted, coiled }
 * Returns [{ key, source, effect: "dice"|"down"|"up"|"note", detail?, fire? }] in rules order.
 *  source: "strength" | "weakness" | "animal" | "perk" | "wildsense" | "threat" | "clash"
 *  fire:   the ability key that "fired" (the simulator counts these)
 */
export function modifierList(c, form, opt, ctx) {
  const tags = ctx.tags ?? [];
  const a = opt.rollAs;
  const out = [];
  const add = (key, source, effect, extra = {}) => out.push({ key, source, effect, ...extra });
  if (form === "animal") {
    const F = FRAMES[c.frame];
    if (F) {
      const s = F.strengths.find(t => tags.includes(t));
      if (s) add("strength", "strength", "dice", { detail: s });                   // §2 Strength
      const w = F.weaknesses.find(t => tags.includes(t));
      if (w) add("weakness", "weakness", "up", { detail: w });                     // §2 Weakness
    }
    const an = (key, effect) => add(key, "animal", effect, { fire: key });
    switch (c.animal) {
      case "jaguar": if (a === "sneak" && tags.includes("dark")) an("jaguar", "down"); break;
      case "snowleopard": if (ctx.action === "strike" && ctx.firstStrike) an("snowleopard", "down"); break;
      case "dog": if ((a === "sneak" || a === "sense") && tags.includes("crowd")) an("dog", "down"); break;
      case "falcon": if (a === "sense" && (tags.includes("open") || tags.includes("high"))) an("falcon", "down"); break;
      case "owl": if ((a === "sneak" || a === "move") && tags.includes("dark")) an("owl", "dice"); break;
      case "raven": if (opt.approach === "wits") an("raven", "note"); break;
      case "mouse": if ((a === "sneak" || a === "move") && tags.includes("narrow")) an("mouse", "down"); break;
      case "rat": if (opt.gnaw) an("rat", "note"); break;
      case "squirrel": if (a === "move" && tags.includes("high")) an("squirrel", "down"); break;
      case "gator": if ((a === "sneak" || a === "force") && tags.includes("water")) an("gator", "down"); break;
      case "komodo": if (a === "sense") an("komodo", "dice"); break;
    }
  } else if (c.wildSense && tags.includes(c.wildSense) && FRAMES[c.frame]?.strengths.includes(c.wildSense)) {
    add("wildsense", "wildsense", "dice", { detail: c.wildSense });               // §12 Wild Sense
  }
  for (const p of perkList(c)) {
    const pk = PERKS[p];
    if (!pk || !(pk.form === "any" || form === "human")) continue;
    const perk = () => add(p, "perk", "dice", { fire: p });
    switch (p) {
      case "football": if (a === "force") perk(); break;
      case "hideseek": if (a === "sneak") perk(); break;
      case "trackstar": if (a === "move") perk(); break;
      case "scout": if (a === "sense") perk(); break;
      case "brainiac": if (opt.approach === "wits") perk(); break;
      case "swim": if (tags.includes("water")) perk(); break;
      case "gymnast": if (tags.includes("high")) perk(); break;
      case "nightowl": if (tags.includes("dark")) perk(); break;
      case "drama": if (tags.includes("crowd")) perk(); break;
      case "whisperer": {
        const vsHound = ctx.threat ? ctx.threat.key === "hound" : (ctx.guardKeys ?? []).includes("hound");
        if (vsHound) perk();
        break;
      }
    }
  }
  if (a === "sneak") {                                                           // Table 4 specials
    const g = ctx.guardKeys ?? [];
    if (g.includes("hound") && !(form === "animal" && c.animal === "komodo")) add("tracker", "threat", "up"); // Tracker (Komodo ignores)
    if (g.includes("huntsman")) add("trophy", "threat", "up");                   // Trophy
  }
  if (ctx.distracted) add("distracted", "clash", "down");                        // §7 Distract
  if (ctx.coiled) add("coiled", "clash", "down");                                // Python: Coil
  return out;
}

/** The own modifiers folded to counts: { dice, down, up, fires } (the simulator's view). */
export function selfMods(c, form, opt, ctx) {
  let dice = 0, down = 0, up = 0;
  const fires = [];
  for (const m of modifierList(c, form, opt, ctx)) {
    if (m.effect === "dice") dice++;
    else if (m.effect === "down") down++;
    else if (m.effect === "up") up++;
    if (m.fire) fires.push(m.fire);
  }
  return { dice, down, up, fires };
}

/** §1 The Cap: pool and Difficulty from a base rating, own mods and extra boosts. */
export function finalPool(opt, m, extraDice = 0, extraDown = 0) {
  const n = opt.rating + Math.min(CAP_DICE, m.dice + extraDice);
  const d = Math.max(DIFF_MIN, opt.D + m.up - Math.min(CAP_DIFF, m.down + extraDown));
  return { n, d };
}

/**
 * Every approach a character could roll in a form at a place, with its rating:
 * [{ approach, rating, canRoll, gnaw, beak }]. (The dialog's approach list.)
 */
export function approachOptions(c, form, tags = []) {
  return APPROACHES.map(approach => {
    const o = optionFor(c, form, approach, 0, tags);
    return {
      approach,
      rating: o?.rating ?? 0,
      canRoll: !!o,
      gnaw: !!o?.gnaw,
      beak: form === "animal" && approach === "wits" && !!o,
    };
  });
}

/**
 * The full roll plan for the Foundry dialog and card.
 * input: {
 *   c, form, approach, tags, difficulty (the base Difficulty for this approach here),
 *   trail (bool: On the Trail, +1 Difficulty), action, threat ({key}), guardKeys,
 *   firstStrike, distracted, coiled,
 *   edges (number the roller wants to spend), helpers ([{ id, name, free }] in order)
 * }
 * Returns {
 *   canRoll, reason, opt, rating, baseDifficulty, mods, fires,
 *   boosts: [{ kind: "edge"|"help", id?, name?, free?, counted }],
 *   dice: { own, boosts, wanted, applied, capped }, down: { wanted, applied, capped }, up,
 *   pool, difficulty, edgesUsed, helpersUsed: [{ id, name, free }]
 * }
 * Order of the Cap: own dice first, then Edges, then Help in the order given;
 * boosts beyond the Cap are not counted (and so not paid for).
 */
export function buildRollPlan(input) {
  const c = input.c;
  const form = input.form ?? "human";
  const tags = input.tags ?? [];
  const base = Math.max(DIFF_MIN, Number(input.difficulty ?? 2) || 2);
  const D = base + (input.trail ? 1 : 0);
  const opt = optionFor(c, form, input.approach, D, tags);
  const plan = {
    canRoll: !!opt, reason: opt ? null : (form === "animal" && input.approach === "wits" ? "animalWits" : "zeroRating"),
    opt, rating: opt?.rating ?? 0, baseDifficulty: base, trail: !!input.trail,
    action: input.action ?? null,
    mods: [], fires: [], boosts: [],
    dice: { own: 0, boosts: 0, wanted: 0, applied: 0, capped: false },
    down: { wanted: 0, applied: 0, capped: false }, up: 0,
    pool: 0, difficulty: D, edgesUsed: 0, helpersUsed: [],
  };
  if (input.action && CLASH_ACTIONS[input.action] && !CLASH_ACTIONS[input.action].approaches.includes(input.approach)) {
    plan.canRoll = false; plan.reason = "actionApproach";
  }
  if (!opt) return plan;
  const ctx = {
    tags, guardKeys: input.guardKeys ?? [], threat: input.threat ?? null, action: input.action ?? null,
    firstStrike: !!input.firstStrike, distracted: !!input.distracted, coiled: !!input.coiled,
  };
  plan.mods = modifierList(c, form, opt, ctx);
  const m = selfMods(c, form, opt, ctx);
  plan.fires = m.fires;
  plan.up = m.up;
  plan.dice.own = m.dice;
  // Boosts, in Cap order: Edges, then Help.
  let room = Math.max(0, CAP_DICE - m.dice);
  const edges = Math.max(0, Math.floor(Number(input.edges) || 0));
  for (let i = 0; i < edges; i++) {
    const counted = room > 0;
    if (counted) { room--; plan.edgesUsed++; }
    plan.boosts.push({ kind: "edge", counted });
  }
  for (const h of input.helpers ?? []) {
    const counted = room > 0;
    if (counted) { room--; plan.helpersUsed.push({ id: h.id, name: h.name, free: !!h.free }); }
    plan.boosts.push({ kind: "help", id: h.id, name: h.name, free: !!h.free, counted });
  }
  const extra = plan.edgesUsed + plan.helpersUsed.length;
  plan.dice.boosts = edges + (input.helpers?.length ?? 0);
  plan.dice.wanted = m.dice + plan.dice.boosts;
  plan.dice.applied = Math.min(CAP_DICE, m.dice + extra);
  plan.dice.capped = plan.dice.wanted > CAP_DICE;
  plan.down.wanted = m.down;
  plan.down.applied = Math.min(CAP_DIFF, m.down);
  plan.down.capped = m.down > CAP_DIFF;
  const f = finalPool(opt, m, extra, 0);
  plan.pool = f.n;
  plan.difficulty = f.d;
  plan.floored = opt.D + m.up - plan.down.applied < DIFF_MIN;
  return plan;
}

/**
 * §5 Help: can this friend Help a roll of `approach` at a place? It has to be something
 * their current form can do: in animal form you can't help a Wits roll, except the Raven's
 * Clever Beak against Locked things (Ch 4). Down, Netted and Taken friends can't act.
 * helper: { id, form, animal, wild, status: { down, netted, taken } }.
 * Returns { ok, reason, free } — free when Coyote's Pack pays instead of Wild.
 */
export function canHelp(helper, { approach, tags = [], rollerId, packFree = false } = {}) {
  if (!helper || helper.id === rollerId) return { ok: false, reason: "self", free: false };
  const st = helper.status ?? {};
  if (st.down || st.netted || st.taken) return { ok: false, reason: "cantAct", free: false };
  if (helper.form === "animal" && approach === "wits" && !(helper.animal === "raven" && tags.includes("locked"))) {
    return { ok: false, reason: "animalWits", free: false };
  }
  if (packFree) return { ok: true, reason: null, free: true };
  if ((Number(helper.wild) || 0) < 1) return { ok: false, reason: "noWild", free: false };
  return { ok: true, reason: null, free: false };
}
