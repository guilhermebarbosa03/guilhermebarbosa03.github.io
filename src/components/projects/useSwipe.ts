import { useRef, type MouseEvent, type PointerEvent } from "react";

/** Horizontal distance that counts as a deliberate swipe. */
const SWIPE_THRESHOLD_PX = 48;
/** The gesture must be clearly more horizontal than vertical, so page scrolling never triggers it. */
const HORIZONTAL_BIAS = 1.5;

/**
 * Pointer-based swipe for touch and pen. The element needs `touch-action: pan-y` in CSS
 * so the browser keeps handling vertical scrolling and leaves horizontal moves to us.
 * `onSwipe(1)` means "next" (finger moved left), `onSwipe(-1)` means "previous".
 */
export function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const start = useRef<{ id: number; x: number; y: number } | null>(null);
  const swiped = useRef(false);

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      swiped.current = false;
      // Mouse drags are left alone so text selection keeps working
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      start.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      start.current = null;
      if (!origin || origin.id !== event.pointerId) return;

      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy) * HORIZONTAL_BIAS) return;

      swiped.current = true;
      onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel() {
      start.current = null;
    },
    /** A swipe that ends over the same button would otherwise also "click" it and open the zoom view. */
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (!swiped.current) return;
      swiped.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
