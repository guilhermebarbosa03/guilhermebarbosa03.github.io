import styles from "./PixelScene.module.css";
import { SceneDriver } from "./SceneDriver";
import { lcg, rect } from "./pixelArt";
import { CELL, CLOUDS, CLOUD_UNIT, MOON, MOON_CELLS, STARS, STAR_PLUS, SUN, SUN_CELLS } from "./skyArt";
import { MOBILE_TREES, TREES, TREE_STAGE_COUNT, TREE_UNIT, TREE_VARIANTS } from "./treeArt";

/**
 * Fixed backdrop: stars, sun and moon, clouds, two layers of stepped hills and slowly growing trees.
 * Everything is pre-rendered here as SVG on the server (no CSS animations at all). The only moving
 * parts are driven by <SceneDriver />, which writes to the DOM on the shared slow clock.
 * Colors come from per-phase variables on the root (see the CSS), so the day/night cycle is a
 * handful of flat palette swaps.
 */

/* Hills: one tile per layer, repeated by an SVG <pattern> so any viewport width is covered */

interface Hill {
  cx: number;
  hw: number;
  h: number;
}

interface HillSpec {
  width: number;
  /** Minimum column height, so the layer never drops to zero at the tile seam. */
  floor: number;
  /** Heights snap to multiples of this, which makes the staircase chunkier. */
  step: number;
  hills: readonly Hill[];
  specks: { count: number; maxWidth: number; depth: number; seed: number };
}

/** Rows in a tile; keep in sync with the `* 44` in PixelScene.module.css. */
const TILE_ROWS = 44;
/** Pixel size of one tile row: small screens get 3px, larger ones 4px (see the CSS). */
const HILL_SCALES = [3, 4] as const;

const FAR_HILLS: HillSpec = {
  width: 160,
  floor: 8,
  step: 2,
  hills: [
    { cx: 26, hw: 40, h: 34 },
    { cx: 92, hw: 56, h: 42 },
    { cx: 146, hw: 30, h: 28 },
  ],
  specks: { count: 16, maxWidth: 3, depth: 12, seed: 11 },
};

const NEAR_HILLS: HillSpec = {
  width: 120,
  floor: 4,
  step: 1,
  hills: [
    { cx: 20, hw: 32, h: 20 },
    { cx: 64, hw: 38, h: 28 },
    { cx: 106, hw: 26, h: 16 },
  ],
  specks: { count: 14, maxWidth: 4, depth: 14, seed: 23 },
};

function hillTile({ width, floor, step, hills, specks }: HillSpec) {
  const heights: number[] = [];
  for (let x = 0; x < width; x++) {
    let top = floor;
    for (const hill of hills) {
      // Wrap around the tile edges so hills crossing the seam stay continuous.
      for (const shift of [-width, 0, width]) {
        const t = (x + 0.5 - hill.cx - shift) / hill.hw;
        if (Math.abs(t) < 1) top = Math.max(top, floor + (hill.h - floor) * (1 - t * t) ** 0.75);
      }
    }
    heights.push(Math.min(TILE_ROWS, Math.round(top / step) * step));
  }

  let body = "";
  for (let x = 0; x < width; ) {
    let end = x;
    while (end < width && heights[end] === heights[x]) end++;
    body += rect(x, TILE_ROWS - heights[x], end - x, heights[x]);
    x = end;
  }

  const random = lcg(specks.seed);
  let dark = "";
  for (let i = 0; i < specks.count; i++) {
    const w = 2 + Math.floor(random() * (specks.maxWidth - 1));
    const x = Math.floor(random() * (width - w));
    // Stay below the lowest surface cell the speck spans, so it never pokes out of the hill.
    const lowest = Math.min(...heights.slice(x, x + w));
    const room = Math.min(lowest - 3, specks.depth);
    if (room < 1) continue;
    dark += rect(x, TILE_ROWS - lowest + 2 + Math.floor(random() * room), w, 1);
  }

  return { width, body, dark };
}

const FAR = hillTile(FAR_HILLS);
const NEAR = hillTile(NEAR_HILLS);

