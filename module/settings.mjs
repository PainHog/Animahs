/**
 * Settings: the mission state (hidden world setting, written only by the active GM),
 * one switch for every automation, and the tracker and reminder options.
 * Every automation can be switched off (WORKFLOW.md); with one off, the Storyteller gets
 * a one-click "Apply" with the rules-correct outcome instead.
 */
import { SYSTEM_ID, SETTINGS, HOOKS } from "./contracts.mjs";
import { emptyState } from "./logic/mission.mjs";

const world = (key, type, def, extra = {}) => game.settings.register(SYSTEM_ID, key, {
  name: `MG.Setting.${key}.name`, hint: `MG.Setting.${key}.hint`,
  scope: "world", config: true, type, default: def, ...extra,
});

export function registerSettings() {
  game.settings.register(SYSTEM_ID, SETTINGS.migrationVersion, { scope: "world", config: false, type: String, default: "" });
  game.settings.register(SYSTEM_ID, SETTINGS.missionState, {
    scope: "world", config: false, type: Object, default: emptyState(),
    onChange: value => Hooks.callAll(HOOKS.missionChanged, value),
  });
  world(SETTINGS.autoProgress, Boolean, true);
  world(SETTINGS.autoScent, Boolean, true);
  world(SETTINGS.autoHurt, Boolean, true);
  world(SETTINGS.autoClash, Boolean, true);
  world(SETTINGS.autoTaken, Boolean, true);
  world(SETTINGS.autoWild, Boolean, true);
  world(SETTINGS.autoGrowth, Boolean, true);
  world(SETTINGS.threatTargets, String, "prompt", {
    choices: { prompt: "MG.Setting.threatTargets.prompt", random: "MG.Setting.threatTargets.random" },
  });
  world(SETTINGS.trackerForPlayers, Boolean, true, { onChange: () => Hooks.callAll(HOOKS.missionChanged) });
  world(SETTINGS.rulesReminders, Boolean, true);
  game.settings.register(SYSTEM_ID, SETTINGS.trackerAutoOpen, {
    name: `MG.Setting.${SETTINGS.trackerAutoOpen}.name`, hint: `MG.Setting.${SETTINGS.trackerAutoOpen}.hint`,
    scope: "client", config: true, type: Boolean, default: true,
  });
}

/** Read one of this system's settings. */
export const setting = key => game.settings.get(SYSTEM_ID, key);

/** The automation switches as the reducer and effects need them. */
export function autoSettings() {
  return {
    progress: setting(SETTINGS.autoProgress),
    scent: setting(SETTINGS.autoScent),
    hurt: setting(SETTINGS.autoHurt),
    clash: setting(SETTINGS.autoClash),
    taken: setting(SETTINGS.autoTaken),
    wild: setting(SETTINGS.autoWild),
    growth: setting(SETTINGS.autoGrowth),
  };
}
