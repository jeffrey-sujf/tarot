import { useState, type PointerEvent } from "react";
import type { Orientation, TarotCard as TarotCardData } from "../../data/cards";
import { CardArt } from "../CardArt";
import { CardBack } from "../CardBack";
import { cx } from "../../utils/classNames";
import styles from "./TarotCard.module.css";

interface Props {
  card: TarotCardData;
  orientation: Orientation;
  label: string;
  dealDelayMs: number;
  onOpen: () => void;
}

/**
 * Cards deal face down. On desktop, a real mouse hovering the card
 * commits the reveal immediately. On mobile there is no hover, so a
 * first tap commits it instead; a second tap (or a click once already
 * revealed) opens the full detail modal. The hover commit is gated on
 * `pointerType === "mouse"` so it never fires from a touch tap's
 * synthetic pointer/mouse events, which would otherwise race with the
 * click handler and skip straight to opening the modal on mobile.
 */
export function TarotCard({ card, orientation, label, dealDelayMs, onOpen }: Props) {
  const [revealed, setRevealed] = useState(false);

  function handleClick() {
    if (!revealed) {
      setRevealed(true);
    } else {
      onOpen();
    }
  }

  function handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === "mouse") {
      setRevealed(true);
    }
  }

  return (
    <div className={styles.column}>
      <button
        type="button"
        className={styles.cardButton}
        style={{ animationDelay: `${dealDelayMs}ms` }}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        aria-label={
          revealed
            ? `${card.name}, ${orientation}. Open card details.`
            : `${card.name}, ${orientation}, face down. Tap to reveal.`
        }
      >
        <span className={cx(styles.cardFace, orientation === "reversed" && styles.reversed)}>
          <span className={cx(styles.flipper, revealed && styles.revealed)}>
            <span className={styles.faceBack}>
              <CardBack />
            </span>
            <span className={styles.faceFront}>
              <CardArt card={card} />
            </span>
          </span>
        </span>
      </button>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
