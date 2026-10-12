/**
 * A single shared card-back design, rendered for every card in the deck
 * (real decks have one uniform back). Echoes the Tudor-rose checkerboard
 * of the reference scan (tarot_back.jpg), but as light line art on
 * white rather than solid dark print, so it stays consistent with the
 * deck's black-on-white engraving look. Pure vector: exact 2:3 aspect
 * match to the card slot (no letterboxing) and effectively free to
 * load, so the reveal flip never waits on it.
 */
export function CardBack() {
  return (
    <svg viewBox="0 0 240 400" width="100%" height="100%" role="img" aria-hidden="true" style={{ color: "var(--ink)", display: "block" }}>
      <defs>
        <pattern id="card-back-tile" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <g transform="translate(20 20)" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6">
            <circle cx="0" cy="-7" r="4.5" />
            <circle cx="0" cy="7" r="4.5" />
            <circle cx="-7" cy="0" r="4.5" />
            <circle cx="7" cy="0" r="4.5" />
            <circle r="2" fill="currentColor" stroke="none" opacity="0.6" />
          </g>
        </pattern>
      </defs>

      <rect x="6" y="6" width="228" height="388" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="16" width="208" height="368" fill="url(#card-back-tile)" />
      <rect x="16" y="16" width="208" height="368" fill="none" stroke="currentColor" strokeWidth="1" />

      <g transform="translate(120 200)">
        <circle r="34" fill="var(--paper-raised)" stroke="currentColor" strokeWidth="1" />
        <circle r="25" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const cx = Math.cos(angle) * 12;
            const cy = Math.sin(angle) * 12;
            return <circle key={i} cx={cx} cy={cy} r="9" />;
          })}
        </g>
        <circle r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle r="1.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
