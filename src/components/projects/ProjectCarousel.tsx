"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { Panel } from "@/components/ui/Panel";
import { PixelButton } from "@/components/ui/PixelButton";
import type { Project, UiStrings } from "@/content/types";
import { fill } from "@/lib/format";
import styles from "./ProjectCarousel.module.css";
import { ProjectModal } from "./ProjectModal";
import { ProjectSlide } from "./ProjectSlide";
import { useAutoplay } from "./useAutoplay";
import { useImagePreloader } from "./useImagePreloader";
import { useNeighborDecode } from "./useNeighborDecode";
import { useProjectHash } from "./useProjectHash";
import { useSwipe } from "./useSwipe";
import { wrapIndex } from "./wrapIndex";

interface ProjectCarouselProps {
  projects: Project[];
  labels: UiStrings["projects"];
}

interface ZoomState {
  projectIndex: number;
  imageIndex: number;
}

export function ProjectCarousel({ projects, labels }: ProjectCarouselProps) {
  const total = projects.length;
  // `stamp` changes on every navigation, even back to the same index, so autoplay always restarts its countdown
  const [nav, setNav] = useState({ index: 0, stamp: 0 });
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const zoomTriggerRef = useRef<HTMLElement | null>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (target: number) => setNav((current) => ({ index: wrapIndex(target, total), stamp: current.stamp + 1 })),
    [total],
  );
  const step = useCallback(
    (delta: number) =>
      setNav((current) => ({ index: wrapIndex(current.index + delta, total), stamp: current.stamp + 1 })),
    [total],
  );
  const advance = useCallback(() => step(1), [step]);

  const autoplay = useAutoplay({ onAdvance: advance, restartKey: nav.stamp, suspended: zoom !== null });
  const swipe = useSwipe(step);
  useProjectHash(projects, goTo);
  useNeighborDecode(slidesRef, nav.index, total);
  const boostImages = useImagePreloader(projects, nav.index);

  // One delegated listener instead of per-slide handlers: hovering or focusing a card image or summary
  // moves that project's zoom images to the front of the preload queue, without re-rendering any slide
  const handleIntent = useCallback(
    (event: SyntheticEvent) => {
      if (!(event.target instanceof Element)) return;
      const value = event.target.closest("[data-intent]")?.getAttribute("data-intent");
      if (value !== null && value !== undefined) boostImages(Number(value));
    },
    [boostImages],
  );

  const openZoom = useCallback((projectIndex: number, imageIndex: number, trigger: HTMLElement) => {
    zoomTriggerRef.current = trigger;
    setZoom({ projectIndex, imageIndex });
  }, []);

  const closeZoom = useCallback(() => {
    setZoom(null);
    zoomTriggerRef.current?.focus({ preventScroll: true });
  }, []);

  const changeZoomImage = useCallback(
    (imageIndex: number) => setZoom((current) => (current ? { ...current, imageIndex } : current)),
    [],
  );

  const stepZoomProject = useCallback(
    (delta: number) =>
      setZoom((current) =>
        current ? { projectIndex: wrapIndex(current.projectIndex + delta, total), imageIndex: 0 } : current,
      ),
    [total],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const activeProject = projects[nav.index];
  const status = `${fill(labels.slideStatus, { n: nav.index + 1, total })}: ${activeProject.title}`;
  const zoomProject = zoom ? projects[zoom.projectIndex] : null;

  return (
    <>
      <div className={styles.carousel} onKeyDown={handleKeyDown} {...autoplay.interactionProps}>
        <PixelButton className={styles.prev} variant="secondary" icon="arrow-left" iconOnly onClick={() => step(-1)}>
          {labels.previous}
        </PixelButton>

        <Panel className={styles.card} {...swipe}>
          <div ref={slidesRef} className={styles.slides} onPointerOver={handleIntent} onFocus={handleIntent}>
            {projects.map((project, index) => (
              <ProjectSlide
                key={project.id}
                project={project}
                index={index}
                total={total}
                active={index === nav.index}
                eager={index === 0}
                labels={labels}
                onOpen={openZoom}
              />
            ))}
          </div>
        </Panel>

        <PixelButton className={styles.next} variant="secondary" icon="arrow-right" iconOnly onClick={() => step(1)}>
          {labels.next}
        </PixelButton>

        <div className={styles.status}>
          <ul role="list" className={styles.dots}>
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={styles.dot}
                  aria-label={fill(labels.goTo, { n: index + 1, title: project.title })}
                  aria-current={index === nav.index ? "true" : undefined}
                  onClick={() => goTo(index)}
                >
                  <span className={styles.dotOutline} aria-hidden="true">
                    <span className={styles.dotFill} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.tools}>
            <PixelButton
              variant="secondary"
              size="sm"
              icon={autoplay.paused ? "play" : "pause"}
              iconOnly
              onClick={autoplay.togglePaused}
            >
              {autoplay.paused ? labels.play : labels.pause}
            </PixelButton>
            <span className={styles.counter} aria-hidden="true">
              {nav.index + 1} / {total}
            </span>
          </div>
        </div>

        {/* Silent while autoplay runs; announces manual changes */}
        <div className="visually-hidden" aria-live={autoplay.running ? "off" : "polite"} aria-atomic="true">
          {status}
        </div>
      </div>

      <ProjectModal
        project={zoomProject}
        imageIndex={zoom?.imageIndex ?? 0}
        labels={labels}
        onImageChange={changeZoomImage}
        onProjectStep={stepZoomProject}
        onClose={closeZoom}
      />
    </>
  );
}
