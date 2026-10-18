import { cellsToPath, lcg, rect } from "./pixelArt";

/* Sky art: clouds, sun, moon and stars. Runs on the server only; the client receives finished paths. */

/* Clouds: unions of circles rasterized on a 4px grid, cut flat at the bottom */

type Circle = readonly [cx: number, cy: number, r: number];

interface CloudSpec {
  circles: readonly Circle[];
  /** Row where the flat underside ends. */
  base: number;
  /** How many bottom rows use the shade color. */
  shade: number;
  /** Vertical position, percent of the viewport height. */
  top: number;
  /** Starting horizontal position, percent of the viewport width. */
  left: number;
  /** Drift speed in px per second (left to right). */
  speed: number;
}

const CLOUD_SPECS: readonly CloudSpec[] = [
  { circles: [[7, 9, 4.5], [15, 7, 6.5], [24, 8.5, 5.5], [30, 10.5, 3.5]], base: 13, shade: 2, top: 8, left: 6, speed: 5 },
  { circles: [[6, 7, 4], [13, 5.5, 5.5], [20, 7.5, 4.5]], base: 11, shade: 2, top: 14, left: 60, speed: 7 },
  { circles: [[5, 6, 3.5], [11, 5, 4.5], [16, 6.5, 3]], base: 9, shade: 1, top: 26, left: 36, speed: 9 },
  { circles: [[6, 6, 4], [14, 5, 5], [22, 5.5, 5], [29, 7, 3.5]], base: 10, shade: 2, top: 34, left: 78, speed: 4 },
  { circles: [[4, 6, 3], [9, 4.5, 4], [15, 5.5, 4]], base: 9, shade: 1, top: 38, left: 18, speed: 6 },
  { circles: [[4, 5, 3], [9, 4, 4], [13, 5.5, 3]], base: 8, shade: 1, top: 6, left: 48, speed: 8 },
];

function cloudRows({ circles, base, shade }: CloudSpec): string[] {
  const width = Math.ceil(Math.max(...circles.map(([cx, , r]) => cx + r)));
  const filled = (x: number, y: number) =>
    circles.some(([cx, cy, r]) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r);

  const rows: string[] = [];
  for (let y = 0; y < base; y++) {
    rows.push(Array.from({ length: width }, (_, x) => (filled(x, y) ? "#" : ".")).join(""));
  }

  // The underside is a flat shelf: fill the bottom rows across the cloud's whole span,
  // with the very last row pulled in by one cell so the corners look rounded.
  const used = rows.flatMap((row) => [row.indexOf("#"), row.lastIndexOf("#")]).filter((x) => x >= 0);
  const left = Math.min(...used);
  const right = Math.max(...used);
  for (let y = base - shade - 1; y < base; y++) {
    const inset = y === base - 1 ? 1 : 0;
    rows[y] = [...rows[y]].map((cell, x) => (x >= left + inset && x <= right - inset ? "#" : cell)).join("");
  }
  for (let y = base - shade; y < base; y++) rows[y] = rows[y].replaceAll("#", "o");

  return rows.slice(rows.findIndex((row) => /[#o]/.test(row)));
}

export const CLOUD_UNIT = 4;

export const CLOUDS = CLOUD_SPECS.map((spec) => {
  const rows = cloudRows(spec);
  return {
    width: rows[0].length,
    height: rows.length,
    body: cellsToPath(rows, "#"),
    shade: cellsToPath(rows, "o"),
    top: spec.top,
    left: spec.left,
    speed: spec.speed,
  };
});

/* Sun: 17x17 cells at 4px. Disc with a darker rim and stepped rays in the 8 directions. */

export const SUN_CELLS = 17;
export const CELL = 4;

function sunRows(): string[] {
  const c = 8;
  return Array.from({ length: SUN_CELLS }, (_, y) =>
    Array.from({ length: SUN_CELLS }, (_, x) => {
      const dx = Math.abs(x - c);
      const dy = Math.abs(y - c);
      const d2 = dx * dx + dy * dy;
      if (d2 <= 21) return d2 >= 14 ? "o" : "y";
      if ((dx === 0 || dy === 0) && Math.max(dx, dy) >= 6) return "o";
      if (dx === dy && dx >= 5 && dx <= 6) return "o";
      return ".";
    }).join(""),
  );
}

const SUN_ROWS = sunRows();
export const SUN = { core: cellsToPath(SUN_ROWS, "y"), edge: cellsToPath(SUN_ROWS, "o") };

/* Moon: a crescent cut out of a disc, 15x15 cells at 4px */

export const MOON_CELLS = 15;

function moonRows(): string[] {
  return Array.from({ length: MOON_CELLS }, (_, y) =>
    Array.from({ length: MOON_CELLS }, (_, x) => {
      const inDisc = (x + 0.5 - 7.5) ** 2 + (y + 0.5 - 7.5) ** 2 <= 6.6 ** 2;
      const inCut = (x + 0.5 - 11) ** 2 + (y + 0.5 - 5) ** 2 <= 5.8 ** 2;
      return inDisc && !inCut ? "m" : ".";
    }).join(""),
  );
}

export const MOON = { body: cellsToPath(moonRows(), "m") };

/* Stars: scattered over the top 60% of the viewport. Positions are percentages of the star layer. */

export interface Star {
  x: string;
  y: string;
  size: number;
  plus: boolean;
  twinkle: boolean;
}

function makeStars(count: number): Star[] {
  const random = lcg(2024);
  return Array.from({ length: count }, (_, i) => {
    const plus = i % 7 === 3;
    return {
      x: `${(2 + random() * 95).toFixed(1)}%`,
      y: `${(3 + random() * 92).toFixed(1)}%`,
      size: plus ? 0 : 2 + Math.floor(random() * 3),
      plus,
      twinkle: i % 3 === 0,
    };
  });
}

export const STARS = makeStars(30);

/** 3x3 plus drawn with 2px cells. */
export const STAR_PLUS = rect(2, 0, 2, 6) + rect(0, 2, 6, 2);
