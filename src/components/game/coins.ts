import { COIN_GRID, type CoinDigit } from "@/components/scene/coinArt";
import { findSpot, isFree, pageBand, type Box, type Layout } from "./placement";

export type CoinSize = "big" | "medium" | "small";

/** Screen pixels per art pixel. */
export const COIN_SCALE: Record<CoinSize, number> = { big: 6, medium: 4, small: 2 };

export const coinPixels = (size: CoinSize) => COIN_SCALE[size] * COIN_GRID;

export interface Coin {
  id: number;
  size: CoinSize;
  digit: CoinDigit;
  /** Top-left corner in document coordinates. */
  x: number;
  y: number;
}

export type CoinCounts = Record<CoinSize, number>;

// Biggest first: they are the hardest to fit, so they get the first pick of free space
const SIZES: readonly CoinSize[] = ["big", "medium", "small"];

export function countsForWidth(width: number): CoinCounts {
  if (width >= 1440) return { big: 4, medium: 2, small: 6 };
  if (width >= 1024) return { big: 2, medium: 2, small: 4 };
  return { big: 0, medium: 1, small: 4 };
}

export function digitFor(id: number): CoinDigit {
  return id % 2 === 0 ? "1" : "0";
}

export function coinBox(coin: Coin): Box {
  const size = coinPixels(coin.size);
  return { x: coin.x, y: coin.y, w: size, h: size };
}

/**
 * Brings `current` in line with `counts` and the page as it is now: surplus coins are dropped,
 * coins that no longer fit move silently to a free spot, and missing coins are added.
 * Returns `current` itself when nothing changed, so React can skip the render.
 */
export function reconcile(
  current: readonly Coin[],
  counts: CoinCounts,
  layout: Layout,
  nextId: () => number,
): readonly Coin[] {
  const result: Coin[] = [];
  const boxes: Box[] = [];
  const keep = (coin: Coin) => {
    result.push(coin);
    boxes.push(coinBox(coin));
  };

  for (const size of SIZES) {
    const px = coinPixels(size);
    const existing = current.filter((coin) => coin.size === size).slice(0, counts[size]);

    for (const coin of existing) {
      if (isFree(layout, coinBox(coin), boxes)) {
        keep(coin);
        continue;
      }
      const spot = findSpot(layout, px, boxes);
      if (spot) keep({ ...coin, ...spot });
    }

    for (let slot = existing.length; slot < counts[size]; slot++) {
      const band = pageBand(layout, px, slot, counts[size]);
      const spot = findSpot(layout, px, boxes, { yRange: band }) ?? findSpot(layout, px, boxes);
      if (!spot) continue;
      const id = nextId();
      keep({ id, size, digit: digitFor(id), ...spot });
    }
  }

  const unchanged = result.length === current.length && result.every((coin, i) => coin === current[i]);
  return unchanged ? current : result;
}
