import type { Reading } from "../engine/reading";
import type { ModeId } from "../modes/types";
import { modeById } from "../modes/registry";
import { getAnonId, getApproximateLocation } from "../engine/context";
import { buildPastNowFutureSeed, buildDecisionSeed } from "../engine/seedInput";
import { drawUniqueCards } from "../engine/draw";
import { encodeReadingCode, decodeReadingCode } from "../engine/readingCode";
import { cardByIndex } from "../data/cards";

function assemble(modeId: ModeId, drawn: { cardIndex: number; orientation: "upright" | "reversed" }[], decisionA?: string, decisionB?: string): Reading {
  const mode = modeById(modeId);
  const positions = mode.getPositions(decisionA !== undefined ? { decisionA, decisionB: decisionB ?? "" } : undefined);

  const seed = encodeReadingCode({ mode: modeId, cards: drawn, decisionA, decisionB });

  return {
    version: 1,
    mode: modeId,
    seed,
    createdAt: new Date().toISOString(),
    context: { decisionA, decisionB },
    cards: drawn.map((d, i) => ({
      cardIndex: d.cardIndex,
      orientation: d.orientation,
      positionKey: positions[i].key,
      label: positions[i].label,
    })),
  };
}

export async function generatePastNowFutureReading(): Promise<Reading> {
  const anonId = getAnonId();
  const location = await getApproximateLocation();
  const seedInput = buildPastNowFutureSeed(anonId, location);
  const drawn = drawUniqueCards(seedInput, 3);
  return assemble("past-present-future", drawn);
}

export async function generateDecisionReading(decisionA: string, decisionB: string): Promise<Reading> {
  const anonId = getAnonId();
  const location = await getApproximateLocation();
  const seedInput = buildDecisionSeed(decisionA, decisionB, anonId, location);
  const drawn = drawUniqueCards(seedInput, 3);
  return assemble("decision", drawn, decisionA.trim(), decisionB.trim());
}

export type ReconstructResult =
  | { ok: true; reading: Reading }
  | { ok: false; reason: "malformed" | "unsupported-version" | "corrupt" };

export function reconstructReading(code: string): ReconstructResult {
  const result = decodeReadingCode(code);
  if (!result.ok) return result;

  const { mode, cards, decisionA, decisionB } = result.data;
  // Touch cardByIndex to fail loudly (shouldn't happen — decode already range-checks).
  cards.forEach((c) => cardByIndex(c.cardIndex));

  const reading = assemble(mode, cards, decisionA, decisionB);
  // Preserve the exact code the user entered rather than re-encoding, so a
  // round trip never silently changes the seed string.
  reading.seed = code.trim();
  return { ok: true, reading };
}
