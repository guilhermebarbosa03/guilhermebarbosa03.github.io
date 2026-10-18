import { useCallback, useEffect, useRef } from "react";
import type { Project } from "@/content/types";
import { startImagePreloader, type ImagePreloader } from "./imagePreloader";

/**
 * Starts the background image preloader after mount and stops it on unmount. Returns a stable
 * `boost(projectIndex)` that moves a project's zoom images to the front of the queue.
 */
export function useImagePreloader(projects: Project[], activeIndex: number) {
  const preloaderRef = useRef<ImagePreloader | null>(null);
  const activeRef = useRef(activeIndex);
  const lastBoostRef = useRef(-1);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const preloader = startImagePreloader(projects, () => activeRef.current);
    preloaderRef.current = preloader;
    lastBoostRef.current = -1;
    return () => {
      preloader.stop();
      preloaderRef.current = null;
    };
  }, [projects]);

  return useCallback((projectIndex: number) => {
    // Pointer movement fires this constantly; only a change of project does any work
    if (lastBoostRef.current === projectIndex) return;
    lastBoostRef.current = projectIndex;
    preloaderRef.current?.boost(projectIndex);
  }, []);
}
