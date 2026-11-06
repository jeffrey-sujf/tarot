import { useEffect, useState, type CSSProperties } from "react";
import { cx } from "../utils/classNames";
import { useReducedMotion } from "../utils/useReducedMotion";
import styles from "./DrawOverlay.module.css";

const EXIT_MS = 380;

const LINES = ["Calculating location…", "Reading the current time…", "Shuffling the deck…"];

/**
 * Brief full-screen "calculating" moment shown while a reading is drawn.
 * Mounts instantly on `active`, but lingers after `active` goes false so the
 * CSS opacity/blur transition can finish — by then the reading page has
 * already mounted underneath, so the overlay blurs back to reveal it.
 */
export function DrawOverlay({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (active) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!mounted) return null;

  return (
    <div className={cx(styles.overlay, visible && styles.visible)} aria-hidden="true">
      <div className={cx(styles.lines, reducedMotion && styles.reduced)}>
        {LINES.map((line, i) => (
          <span key={line} className={styles.line} style={{ "--line-delay": `${i * 220}ms` } as CSSProperties}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
