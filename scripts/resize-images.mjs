/**
 * Runs after `next build` (static export). GitHub Pages cannot resize images on request, so this
 * writes every width and quality the custom loader (src/lib/imageLoader.ts) can ask for, as WebP
 * next to each original in out/_next/static/media.
 *
 * WIDTHS and QUALITIES must match images.deviceSizes + imageSizes and images.qualities in next.config.ts.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [96, 192, 256, 384, 480, 768, 1080, 1440, 1920, 2400];
const QUALITIES = [75, 90];
const MEDIA_DIR = path.join("out", "_next", "static", "media");
const RASTER = /\.(webp|png|jpe?g)$/i;
const VARIANT = /\.w\d+q\d+\.webp$/;

const files = (await readdir(MEDIA_DIR)).filter((name) => RASTER.test(name) && !VARIANT.test(name));
let written = 0;

for (const name of files) {
  const source = path.join(MEDIA_DIR, name);
  const base = name.replace(/\.[a-z0-9]+$/i, "");
  await Promise.all(
    WIDTHS.flatMap((width) =>
      QUALITIES.map(async (quality) => {
        await sharp(source)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality })
          .toFile(path.join(MEDIA_DIR, `${base}.w${width}q${quality}.webp`));
        written++;
      }),
    ),
  );
}

console.log(`Resized ${files.length} images into ${written} files.`);
