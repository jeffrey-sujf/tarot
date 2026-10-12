import { useState } from "react";
import type { Reading } from "../../engine/reading";
import { cardByIndex } from "../../data/cards";
import { modeById } from "../../modes/registry";
import { TarotCard } from "./TarotCard";
import { CardModal } from "./CardModal";
import { ReadingActions } from "./ReadingActions";
import styles from "./ReadingView.module.css";

export function ReadingView({ reading, onStartOver }: { reading: Reading; onStartOver: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mode = modeById(reading.mode);

  const open = openIndex !== null ? reading.cards[openIndex] : null;
  const openCard = open ? cardByIndex(open.cardIndex) : null;

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onStartOver}>
        ← New reading
      </button>

      <h1 className={styles.title}>{mode.title}</h1>

      <div className={styles.row}>
        {reading.cards.map((entry, i) => (
          <TarotCard
            key={entry.positionKey}
            card={cardByIndex(entry.cardIndex)}
            orientation={entry.orientation}
            label={entry.label}
            dealDelayMs={i * 140}
            onOpen={() => setOpenIndex(i)}
          />
        ))}
      </div>

      <ReadingActions reading={reading} />

      {open && openCard && (
        <CardModal
          card={openCard}
          orientation={open.orientation}
          positionLabel={open.label}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
