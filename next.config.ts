import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site for GitHub Pages: `next build` writes plain files to out/, one folder per route
  output: "export",
  trailingSlash: true,
  images: {
    // There is no image server on GitHub Pages. The loader points at pre-resized copies that
    // scripts/resize-images.mjs writes next to each original after the build.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // Kept short: every width is a file per image and quality
    deviceSizes: [480, 768, 1080, 1440, 1920, 2400],
    imageSizes: [96, 192, 256, 384],
    // 75 is the default; 90 is used by the enlarged image in the project zoom view
    qualities: [75, 90],
  },
};

export default nextConfig;
