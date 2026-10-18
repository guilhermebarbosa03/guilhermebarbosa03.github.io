/*
 * Free-space search for the coin game. Everything here works in DOCUMENT coordinates
 * (viewport rect + scroll offset), because coins are absolutely positioned against the page.
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Point {
  x: number;
  y: number;
}

/** Everything the search needs to know about the page at one moment. */
export interface Layout {
  obstacles: Box[];
  /** Usable page width (excludes the scrollbar). */
  width: number;
  /** Full document height. */
  height: number;
  /** Highest allowed top edge for a coin: below the sticky header. */
  minY: number;
}

export interface SpotOptions {
  /** Allowed range for the coin's top edge, as [min, max]. Clamped to the page bounds. */
  yRange?: readonly [number, number];
  /** Keep the coin's centre at least `distance` px from this point. */
  avoid?: Point & { distance: number };
}

const OBSTACLE_PAD = 12;
const COIN_GAP = 24;
const EDGE = 8;
const HEADER_GAP = 16;
const RANDOM_TRIES = 120;
const GRID_STEP = 16;

const SOLID_TAGS = new Set(["img", "svg", "button", "a", "input", "video"]);

function isTransparent(color: string) {
  return color === "transparent" || color === "rgba(0, 0, 0, 0)";
}

function paintsBox(style: CSSStyleDeclaration) {
  return (
    !isTransparent(style.backgroundColor) ||
    style.backgroundImage !== "none" ||
    parseFloat(style.borderTopWidth) > 0 ||
    parseFloat(style.borderRightWidth) > 0 ||
    parseFloat(style.borderBottomWidth) > 0 ||
    parseFloat(style.borderLeftWidth) > 0
  );
}

/**
 * Reads the DOM once: obstacles plus page limits. Called only when a placement is needed,
 * never per tick, because it forces layout and computes styles for the whole content.
 */
export function measureLayout(): Layout {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const obstacles: Box[] = [];

  // Takes a viewport rectangle and stores it in document coordinates
  const push = (left: number, top: number, width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    obstacles.push({ x: left + scrollX, y: top + scrollY, w: width, h: height });
  };
  const pushRect = (rect: DOMRect) => push(rect.left, rect.top, rect.width, rect.height);

  let minY = 0;
  const header = document.querySelector("header");
  if (header) {
    const rect = header.getBoundingClientRect();
    // The header is sticky, so its rectangle follows the scroll. What matters is the strip it
    // occupies at the top of the document, so anchor sticky/fixed headers at the document top.
    const position = getComputedStyle(header).position;
    const top = position === "sticky" || position === "fixed" ? -scrollY : rect.top;
    push(rect.left, top, rect.width, rect.height);
    minY = top + scrollY + rect.height + HEADER_GAP;
  }

  const range = document.createRange();
  for (const el of document.querySelectorAll("main *, footer *")) {
    // Children of an <svg> are part of its picture; the <svg> box itself is the obstacle
    if (el instanceof SVGElement && el.localName !== "svg") continue;
    const style = getComputedStyle(el);
    // Fixed layers (modals) do not move with the document, so their rect is not a document position
    if (style.position === "fixed") continue;

    if (SOLID_TAGS.has(el.localName) || paintsBox(style)) {
      pushRect(el.getBoundingClientRect());
      continue;
    }

    // Bare text on the sky has no box of its own, so measure the glyphs themselves
    for (const node of el.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) pushRect(rect);
    }
  }

  return {
    obstacles,
    width: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
    minY,
  };
}

function overlaps(a: Box, b: Box, pad: number) {
  return a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
}

function limits(layout: Layout, size: number) {
  return {
    minX: EDGE,
    maxX: layout.width - size - EDGE,
    minY: layout.minY,
    maxY: layout.height - size - EDGE,
  };
}

/** True when `box` is inside the page limits, clear of every obstacle and at least 24px from the other coins. */
export function isFree(layout: Layout, box: Box, others: readonly Box[]): boolean {
  const { minX, maxX, minY, maxY } = limits(layout, box.w);
  if (box.x < minX || box.x > maxX || box.y < minY || box.y > maxY) return false;
  return !layout.obstacles.some((o) => overlaps(box, o, OBSTACLE_PAD)) && !others.some((o) => overlaps(box, o, COIN_GAP));
}

function farEnough(x: number, y: number, size: number, avoid: SpotOptions["avoid"]) {
  if (!avoid) return true;
  return Math.hypot(x + size / 2 - avoid.x, y + size / 2 - avoid.y) >= avoid.distance;
}

/** Random candidates first, then a coarse grid scan. Returns null when the page has no room left. */
export function findSpot(layout: Layout, size: number, others: readonly Box[], options: SpotOptions = {}): Point | null {
  const { minX, maxX, minY, maxY } = limits(layout, size);
  const top = Math.max(minY, options.yRange?.[0] ?? minY);
  const bottom = Math.min(maxY, options.yRange?.[1] ?? maxY);
  if (maxX < minX || bottom < top) return null;

  const accepts = (x: number, y: number) =>
    farEnough(x, y, size, options.avoid) && isFree(layout, { x, y, w: size, h: size }, others);

  for (let i = 0; i < RANDOM_TRIES; i++) {
    const x = Math.round(minX + Math.random() * (maxX - minX));
    const y = Math.round(top + Math.random() * (bottom - top));
    if (accepts(x, y)) return { x, y };
  }

  for (let y = top; y <= bottom; y += GRID_STEP) {
    for (let x = minX; x <= maxX; x += GRID_STEP) {
      if (accepts(x, y)) return { x, y };
    }
  }
  return null;
}

/** The slice of the page height reserved for coin number `slot` of `count`, so a group spreads over the whole page. */
export function pageBand(layout: Layout, size: number, slot: number, count: number): readonly [number, number] {
  const { minY, maxY } = limits(layout, size);
  const span = maxY - minY;
  return [minY + (span * slot) / count, minY + (span * (slot + 1)) / count];
}
