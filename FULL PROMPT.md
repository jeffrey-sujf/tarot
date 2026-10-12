# Tarot Reading Website

Build a polished, production-quality tarot reading web app with functional interactions and deterministic reading logic.

## Product Direction

The experience should feel:

**Apple-level restraint × vintage black-and-white tarot printmaking.**

Prioritize:

- Minimal, quiet, elegant UI
- Excellent typography and generous spacing
- Responsive, touch-first design
- Subtle tactile animations
- Accessibility and `prefers-reduced-motion`
- Fast loading
- Clean separation of data, logic, and UI
- Extensible reading-mode architecture

Avoid:

- Tailwind CSS
- Neon/stereotypical occult styling
- Excessive gradients, glassmorphism, decoration, or animation
- Generic dashboard layouts
- Game-like effects

Use regular CSS, CSS Modules, styled-components, or another maintainable non-Tailwind solution.

## 1. Tarot Deck

Implement the complete standard **78-card deck**:

- 22 Major Arcana
- 56 Minor Arcana: Wands, Cups, Swords, Pentacles

Each card must contain:

- ID/name
- Image
- Upright meaning
- Reversed meaning
- Short interpretation data

Cards may be upright or reversed. Reversed cards display artwork rotated 180° and use reversed interpretations.

Artwork should consistently resemble monochrome engravings, etchings, woodcuts, or old book illustrations.

If final assets are unavailable, implement the complete deck/data architecture with clearly replaceable placeholders rather than inventing inconsistent artwork.

## 2. Reading Modes

Define modes through configuration/interfaces so additional modes can be added without rewriting page logic.

Implement only:

### Past / Now / Future

Three positions:

**Past — Now — Future**

Seed context may include:

- Current date/time
- Coarse location when available and appropriate
- Random anonymous locally stored ID if useful

Never use invasive fingerprinting. Location must remain optional.

### Decision Reading

Require:

- Decision A
- Decision B

Normalize option text before seed generation.

Spread:

1. `[Decision A] Outcome`
2. `[Decision B] Outcome`
3. `Central Advice`

Use the user's actual option names in the displayed labels.

Seed context includes the normalized decisions, current date/time, and optional coarse location.

Handle empty, identical, and very long option names gracefully.

## 3. Deterministic Seed System

Readings must be reproducible.

The same valid seed must reconstruct exactly:

- Mode
- Cards
- Card positions
- Upright/reversed states
- Decision names when applicable

Requirements:

- Do not use `Math.random()` for reading generation after seed creation.
- Use a deterministic seeded PRNG.
- Prevent duplicate cards within a spread.
- Use a compact, human-copyable, versioned reading code.
- Never expose raw device identifiers or exact location.

Example format:

```
TRT1-XXXXXXXXXXXX
```

If frontend-only, encode the minimum state required for reconstruction. If persistence/backend is used, the code may be a lookup key.

Refreshing or reopening a reading must preserve it.

## 4. Home / Retrieval

The home page presents reading modes through an extensible mode-selection UI.

Include a discreet secondary control:

**Retrieve a reading**

When activated, reveal an input for a reading code.

Handle:

- Valid codes
- Invalid codes
- Unsupported versions
- Missing readings if persistence is used

Use inline/subtle feedback, never browser alerts.

## 5. Reading Experience

Show three cards horizontally on desktop.

On narrow touch screens, use appropriately sized cards and, when useful, horizontal scrolling with gentle scroll snapping.

### Sequential reveal

Do not immediately expose drawn cards.

Explicit state flow:

```
dealing → reveal-1 → reveal-2 → reveal-3 → complete
```

Behavior:

1. Deal all three cards face-down with subtle staggering.
2. Only the current unrevealed card is interactive.
3. Tap it to reveal using a ~400–600ms restrained 3D flip.
4. After completion, activate the next card after ~100–200ms.
5. After all cards are revealed, any card can open its details.

Prevent rapid taps from skipping states, revealing multiple cards, or opening details during animation.