export function PixelScene() {
  return (
    <div aria-hidden="true" className={`no-print ${styles.scene}`} data-scene data-phase="day">
      <SceneDriver />

      {/* Stars: shown by the phase selectors in the CSS; `twinkle` stars blink via data-twinkle on the root */}
      <svg className={styles.stars} shapeRendering="crispEdges">
        <defs>
          <path id="scene-star-plus" d={STAR_PLUS} />
        </defs>
        {[false, true].map((twinkle) => (
          <g key={String(twinkle)} className={twinkle ? styles.starsTwinkle : undefined}>
            {STARS.filter((star) => star.twinkle === twinkle).map((star, i) =>
              star.plus ? (
                <use key={i} href="#scene-star-plus" x={star.x} y={star.y} />
              ) : (
                <rect key={i} x={star.x} y={star.y} width={star.size} height={star.size} />
              ),
            )}
          </g>
        ))}
      </svg>

      {/* Sun and moon: animated by the driver; the transform in the CSS is the static daytime spot */}
      <svg
        className={styles.sun}
        data-sun
        data-half={(SUN_CELLS * CELL) / 2}
        viewBox={`0 0 ${SUN_CELLS} ${SUN_CELLS}`}
        width={SUN_CELLS * CELL}
        height={SUN_CELLS * CELL}
        shapeRendering="crispEdges"
      >
        <path className={styles.sunCore} d={SUN.core} />
        <path className={styles.sunEdge} d={SUN.edge} />
      </svg>
      <svg
        className={styles.moon}
        data-moon
        data-half={(MOON_CELLS * CELL) / 2}
        viewBox={`0 0 ${MOON_CELLS} ${MOON_CELLS}`}
        width={MOON_CELLS * CELL}
        height={MOON_CELLS * CELL}
        shapeRendering="crispEdges"
      >
        <path className={styles.moonBody} d={MOON.body} />
      </svg>

      {CLOUDS.map((cloud, i) => (
        <svg
          key={`cloud-${i}`}
          className={i >= 4 ? `${styles.cloud} ${styles.cloudExtra}` : styles.cloud}
          style={{ top: `${cloud.top}%`, left: `${cloud.left}%` }}
          data-cloud
          data-left={cloud.left}
          data-speed={cloud.speed}
          data-width={cloud.width * CLOUD_UNIT}
          viewBox={`0 0 ${cloud.width} ${cloud.height}`}
          width={cloud.width * CLOUD_UNIT}
          height={cloud.height * CLOUD_UNIT}
          shapeRendering="crispEdges"
        >
          <path className={styles.cloudBody} d={cloud.body} />
          <path className={styles.cloudShade} d={cloud.shade} />
        </svg>
      ))}

      <div className={styles.hills}>
        <svg className={styles.hillsSvg} shapeRendering="crispEdges">
          <defs>
            <g id="scene-hills-far">
              <path className={styles.hillFar} d={FAR.body} />
              <path className={styles.hillFarDark} d={FAR.dark} />
            </g>
            <g id="scene-hills-near">
              <path className={styles.hillNear} d={NEAR.body} />
              <path className={styles.hillNearDark} d={NEAR.dark} />
            </g>
            {HILL_SCALES.map((scale) => (
              <pattern
                key={`far-${scale}`}
                id={`scene-far-${scale}`}
                patternUnits="userSpaceOnUse"
                patternTransform={`scale(${scale})`}
                width={FAR.width}
                height={TILE_ROWS}
              >
                <use href="#scene-hills-far" />
              </pattern>
            ))}
            {HILL_SCALES.map((scale) => (
              <pattern
                key={`near-${scale}`}
                id={`scene-near-${scale}`}
                patternUnits="userSpaceOnUse"
                patternTransform={`scale(${scale})`}
                width={NEAR.width}
                height={TILE_ROWS}
              >
                <use href="#scene-hills-near" />
              </pattern>
            ))}
          </defs>
          {(["far", "near"] as const).flatMap((layer) =>
            HILL_SCALES.map((scale) => (
              <rect
                key={`${layer}-${scale}`}
                className={styles[`scale${scale}`]}
                width="100%"
                height="100%"
                fill={`url(#scene-${layer}-${scale})`}
              />
            )),
          )}
        </svg>
      </div>

      {/* Trees: each stage is drawn once per variant and shown by data-stage on the tree */}
      <svg className={styles.treeDefs} width="0" height="0" focusable="false">
        <defs>
          {TREE_VARIANTS.flatMap((variant) =>
            variant.stages.map((stage) => (
              <g key={stage.id} id={stage.id}>
                {stage.trunk && <path className={styles.trunk} d={stage.trunk} />}
                {stage.leaf && <path className={styles.leaf} d={stage.leaf} />}
                {stage.dark && <path className={styles.leafDark} d={stage.dark} />}
              </g>
            )),
          )}
        </defs>
      </svg>
      {TREES.map((tree, i) => {
        const variant = TREE_VARIANTS.find((v) => v.key === tree.variant)!;
        return (
          <svg
            key={`tree-${i}`}
            className={i >= MOBILE_TREES ? `${styles.tree} ${styles.treeExtra}` : styles.tree}
            style={{ left: `${tree.left}%` }}
            data-tree
            data-stage="0"
            viewBox={`0 0 ${variant.width} ${variant.height}`}
            width={variant.width * TREE_UNIT}
            height={variant.height * TREE_UNIT}
            shapeRendering="crispEdges"
          >
            {variant.stages.slice(0, TREE_STAGE_COUNT).map((stage) => (
              <use
                key={stage.id}
                className={`${styles.stage} ${styles[`stage${stage.stage}`]}`}
                href={`#${stage.id}`}
                x={stage.x}
                y={stage.y}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
