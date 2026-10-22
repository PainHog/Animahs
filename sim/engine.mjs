/**
 * Plays one mission strictly by docs/CORE-RULES.md (v0.1 draft). Every rule cites its §.
 *
 * Abstractions (stated up front, sim/README.md §1):
 *  - no map: movement between obstacles is free (§6) and everyone is "at" the obstacle;
 *  - shifts between obstacles happen out of the Hunt's sight unless `shiftSeenOutside` says otherwise;
 *  - players never Withdraw or Slip Away (both are always Losses or no better than fighting);
 *  - the prize is never handed over once picked up (the rules don't say it can be).
 * Player decisions are simple documented policies (`value`, `chooseRoll`, `planBoosts`, `clashAction`).
 */
import { classify, rollPool, pushRoll, odds, pushOdds } from "./dice.mjs";
import * as R from "./rules-data.mjs";

const FR = R.FRAMES;

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */

function newState(mission, party, rng, params, opts = {}) {
  const lab = R.LABELS[mission.label];
  // §8 / Table 5: each mission states its Limit for 3, 4 and 5 players.
  const ml = typeof mission.limit === "object" ? mission.limit?.[party.length] : mission.limit;
  if (ml == null) throw new Error(`${mission.id} has no Scent Limit for ${party.length} players`);
  const limit = ml + (params.limitShift ?? 0) + (params.sizeLimit?.[party.length] ?? 0);
  const baseWild = params.wildBySize?.[party.length] ?? params.startWild;
  const chars = party.map(c => ({
    ...c, wild: baseWild + (c.perk === "gamer" ? 1 : 0), wildStart: baseWild + (c.perk === "gamer" ? 1 : 0), hurt: 0, form: "human",
    status: "active", stuck: false, exposed: false, used: new Set(),
    shifts: 0, wildSpent: 0, rollsAnimal: 0, rollsHuman: 0, taken: false,
  }));
  return {
    m: mission, p: params, rng, limit, scoutDiff: lab.scoutDiff,
    scent: 0, huntUp: false, huntUpAt: null, edges: Math.min(R.EDGE_MAX, party.filter(c => c.perk === "captain").length), phase: "in", over: false,
    chars, objectiveDone: false, prizeLost: false, carrier: null,
    trace: opts.trace ? [] : null,
    st: {
      rolls: { fail: 0, partial: 0, success: 0, crit: 0 }, pushes: 0, freePushes: 0, helps: 0, edgesGained: 0, edgesUsed: 0,
      patches: 0, clashes: 0, clashRounds: [], clashRound4: 0, downs: 0, nets: 0, shiftsSeen: 0,
      fires: {}, wayIn: null, scout: null, maxRoundsHit: 0, overdraws: 0, withdrew: 0,
    },
  };
}

const log = (S, msg) => { if (S.trace) S.trace.push(msg); };
const active = S => S.chars.filter(c => c.status === "active");
const fire = (S, key) => { S.st.fires[key] = (S.st.fires[key] ?? 0) + 1; };

/* ------------------------------------------------------------------ */
/*  Ratings and modifiers (§1, §2, Tables 1–4)                        */
/* ------------------------------------------------------------------ */

function rating(c, form, approach, tags) {
  if (form === "human") return c.human[approach];
  if (approach === "wits") return c.animal === "raven" && tags.includes("locked") ? 2 : 0; // Raven: Clever Beak
  return FR[c.frame].ratings[approach];
}

/** Options at an obstacle for character c in a form: [{ approach, rollAs, D, rating, gnaw }]. */
function optionsFor(c, form, ob) {
  const out = [];
  for (const [a, D] of Object.entries(ob.approaches)) {
    const r = rating(c, form, a, ob.tags);
    if (r > 0) out.push({ approach: a, rollAs: a, D, rating: r });
    // Brown Rat, Gnaw: against Locked things, your Force rating is 3.
    if (form === "animal" && c.animal === "rat" && ob.tags.includes("locked") && a === "force") {
      out[out.length - 1] = { approach: a, rollAs: "force", D, rating: 3, gnaw: true };
    }
  }
  return out;
}

/**
 * The character's own modifiers for a roll (before Help and Edges).
 * ctx: { tags, guardKeys, threat, action ("strike"|"distract"|null), escape, firstStrike, distracted, coiled }
 * Returns { dice, down, up, fires }.
 */
