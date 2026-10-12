/**
 * Deterministic seeded PRNG. Given the same numeric seed, `mulberry32`
 * always produces the same sequence — this is the only randomness source
 * used once a reading's seed has been established.
 */

// xmur3: hashes an arbitrary string into a 32-bit seed for mulberry32.
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Creates a reproducible RNG (0..1) from an arbitrary seed string. */
export function createRng(seedString: string): Rng {
  const hashSeed = xmur3(seedString)();
  return mulberry32(hashSeed);
}

export function randomInt(rng: Rng, maxExclusive: number): number {
  return Math.floor(rng() * maxExclusive);
}
