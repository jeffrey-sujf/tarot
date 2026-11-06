Build a minimalist tarot reading website with an elegant Apple-inspired UI, subtle animations, and a black-and-white retro print aesthetic.

Do not use Tailwind CSS.

## Core experience

The home page has two reading modes, with architecture that allows more modes later.

### 1. Past / Now / Future

Draw three unique tarot cards:

- Past
- Now
- Future

Generate a deterministic seed using the current date/time and, when reasonably available, approximate location and a locally generated anonymous user ID.

The experience must still work without location permission. Do not use browser fingerprinting.

### 2. Decision Reading

Require the user to enter:

- Decision A
- Decision B

Then draw:

- `[Decision A] Outcome`
- `[Decision B] Outcome`
- `Central Advice`

Generate the deterministic seed from the two decisions + date/time + approximate location when available.

## Tarot system

Include the complete 78-card tarot deck.

Each card has:

- Name
- Artwork
- Upright meaning
- Reversed meaning

Cards can randomly be upright or reversed. Reversed cards should visually rotate 180° and use their reversed interpretation.

No duplicate cards within one spread.

Use a seeded PRNG so the same seed ALWAYS reproduces the same cards, positions, orientations, mode, and decision labels.

Use a versioned, compact reading code such as:

```
TRT1-XXXX-XXXX-XXXX
```

Do not expose raw location or identifiers in the code.

## Reading page

Show three cards with their labels underneath.

Clicking a card opens an elegant modal containing:

**Meaning**
A very brief explanation of the card.

**Implications**
A very brief interpretation based on its position in the current reading.

Keep interpretations concise.

Provide actions to:

- Copy the reading seed
- Export/share a clean image of the three cards, labels, and seed

## Previous readings

The home page should have a discreet/hidden **Retrieve Reading** control.

Entering a valid seed must reconstruct the exact previous reading.

Handle invalid seeds gracefully.

## Visual direction

The UI should feel:

**Apple-like minimalism × vintage tarot printmaking**

Use:

- Generous whitespace
- Excellent typography
- Mostly monochrome colors
- Thin borders
- Restrained shadows
- Smooth 200–500ms transitions
- Subtle card dealing/reveal animations
- Refined hover/press interactions
- Responsive mobile design

Avoid:

- Tailwind
- Neon occult aesthetics
- Excessive gradients
- Heavy glassmorphism
- Overdone animations
- Generic dashboard styling

Tarot artwork should have a consistent black-and-white engraving / woodcut / old-book-print aesthetic.

If final artwork is unavailable, use replaceable placeholders rather than mixing inconsistent imagery.

## Architecture

Keep these concerns separate:

- Tarot card data
- Reading modes
- Seed generation
- Seeded randomization
- Reading serialization/retrieval
- UI
- Export/share functionality

Prefer a frontend-only implementation for V1 unless a backend is genuinely necessary.

Make adding future spreads easy.

Before coding, briefly describe your proposed architecture and file structure. Then implement the application end-to-end.

Prioritize correct reading/seed logic first, then visual polish. Do not overengineer.