function selfMods(c, form, opt, ctx) {
  const tags = ctx.tags;
  const a = opt.rollAs;
  let dice = 0, down = 0, up = 0;
  const fires = [];
  if (form === "animal") {
    const F = FR[c.frame];
    if (F.strengths.some(t => tags.includes(t))) dice++;                        // §2 Strength
    let weak = F.weaknesses.filter(t => tags.includes(t));
    if (c.animal === "tiger") weak = weak.filter(t => t !== "water");           // Tiger: Water isn't a Weakness
    if (weak.length) up++;                                                       // §2 Weakness
    switch (c.animal) {
      case "jaguar": if (a === "sneak" && tags.includes("dark")) { down++; fires.push("jaguar"); } break;
      case "tiger": if (ctx.action === "strike" && ctx.firstStrike) { down++; fires.push("tiger"); } break;
      case "dog": if ((a === "sneak" || a === "sense") && tags.includes("crowd")) { down++; fires.push("dog"); } break;
      case "hawk": if (a === "sense" && (tags.includes("open") || tags.includes("high"))) { down++; fires.push("hawk"); } break;
      case "owl": if ((a === "sneak" || a === "move") && tags.includes("dark")) { dice++; fires.push("owl"); } break;
      case "raven": if (opt.approach === "wits") fires.push("raven"); break;
      case "mouse": if ((a === "sneak" || a === "move") && tags.includes("narrow")) { down++; fires.push("mouse"); } break;
      case "rat": if (opt.gnaw) fires.push("rat"); break;
      case "squirrel": if (a === "move" && tags.includes("high")) { down++; fires.push("squirrel"); } break;
      case "gator": if ((a === "sneak" || a === "force") && tags.includes("water")) { down++; fires.push("gator"); } break;
      case "komodo": if (a === "sense") { dice++; fires.push("komodo"); } break;
    }
  }
  const pk = R.PERKS[c.perk];
  if (pk && (pk.form === "any" || form === "human")) {
    switch (c.perk) {
      case "football": if (a === "force") { dice++; fires.push("football"); } break;
      case "hideseek": if (a === "sneak") { dice++; fires.push("hideseek"); } break;
      case "trackstar": if (a === "move") { dice++; fires.push("trackstar"); } break;
      case "scout": if (a === "sense") { dice++; fires.push("scout"); } break;
      case "brainiac": if (opt.approach === "wits") { dice++; fires.push("brainiac"); } break;
      case "swim": if (tags.includes("water")) { dice++; fires.push("swim"); } break;
      case "gymnast": if (tags.includes("high")) { dice++; fires.push("gymnast"); } break;
      case "nightowl": if (tags.includes("dark")) { dice++; fires.push("nightowl"); } break;
      case "drama": if (tags.includes("crowd")) { dice++; fires.push("drama"); } break;
      case "whisperer": {
        const vsHound = ctx.threat ? ctx.threat.key === "hound" : (ctx.guardKeys ?? []).includes("hound");
        if (vsHound) { dice++; fires.push("whisperer"); }
        break;
      }
    }
  }
  if (a === "sneak") {                                                           // Table 4 specials
    const g = ctx.guardKeys ?? [];
    if (g.includes("hound") && !(form === "animal" && c.animal === "komodo")) up++; // Tracker (Komodo ignores)
    if (g.includes("huntsman")) up++;                                            // Trophy
  }
  if (ctx.distracted) down++;                                                    // §7 Distract
  if (ctx.coiled) down++;                                                        // Python: Coil
  return { dice, down, up, fires };
}

/** §1 The Cap: pool and Difficulty from a base rating, own mods and extra boosts. */
function finalPool(opt, m, extraDice = 0, extraDown = 0) {
  const n = opt.rating + Math.min(R.CAP_DICE, m.dice + extraDice);
  const d = Math.max(1, opt.D + m.up - Math.min(R.CAP_DIFF, m.down + extraDown));
  return { n, d };
}

/* ------------------------------------------------------------------ */
/*  Policy: values                                                    */
/* ------------------------------------------------------------------ */

/** How much the team minds +1 Scent right now (policy). */
function scentWeight(S) {
  if (S.huntUp) return 0;
  const rem = S.limit - S.scent;
  if (rem <= 1) return 2.5;
  if (rem === 2) return 0.8;
  return 0.35;
}

/** Cost of taking `harm` Hurt for character c (policy). */
function hurtCost(c, harm) {
  if (harm <= 0) return 0;
  return c.hurt + harm >= R.HURT_BOXES ? 1.6 : 0.3 * harm;
}

/** Value of each result for a roll in context (policy). Returns { fail, partial, success, crit }. */
function valuesFor(S, c, kind, info) {
  const lam = scentWeight(S);
  if (kind === "point") {
    const failExtra = (info.guarded ? 0.8 : 0) + (info.dangerous ? hurtCost(c, 1) : 0) + (takenOnFail(S) ? 4 : 0);
    return { fail: -lam - failExtra, partial: 1 - lam, success: 1, crit: 1.3 };
  }
  if (kind === "group") {
    const failExtra = (info.guarded ? 0.8 : 0) + (info.dangerous ? hurtCost(c, 1) : 0) + (takenOnFail(S) ? 4 : 0);
    return { fail: -0.6 * lam - failExtra, partial: 1 - 0.6 * lam, success: 1, crit: 1.2 };
  }
  if (kind === "scout") return { fail: -0.8, partial: 0.4, success: 1, crit: 1.4 };
  // clash actions
  const t = info.threat;
  const cost = t.net ? 0.9 : hurtCost(c, t.harm);
  const left = t.tough - t.dmg;
  if (kind === "strike") return { fail: -cost, partial: 1 - cost, success: 1, crit: Math.min(2, left) };
  if (kind === "distract") return { fail: -cost, partial: 0.5 - cost, success: 0.5, crit: 0.5 };
  throw new Error(kind);
}

const ev = (o, v) => o.fail * v.fail + o.partial * v.partial + o.success * v.success + o.crit * v.crit;

