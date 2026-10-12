export type ModeId = "past-present-future" | "decision";

export interface PositionDef {
  /** Stable key, stored in the reading code's context when needed. */
  key: string;
  /** Label shown under the card. */
  label: string;
}

export interface DecisionContext {
  decisionA: string;
  decisionB: string;
}

export interface ReadingMode {
  id: ModeId;
  title: string;
  description: string;
  cardCount: 3;
  /**
   * Resolves this mode's positions. For static modes this ignores its
   * argument; the decision mode uses it to fold in the user's labels.
   */
  getPositions: (context?: DecisionContext) => PositionDef[];
  /** Whether this mode needs extra user input before a reading can start. */
  requiresInput: boolean;
}
