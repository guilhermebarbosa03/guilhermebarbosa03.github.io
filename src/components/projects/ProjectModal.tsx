"use client";

import Image from "next/image";
import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { Tag } from "@/components/ui/Tag";
import type { Project, ProjectImage, UiStrings } from "@/content/types";
import { fill } from "@/lib/format";
import { whenIdle } from "./idle";
import { ZOOM_MAIN_SIZES, ZOOM_QUALITY, ZOOM_THUMB_SIZES, zoomMidSizes } from "./imageSizes";
import { ImageFrame } from "./ImageFrame";
import { PixelImage } from "./PixelImage";
import { PixelPlaceholder } from "./PixelPlaceholder";
import styles from "./ProjectModal.module.css";
import { useScrollLock } from "./useScrollLock";
import { wrapIndex } from "./wrapIndex";

type Labels = UiStrings["projects"];

interface ProjectModalProps {
  /** The project to show, or null while the zoom view is closed. */
  project: Project | null;
  imageIndex: number;
  labels: Labels;
  onImageChange: (index: number) => void;
  /** Moves the zoom view to the previous (-1) or next (1) project. */
  onProjectStep: (delta: number) => void;
  onClose: () => void;
}

/** Zoom view: a native modal <dialog> with the project's images on one side and its full story on the other. */
export function ProjectModal({ project, imageIndex, labels, onImageChange, onProjectStep, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdropRef = useRef(false);
  const titleId = useId();
  const open = project !== null;
  const imageCount = project?.images.length ?? 0;

  useScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const closeDialog = () => dialogRef.current?.close();

  // Tracking where the press began keeps a text selection that ends on the backdrop from closing the view
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressedBackdropRef.current = event.target === event.currentTarget;
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const pressedBackdrop = pressedBackdropRef.current;
    pressedBackdropRef.current = false;
    if (pressedBackdrop && event.target === event.currentTarget) closeDialog();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (imageCount < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onImageChange(wrapIndex(imageIndex - 1, imageCount));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onImageChange(wrapIndex(imageIndex + 1, imageCount));
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {project && (
        <>
          <PixelButton
            className={styles.projectPrev}
            variant="secondary"
            icon="arrow-left"
            iconOnly
            onClick={() => onProjectStep(-1)}
          >
            {labels.previous}
          </PixelButton>

          <div className={styles.box}>
            {/* Zero-height sticky row: the button stays reachable while the content scrolls */}
            <div className={styles.closeSlot}>
              <PixelButton className={styles.close} variant="secondary" icon="close" iconOnly onClick={closeDialog}>
                {labels.close}
              </PixelButton>
            </div>

            <div className={styles.frame}>
              <Gallery project={project} imageIndex={imageIndex} labels={labels} onImageChange={onImageChange} />
              <Details project={project} titleId={titleId} labels={labels} />
            </div>
          </div>

          <PixelButton
            className={styles.projectNext}
            variant="secondary"
            icon="arrow-right"
            iconOnly
            onClick={() => onProjectStep(1)}
          >
            {labels.next}
          </PixelButton>
        </>
      )}
    </dialog>
  );
}

interface GalleryProps {
  project: Project;
  imageIndex: number;
  labels: Labels;
  onImageChange: (index: number) => void;
}

function Gallery({ project, imageIndex, labels, onImageChange }: GalleryProps) {
  const { images } = project;
  const viewerRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = imageIndex < count ? imageIndex : 0;
  const image = images[current];
  const hasMany = count > 1;

  // The visible image plus its two neighbors stay mounted, so stepping to a neighbor reveals a layer
  // that has already loaded and decoded instead of starting a new request
  const mounted = [...new Set([current, wrapIndex(current + 1, count), wrapIndex(current - 1, count)])].sort(
    (a, b) => a - b,
  );

  // Decode the hidden neighbors while the browser is idle
  useEffect(() => {
    return whenIdle(() => {
      for (const img of viewerRef.current?.querySelectorAll<HTMLImageElement>('[data-active="false"] img') ?? []) {
        img.decode().catch(() => {});
      }
    }, 1000);
  }, [current, count]);

  if (!image) return null;

  return (
    <div className={styles.gallery}>
      <figure className={styles.figure}>
        <div ref={viewerRef} className={styles.viewer}>
          {mounted.map((index) => (
            <ZoomLayer
              key={`${project.id}:${index}`}
              project={project}
              image={images[index]}
              imageIndex={index}
              active={index === current}
            />
          ))}
          {hasMany && (
            <>
              <PixelButton
                className={`${styles.arrow} ${styles.arrowPrev}`}
                variant="secondary"
                size="sm"
                icon="arrow-left"
                iconOnly
                onClick={() => onImageChange(wrapIndex(current - 1, count))}
              >
                {labels.previousImage}
              </PixelButton>
              <PixelButton
                className={`${styles.arrow} ${styles.arrowNext}`}
                variant="secondary"
                size="sm"
                icon="arrow-right"
                iconOnly
                onClick={() => onImageChange(wrapIndex(current + 1, count))}
              >
                {labels.nextImage}
              </PixelButton>
            </>
          )}
        </div>
        <figcaption className={styles.caption} aria-live="polite">
          <span>{image.alt}</span>
          <span className={styles.counter}>{fill(labels.imageCounter, { n: current + 1, total: count })}</span>
        </figcaption>
      </figure>

      {hasMany && (
        <ul role="list" className={styles.thumbs}>
          {images.map((thumb, index) => (
            <li key={thumb.src.src}>
              <button
                type="button"
                className={styles.thumb}
                aria-label={thumb.alt}
                aria-current={index === current ? "true" : undefined}
                onClick={() => onImageChange(index)}
              >
                <span className={styles.thumbImage}>
                  <PixelImage
                    src={thumb.src}
                    alt=""
                    sizes={ZOOM_THUMB_SIZES}
                    loading="eager"
                    fetchPriority="low"
                    className={styles.image}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ZoomLayerProps {
  project: Project;
  image: ProjectImage;
  imageIndex: number;
  active: boolean;
}

/**
 * One image of the stage, painted in three stacked layers with the same object-fit so they align:
 * pixel mosaic, then a mid-resolution version that is already cached (same `sizes` as the card cell
 * or the thumbnail it came from), then the full image. Whatever has loaded shows through the rest.
 */
function ZoomLayer({ project, image, imageIndex, active }: ZoomLayerProps) {
  return (
    // alt is empty on purpose: the caption below carries the description and is announced on change
    <div className={styles.layer} data-active={active} aria-hidden={active ? undefined : true}>
      <ImageFrame image={image.src}>
        <PixelPlaceholder image={image.src} />
        <Image
          src={image.src}
          alt=""
          fill
          sizes={zoomMidSizes(project, imageIndex)}
          loading="eager"
          fetchPriority={active ? "auto" : "low"}
          className={styles.image}
        />
        <Image
          src={image.src}
          alt=""
          fill
          sizes={ZOOM_MAIN_SIZES}
          quality={ZOOM_QUALITY}
          loading="eager"
          fetchPriority={active ? "high" : "low"}
          className={styles.image}
        />
      </ImageFrame>
    </div>
  );
}

interface DetailsProps {
  project: Project;
  titleId: string;
  labels: Labels;
}

function Details({ project, titleId, labels }: DetailsProps) {
  return (
    <div className={styles.info}>
      <h2 id={titleId} className={styles.title}>
        {project.title}
      </h2>
      <p className={styles.context}>{project.context}</p>
      <p className={styles.summary}>{project.summary}</p>

      <div className={styles.block}>
        <h3 className={styles.blockTitle}>{labels.detailsTitle}</h3>
        <ul role="list" className={styles.details}>
          {project.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>

      <div className={styles.block}>
        <h3 className={styles.blockTitle}>{labels.skillsTitle}</h3>
        <ul role="list" className={styles.skills}>
          {project.skills.map((skill) => (
            <li key={skill.id}>
              <Tag label={skill.label} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
