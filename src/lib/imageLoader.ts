import type { ImageLoaderProps } from "next/image";

/**
 * Maps next/image requests to files resized ahead of time by scripts/resize-images.mjs, e.g.
 * /_next/static/media/photo.abc123.webp at 768px, quality 75 -> photo.abc123.w768q75.webp.
 * In development those files do not exist, so the original is served as is.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (process.env.NODE_ENV === "development" || !src.startsWith("/_next/static/media/")) return src;
  return src.replace(/\.[a-z0-9]+$/i, `.w${width}q${quality ?? 75}.webp`);
}
