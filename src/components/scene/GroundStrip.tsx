import styles from "./GroundStrip.module.css";

/**
 * Grass-and-dirt floor for the bottom of the page. One 64x18 tile (4px cells) is repeated by an SVG
 * <pattern>, so it fills any width without stretching. The tile is anchored at the top, which means
 * the shorter mobile strip simply crops the bottom rows of dirt.
 */

const UNIT = 4;
const TILE_COLS = 64;
const TILE_ROWS = 18;
const GRASS_BODY = { from: 1, to: 5 }; // rows 1-4 are grass; row 0 only holds the blade tips
const FRINGE_ROW = 5;
const TEETH_ROW = 6;

const cell = (x: number, y: number, w: number, h: number) =>
  `M${x * UNIT} ${y * UNIT}h${w * UNIT}v${h * UNIT}h${-w * UNIT}z`;

/** Small deterministic generator: the tile must be identical on every render. */
function lcg(seed: number) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function groundTile() {
  const random = lcg(7);
  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));

  // Jagged top edge: short blade runs with irregular gaps.
  let blades = "";
  for (let x = between(0, 3); x < TILE_COLS; x += between(2, 6)) {
    const w = Math.min(between(1, 3), TILE_COLS - x);
    blades += cell(x, 0, w, 1);
    x += w;
  }

  // Ragged lower edge of the grass: a fringe row with a few teeth hanging into the dirt.
  let fringe = "";
  let teeth = "";
  for (let x = between(0, 2); x < TILE_COLS; x += between(2, 4)) {
    const w = Math.min(between(3, 8), TILE_COLS - x);
    fringe += cell(x, FRINGE_ROW, w, 1);
    if (random() < 0.6) {
      const toothW = Math.min(between(1, 2), w);
      teeth += cell(x + between(0, w - toothW), TEETH_ROW, toothW, 1);
    }
    x += w;
  }

  // Lighter grass flecks on the grass body.
  let flecks = "";
  for (let i = 0; i < 9; i++) {
    flecks += cell(between(0, TILE_COLS - 3), between(GRASS_BODY.from + 1, GRASS_BODY.to - 2), between(1, 2), 1);
  }

  // Pebbles and specks scattered with a free cell around each, so nothing lines up like bricks.
  const taken = new Set<string>();
  const isFree = (x: number, y: number, w: number, h: number) => {
    if (x < 0 || x + w > TILE_COLS || y + h > TILE_ROWS) return false;
    for (let dy = -1; dy <= h; dy++) {
      for (let dx = -1; dx <= w; dx++) if (taken.has(`${x + dx}:${y + dy}`)) return false;
    }
    return true;
  };
  const place = (x: number, y: number, w: number, h: number) => {
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) taken.add(`${x + dx}:${y + dy}`);
  };

  const pebbleShapes = [
    [[0, 0, 1, 1]],
    [[0, 0, 2, 1]],
    [[0, 0, 1, 2]],
    [[0, 0, 2, 1], [0, 1, 1, 1]],
    [[0, 0, 1, 1], [0, 1, 2, 1]],
  ] as const;

  let pebbles = "";
  let specks = "";
  for (let attempt = 0; attempt < 90; attempt++) {
    const shape = pebbleShapes[between(0, pebbleShapes.length - 1)];
    const x = between(0, TILE_COLS - 2);
    const y = between(TEETH_ROW + 2, TILE_ROWS - 2);
    const parts = shape.map(([dx, dy, w, h]) => [x + dx, y + dy, w, h] as const);
    if (!parts.every(([px, py, w, h]) => isFree(px, py, w, h))) continue;
    parts.forEach(([px, py, w, h]) => place(px, py, w, h));
    // Roughly one pebble in three gets a light speck above it, like a lit edge.
    if (random() < 0.35 && isFree(x, y - 1, 1, 1) && y - 1 > TEETH_ROW) {
      specks += cell(x, y - 1, 1, 1);
      place(x, y - 1, 1, 1);
    }
    pebbles += parts.map(([px, py, w, h]) => cell(px, py, w, h)).join("");
  }

  return { blades, fringe, teeth, flecks, pebbles, specks };
}

const TILE = groundTile();

export function GroundStrip() {
  return (
    <svg className={styles.ground} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <defs>
        <pattern
          id="ground-tile"
          patternUnits="userSpaceOnUse"
          width={TILE_COLS * UNIT}
          height={TILE_ROWS * UNIT}
        >
          <path className={styles.dirt} d={cell(0, FRINGE_ROW, TILE_COLS, TILE_ROWS - FRINGE_ROW)} />
          <path className={styles.pebble} d={TILE.pebbles} />
          <path className={styles.speck} d={TILE.specks} />
          <path className={styles.grass} d={cell(0, GRASS_BODY.from, TILE_COLS, GRASS_BODY.to - GRASS_BODY.from)} />
          <path className={styles.fleck} d={TILE.flecks} />
          <path className={styles.edge} d={TILE.blades + cell(0, 1, TILE_COLS, 1) + TILE.fringe + TILE.teeth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ground-tile)" />
    </svg>
  );
}
