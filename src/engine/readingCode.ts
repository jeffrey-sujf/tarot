import { bytesToBase64Url, base64UrlToBytes } from "./base64url";
import { DECK_SIZE } from "../data/cards";
import type { Orientation } from "../data/cards";
import type { ModeId } from "../modes/types";

const CURRENT_VERSION = 2;

/** UI-facing cap on typed decision length (characters the input will accept). */
export const MAX_DECISION_CHARS = 20;

/**
 * Hard cap, in UTF-8 bytes, on each decision's contribution to the encoded
 * seed. Bounding by bytes (not characters) keeps the seed short and
 * reliably copy/paste-able even for multi-byte scripts (CJK, emoji), where
 * MAX_DECISION_CHARS characters could otherwise balloon into a seed too
 * long to paste back in cleanly.
 */
const MAX_DECISION_BYTES = 48;

/** Truncates to at most `maxBytes`, backing off so a multi-byte UTF-8 sequence is never split. */
function truncateUtf8(bytes: Uint8Array, maxBytes: number): Uint8Array {
  if (bytes.length <= maxBytes) return bytes;
  let end = maxBytes;
  while (end > 0 && (bytes[end] & 0xc0) === 0x80) end--;
  return bytes.slice(0, end);
}

/** Visual grouping width for the "xxxx-xxxx-xxxx" display chunks (see encodeReadingCode). */
const CHUNK_WIDTH = 4;

/**
 * Reassembles the base64url payload from its display chunks. Base64url's own
 * alphabet includes '-', so a naive `.replace(/-/g, "")` would also strip
 * data characters that just happen to be '-' (not only the separators we
 * inserted), corrupting the payload — this happened often on longer
 * (decision-mode) codes, where a literal '-' is more likely to occur.
 * Instead, walk the string exactly as it was built: a separator is expected
 * only right after every `CHUNK_WIDTH` characters, never inside a chunk.
 */
function dechunk(raw: string): string | null {
  let out = "";
  let i = 0;
  while (i < raw.length) {
    const chunk = raw.slice(i, i + CHUNK_WIDTH);
    out += chunk;
    i += chunk.length;
    if (i < raw.length) {
      if (raw[i] !== "-") return null;
      i += 1;
    }
  }
  return out;
}

const MODE_TO_BYTE: Record<ModeId, number> = { "past-present-future": 0, decision: 1 };
const BYTE_TO_MODE: Record<number, ModeId> = { 0: "past-present-future", 1: "decision" };

export interface DecodedReadingCode {
  version: number;
  mode: ModeId;
  cards: { cardIndex: number; orientation: Orientation }[];
  decisionA?: string;
  decisionB?: string;
}

export type DecodeResult =
  | { ok: true; data: DecodedReadingCode }
  | { ok: false; reason: "malformed" | "unsupported-version" | "corrupt" };

function checksum(bytes: number[]): number {
  return bytes.reduce((sum, b) => (sum + b) & 0xff, 0);
}

export interface EncodeInput {
  mode: ModeId;
  cards: { cardIndex: number; orientation: Orientation }[];
  decisionA?: string;
  decisionB?: string;
}

/** Encodes a drawn result (not raw context) into a shareable "TRT2-xxxx-xxxx" code. */
export function encodeReadingCode(input: EncodeInput): string {
  const bytes: number[] = [CURRENT_VERSION, MODE_TO_BYTE[input.mode]];

  for (const card of input.cards) {
    const orientationBit = card.orientation === "reversed" ? 0x80 : 0;
    bytes.push(orientationBit | (card.cardIndex & 0x7f));
  }

  if (input.mode === "decision") {
    for (const text of [input.decisionA ?? "", input.decisionB ?? ""]) {
      const fullBytes = new TextEncoder().encode(text.slice(0, MAX_DECISION_CHARS));
      const encoded = truncateUtf8(fullBytes, MAX_DECISION_BYTES);
      bytes.push(encoded.length);
      bytes.push(...encoded);
    }
  }

  bytes.push(checksum(bytes));

  const payload = bytesToBase64Url(new Uint8Array(bytes));
  const chunks: string[] = [];
  for (let i = 0; i < payload.length; i += CHUNK_WIDTH) chunks.push(payload.slice(i, i + CHUNK_WIDTH));
  return `TRT${CURRENT_VERSION}-${chunks.join("-")}`;
}

export function decodeReadingCode(code: string): DecodeResult {
  const trimmed = code.trim();
  const match = trimmed.match(/^TRT(\d+)-([A-Za-z0-9_-]+)$/);
  if (!match) return { ok: false, reason: "malformed" };

  const declaredVersion = Number(match[1]);
  if (declaredVersion !== CURRENT_VERSION) return { ok: false, reason: "unsupported-version" };

  const payload = dechunk(match[2]);
  if (payload === null) return { ok: false, reason: "malformed" };
  const bytes = base64UrlToBytes(payload);
  if (!bytes || bytes.length < 6) return { ok: false, reason: "malformed" };

  const body = Array.from(bytes.slice(0, -1));
  const expectedChecksum = bytes[bytes.length - 1];
  if (checksum(body) !== expectedChecksum) return { ok: false, reason: "corrupt" };

  const [version, modeByte, ...rest] = body;
  if (version !== CURRENT_VERSION) return { ok: false, reason: "unsupported-version" };
  const mode = BYTE_TO_MODE[modeByte];
  if (mode === undefined) return { ok: false, reason: "corrupt" };

  if (rest.length < 3) return { ok: false, reason: "corrupt" };
  const cardBytes = rest.slice(0, 3);
  const cards = cardBytes.map((b) => ({
    cardIndex: b & 0x7f,
    orientation: (b & 0x80 ? "reversed" : "upright") as Orientation,
  }));

  if (cards.some((c) => c.cardIndex >= DECK_SIZE)) return { ok: false, reason: "corrupt" };
  const uniqueIndices = new Set(cards.map((c) => c.cardIndex));
  if (uniqueIndices.size !== cards.length) return { ok: false, reason: "corrupt" };

  let cursor = 3;
  let decisionA: string | undefined;
  let decisionB: string | undefined;

  if (mode === "decision") {
    try {
      for (const key of ["decisionA", "decisionB"] as const) {
        if (cursor + 1 > rest.length) throw new Error("truncated");
        const len = rest[cursor];
        cursor += 1;
        if (cursor + len > rest.length) throw new Error("truncated");
        const slice = rest.slice(cursor, cursor + len);
        cursor += len;
        const text = new TextDecoder().decode(new Uint8Array(slice));
        if (key === "decisionA") decisionA = text;
        else decisionB = text;
      }
    } catch {
      return { ok: false, reason: "corrupt" };
    }
  }

  return { ok: true, data: { version, mode, cards, decisionA, decisionB } };
}
