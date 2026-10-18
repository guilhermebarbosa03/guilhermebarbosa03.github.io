import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import styles from "./PixelPlaceholder.module.css";

/**
 * Pixel mosaic shown under a project image until the real one paints. `blurDataURL` is an 8px
 * version of the image; scaled up with `image-rendering: pixelated` it becomes a chunky mosaic
 * instead of a blur. Without it the layer is transparent. Place it right before the <img>, inside a
 * positioned parent: it fills the parent and matches `object-fit: contain`.
 */
export function PixelPlaceholder({ image }: { image: StaticImageData }) {
  const style: CSSProperties | undefined = image.blurDataURL
    ? { backgroundImage: `url("${image.blurDataURL}")` }
    : undefined;
  return <span className={styles.placeholder} style={style} aria-hidden="true" />;
}
