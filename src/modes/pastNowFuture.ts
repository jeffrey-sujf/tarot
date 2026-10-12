import type { ReadingMode } from "./types";

export const pastNowFuture: ReadingMode = {
  id: "past-present-future",
  title: "Past · Now · Future",
  description: "The classic",
  cardCount: 3,
  requiresInput: false,
  getPositions: () => [
    { key: "past", label: "Past" },
    { key: "now", label: "Now" },
    { key: "future", label: "Future" },
  ],
};
