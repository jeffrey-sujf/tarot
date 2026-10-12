import { useEffect, useRef } from "react";
import type { Orientation, TarotCard as TarotCardData } from "../../data/cards";
import { CardArt } from "../CardArt";
import { cx } from "../../utils/classNames";
import styles from "./CardModal.module.css";

interface Props {
  card: TarotCardData;
  orientation: Orientation;
  positionLabel: string;
  onClose: () => void;
}

export function CardModal({ card, orientation, positionLabel, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const meaning = orientation === "upright" ? card.meaning.upright : card.meaning.reversed;
  const implication = orientation === "upright" ? card.implication.upright : card.implication.reversed;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${card.name}, ${positionLabel}`}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
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
