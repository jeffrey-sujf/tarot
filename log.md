# Progress Log

## 2026-10-12 — No-duplicate-card requirement check

User request: "no two same card should be draw in one spread."

Investigated `src/engine/draw.ts` (`drawUniqueCards`), `src/engine/readingCode.ts`
(encode/decode), and `src/state/readingStore.ts`:

- `drawUniqueCards` already draws without replacement: each pick does
  `available.splice(pick, 1)`, removing the chosen card index from the pool
  before the next draw, so a duplicate is structurally impossible for
  freshly generated readings.
- `decodeReadingCode` additionally re-validates uniqueness on any
  reconstructed/retrieved seed (`uniqueIndices.size !== cards.length` →
  rejected as `"corrupt"`), so a hand-edited/corrupted code can't force a
  duplicate-card reading either.
- Stress-tested the draw algorithm standalone: 100,000 simulated 3-card
  spreads with random seeds, 0 duplicates found.

Conclusion: the no-duplicate-cards-per-spread requirement was already
correctly implemented end-to-end (generation path + retrieval/decode path).
No code change was needed; verified behavior matches spec.
