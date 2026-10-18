import { cellsToPath } from "./pixelArt";

/** Bit coin: 9x9 pixel octagon with a 3x5 binary digit. Render with viewBox "0 0 9 9" at an integer scale. */
export const COIN_GRID = 9;

const BODY = [
  "..#####..",
  ".#lllgg#.",
  "#lgggggd#",
  "#lgggggd#",
  "#lgggggd#",
  "#lgggggd#",
  "#lgggggd#",
  ".#ddddd#.",
  "..#####..",
];

const DIGITS = {
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": [".#.", "##.", ".#.", ".#.", "###"],
} as const;

export type CoinDigit = keyof typeof DIGITS;

export interface CoinPaths {
  ink: string;
  gold: string;
  light: string;
  dark: string;
}

function build(digit: CoinDigit): CoinPaths {
  const rows = BODY.map((row) => [...row]);
  DIGITS[digit].forEach((line, dy) => {
    [...line].forEach((cell, dx) => {
      if (cell === "#") rows[2 + dy][3 + dx] = "#";
    });
  });
  const art = rows.map((row) => row.join(""));
  return {
    ink: cellsToPath(art, "#"),
    gold: cellsToPath(art, "g"),
    light: cellsToPath(art, "l"),
    dark: cellsToPath(art, "d"),
  };
}

export const COIN_ART: Record<CoinDigit, CoinPaths> = { "0": build("0"), "1": build("1") };
