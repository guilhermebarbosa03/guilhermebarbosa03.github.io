/**
 * Shared timer for the discrete changes in the scenery (sky phase, star twinkle, trees, coin
 * bobbing). Listeners run every TICK_MS while the tab is visible.
 */

export const TICK_MS = 500;

type Listener = (elapsedMs: number) => void;

const listeners = new Set<Listener>();
let timer: number | undefined;
let startedAt: number | undefined;

function tick() {
  // Background tabs: skip the work; elapsed time keeps counting so the cycle resumes where it should be
  if (document.visibilityState === "hidden" || startedAt === undefined) return;
  const elapsed = performance.now() - startedAt;
  for (const listener of listeners) listener(elapsed);
}

/** Calls `listener` right away and then every TICK_MS with the time since the scene started. */
export function subscribeClock(listener: Listener): () => void {
  startedAt ??= performance.now();
  listeners.add(listener);
  if (timer === undefined) timer = window.setInterval(tick, TICK_MS);
  listener(performance.now() - startedAt);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Time since the scene started, for animations that must line up with the clock's timeline. */
export function clockElapsed(): number {
  startedAt ??= performance.now();
  return performance.now() - startedAt;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
