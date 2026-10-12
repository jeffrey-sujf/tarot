import { DECK_SIZE } from "../data/cards";
import type { Orientation } from "../data/cards";
import { createRng, randomInt } from "./prng";

export interface DrawnCard {
  cardIndex: number;
  orientation: Orientation;
}

/** Draws `count` unique card indices with independent orientations, from one seed string. */
export function drawUniqueCards(seed: string, count: number): DrawnCard[] {
  const rng = createRng(seed);
  const available = Array.from({ length: DECK_SIZE }, (_, i) => i);
  const result: DrawnCard[] = [];

  for (let i = 0; i < count; i++) {
    const pick = randomInt(rng, available.length);
    const cardIndex = available.splice(pick, 1)[0];
    const orientation: Orientation = rng() < 0.5 ? "upright" : "reversed";
    result.push({ cardIndex, orientation });
  }

  return result;
}
