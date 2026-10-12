import type { Reading } from "./reading";

/**
 * Local-only persistence for in-progress / recent UI state. Nothing here is
 * ever sent anywhere, and all of it self-expires or clears with the browser —
 * see context.ts for the anonymous seed id, which follows the same rule.
 */

const CURRENT_READING_KEY = "tarot.currentReading";
const DECISION_DRAFT_KEY = "tarot.decisionDraft";

/** Short enough that reopening the browser minutes later still has your draft, but it won't linger. */
const DECISION_DRAFT_TTL_MS = 30 * 60 * 1000;

/**
 * The last completed reading, kept only for the life of this tab/session.
 * sessionStorage (not localStorage) so it reappears after a reload but is
 * gone once the tab or browser is actually closed.
 */
export function saveCurrentReading(reading: Reading | null) {
  try {
    if (reading) sessionStorage.setItem(CURRENT_READING_KEY, JSON.stringify(reading));
    else sessionStorage.removeItem(CURRENT_READING_KEY);
  } catch {
    // sessionStorage unavailable — reading simply won't survive a reload.
  }
}

export function loadCurrentReading(): Reading | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_READING_KEY);
    return raw ? (JSON.parse(raw) as Reading) : null;
  } catch {
    return null;
  }
}

interface DecisionDraft {
  a: string;
  b: string;
  savedAt: number;
}

/**
 * The decision inputs a visitor is mid-typing. localStorage so a brief
 * browser close doesn't lose them, but an expiry timestamp keeps it from
 * becoming permanent memory of what they typed.
 */
export function saveDecisionDraft(a: string, b: string) {
  try {
    if (!a && !b) {
      localStorage.removeItem(DECISION_DRAFT_KEY);
      return;
    }
    const draft: DecisionDraft = { a, b, savedAt: Date.now() };
    localStorage.setItem(DECISION_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage unavailable — draft simply won't survive a close.
  }
}

export function loadDecisionDraft(): { a: string; b: string } | null {
  try {
    const raw = localStorage.getItem(DECISION_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as DecisionDraft;
    if (Date.now() - draft.savedAt > DECISION_DRAFT_TTL_MS) {
      localStorage.removeItem(DECISION_DRAFT_KEY);
      return null;
    }
    return { a: draft.a, b: draft.b };
  } catch {
    return null;
  }
}

export function clearDecisionDraft() {
  try {
    localStorage.removeItem(DECISION_DRAFT_KEY);
  } catch {
    // ignore
  }
}