/** What a Wild token is worth to spend right now (policy; DESIGN D16 "spend it"). */
function wildValue(S, c) {
  if (c.wild <= 0) return Infinity;
  if (S.phase === "escape") return 0.05;
  if (S.p.spend === "thrifty") return c.wild <= 2 ? Infinity : 0.25;
  return c.wild >= 2 ? 0.12 : 0.3;
}

/* ------------------------------------------------------------------ */
/*  Shifting (§3) and Patch Up (§4)                                    */
/* ------------------------------------------------------------------ */

function canShiftTo(c, form) {
  if (form === c.form) return true;
  if (form === "human") return !c.stuck;
  return c.wild >= 1 || c.hurt <= 0; // out of Wild: take 1 Hurt instead, unless that would put you Down
}

function shiftCost(S, c, form) {
  if (form === c.form || form === "human") return 0;
  return c.wild >= 1 ? wildValue(S, c) : 0.6; // overdraw costs a Hurt
}

/** Shift c into `form`. `seen` = in sight of the Hunt. */
function doShift(S, c, form, seen) {
  if (form === c.form) return;
  if (form === "animal") {
    if (c.wild >= 1) { c.wild--; c.wildSpent++; }
    else { S.st.overdraws++; hurt(S, c, 1, { noIntercept: true }); }
    c.shifts++;
  }
  c.form = form;
  if (seen) { c.exposed = true; S.st.shiftsSeen++; }
  log(S, `${c.animal} shifts to ${form}${seen ? " (seen)" : ""}`);
}

function patchUp(S, healer, target) {
  healer.wild--; healer.wildSpent++;
  target.hurt = Math.max(0, target.hurt - 1);
  S.st.patches++;
}

/* ------------------------------------------------------------------ */
/*  Hurt, Down, Netted, Taken (§9)                                     */
/* ------------------------------------------------------------------ */

function hurt(S, c, amount, o = {}) {
  if (amount <= 0 || c.status !== "active") return;
  // Brown Bear, Thick Fur: once per scene, take 1 less.
  if (c.animal === "bear" && c.form === "animal" && !c.used.has("bear")) { c.used.add("bear"); amount -= 1; fire(S, "bear"); }
  if (amount <= 0) return;
  c.hurt += amount;
  if (c.hurt >= R.HURT_BOXES) {
    c.hurt = R.HURT_BOXES; c.status = "down"; S.st.downs++;
    if (c.form === "animal") c.stuck = true; // §9 Stuck
    if (S.clash) S.clash.down = true;
    log(S, `${c.animal} is Down`);
  }
  checkAllOut(S);
}

function net(S, c) {
  if (c.status !== "active") return;
  c.status = "netted"; S.st.nets++;
  log(S, `${c.animal} is Netted`);
  checkAllOut(S);
}

function take(S, c) {
  if (c.status === "taken" || c.status === "out") return;
  c.status = "taken"; c.taken = true; c.exposed = true;
  if (S.huntUp && S.phase !== "escape" && S.withdrawn === false) { S.withdrawn = true; S.st.withdrew = 1; } // policy: run once a friend is Taken
  if (S.carrier === c) S.prizeLost = true;
  log(S, `${c.animal} is Taken`);
}

/** §9 Everyone Down, Netted or Taken at once: everyone is Taken, Loss. */
function checkAllOut(S) {
  if (S.over) return;
  if (S.chars.some(c => c.status === "active")) return;
  for (const c of S.chars) if (c.status === "down" || c.status === "netted") take(S, c);
  S.over = true;
}

/** End of a scene (§6, §9): Down and Netted characters get up or are Taken; once-per-scene uses reset. */
function endScene(S) {
  const friend = active(S).length > 0;
  for (const c of S.chars) {
    if (c.status === "down" || c.status === "netted") {
      if (friend && !S.huntUp) { if (c.status === "down") c.hurt = 2; c.status = "active"; }
      else take(S, c);
    }
    c.used.clear();
  }
  checkAllOut(S);
}

/* ------------------------------------------------------------------ */
/*  Scent (§8)                                                         */
/* ------------------------------------------------------------------ */

function scentUp(S, n) {
  if (S.huntUp || n <= 0) return;
  S.scent = Math.min(S.limit, S.scent + n);
  if (S.scent >= S.limit) { S.huntUp = true; S.huntUpAt = S.phase; log(S, "The Hunt is Up"); }
}

const onTheTrail = S => S.scent >= Math.ceil(S.limit / 2);

/** §8: once the Hunt is Up, a Fail means you're Taken (in the Escape; also inside under pressOn). */
const takenOnFail = S => S.huntUp && (S.phase === "escape" || S.p.huntUpInside === "pressOn");

/** §8: does the Hunt being Up end the inside part of the mission now? (pressOn: the team's choice.) */
function stopInside(S) {
  if (!S.huntUp || S.phase === "escape") return false;
  if (S.p.huntUpInside !== "pressOn") return true;
  if (S.withdrawn === undefined) {
    S.withdrawn = S.remaining > 1 || (S.p.pressOnWhen === "underway" && !(S.curProg > 0)); // policy
    if (S.withdrawn) S.st.withdrew = 1;
  }
  return S.withdrawn;
}

/* ------------------------------------------------------------------ */
/*  Rolling                                                            */
/* ------------------------------------------------------------------ */

