import Image, { type ImageProps, type StaticImageData } from "next/image";
import { PixelPlaceholder } from "./PixelPlaceholder";

type PixelImageProps = Omit<ImageProps, "src" | "fill" | "placeholder" | "blurDataURL"> & {
  src: StaticImageData;
  sizes: string;
};

/** A fill-mode next/image on top of its pixel mosaic placeholder. The parent must be positioned. */
export function PixelImage({ src, alt, ...props }: PixelImageProps) {
  return (
    <>
      <PixelPlaceholder image={src} />
      <Image src={src} alt={alt} fill {...props} />
    </>
  );
}
