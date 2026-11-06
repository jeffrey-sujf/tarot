import { useEffect, useState, type CSSProperties } from "react";
import { cx } from "../utils/classNames";
import { useReducedMotion } from "../utils/useReducedMotion";
import styles from "./DrawOverlay.module.css";

const EXIT_MS = 380;
const STEP_SPACING_MS = 480;

const STEPS: { text: string; readout: "coords" | "clock" | null }[] = [
  { text: "Calculating location…", readout: "coords" },
  { text: "Reading the current time…", readout: "clock" },
  { text: "Shuffling the deck…", readout: null },
];

function useTicker(active: boolean, intervalMs: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);
}

/** Flickers through plausible coordinate digits — purely decorative, never a real position. */
function ScrambleCoords({ live }: { live: boolean }) {
  useTicker(live, 90);
  if (!live) return <span className={styles.readout}>— · —</span>;
  const lat = (Math.random() * 90).toFixed(4);
  const lon = (Math.random() * 180).toFixed(4);
  return (
    <span className={styles.readout}>
      {lat}° N &nbsp; {lon}° W
    </span>
  );
}

/** Ticks the real local time down to the millisecond. */
function LiveClock({ live }: { live: boolean }) {
  useTicker(live, 50);
  const now = new Date();
  const time = `${now.toLocaleTimeString([], { hour12: false })}.${String(now.getMilliseconds()).padStart(3, "0")}`;
  return <span className={styles.readout}>{time}</span>;
}

function Readout({ kind, live }: { kind: "coords" | "clock"; live: boolean }) {
  return kind === "coords" ? <ScrambleCoords live={live} /> : <LiveClock live={live} />;
}

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
      <div className={cx(styles.steps, reducedMotion && styles.reduced)}>
        {STEPS.map((step, i) => (
          <div
            key={step.text}
            className={styles.step}
            style={{ "--step-delay": `${i * STEP_SPACING_MS}ms` } as CSSProperties}
          >
            <span className={styles.label}>{step.text}</span>
            {step.readout && <Readout kind={step.readout} live={visible && !reducedMotion} />}
          </div>
        ))}
      </div>
    </div>
  );
}
