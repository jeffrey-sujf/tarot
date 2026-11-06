import { useState } from "react";
import { MODES } from "../../modes/registry";
import { ModeCard } from "../ModeCard";
import { DecisionForm } from "../DecisionForm";
import { RetrieveSeed } from "../RetrieveSeed";
import { generatePastNowFutureReading, generateDecisionReading } from "../../state/readingStore";
import type { Reading } from "../../engine/reading";
import styles from "./Home.module.css";

/** Floor for the "calculating" moment — long enough to read all three steps in DrawOverlay. */
const MIN_DRAW_MS = 1400;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Home({
  onReady,
  onDrawingChange,
}: {
  onReady: (reading: Reading) => void;
  onDrawingChange: (drawing: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPastNowFuture() {
    setGenerating(true);
    setError(null);
    onDrawingChange(true);
    try {
      const [reading] = await Promise.all([generatePastNowFutureReading(), wait(MIN_DRAW_MS)]);
      onReady(reading);
    } catch {
      setError("Something went wrong drawing your cards. Please try again.");
    } finally {
      setGenerating(false);
      onDrawingChange(false);
    }
  }

  function selectDecision() {
    setSelected((current) => (current === "decision" ? null : "decision"));
  }

  async function submitDecision(a: string, b: string) {
    setGenerating(true);
    setError(null);
    onDrawingChange(true);
    try {
      const [reading] = await Promise.all([generateDecisionReading(a, b), wait(MIN_DRAW_MS)]);
      onReady(reading);
    } catch {
      setError("Something went wrong drawing your cards. Please try again.");
    } finally {
      setGenerating(false);
      onDrawingChange(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <p className={styles.kicker}>unique to this moment</p>
        <h1 className={styles.title}>MomenTarot</h1>
        <p className={styles.kicker}></p>
      </div>

      <div className={styles.modes}>
        {MODES.map((mode) =>
          mode.id === "decision" ? (
            <ModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              active={selected === "decision"}
              disabled={generating}
              onClick={selectDecision}
            />
          ) : (
            <ModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              disabled={generating}
              onClick={startPastNowFuture}
            />
          )
        )}
      </div>

      {selected === "decision" && <DecisionForm onSubmit={submitDecision} submitting={generating} />}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        <RetrieveSeed onRetrieve={onReady} />
      </div>
    </div>
  );
}
