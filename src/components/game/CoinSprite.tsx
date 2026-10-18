import { memo } from "react";
import { COIN_ART, COIN_GRID, type CoinDigit } from "@/components/scene/coinArt";
import styles from "./CoinSprite.module.css";

interface CoinSpriteProps {
  digit: CoinDigit;
  /** Screen pixels per art pixel (keep it an integer so the pixels stay square). */
  scale: number;
}

export const CoinSprite = memo(function CoinSprite({ digit, scale }: CoinSpriteProps) {
  const art = COIN_ART[digit];
  const size = COIN_GRID * scale;

  return (
    <svg
      className={styles.sprite}
      width={size}
      height={size}
      viewBox={`0 0 ${COIN_GRID} ${COIN_GRID}`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path className={styles.ink} d={art.ink} />
      <path className={styles.gold} d={art.gold} />
      <path className={styles.light} d={art.light} />
      <path className={styles.dark} d={art.dark} />
    </svg>
  );
});
