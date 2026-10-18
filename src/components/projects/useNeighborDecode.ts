import { useEffect, type RefObject } from "react";
import { whenIdle } from "./idle";
import { wrapIndex } from "./wrapIndex";

/**
 * Decodes the images of the next and previous slides ahead of time (once after mount, then whenever the
 * active slide changes), so switching never shows a decode flash. `container` holds the slides as
 * direct children, in order.
 */
export function useNeighborDecode(container: RefObject<HTMLElement | null>, activeIndex: number, total: number) {
  useEffect(() => {
    return whenIdle(() => {
      const slides = container.current?.children;
      if (!slides || total < 2) return;
      const neighbors = new Set([wrapIndex(activeIndex + 1, total), wrapIndex(activeIndex - 1, total)]);
      neighbors.delete(activeIndex);
      for (const index of neighbors) {
        for (const img of slides[index]?.querySelectorAll("img") ?? []) {
          img.decode().catch(() => {});
        }
      }
    }, 1000);
  }, [container, activeIndex, total]);
}
