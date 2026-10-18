import type { CSSProperties, ReactNode } from "react";
import type { StaticImageData } from "next/image";
import styles from "./ImageFrame.module.css";

interface ImageFrameProps {
  image: StaticImageData;
  className?: string;
  children: ReactNode;
}

/**
 * Bordered box with the image's own aspect ratio, as large as fits and centered in its parent, so
 * the border hugs the picture instead of the cell. The parent must be a size container
 * (`container-type: size`); fill-mode images and badges go inside.
 */
export function ImageFrame({ image, className, children }: ImageFrameProps) {
  const style = { "--ratio": image.width / image.height } as CSSProperties;
  return (
    <span className={className ? `${styles.frame} ${className}` : styles.frame} style={style}>
      {children}
    </span>
  );
}
