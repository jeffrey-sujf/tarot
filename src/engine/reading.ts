import type { Orientation } from "../data/cards";
import type { ModeId } from "../modes/types";

export interface ReadingCardEntry {
  cardIndex: number;
  orientation: Orientation;
  positionKey: string;
  label: string;
}

export interface Reading {
  version: 1;
  mode: ModeId;
  /** The compact, shareable "TRT2-xxxx-xxxx" code, also the lookup key. */
  seed: string;
  createdAt: string;
  context: {
    decisionA?: string;
    decisionB?: string;
  };
  cards: ReadingCardEntry[];
}
