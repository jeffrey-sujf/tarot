import type { ReadingMode } from "./types";

export const decisionMode: ReadingMode = {
  id: "decision",
  title: "Decision",
  description: "Type your two options",
  cardCount: 3,
  requiresInput: true,
  getPositions: (context) => {
    const a = context?.decisionA?.trim() || "Decision A";
    const b = context?.decisionB?.trim() || "Decision B";
    return [
      { key: "decisionA", label: `${a}: Outcome` },
      { key: "decisionB", label: `${b}: Outcome` },
      { key: "centralAdvice", label: "Central Advice" },
    ];
  },
};
