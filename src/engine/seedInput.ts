import type { CoarseLocation } from "./context";
import { normalizeText } from "./context";

/**
 * Builds the string fed into the PRNG at *generation* time. This is never
 * persisted or shared — only its output (the drawn cards) is. Including a
 * crypto-random component means re-rolling produces a fresh reading even
 * within the same millisecond, while still being perfectly deterministic
 * for any single seed value.
 */
function freshEntropy(): string {
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  return `${Date.now()}-${bytes[0]}-${bytes[1]}`;
}

export function buildPastNowFutureSeed(anonId: string, location: CoarseLocation | null): string {
  const geo = location ? `${location.lat},${location.lon}` : "no-geo";
  return `pf|${freshEntropy()}|${geo}|${anonId}`;
}

export function buildDecisionSeed(
  decisionA: string,
  decisionB: string,
  anonId: string,
  location: CoarseLocation | null
): string {
  const geo = location ? `${location.lat},${location.lon}` : "no-geo";
  return `dec|${normalizeText(decisionA)}|${normalizeText(decisionB)}|${freshEntropy()}|${geo}|${anonId}`;
}