/**
 * Add Edges and Help to a planned roll while they're worth it (§1 Cap, §4, §5).
 * Returns { n, d, helpers, edges, brainiac }.
 */
function planBoosts(S, roller, form, opt, m, vals, info) {
  let extraDice = 0, extraDown = 0, edges = 0, brainiac = null;
  const helpers = [];
  const evAt = (xd, xdn) => { const f = finalPool(opt, m, xd, xdn); return ev(odds(f.n, f.d), vals); };
  // Edges (team tokens) and Help (1 Wild each).
  for (let guard = 0; guard < 4; guard++) {
    if (m.dice + extraDice >= R.CAP_DICE) break;
    if (helpers.length >= S.p.maxHelpers && !(S.edges - edges > 0)) break;
    const gain = evAt(extraDice + 1, extraDown) - evAt(extraDice, extraDown);
    if (S.edges - edges > 0 && gain > 0.04) { edges++; extraDice++; continue; }
    const cands = helpers.length >= S.p.maxHelpers ? [] : active(S).filter(h => h !== roller && !helpers.includes(h) && h.wild >= 1 &&
      !(opt.approach === "wits" && h.form !== "human") && (!info.helperFilter || info.helperFilter(h)));
    let best = null;
    for (const h of cands) {
      const give = 1;
      const g = evAt(Math.min(R.CAP_DICE - m.dice, extraDice + give), extraDown) - evAt(extraDice, extraDown);
      const freeHelp = h.form === "animal" && h.animal === "wolf" && !h.used.has("wolf"); // Wolf: Pack
      const net = g - (freeHelp ? 0 : wildValue(S, h));
      if (net > 0 && (!best || net > best.net)) best = { h, give, net };
    }
    if (!best) break;
    helpers.push(best.h); extraDice += best.give;
  }
  const f = finalPool(opt, m, extraDice, extraDown);
  return { ...f, helpers, edges, brainiac };
}

/**
 * Make one roll (§1): pay boosts, roll, maybe Push (§4), apply Wily / Class Clown.
 * Returns the result string.
 */
function makeRoll(S, c, form, opt, m, plan, vals) {
  for (const h of plan.helpers) {
    S.st.helps++;
    if (h.form === "animal" && h.animal === "wolf" && !h.used.has("wolf")) { h.used.add("wolf"); fire(S, "wolf"); continue; }
    h.wild--; h.wildSpent++;
  }
  if (plan.edges) { S.edges -= plan.edges; S.st.edgesUsed += plan.edges; }
  for (const f of m.fires) fire(S, f);

  let r = rollPool(S.rng, plan.n);
  let res = classify(r.hits, r.sixes, plan.d);
  if (res === "fail" || res === "partial") {
    const after = pushOdds(plan.n, r.hits, r.sixes, plan.d);
    const gain = ev(after, vals) - vals[res];
    // Free Pushes: Gamer (any roll, once per scene), Cheetah: Burst (Move, once per scene).
    let free = null;
    if (form === "animal" && c.animal === "cheetah" && opt.rollAs === "move" && !c.used.has("cheetah")) free = "cheetah";
    if (free && gain > 0.02) {
      c.used.add(free); fire(S, free); S.st.freePushes++;
      r = pushRoll(S.rng, r); res = classify(r.hits, r.sixes, plan.d);
    } else if (c.wild >= 1 && gain > wildValue(S, c)) {
      c.wild--; c.wildSpent++; S.st.pushes++;
      r = pushRoll(S.rng, r); res = classify(r.hits, r.sixes, plan.d);
    }
  }
  if (res === "fail") {
    if (form === "animal" && c.animal === "fox" && !c.used.has("fox")) { c.used.add("fox"); fire(S, "fox"); res = "partial"; }
  }
  S.st.rolls[res]++;
  if (form === "animal") c.rollsAnimal++; else c.rollsHuman++;
  log(S, `${c.animal}/${form} ${opt.rollAs} ${plan.n}d vs ${plan.d}: ${res}`);
  return res;
}

