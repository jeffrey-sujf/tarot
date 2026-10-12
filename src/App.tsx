import { useEffect, useState } from "react";
import { Home } from "./components/Home/Home";
import { ReadingView } from "./components/Reading/ReadingView";
import { reconstructReading } from "./state/readingStore";
import type { Reading } from "./engine/reading";

function readSeedFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("seed");
}

function setSeedInUrl(seed: string | null) {
  const url = new URL(window.location.href);
  if (seed) url.searchParams.set("seed", seed);
  else url.searchParams.delete("seed");
  window.history.replaceState({}, "", url.toString());
}

export default function App() {
  const [reading, setReading] = useState<Reading | null>(null);

  useEffect(() => {
    const seed = readSeedFromUrl();
    if (!seed) return;
    const result = reconstructReading(seed);
    if (result.ok) setReading(result.reading);
  }, []);

  function handleReady(next: Reading) {
    setReading(next);
    setSeedInUrl(next.seed);
  }

  function handleStartOver() {
    setReading(null);
    setSeedInUrl(null);
  }

  return reading ? <ReadingView reading={reading} onStartOver={handleStartOver} /> : <Home onReady={handleReady} />;
}
