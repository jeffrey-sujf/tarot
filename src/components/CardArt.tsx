import { useState } from "react";
import type { TarotCard } from "../data/cards";
import styles from "./CardArt.module.css";
import { cx } from "../utils/classNames";

/**
 * Renders a card's scanned black-and-white artwork, keyed by its stable
 * deck index (`/cards/<index>.jpg`, served from `public/cards/`). Shows a
 * quiet breathing placeholder while the image loads, then crossfades in,
 * so a slow first load (new device, cold cache) reads as intentional
 * rather than a stalled image.
 */
export function CardArt({ card, className }: { card: TarotCard; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={cx(styles.frame, className)}>
      {!loaded && <span className={styles.placeholder} aria-hidden="true" />}
      <img
        src={`/cards/${card.index}.jpg`}
        alt={card.name}
        draggable={false}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cx(styles.art, loaded && styles.loaded)}
      />
    </span>
  );
}
