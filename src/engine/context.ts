/**
 * Local, privacy-conscious context used only to seed a *new* reading.
 * None of this raw data is ever embedded in a shareable reading code —
 * see readingCode.ts, which only encodes the drawn result.
 */

const ANON_ID_KEY = "tarot.anonId";

/** A random, locally generated id — never sent anywhere, never fingerprinted. */
export function getAnonId(): string {
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to a
    // session-only random value so the app still works.
    return crypto.randomUUID();
  }
}

export interface CoarseLocation {
  /** Rounded to ~1 decimal degree (~11km) — never exact. */
  lat: number;
  lon: number;
}

/**
 * Best-effort, low-accuracy geolocation with a short timeout. Resolves to
 * `null` on denial, timeout, or any error — callers must work without it.
 */
export function getApproximateLocation(): Promise<CoarseLocation | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    const timer = setTimeout(() => resolve(null), 2500);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          lat: Math.round(pos.coords.latitude * 10) / 10,
          lon: Math.round(pos.coords.longitude * 10) / 10,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 300000 }
    );
  });
}

/** Collapses whitespace and case so trivial typing differences don't change the seed. */
export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}
