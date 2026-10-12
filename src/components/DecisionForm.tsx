import { useState } from "react";
import { MAX_DECISION_CHARS } from "../engine/readingCode";
import styles from "./DecisionForm.module.css";

export function DecisionForm({ onSubmit, submitting }: { onSubmit: (a: string, b: string) => void; submitting: boolean }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmedA = a.trim();
  const trimmedB = b.trim();
  const valid = trimmedA.length > 0 && trimmedB.length > 0;
  const sameText = valid && trimmedA.toLowerCase() === trimmedB.toLowerCase();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || submitting) return;
    onSubmit(trimmedA, trimmedB);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Decision A</span>
        <input
          className={styles.input}
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Stay at my current job"
          maxLength={MAX_DECISION_CHARS}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Decision B</span>
        <input
          className={styles.input}
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Accept the new offer"
          maxLength={MAX_DECISION_CHARS}
        />
      </label>

      <div className={styles.footer}>
        <div className={styles.hint} aria-live="polite">
          {touched && !valid && "Both decisions are required."}
          {sameText && "Both decisions read the same, the reading will still work."}
        </div>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Drawing…" : "Reveal cards"}
        </button>
      </div>
    </form>
  );
}
