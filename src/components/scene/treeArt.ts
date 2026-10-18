import { cellsToPath } from "./pixelArt";

/*
 * Tree art. Every tree has six drawn stages (1 sprout, 2 and 3 sapling, 4 and 5 young, 6 full) that are pre-rendered
 * once per variant. Cell letters: t = trunk, g = leaf, d = shaded leaf.
 */

export const TREE_UNIT = 6;

const SPROUT = ["g...g", "gg.gg", ".gtg.", "..t..", "..t.."];

function grid(w: number, h: number): string[][] {
  return Array.from({ length: h }, () => Array<string>(w).fill("."));
}

function trunkOf(cells: string[][], centerX: number, width: number, fromRow: number) {
  for (let y = fromRow; y < cells.length; y++) {
    for (let x = centerX - (width - 1) / 2; x <= centerX + (width - 1) / 2; x++) cells[y][x] = "t";
  }
}

/** Round canopy of radius `r` cells on a trunk `trunk` rows tall. Always odd width, so it centers on a cell. */
function roundTree(r: number, trunk: number): string[] {
  const w = 2 * r + 1;
  const cells = grid(w, w + trunk);
  trunkOf(cells, r, r >= 4 ? 3 : 1, w - 1);
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - r;
      const dy = y - r;
      if (dx * dx + dy * dy > (r + 0.35) ** 2) continue;
      cells[y][x] = r >= 2 && dx + dy > r * 0.8 ? "d" : "g";
    }
  }
  return cells.map((row) => row.join(""));
}

/** Pine of `layers` stacked triangles, each `layerRows` tall, up to half-width `halfWidth`. */
function pineTree(layers: number, halfWidth: number, layerRows: number, trunk: number): string[] {
  const w = 2 * halfWidth + 1;
  const leafRows = (layers - 1) * (layerRows - 1) + layerRows;
  const halves = Array<number>(leafRows).fill(-1);
  for (let i = 0; i < layers; i++) {
    const widest = layers === 1 ? halfWidth : Math.round(2 + (i * (halfWidth - 2)) / (layers - 1));
    for (let j = 0; j < layerRows; j++) {
      const t = j / (layerRows - 1);
      const half = i === 0 ? Math.round(widest * t) : Math.round(widest * (0.5 + 0.5 * t));
      const y = i * (layerRows - 1) + j;
      halves[y] = Math.max(halves[y], half);
    }
  }

  const cells = grid(w, leafRows + trunk);
  trunkOf(cells, halfWidth, halfWidth >= 5 ? 3 : 1, leafRows);
  halves.forEach((half, y) => {
    for (let dx = -half; dx <= half; dx++) cells[y][halfWidth + dx] = dx >= 1 && dx * 2 > half ? "d" : "g";
  });
  return cells.map((row) => row.join(""));
}

type RoundParams = readonly [radius: number, trunk: number];
type PineParams = readonly [layers: number, halfWidth: number, layerRows: number, trunk: number];

interface VariantSpec {
  /** Stages 2 to 6, each bigger and fuller than the last */
  rounds?: readonly [RoundParams, RoundParams, RoundParams, RoundParams, RoundParams];
  pines?: readonly [PineParams, PineParams, PineParams, PineParams, PineParams];
}

const VARIANT_SPECS = {
  roundL: { rounds: [[2, 3], [4, 4], [6, 5], [8, 6], [10, 8]] },
  roundM: { rounds: [[2, 2], [3, 3], [4, 4], [6, 5], [8, 6]] },
  roundS: { rounds: [[1, 2], [2, 3], [3, 3], [5, 4], [6, 5]] },
  pineL: { pines: [[1, 2, 4, 2], [2, 4, 4, 2], [3, 5, 4, 3], [4, 7, 4, 3], [5, 9, 4, 4]] },
  pineM: { pines: [[1, 2, 4, 2], [2, 4, 4, 2], [3, 5, 4, 3], [4, 6, 4, 3], [4, 8, 4, 4]] },
  pineS: { pines: [[1, 2, 3, 1], [2, 3, 3, 1], [2, 3, 4, 2], [3, 5, 4, 2], [4, 6, 4, 3]] },
} as const satisfies Record<string, VariantSpec>;

export type TreeVariantKey = keyof typeof VARIANT_SPECS;

function stageRows(spec: VariantSpec): string[][] {
  const drawn = spec.rounds
    ? spec.rounds.map(([r, trunk]) => roundTree(r, trunk))
    : spec.pines!.map(([n, hw, lh, trunk]) => pineTree(n, hw, lh, trunk));
  return [SPROUT, ...drawn];
}

export interface TreeStageArt {
  stage: number;
  id: string;
  /** Offset inside the full-size canvas that keeps the base centered and on the ground. */
  x: number;
  y: number;
  trunk: string;
  leaf: string;
  dark: string;
}

export const TREE_VARIANTS = (Object.keys(VARIANT_SPECS) as TreeVariantKey[]).map((key) => {
  const rows = stageRows(VARIANT_SPECS[key]);
  const full = rows[rows.length - 1];
  const width = full[0].length;
  const height = full.length;
  const stages: TreeStageArt[] = rows.map((stageCells, i) => ({
    stage: i + 1,
    id: `scene-tree-${key}-${i + 1}`,
    x: (width - stageCells[0].length) / 2,
    y: height - stageCells.length,
    trunk: cellsToPath(stageCells, "t"),
    leaf: cellsToPath(stageCells, "g"),
    dark: cellsToPath(stageCells, "d"),
  }));
  return { key, width, height, stages };
});

export const TREE_STAGE_COUNT = 6;

/** Trees in the order they start to grow. `left` is percent of the viewport width. */
export const TREES: readonly { variant: TreeVariantKey; left: number }[] = [
  { variant: "roundM", left: 6 },
  { variant: "pineL", left: 93 },
  { variant: "roundL", left: 15 },
  { variant: "pineM", left: 84 },
  { variant: "roundS", left: 30 },
  { variant: "pineS", left: 70 },
  { variant: "pineM", left: 50 },
];

/** Below 768px wide only this many trees are shown. */
export const MOBILE_TREES = 4;
