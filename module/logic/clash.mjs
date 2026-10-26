/**
 * §7 Clashes (Foundry-free). Threats have Difficulty, Toughness and Harm (Table 4) and
 * never roll. Each round everyone in the Clash takes one action:
 *  - Strike (Force): Success 1 harm, Critical 2; out when harm taken = Toughness;
 *  - Distract (Sneak or Move): a Success puts the next Strike against it this round at −1 Difficulty;
 *  - Slip Away (Move or Sneak): a Success takes you out of the Clash: past a group obstacle, or waiting at a point one;
 *  - or Shift, Patch Up, free a Netted friend (no roll).
 * Against a threat a Partial does the job but its Harm hits you; a Fail just hits you
 * (a Trapper's Fail nets you instead). At the end of each round each threat nobody rolled
 * against deals its Harm to one character of the Storyteller's choice. The Clash ends when
 * every threat is out, nobody is left in it, or at the end of round 4.
 *
 * Animal perks handled here: Snow Leopard Ambush (first Strike in each Clash, −1 Difficulty),
 * Moose Antler Sweep (a Beater or Hound is out at once), Python Coil (the next roll anyone
 * makes against that threat is at −1 Difficulty). Hippopotamus Charge arrives as a Critical.
 *
 * Effects returned for the runtime to apply to actors:
 *   { type: "hurt", actorId, amount, threatId } · { type: "net", actorId, threatId }
 *   { type: "take", actorId } · { type: "slip", actorId }
 */
import { THREATS, CLASH_MAX_ROUNDS } from "../config.mjs";

/** A threat in a Clash, from its Table 4 kind (numbers may be overridden from an actor). */
export function makeThreat(key, i = 0, extra = {}) {
  const T = THREATS[key] ?? THREATS.beater;
  return {
    id: extra.id ?? `${key}-${i + 1}`,
    key: THREATS[key] ? key : "beater",
    name: extra.name ?? T.name,
    diff: Number(extra.diff ?? T.diff),
    tough: Number(extra.tough ?? T.tough),
    harm: Number(extra.harm ?? T.harm),
    harmTaken: Number(extra.harmTaken ?? 0),
    out: false,
    net: !!T.net, tracker: !!T.tracker, trophy: !!T.trophy,
    coiled: false,
    actorUuid: extra.actorUuid ?? null,
    tokenUuid: extra.tokenUuid ?? null,
  };
}

/** A fresh Clash. */
export function newClash({ id, obstacleUid = null, threats = [], participants = [] }) {
  return {
    id, obstacleUid, round: 1,
    threats: threats.map(t => ({ ...t })),
    participants: [...participants],
    left: [],          // slipped away (past a group obstacle; waiting at a point one)
    struck: [],        // threat ids rolled against this round
    distracted: [],    // threat ids Distracted this round
    firstStrike: [],   // actors who have made their first Strike this Clash (Ambush)
    anyDown: false, anyShifted: false, shifters: [],
    over: null,        // null | "allOut" | "nobodyLeft" | "round4"
  };
}

export const threatsLeft = clash => (clash?.threats ?? []).filter(t => !t.out);
export const guardKeysOf = clash => threatsLeft(clash).map(t => t.key);
export const threatById = (clash, id) => (clash?.threats ?? []).find(t => t.id === id) ?? null;

/** Who is still in the Clash: participants who haven't slipped away and can act. */
export function stillIn(clash, roster) {
  const st = id => roster.find(r => r.id === id) ?? {};
  return clash.participants.filter(id => !clash.left.includes(id) && !st(id).down && !st(id).netted && !st(id).taken);
}

/**
 * What a roll against a threat starts from (for the roll dialog): the threat's
 * Difficulty and the context flags the roll plan needs.
 */
