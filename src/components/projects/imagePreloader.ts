import { getImageProps } from "next/image";
import type { Project } from "@/content/types";
import { projectAnchor } from "@/lib/site";
import { whenIdle } from "./idle";
import { cardColumns, cardSizes, MAX_CARD_IMAGES, ZOOM_MAIN_SIZES, ZOOM_QUALITY, ZOOM_THUMB_SIZES } from "./imageSizes";

/*
 * Warms the HTTP cache with the project images, a few at a time, once the page is done loading.
 * Every request is built with getImageProps and the same src/sizes the rendered <Image> uses (see
 * imageSizes.ts), so the browser resolves the same srcset candidate and the render is a cache hit.
 * Nothing is kept after a request settles, so no decoded bitmaps stay in memory.
 */

const CONCURRENCY = 2;

interface Task {
  kind: "card" | "zoom";
  projectIndex: number;
  src: Project["images"][number]["src"];
  sizes: string;
  /** Card images only: where the rendered <img> lives, so one that already loaded can be skipped. */
  domLookup?: { anchor: string; imageIndex: number };
}

export interface ImagePreloader {
  /** The user showed interest in a project: its zoom images go to the front of the queue. */
  boost(projectIndex: number): void;
  stop(): void;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

function isDataSaver(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return Boolean(connection?.saveData) || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}

/** Project indexes ordered by circular distance from `start`: start, next, previous, next + 1, ... */
function byDistance(total: number, start: number): number[] {
  const order = new Set<number>();
  for (let offset = 0; order.size < total; offset += 1) {
    order.add((start + offset) % total);
    order.add((start - offset + total) % total);
  }
  return [...order];
}

function buildQueue(projects: Project[], activeIndex: number, includeMain: boolean): Task[] {
  const total = projects.length;
  const fromActive = Array.from({ length: total }, (_, offset) => (activeIndex + offset) % total);
  const tasks: Task[] = [];

  // 1. Card images, starting at the active slide
  for (const projectIndex of fromActive) {
    const project = projects[projectIndex];
    const sizes = cardSizes(cardColumns(project));
    project.images.slice(0, MAX_CARD_IMAGES).forEach((image, imageIndex) => {
      tasks.push({
        kind: "card",
        projectIndex,
        src: image.src,
        sizes,
        domLookup: { anchor: projectAnchor(project.id), imageIndex },
      });
    });
  }

  // 2. Zoom thumbnails (only rendered for projects with several images)
  for (const projectIndex of fromActive) {
    const project = projects[projectIndex];
    if (project.images.length < 2) continue;
    for (const image of project.images) {
      tasks.push({ kind: "zoom", projectIndex, src: image.src, sizes: ZOOM_THUMB_SIZES });
    }
  }

  // 3. Zoom main images: active project, then its neighbors, then the rest
  if (includeMain) {
    for (const projectIndex of byDistance(total, activeIndex)) {
      for (const image of projects[projectIndex].images) {
        tasks.push({ kind: "zoom", projectIndex, src: image.src, sizes: ZOOM_MAIN_SIZES });
      }
    }
  }

  return tasks;
}

/** True when the card's own <img> for this task has already finished loading. */
function isAlreadyLoaded(task: Task): boolean {
  if (!task.domLookup) return false;
  const root = document.getElementById(task.domLookup.anchor);
  const img = root?.querySelectorAll("img")[task.domLookup.imageIndex];
  return Boolean(img && img.complete && img.naturalWidth > 0);
}

function load(task: Task, signal: AbortSignal): Promise<void> {
  // Same quality as the rendered zoom image, otherwise the URL differs and the cache misses
  const quality = task.sizes === ZOOM_MAIN_SIZES ? ZOOM_QUALITY : undefined;
  const { props } = getImageProps({ src: task.src, alt: "", fill: true, sizes: task.sizes, quality });

  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    let img: HTMLImageElement | null = new Image();

    const finish = () => {
      if (!img) return;
      signal.removeEventListener("abort", abort);
      img.onload = null;
      img.onerror = null;
      img = null; // drop the reference: the browser keeps the bytes in its cache, we keep nothing
      resolve();
    };
    const abort = () => {
      if (img) {
        img.removeAttribute("srcset");
        img.removeAttribute("src");
      }
      finish();
    };

    signal.addEventListener("abort", abort, { once: true });
    img.onload = finish;
    img.onerror = finish;
    img.fetchPriority = "low";
    img.decoding = "async";
    img.sizes = props.sizes ?? "";
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = typeof props.src === "string" ? props.src : "";
  });
}

export function startImagePreloader(projects: Project[], getActiveIndex: () => number): ImagePreloader {
  const controller = new AbortController();
  const { signal } = controller;
  let pending: Task[] | null = null;
  const boosted: number[] = [];
  const requested = new Set<string>();
  let cancelIdle = () => {};
  let removeLoadListener = () => {};

  const prioritize = (projectIndex: number) => {
    if (!pending) return;
    const first: Task[] = [];
    const rest: Task[] = [];
    for (const task of pending) (task.kind === "zoom" && task.projectIndex === projectIndex ? first : rest).push(task);
    pending = [...first, ...rest];
  };

  const worker = async () => {
    while (!signal.aborted && pending) {
      const task = pending.shift();
      if (!task) return;
      if (isAlreadyLoaded(task)) continue;
      const key = `${task.sizes}|${task.src.src}`;
      if (requested.has(key)) continue;
      requested.add(key);
      await load(task, signal);
    }
  };

  const start = () => {
    pending = buildQueue(projects, getActiveIndex(), !isDataSaver());
    // Intent shown before the queue existed; oldest first so the latest ends up in front
    for (const projectIndex of boosted) prioritize(projectIndex);
    void Promise.all(Array.from({ length: CONCURRENCY }, worker));
  };

  if (document.readyState === "complete") {
    cancelIdle = whenIdle(start);
  } else {
    const onLoad = () => {
      cancelIdle = whenIdle(start);
    };
    window.addEventListener("load", onLoad, { once: true });
    removeLoadListener = () => window.removeEventListener("load", onLoad);
  }

  return {
    boost(projectIndex) {
      if (signal.aborted) return;
      if (!pending) {
        boosted.push(projectIndex);
        return;
      }
      prioritize(projectIndex);
    },
    stop() {
      controller.abort();
      cancelIdle();
      removeLoadListener();
      pending = null;
    },
  };
}
