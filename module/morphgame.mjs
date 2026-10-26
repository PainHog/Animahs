/**
 * SECOND NATURE — a tabletop roleplaying game by Richard Moore.
 * Foundry VTT game system — entry point.
 *
 * This file only wires things up: data models, document class, sheets, settings, GM
 * operations and automation hooks in "init"; the reconcile pass and the tracker in "ready".
 * Rules live in module/logic/ (Foundry-free, shared with the simulator); shared names in
 * module/contracts.mjs.
 */
import { MG } from "./config.mjs";
import { SYSTEM_ID, SETTINGS } from "./contracts.mjs";
import * as Logic from "./logic/rules.mjs";
import * as Mission from "./logic/mission.mjs";
import { BondedData } from "./data/bonded.mjs";
import { ThreatData } from "./data/threat.mjs";
import { MGActor } from "./documents/actor.mjs";
import { BondedSheet } from "./sheets/bonded-sheet.mjs";
import { ThreatSheet } from "./sheets/threat-sheet.mjs";
import { registerSettings } from "./settings.mjs";
import { registerQueries, runOp } from "./net/gm-ops.mjs";
import { registerActorOps, shift, patchUp, freeNetted, applyHurt, postNotice } from "./actors/actor-ops.mjs";
import { registerRollOps, registerRollHooks, performRoll, push } from "./dice/rolls.mjs";
import { RollDialog, rollDialog } from "./dice/roll-dialog.mjs";
import * as Automation from "./mission/automation.mjs";
import { getState } from "./mission/store.mjs";
import { MissionTracker, openTracker, registerTrackerHooks, startMissionFor, endRoundWithTargets } from "./apps/mission-tracker.mjs";
import { CharacterBuilder } from "./apps/character-builder.mjs";

/* -------------------------------------------- */
/*  Init                                        */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log("Second Nature | Initialising the system.");

  CONFIG.MG = MG;
  CONFIG.Actor.documentClass = MGActor;
  CONFIG.Actor.dataModels.bonded = BondedData;
  CONFIG.Actor.dataModels.threat = ThreatData;
  CONFIG.Actor.trackableAttributes = {
    bonded: { bar: ["wild", "hurt"], value: [] },
    threat: { bar: [], value: ["harmTaken"] },
  };

  registerSettings();
  registerQueries();
  registerActorOps();
  registerRollOps();
  registerRollHooks();
  Automation.registerAutomation();
  registerTrackerHooks();

  const Actors = foundry.documents?.collections?.Actors ?? globalThis.Actors;
  Actors.registerSheet(SYSTEM_ID, BondedSheet, { types: ["bonded"], makeDefault: true, label: "MG.Sheet.bondedLabel" });
  Actors.registerSheet(SYSTEM_ID, ThreatSheet, { types: ["threat"], makeDefault: true, label: "MG.Sheet.threatLabel" });

  // Public API for macros and other modules (game.morphgame, and game.morphGame for short).
  const api = {
    id: SYSTEM_ID, MG, logic: Logic, mission: Mission,
    getState, openTracker, startMission: startMissionFor, endRound: endRoundWithTargets,
    rollDialog, performRoll, push, shift, patchUp, freeNetted, applyHurt, postNotice, runOp,
    automation: Automation,
    apps: { MissionTracker, RollDialog, CharacterBuilder, BondedSheet, ThreatSheet },
  };
  game.morphgame = Object.assign(game.morphgame ?? {}, api);
  game.morphGame = game.morphgame;
});

/* -------------------------------------------- */
/*  Ready                                       */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  console.log("Second Nature | Ready.");
  // The GM catches up on roll cards made while no GM was connected.
  await Automation.reconcile();
  const S = getState();
  const show = game.user.isGM || game.settings.get(SYSTEM_ID, SETTINGS.trackerForPlayers);
  if (show && Mission.isRunning(S) && game.settings.get(SYSTEM_ID, SETTINGS.trackerAutoOpen)) openTracker();
});