Keep reveal-flip transforms separate from card orientation so reversed artwork can remain rotated 180° correctly.

The active card may use a very subtle lift/prominence treatment.

Touch/pointer down should create slight compression around `scale(0.985)`.

With `prefers-reduced-motion`, preserve the sequential state machine but replace 3D/dealing motion with short fades/state changes.

## 6. Card Details

Tapping a revealed card after the reading is complete opens a lightweight detail view.

Use:

- Mobile bottom sheet on small screens
- Elegant modal/popover on larger screens

Display:

**Card Name**

**Upright / Reversed**

### Meaning

A concise general meaning.

### Implications

A concise interpretation based specifically on the card's spread position.

Position-aware implications must distinguish between:

- Past
- Now
- Future
- Decision A outcome
- Decision B outcome
- Central Advice

Keep interpretations short and contemplative rather than generating long mystical essays.

Optional on touch: swipe between card details and swipe down to dismiss, but always provide visible tap/button alternatives.

## 7. Reading Actions

Provide subtle controls for:

### Copy Seed

Copy the reading code with temporary feedback such as:

**Seed copied**

Handle unavailable Clipboard APIs gracefully.

### Share / Export

Generate a deliberately designed shareable image containing:

- Three cards
- Position labels
- Reading seed
- Decision names when applicable

Do not simply capture an accidental browser screenshot. Render a clean export using an appropriate client-side technique.

## 8. Visual / Interaction Design

Use:

- Generous negative space
- Strong typography
- Mostly monochrome colors
- Thin borders
- Restrained shadows
- Responsive card sizing
- Refined hover/focus/pressed states
- Smooth easing
- ~200–500ms transitions for normal UI interactions

The surrounding interface should be contemporary and extremely clean while the cards provide the vintage visual character.

Touch requirements:

- Interactive targets approximately 44×44px minimum
- Never rely on hover
- Prefer Pointer Events where appropriate
- Preserve normal vertical scrolling
- Respect device safe areas
- Never disable browser zoom/accessibility gestures

Optional subtle haptics may be used for card reveal/completion where supported, but must never be required.

## 9. Privacy

- Do not require precise location.
- Request location only when justified.
- Reading generation must work without it.
- Prefer coarse location.
- Do not fingerprint users.
- If needed, generate a random local anonymous ID.
- Never expose raw location/device IDs in shareable codes.
- Keep tarot determinism separate from analytics/tracking.

## 10. Architecture

Separate:

- Tarot deck data
- Reading-mode definitions
- Seed/context generation
- Seeded PRNG
- Reading generation
- Serialization/deserialization
- UI components
- Export/share logic
- Persistence if needed

A reading can conceptually resemble:

```
{
  version: 1,
  mode: "past-present-future" | "decision",
  seed: "...",
  createdAt: "...",
  context: {
    decisionA?: string,
    decisionB?: string
  },
  cards: [
    {
      cardId: string,
      orientation: "upright" | "reversed",
      position: string,
      label: string
    }
  ]
}
```

Future modes might include Single Card, Love, Career, or Celtic Cross, but **do not implement them now**.

## 11. Required Edge Cases

Handle:

- Location unavailable/denied
- Clipboard unavailable
- Empty/identical/very long decision names
- Invalid or unsupported reading codes
- Mobile layouts
- Reduced motion
- Refresh/reopen/share flows
- Duplicate-card prevention
- Rapid input during reveal animations

## Implementation Order

Before coding, briefly state the proposed architecture and file structure.

Then implement end-to-end in this order:

1. Complete tarot data model
2. Deterministic/versioned seed system
3. Reading generation logic
4. Both reading modes
5. Reading retrieval
6. Responsive/touch-first reading UI
7. Sequential reveal state machine
8. Card detail interactions
9. Copy/share/export
10. Animation and visual polish

Do not stop at mockups or pseudocode.

Build the functional application.

When requirements are ambiguous, choose the simplest robust implementation consistent with this specification rather than adding unnecessary complexity.