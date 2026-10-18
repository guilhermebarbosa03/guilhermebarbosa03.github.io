"use client";

import { useEffect, useRef } from "react";
import { clockElapsed, prefersReducedMotion, subscribeClock, TICK_MS } from "./clock";

/*
 * Drives the backdrop.
 *
 * Motion (clouds, sun, moon) uses the Web Animations API: each element gets one linear, infinite
 * animation whose current time is derived from the scene clock. The browser interpolates every
 * frame on the compositor, and since the animation follows the document timeline it is already at
 * the right spot when a hidden tab comes back, with no catch-up run.
 *
 * Everything discrete (palette phase, star twinkle, tree growth) runs on the shared 500ms clock
 * and writes to the DOM only when a value changes.
 *
 * Cycle (seconds, 240 in total, starting in the morning):
 *   0-100 day | 100-120 dusk-1..3 | 120-220 night | 220-240 dawn-1..3
 * Sun and moon sit on opposite points of the same circle: the sun crosses the sky from 0 to 120,
 * the moon from 120 to 240, and each sets below the hills before the other rises.
 */

const CYCLE_S = 240;
const CYCLE_MS = CYCLE_S * 1000;
const STEP_S = 20 / 3;

const PHASES: readonly (readonly [end: number, name: string])[] = [
  [100, "day"],
  [100 + STEP_S, "dusk-1"],
  [100 + 2 * STEP_S, "dusk-2"],
  [120, "dusk-3"],
  [220, "night"],
  [220 + STEP_S, "dawn-1"],
  [220 + 2 * STEP_S, "dawn-2"],
  [CYCLE_S, "dawn-3"],
];

const STARRY = new Set(["dusk-3", "night", "dawn-1"]);

/** Trees: tree i sprouts at 20s + 10s * i, then gains one stage every 15s until it is full (stage 6). */
const TREE_FIRST_S = 20;
const TREE_OFFSET_S = 10;
const TREE_STAGE_S = 15;
const TREE_MAX_STAGE = 6;

const TWINKLE_MS = 3000;
/** Keyframes along the visible half of the sun/moon arc; linear segments between them read as a curve. */
const ARC_STEPS = 48;
const RESIZE_DEBOUNCE_MS = 200;

function phaseAt(seconds: number): string {
  for (const [end, name] of PHASES) if (seconds < end) return name;
  return "dawn-3";
}

function treeStage(elapsedS: number, index: number): number {
  const since = elapsedS - (TREE_FIRST_S + index * TREE_OFFSET_S);
  if (since < 0) return 0;
  return Math.min(TREE_MAX_STAGE, 1 + Math.floor(since / TREE_STAGE_S));
}

/**
 * One full cycle for a sky body. First half: rises at the left below the bottom edge, arcs over
 * the sky and sets at the right below the edge. Second half: travels back to the left out of sight.
 */
function arcKeyframes(width: number, height: number, half: number): Keyframe[] {
  const horizon = height + half;
  const peak = height * 0.14;
  const point = (progress: number) => ({
    x: width * (0.06 + 0.88 * progress) - half,
    y: horizon - Math.sin(Math.PI * progress) * (horizon - peak) - half,
  });
  const frames: Keyframe[] = [];
  for (let i = 0; i <= ARC_STEPS; i++) {
    const { x, y } = point(i / ARC_STEPS);
    frames.push({ offset: (i / ARC_STEPS) * 0.5, transform: `translate(${x}px, ${y}px)` });
  }
  const start = point(0);
  frames.push({ offset: 1, transform: `translate(${start.x}px, ${start.y}px)` });
  return frames;
}

export function SceneDriver() {
  const marker = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>("[data-scene]");
    if (!root || prefersReducedMotion()) return;
    root.dataset.driven = "";

    const clouds = Array.from(root.querySelectorAll<HTMLElement>("[data-cloud]"));
    const sun = root.querySelector<HTMLElement>("[data-sun]");
    const moon = root.querySelector<HTMLElement>("[data-moon]");
    const trees = Array.from(root.querySelectorAll<HTMLElement>("[data-tree]"));
    const treeStages: number[] = trees.map(() => 0);
    let motion: Animation[] = [];

    /** (Re)builds the motion animations for the current viewport, aligned with the clock. */
    function startMotion() {
      for (const animation of motion) animation.cancel();
      motion = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      const elapsed = clockElapsed();

      // Clouds drift left to right, wrapping from just off the right edge back to just off the left
      for (const el of clouds) {
        const cloudWidth = Number(el.dataset.width);
        const speed = Number(el.dataset.speed);
        const start = (Number(el.dataset.left) / 100) * width;
        const span = width + cloudWidth;
        const duration = (span / speed) * 1000;
        const animation = el.animate(
          [
            { transform: `translate(${-cloudWidth - start}px, 0)` },
            { transform: `translate(${width - start}px, 0)` },
          ],
          { duration, iterations: Infinity, easing: "linear" },
        );
        animation.currentTime = (((start + cloudWidth) / span) * duration + elapsed) % duration;
        motion.push(animation);
      }

      // The moon runs the same orbit half a cycle later, so the two are always 180° apart
      const bodies: [HTMLElement | null, number][] = [
        [sun, 0],
        [moon, CYCLE_MS / 2],
      ];
      for (const [el, offset] of bodies) {
        if (!el) continue;
        const animation = el.animate(arcKeyframes(width, height, Number(el.dataset.half)), {
          duration: CYCLE_MS,
          iterations: Infinity,
          easing: "linear",
        });
        animation.currentTime = (elapsed + CYCLE_MS - offset) % CYCLE_MS;
        motion.push(animation);
      }
    }

    let phase = root.dataset.phase ?? "day";
    let twinkle = "0";
    let lastTick: number | null = null;

    function tick(elapsedMs: number) {
      const elapsedS = elapsedMs / 1000;

      // After a hidden tab or a long stall, snap the palette instead of blending from stale colors
      const resumed = lastTick !== null && elapsedMs - lastTick > TICK_MS * 3;
      lastTick = elapsedMs;
      if (resumed) {
        root!.dataset.instant = "";
        requestAnimationFrame(() => requestAnimationFrame(() => delete root!.dataset.instant));
      }

      const nextPhase = phaseAt(elapsedS % CYCLE_S);
      if (nextPhase !== phase) {
        phase = nextPhase;
        root!.dataset.phase = nextPhase;
      }

      const nextTwinkle = STARRY.has(phase) ? String(Math.floor(elapsedMs / TWINKLE_MS) % 2) : "0";
      if (nextTwinkle !== twinkle) {
        twinkle = nextTwinkle;
        root!.dataset.twinkle = nextTwinkle;
      }

      trees.forEach((tree, i) => {
        const stage = treeStage(elapsedS, i);
        if (stage !== treeStages[i]) {
          treeStages[i] = stage;
          tree.dataset.stage = String(stage);
        }
      });
    }

    startMotion();
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(startMotion, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize);
    const unsubscribe = subscribeClock(tick);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      for (const animation of motion) animation.cancel();
      delete root.dataset.driven;
    };
  }, []);

  return <i ref={marker} hidden />;
}
