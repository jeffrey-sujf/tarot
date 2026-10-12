import { useState } from "react";
import type { Reading } from "../../engine/reading";
import { cardByIndex } from "../../data/cards";
import { copyToClipboard } from "../../utils/clipboard";
import { renderReadingImage, downloadBlob } from "../../export/exportImage";
import styles from "./ReadingActions.module.css";

export function ReadingActions({ reading }: { reading: Reading }) {
  const [toast, setToast] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast((current) => (current === message ? null : current)), 2200);
  }

  async function handleCopy() {
    const ok = await copyToClipboard(reading.seed);
    showToast(ok ? "Seed copied" : "Couldn't copy: seed shown above");
  }

  async function handleExport() {
    setExporting(true);
    try {
      const cards = reading.cards.map((c) => ({
        card: cardByIndex(c.cardIndex),
        orientation: c.orientation,
        label: c.label,
      }));
      const blob = await renderReadingImage(cards, reading.seed, reading.createdAt);
      downloadBlob(blob, `tarot-reading-${reading.seed.replace(/^TRT\d+-/, "")}.png`);
    } catch {
      showToast("Couldn't export image");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.seedRow}>
        <span className={styles.seedLabel}>Reading seed</span>
        <code className={styles.seed}>{reading.seed}</code>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} onClick={handleCopy}>
          Copy seed
        </button>
        <button type="button" className={styles.actionButton} onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export image"}
        </button>
      </div>

      <div className={styles.toastSlot} aria-live="polite">
        {toast && <span className={styles.toast}>{toast}</span>}
      </div>
    </div>
  );
}
