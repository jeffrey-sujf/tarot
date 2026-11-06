import { useEffect, useRef, useState } from "react";
import type { Orientation, TarotCard as TarotCardData } from "../../data/cards";
import { CardArt } from "../CardArt";
import { cx } from "../../utils/classNames";
import { useReducedMotion } from "../../utils/useReducedMotion";
import styles from "./CardModal.module.css";

/** Mirrors the dialog's riseIn duration so close retraces the path it opened on. */
const EXIT_MS = 220;

interface Props {
  card: TarotCardData;
  orientation: Orientation;
  positionLabel: string;
  onClose: () => void;
}

export function CardModal({ card, orientation, positionLabel, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  const reducedMotion = useReducedMotion();
  const meaning = orientation === "upright" ? card.meaning.upright : card.meaning.reversed;
  const implication = orientation === "upright" ? card.implication.upright : card.implication.reversed;

  function requestClose() {
    if (reducedMotion) {
      onClose();
      return;
    }
    setClosing(true);
    window.setTimeout(onClose, EXIT_MS);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cx(styles.overlay, closing && styles.closing)} onClick={requestClose}>
      <div
        className={cx(styles.dialog, closing && styles.closing)}
        role="dialog"
        aria-modal="true"
        aria-label={`${card.name}, ${positionLabel}`}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={requestClose} aria-label="Close">
          ×
        </button>

        <div className={styles.artWrap}>
          <span className={cx(styles.artFrame, orientation === "reversed" && styles.reversed)}>
            <CardArt card={card} />
          </span>
        </div>

        <div className={styles.body}>
          <p className={styles.position}>{positionLabel}</p>
          <h2 className={styles.name}>{card.name}</h2>
          <p className={styles.orientation}>{orientation === "upright" ? "Upright" : "Reversed"}</p>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Meaning</h3>
            <p className={styles.sectionText}>{card.image}</p>
            <p className={styles.sectionText}>{meaning}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Implications</h3>
            <p className={styles.sectionText}>{implication}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