/** Best roll for one character at an obstacle, considering a shift. */
function bestFor(S, c, ob, kind, info, allowShift) {
  let best = null;
  const forms = allowShift ? ["human", "animal"] : [c.form];
  for (const form of forms) {
    if (!canShiftTo(c, form)) continue;
    const sc = allowShift ? shiftCost(S, c, form) : 0;
    const vals = valuesFor(S, c, kind, info);
    for (const opt of optionsFor(c, form, ob)) {
      const m = selfMods(c, form, opt, { tags: ob.tags, guardKeys: info.guardKeys, escape: S.phase === "escape" });
      if (S.phase === "escape" && onTheTrail(S) && info.trail) m.up += 0; // trail already folded into opt.D (§8)
      const f = finalPool(opt, m);
      const score = ev(odds(f.n, f.d), vals) - sc;
      if (!best || score > best.score) best = { c, form, opt, m, vals, score };
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/*  Obstacles (§6)                                                     */
/* ------------------------------------------------------------------ */

/** The obstacle as it stands this scene: On the Trail adds +1 Difficulty in the Escape (§8). */
function sceneObstacle(S, ob) {
  if (S.phase !== "escape" || !onTheTrail(S)) return ob;
  const approaches = {};
  for (const [a, d] of Object.entries(ob.approaches)) approaches[a] = d + 1;
  return { ...ob, approaches };
}

/** On the way to an obstacle: each character may Shift or Patch Up once, free (§6). */
function onTheWay(S, ob, plan) {
  for (const c of active(S)) {
    let want = c.form;
    if (plan.fight) {
      want = forceForm(S, c, ob);
    } else if (ob.kind === "group") {
      const b = bestFor(S, c, ob, "group", plan.info, true);
      if (b) want = b.form;
    } else if (plan.roller === c) {
      want = plan.rollerForm;
    }
    let usedAction = false;
    if (want !== c.form && canShiftTo(c, want)) {
      const seen = S.p.shiftSeenOutside > 0 && S.rng.chance(S.p.shiftSeenOutside);
      doShift(S, c, want, seen);
      if (seen) scentUp(S, 1); // §3
      usedAction = true;
    }
    if (!usedAction && c.wild >= 1) {
      const target = active(S).filter(t => t.hurt >= 1).sort((a, b) => b.hurt - a.hurt)[0];
      if (target && target.hurt >= (S.phase === "escape" ? 1 : 2) && wildValue(S, c) < 0.5) patchUp(S, c, target);
    }
  }
}

/** The form a character would rather fight in at this obstacle. */
function forceForm(S, c, ob) {
  const pool = form => {
    if (!canShiftTo(c, form)) return -1;
    const opt = { approach: "force", rollAs: "force", D: 2, rating: rating(c, form, "force", ob.tags) };
    if (opt.rating <= 0) return -1;
    const m = selfMods(c, form, opt, { tags: ob.tags, action: "strike", firstStrike: true });
    const f = finalPool(opt, m);
    return pAtLeast(f.n, f.d) - (form !== c.form && form === "animal" ? wildValue(S, c) * 0.5 : 0);
  };
  return pool("animal") > pool("human") + 0.05 ? "animal" : (c.stuck ? "animal" : "human");
}
const pAtLeast = (n, d) => 1 - odds(n, d).fail;

/** Should the team start the Clash itself (§6)? Policy `fightGuards`. */
function wantsFight(S, ob) {
  if (S.p.fightGuards !== "auto" || !ob.guards.length) return false;
  const chars = active(S);
  const info = { guardKeys: ob.guards, guarded: true, dangerous: ob.dangerous };
  let pAll = 1;
  if (ob.kind === "group") {
    for (const c of chars) { const b = bestFor(S, c, ob, "group", info, true); pAll *= b ? 1 - odds(finalPool(b.opt, b.m).n, finalPool(b.opt, b.m).d).fail : 0; }
  } else {
    let best = 0;
    for (const c of chars) { const b = bestFor(S, c, ob, "point", info, true); if (b) { const f = finalPool(b.opt, b.m); best = Math.max(best, 1 - odds(f.n, f.d).fail); } }
    pAll = best ** ob.progress;
  }
  let dmg = 0;
  for (const c of chars) {
    const form = forceForm(S, c, ob);
    const opt = { approach: "force", rollAs: "force", D: 2, rating: rating(c, form, "force", ob.tags) };
    if (opt.rating <= 0) continue;
    const m = selfMods(c, form, opt, { tags: ob.tags, action: "strike" });
    const f = finalPool(opt, m);
    dmg += pAtLeast(f.n, R.THREATS[ob.guards[0]].diff + m.up);
  }
  const tough = ob.guards.reduce((a, k) => a + R.THREATS[k].tough, 0);
  return pAll < 0.45 && dmg * 2 >= tough;
}

function runObstacle(S, rawOb) {
  if (S.over) return false;
  const ob = sceneObstacle(S, rawOb);
  let guards = [...ob.guards];
  const info = () => ({ guardKeys: guards, guarded: guards.length > 0, dangerous: ob.dangerous });
  const fight = S.phase !== "escape" && guards.length && wantsFight(S, { ...ob, guards });
  // plan the point roller for the free on-the-way shift
  let plan = { fight, info: info() };
  if (!fight && ob.kind === "point") {
    let best = null;
    for (const c of active(S)) { const b = bestFor(S, c, ob, "point", info(), true); if (b && (!best || b.score > best.score)) best = b; }
    if (best) { plan.roller = best.c; plan.rollerForm = best.form; }
  }
  onTheWay(S, ob, plan);
  if (S.over) return false;

  if (fight) {
    log(S, `${ob.name}: the team starts the Clash`);
    clash(S, ob, guards);
    guards = [];
    if (S.over) return false;
    if (ob.guardsClear) { endScene(S); return true; }
    if (stopInside(S)) { endScene(S); return false; }
  }

  let rounds = 0;
  if (ob.kind === "point") {
    let prog = 0;
    S.curProg = 0;
    while (prog < ob.progress) {
      if (S.over) return false;
      if (++rounds > 30) { S.st.maxRoundsHit++; log(S, `SAFETY STOP at ${ob.name}`); break; }
      let best = null;
      for (const c of active(S)) { const b = bestFor(S, c, ob, "point", info(), false); if (b && (!best || b.score > best.score)) best = b; }
      if (!best) { S.st.maxRoundsHit++; break; }
      // an idle character may shift (their action) to be the better roller next round
      let alt = null;
      for (const c of active(S)) {
        if (c === best.c) continue;
        const b = bestFor(S, c, ob, "point", info(), true);
        if (b && b.form !== c.form && (!alt || b.score > alt.score)) alt = b;
      }
      if (alt && alt.score > best.score + 0.15) doShift(S, alt.c, alt.form, false);

      const plan2 = planBoosts(S, best.c, best.form, best.opt, best.m, best.vals, {});
      const res = makeRoll(S, best.c, best.form, best.opt, best.m, plan2, best.vals);
      if (res === "crit") {
        if (best.opt.rollAs === "force" && best.c.animal === "rhino") fire(S, "rhino");
        if (prog + 1 < ob.progress) prog += 2; else { prog += 1; gainEdge(S); }
      } else if (res === "success") {
        if (best.form === "animal" && best.c.animal === "rhino" && best.opt.rollAs === "force" && !best.c.used.has("rhino") && prog + 1 < ob.progress) {
          best.c.used.add("rhino"); fire(S, "rhino"); prog += 2; // Rhino: Charge counts as a Critical
        } else prog += 1;
      } else if (res === "partial") { prog += 1; scentUp(S, 1); }
      else {
        const wasUp = takenOnFail(S);
        scentUp(S, 1);
        if (wasUp) take(S, best.c);
        else if (ob.dangerous) hurt(S, best.c, 1);
        if (!wasUp && guards.length && !S.huntUp) {
          clash(S, ob, guards); guards = [];
          if (ob.guardsClear) prog = ob.progress;
        }
      }
      S.curProg = prog;
      if (stopInside(S)) break; // §8: the scene ends
    }
    endScene(S);
    return prog >= ob.progress && !S.over;
  }

  // group obstacle
  const past = new Set();
  let anyBad = false;
  const groupRise = () => { // A2: one event, one rise
    if (S.p.groupScent === "once" && anyBad) scentUp(S, 1);
    anyBad = false;
  };
  while (true) {
    if (S.over) return false;
    const pending = active(S).filter(c => !past.has(c));
    if (!pending.length) break;
    if (++rounds > 30) { S.st.maxRoundsHit++; log(S, `SAFETY STOP at ${ob.name}`); break; }
    let bad = false, failed = false;
    const takenNow = takenOnFail(S);
    for (const c of pending) {
      if (c.status !== "active") continue;
      const b = bestFor(S, c, ob, "group", info(), false);
      if (!b) { failed = true; continue; }
      const plan2 = planBoosts(S, c, b.form, b.opt, b.m, b.vals, {});
      const res = makeRoll(S, c, b.form, b.opt, b.m, plan2, b.vals);
      if (res === "fail") {
        bad = true; failed = true;
        if (takenNow) take(S, c);
        else if (ob.dangerous) hurt(S, c, 1);
      } else {
        past.add(c);
        if (res === "partial" && (S.phase !== "escape" || S.p.escapePartialScent)) bad = true;
        if (res === "crit") gainEdge(S);
      }
    }
    if (bad) { if (S.p.groupScent === "once") anyBad = true; else scentUp(S, 1); } // at most once per round
    checkAllOut(S);
    if (S.over) return false;
    if (failed && guards.length && !takenNow) {
      groupRise();
      clash(S, ob, guards); guards = [];
      if (S.over) return false;
      if (ob.guardsClear) break;
    }
    if (stopInside(S)) break;
    if (S.p.groupScent === "once" && rounds >= 3 && active(S).some(c => !past.has(c))) scentUp(S, 1); // A24: every round after the third costs
  }
  groupRise();
  endScene(S);
  return !S.over;
}

function gainEdge(S) {
  if (S.edges < R.EDGE_MAX) { S.edges++; S.st.edgesGained++; }
}

/* ------------------------------------------------------------------ */
/*  Clashes (§7)                                                       */
/* ------------------------------------------------------------------ */

function clash(S, ob, guardKeys) {
  // A Clash is its own scene (§6): once-per-scene abilities come back.
  for (const c of S.chars) c.used.clear();
  S.st.clashes++;
  const th = guardKeys.map((k, i) => ({ key: k, i, ...R.THREATS[k], dmg: 0, out: false, coil: false }));
  S.clash = { down: false, shifted: false };
  const firstStrike = new Set();
  let round = 0;
  log(S, `Clash at ${ob.name}: ${guardKeys.join(", ")}`);
  for (round = 1; round <= R.CLASH_MAX_ROUNDS; round++) {
    const struck = new Set();
    const distracted = new Set();
    const left = () => th.filter(t => !t.out);
    const ctxFor = (c, t, action) => ({
      tags: ob.tags, guardKeys: left().map(x => x.key), threat: t, action,
      firstStrike: action === "strike" && !firstStrike.has(c), distracted: action === "strike" && distracted.has(t.i), coiled: t.coil,
    });
    const strikeView = (c, t) => {
      const opt = { approach: "force", rollAs: "force", D: t.diff, rating: rating(c, c.form, "force", ob.tags) };
      if (opt.rating <= 0) return null;
      const m = selfMods(c, c.form, opt, ctxFor(c, t, "strike"));
      const vals = valuesFor(S, c, "strike", { threat: t });
      const f = finalPool(opt, m);
      return { opt, m, vals, score: ev(odds(f.n, f.d), vals) };
    };
    const target = () => left().sort((a, b) => (a.tough - a.dmg) - (b.tough - b.dmg) || b.harm - a.harm)[0];
    // order: freers, then distracters, then strikers (Python first, best first)
    const actors = active(S);
    const t0 = target();
    if (!t0) break;
    const views = actors.map(c => ({ c, v: strikeView(c, t0) }));
    views.sort((a, b) => (b.c.animal === "python") - (a.c.animal === "python") || (b.v?.score ?? -9) - (a.v?.score ?? -9));
    const strikersAfter = new Set(views.filter(x => (x.v?.score ?? -9) > 0.3).map(x => x.c));
    const distracters = [], strikers = [];
    for (const { c, v } of views) {
      const dv = distractView(S, c, t0, ob, ctxFor);
      if ((!v || v.score < 0.3) && dv && dv.score > 0.2 && [...strikersAfter].some(s => s !== c)) distracters.push({ c, dv });
      else strikers.push(c);
    }
    const order = [...distracters.map(x => x.c), ...strikers];
    for (const c of order) {
      if (S.over || c.status !== "active") continue;
      const t = target();
      if (!t) break;
      // free a Netted friend
      const netted = S.chars.find(k => k.status === "netted");
      if (netted && !strikersAfter.has(c)) { netted.status = "active"; log(S, `${c.animal} frees ${netted.animal}`); continue; }
      // mid-Clash shift (§3: in sight of the Hunt)
      if (S.p.midClashShift && c.form === "human" && canShiftTo(c, "animal") && c.wild >= 1 &&
          FR[c.frame].ratings.force >= c.human.force + 2) {
        doShift(S, c, "animal", true); S.clash.shifted = true; continue;
      }
      // patch up when one more hit would put you Down
      if (c.hurt + t.harm >= R.HURT_BOXES && c.wild >= 2) { patchUp(S, c, c); continue; }
      const dIdx = distracters.findIndex(x => x.c === c);
      if (dIdx >= 0) {
        const dv = distractView(S, c, t, ob, ctxFor);
        if (dv) {
          struck.add(t.i);
          const plan = planBoosts(S, c, c.form, dv.opt, dv.m, dv.vals, {});
          const res = makeRoll(S, c, c.form, dv.opt, dv.m, plan, dv.vals);
          if (res !== "fail") distracted.add(t.i);
          if (res === "partial" || res === "fail") threatHits(S, c, t, res);
          continue;
        }
      }
      const v = strikeView(c, t);
      if (!v) continue;
      struck.add(t.i);
      const usedDistract = distracted.has(t.i);
      const usedCoil = t.coil;
      const plan = planBoosts(S, c, c.form, v.opt, v.m, v.vals, {});
      let res = makeRoll(S, c, c.form, v.opt, v.m, plan, v.vals);
      firstStrike.add(c);
      if (usedDistract) { distracted.delete(t.i); fire(S, "distract"); }
      if (usedCoil) t.coil = false;
      if (res === "success" && c.form === "animal" && c.animal === "rhino" && !c.used.has("rhino")) { c.used.add("rhino"); fire(S, "rhino"); res = "crit"; }
      if (res === "success" && c.form === "animal" && c.animal === "gorilla" && !c.used.has("gorilla") && (t.key === "beater" || t.key === "hound")) {
        c.used.add("gorilla"); fire(S, "gorilla"); t.dmg = t.tough;
      } else if (res === "crit") t.dmg += 2;
      else if (res === "success" || res === "partial") t.dmg += 1;
      if ((res === "success" || res === "crit") && c.form === "animal" && c.animal === "python") { t.coil = true; fire(S, "python"); }
      if (t.dmg >= t.tough) { t.out = true; log(S, `${t.name} is out`); }
      if (res === "partial" || res === "fail") threatHits(S, c, t, res);
    }
    // §7: each threat nobody rolled against hurts one character of the Storyteller's choice
    for (const t of th) {
      if (t.out || struck.has(t.i) || S.over) continue;
      const pool = active(S);
      if (!pool.length) break;
      let victim;
      if (S.p.pressTarget === "mostHurt") victim = pool.sort((a, b) => b.hurt - a.hurt)[0];
      else if (S.p.pressTarget === "leastHurt") victim = pool.sort((a, b) => a.hurt - b.hurt)[0];
      else victim = S.rng.pick(pool);
      hurt(S, victim, t.harm);
    }
    if (!left().length || !active(S).length || S.over) break;
  }
  const rounds = Math.min(round, R.CLASH_MAX_ROUNDS);
  S.st.clashRounds.push(rounds);
  if (rounds >= R.CLASH_MAX_ROUNDS) S.st.clashRound4++;
  // after round 4 any threats still standing pull back
  const rise = rounds >= R.CLASH_MAX_ROUNDS || S.clash.down || S.clash.shifted ? 2 : 1;
  scentUp(S, rise);
  S.clash = null;
  endScene(S);
}

function distractView(S, c, t, ob, ctxFor) {
  let best = null;
  const approaches = ["sneak", "move"];
  for (const a of approaches) {
    const r = rating(c, c.form, a, ob.tags);
    if (r <= 0) continue;
    const opt = { approach: a, rollAs: a, D: t.diff, rating: r };
    const m = selfMods(c, c.form, opt, ctxFor(c, t, "distract"));
    const vals = valuesFor(S, c, "distract", { threat: t });
    const f = finalPool(opt, m);
    const score = ev(odds(f.n, f.d), vals);
    if (!best || score > best.score) best = { opt, m, vals, score };
  }
  return best;
}

/** A Partial or a Fail against a threat (§7): its Harm hits you; a Trapper's Fail nets you. */
function threatHits(S, c, t, res) {
  if (res === "fail" && t.net) net(S, c);
  else hurt(S, c, t.harm);
}

/* ------------------------------------------------------------------ */
/*  The mission (§10)                                                  */
/* ------------------------------------------------------------------ */

function scout(S) {
  // One character rolls Sense; shifting first is out of the Hunt's sight (outside the site).
  const ob = { tags: [], approaches: { sense: S.scoutDiff } };
  let best = null;
  for (const c of S.chars) { const b = bestFor(S, c, ob, "scout", {}, true); if (b && (!best || b.score > best.score)) best = b; }
  if (!best) return null;
  if (best.form !== best.c.form) doShift(S, best.c, best.form, false);
  const plan = planBoosts(S, best.c, best.form, best.opt, best.m, best.vals, {});
  const res = makeRoll(S, best.c, best.form, best.opt, best.m, plan, best.vals);
  if (res === "crit") { gainEdge(S); gainEdge(S); }
  else if (res === "success") gainEdge(S);
  else scentUp(S, 1);
  for (const c of S.chars) c.used.clear();
  return res;
}

/** Estimated trouble on a way in (fewer is better): expected Partials+Fails. */
function wayTrouble(S, way) {
  let t = 0;
  for (const ob of way) {
    const info = { guardKeys: ob.guards, guarded: ob.guards.length > 0, dangerous: ob.dangerous };
    if (ob.kind === "group") {
      for (const c of S.chars) { const b = bestFor(S, c, ob, "group", info, true); if (b) { const f = finalPool(b.opt, b.m); const o = odds(f.n, f.d); t += o.fail * (info.guarded ? 2.5 : 1.5) + o.partial * 0.6; } else t += 3; }
    } else {
      let bestP = 0;
      for (const c of S.chars) { const b = bestFor(S, c, ob, "point", info, true); if (b) { const f = finalPool(b.opt, b.m); const o = odds(f.n, f.d); bestP = Math.max(bestP, o.success + o.crit); } }
      t += ob.progress * (1 - bestP) * 1.5;
    }
  }
  return t;
}

export function playMission(mission, party, rng, params, opts = {}) {
  const S = newState(mission, party, rng, params, opts);
  const sres = scout(S);
  S.st.scout = sres;
  let way;
  if (sres === "fail") way = S.rng.int(0, 1); // the Storyteller picks
  else {
    const t0 = wayTrouble(S, mission.waysIn[0]), t1 = wayTrouble(S, mission.waysIn[1]);
    way = t0 <= t1 ? 0 : 1;
  }
  S.st.wayIn = way;
  log(S, `Way in: ${mission.waysIn[way].map(o => o.name).join(", ")}`);

  const inside = [...mission.waysIn[way], ...mission.inside, mission.objective];
  for (let i = 0; i < inside.length; i++) {
    S.remaining = inside.length - i; // this obstacle and those after it
    if (S.over || stopInside(S)) break;
    const done = runObstacle(S, inside[i]);
    if (i === inside.length - 1 && done && !S.over) { // §1: a roll that finishes it and raises the Hunt still finishes it
      S.objectiveDone = true;
      if (mission.objective.carry) S.carrier = active(S).sort((a, b) => a.hurt - b.hurt)[0] ?? null;
    }
  }
  S.phase = "escape";
  for (const ob of mission.escape) {
    if (S.over) break;
    runObstacle(S, ob);
  }
  for (const c of S.chars) if (c.status === "active") c.status = "out";
  for (const c of S.chars) if (c.perk === "gamer" && c.wildSpent > c.wildStart - 1) fire(S, "gamer"); // spent the extra Wild

  const taken = S.chars.filter(c => c.taken).length;
  const done = S.objectiveDone && !S.prizeLost && !S.chars.every(c => c.taken);
  const result = done ? (taken ? "costly" : "win") : "loss";
  return {
    result, taken, huntUp: S.huntUp, huntUpAt: S.huntUpAt, scent: S.scent, limit: S.limit,
    objectiveDone: S.objectiveDone, prizeLost: S.prizeLost, st: S.st, trace: S.trace,
    chars: S.chars.map(c => ({
      frame: c.frame, animal: c.animal, perk: c.perk, shifts: c.shifts, wildSpent: c.wildSpent, wildStart: c.wildStart,
      taken: c.taken, exposed: c.exposed, rollsAnimal: c.rollsAnimal, rollsHuman: c.rollsHuman, stuck: c.stuck,
    })),
  };
}

/** Internals exposed for the unit tests only. */
export const __test = { finalPool, selfMods, optionsFor, rating };
