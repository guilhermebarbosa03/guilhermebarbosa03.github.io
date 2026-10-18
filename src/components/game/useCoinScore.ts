import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gb-portfolio-coins";

/*
 * The score lives in a tiny module-level store so it works even when localStorage is unavailable.
 * useSyncExternalStore gives the server (and the hydration pass) a score of 0 and applies the
 * stored value right after, which avoids a hydration mismatch.
 */
let score = 0;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isSafeInteger(stored) && stored > 0) score = stored;
  } catch {
    // Storage blocked: keep counting in memory
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  load();
  return score;
}

function getServerSnapshot() {
  return 0;
}

export function addCoinToScore() {
  load();
  score += 1;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // Storage blocked or full: the in-memory score still counts
  }
  for (const listener of listeners) listener();
}

export function useCoinScore(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
