/**
 * Foundry's document and dice classes, looked up where v13 and v14 keep them (the
 * namespaced or configured class first, the old global only as a fallback), so the
 * system doesn't depend on globals Foundry is retiring.
 */

/** The configured ChatMessage class. */
export const ChatMessageClass = () => globalThis.CONFIG?.ChatMessage?.documentClass ?? foundry.documents?.ChatMessage ?? globalThis.ChatMessage;

/** The Roll class (Dice So Nice and other modules hook into it). */
export const RollClass = () => foundry.dice?.Roll ?? globalThis.Roll;

/** A new evaluated "Nd6" roll. */
export const rollD6 = n => new (RollClass())(`${Math.max(0, Math.trunc(n))}d6`).evaluate();

/** The base Actor document class to extend. */
export const BaseActor = foundry.documents?.Actor ?? globalThis.Actor;
