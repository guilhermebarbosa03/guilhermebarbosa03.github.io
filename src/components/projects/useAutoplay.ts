import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
} from "react";

/** How long each project stays on screen while autoplay runs. */
export const AUTOPLAY_MS = 8000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/*
 * Browser-only values are read through useSyncExternalStore: the server snapshot is always `false`,
 * so the first client render matches the server HTML and the real value is applied right after hydration.
 */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getPageHidden() {
  return document.visibilityState === "hidden";
}

function getServerFalse() {
  return false;
}

/** Only keyboard (or assistive tech) focus should pause autoplay. A mouse click leaves focus on a button for good. */
function isKeyboardFocus(target: EventTarget) {
  if (!(target instanceof Element)) return false;
  try {
    return target.matches(":focus-visible");
  } catch {
    return true;
  }
}

interface UseAutoplayOptions {
  /** Called when the countdown ends. */
  onAdvance: () => void;
  /** Must change on every navigation, manual or automatic, so the countdown starts over. */
  restartKey: number;
  /** True while something else (the zoom view) needs the carousel to stay still. */
  suspended: boolean;
}

/**
 * Countdown that advances the carousel. It runs only when nothing asks for calm:
 * the user toggle, a mouse over the carousel, keyboard focus inside it, a hidden tab,
 * the zoom view, or reduced-motion preference (which starts the toggle in "paused").
 */
export function useAutoplay({ onAdvance, restartKey, suspended }: UseAutoplayOptions) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerFalse);
  const pageHidden = useSyncExternalStore(subscribeVisibility, getPageHidden, getServerFalse);
  // null = the user has not chosen yet, so the system preference decides
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const paused = userPaused ?? reducedMotion;
  const running = !paused && !hovering && !focusWithin && !suspended && !pageHidden;

  const advanceRef = useRef(onAdvance);
  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => advanceRef.current(), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [running, restartKey]);

  const togglePaused = useCallback(() => setUserPaused(!paused), [paused]);

  /** Spread on the carousel root. */
  const interactionProps = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      // Touch "hover" ends with the tap, so it never counts as a reason to pause
      if (event.pointerType !== "touch") setHovering(true);
    },
    onPointerLeave: () => setHovering(false),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (isKeyboardFocus(event.target)) setFocusWithin(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
    },
  };

  return { paused, running, togglePaused, interactionProps };
}
