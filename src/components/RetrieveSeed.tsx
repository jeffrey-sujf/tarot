import { useState } from "react";
import { reconstructReading } from "../state/readingStore";
import type { Reading } from "../engine/reading";
import styles from "./RetrieveSeed.module.css";

const ERROR_COPY: Record<string, string> = {
  malformed: "That doesn't look like a valid reading seed.",
  "unsupported-version": "This seed is from an unsupported version.",
  corrupt: "This seed couldn't be read: it may be incomplete.",
};

export function RetrieveSeed({ onRetrieve }: { onRetrieve: (reading: Reading) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const result = reconstructReading(value);
    if (result.ok) {
      setError(null);
      onRetrieve(result.reading);
    } else {
      setError(ERROR_COPY[result.reason] ?? "Couldn't read that seed.");
    }
  }

  if (!open) {
    return (
      <button type="button" className={styles.reveal} onClick={() => setOpen(true)}>
        Retrieve a reading
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="seed-input">
        Enter reading seed
      </label>
      <div className={styles.row}>
        <input
          id="seed-input"
          className={styles.input}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="TRT2-xxxx-xxxx"
          autoFocus
        />
        <button type="submit" className={styles.submit}>
          Open
        </button>
      </div>
      <div className={styles.error} aria-live="polite">
        {error}
      </div>
    </form>
  );
}
