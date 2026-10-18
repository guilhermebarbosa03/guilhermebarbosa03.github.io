import type { Project } from "@/content/types";

/*
 * Single source of truth for every `sizes` string used on project images. The components render with
 * them and the background preloader requests with them, so the browser always picks the same srcset
 * candidate and a later render is a cache hit.
 */

/** Images shown on the card itself. The rest are reachable in the zoom view. */
export const MAX_CARD_IMAGES = 3;
const MEDIA_GAP_PX = 8;

/**
 * `sizes` for one card image cell. The offsets are the space around the cells at each breakpoint:
 * page gutters + card border and padding (+ the two side arrows from 768px). From 1024px the
 * card has a fixed maximum width, so the cell width is a plain pixel value.
 */
export function cardSizes(columns: number): string {
  const gaps = (columns - 1) * MEDIA_GAP_PX;
  const cell = (offset: number) => `calc((100vw - ${offset + gaps}px) / ${columns})`;
  return [
    `(max-width: 479px) ${cell(62)}`,
    `(max-width: 767px) ${cell(70)}`,
    `(max-width: 1023px) ${cell(198)}`,
    `${Math.floor((523 - gaps) / columns)}px`,
  ].join(", ");
}

/** How many images of a project appear on the card (and so how many columns the media row has). */
export function cardColumns(project: Project): number {
  return Math.min(project.images.length, MAX_CARD_IMAGES);
}

/**
 * The large image in the zoom view (the stage is ~62% of the viewport from 1024px).
 */
export const ZOOM_MAIN_SIZES = "(min-width: 1024px) 62vw, 100vw";

/** Encoder quality for the zoom image only; must be listed in images.qualities in next.config.ts. */
export const ZOOM_QUALITY = 90;

/** Zoom view thumbnails. */
export const ZOOM_THUMB_SIZES = "96px";

/**
 * `sizes` of the layer that is already cached when the zoom view opens on an image: the card cell's
 * own sizes for images shown on the card, the thumbnail's for the others.
 */
export function zoomMidSizes(project: Project, imageIndex: number): string {
  return imageIndex < MAX_CARD_IMAGES ? cardSizes(cardColumns(project)) : ZOOM_THUMB_SIZES;
}