export function clashRollContext(clash, { actorId, threatId, action }) {
  const t = threatById(clash, threatId);
  return {
    difficulty: t?.diff ?? 2,
    threat: t ? { key: t.key, id: t.id } : null,
    guardKeys: guardKeysOf(clash),
    action,
    firstStrike: action === "strike" && !clash.firstStrike.includes(actorId),
    distracted: action === "strike" && !!t && clash.distracted.includes(t.id),
    coiled: !!t?.coiled,
  };
}

/**
 * Resolve one final roll against a threat.
 * roll: { actorId, action, threatId, result, form, animal, sweep, coiled, distracted, huntUp }
 * Returns { clash, effects, harmDealt }.
 */
export function resolveClashRoll(clash0, roll) {
  const clash = structuredClone(clash0);
  const effects = [];
  const t = threatById(clash, roll.threatId);
  if (!t || t.out) return { clash, effects, harmDealt: 0 };
  if (!clash.struck.includes(t.id)) clash.struck.push(t.id);
  if (roll.coiled) t.coiled = false;                      // Coil: used by this roll
  const ok = roll.result === "success" || roll.result === "crit";
  const did = ok || roll.result === "partial";            // a Partial does the job
  let harmDealt = 0;
  if (roll.action === "strike") {
    if (!clash.firstStrike.includes(roll.actorId)) clash.firstStrike.push(roll.actorId);
    if (roll.distracted) clash.distracted = clash.distracted.filter(x => x !== t.id);
    if (ok && roll.sweep && (t.key === "beater" || t.key === "hound")) {
      harmDealt = Math.max(0, t.tough - t.harmTaken);       // Moose: Antler Sweep, out at once
    } else if (roll.result === "crit") harmDealt = 2;
    else if (did) harmDealt = 1;
    t.harmTaken = Math.min(t.tough, t.harmTaken + harmDealt);
    if (t.harmTaken >= t.tough) t.out = true;
    if (ok && roll.form === "animal" && roll.animal === "python" && !t.out) t.coiled = true; // Python: Coil
  } else if (roll.action === "distract") {
    if (did && !clash.distracted.includes(t.id)) clash.distracted.push(t.id);
  } else if (roll.action === "slip") {
    if (did && !clash.left.includes(roll.actorId)) { clash.left.push(roll.actorId); effects.push({ type: "slip", actorId: roll.actorId }); }
  }
  // The cost: a Partial's Harm, a Fail's Harm (a Trapper nets you on a Fail). Hunt Up: a Fail is Taken.
  if (roll.result === "fail" && roll.huntUp) effects.push({ type: "take", actorId: roll.actorId });
  else if (roll.result === "fail" && t.net) effects.push({ type: "net", actorId: roll.actorId, threatId: t.id });
  else if (roll.result === "fail" || roll.result === "partial") effects.push({ type: "hurt", actorId: roll.actorId, amount: t.harm, threatId: t.id });
  if (!threatsLeft(clash).length) clash.over = "allOut";
  return { clash, effects, harmDealt };
}

/** Threats nobody rolled against this round (they will deal their Harm at the end of it). */
export const unattended = clash => threatsLeft(clash).filter(t => !clash.struck.includes(t.id));

/**
 * End a Clash round. targets: { [threatId]: actorId } — the Storyteller's choice for each
 * unattended threat. Returns { clash, effects }: Hurt for each target, then the next round
 * (or the end, after round 4).
 */
export function endClashRound(clash0, targets = {}) {
  const clash = structuredClone(clash0);
  const effects = [];
  for (const t of unattended(clash)) {
    const actorId = targets[t.id];
    if (actorId) effects.push({ type: "hurt", actorId, amount: t.harm, threatId: t.id, unattended: true });
  }
  if (clash.round >= CLASH_MAX_ROUNDS) clash.over ??= "round4";
  else clash.round += 1;
  clash.struck = [];
  clash.distracted = [];
  return { clash, effects };
}

/** Check whether the Clash is over because nobody is left in it. */
export function checkNobodyLeft(clash0, roster) {
  const clash = { ...clash0 };
  if (!clash.over && !stillIn(clash, roster).length) clash.over = "nobodyLeft";
  return clash;
}
