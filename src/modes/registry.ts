import type { ReadingMode, ModeId } from "./types";
import { pastNowFuture } from "./pastNowFuture";
import { decisionMode } from "./decision";

/** Registering a future mode here (plus its own config file) is the only wiring needed. */
export const MODES: ReadingMode[] = [pastNowFuture, decisionMode];

const BY_ID = new Map(MODES.map((m) => [m.id, m]));

export function modeById(id: ModeId): ReadingMode {
  const mode = BY_ID.get(id);
  if (!mode) throw new Error(`Unknown mode: ${id}`);
  return mode;
}
