// Stands in for the hosted database the app uses in production. Most calls are answered
// from cache; the rest pay a cross-region round trip, as they do in production.
let state = (Number(process.env.BACKEND_SEED ?? Date.now()) >>> 0) || 1;

function nextRandom() {
  state = (state + 0x6d2b79f5) >>> 0;
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function roundTripMs() {
  return nextRandom() < 0.5 ? 1200 : 40;
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
