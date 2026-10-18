import { memo } from "react";
import { CoinSprite } from "./CoinSprite";
import styles from "./ScoreHud.module.css";

export const ScoreHud = memo(function ScoreHud({ score }: { score: number }) {
  if (score <= 0) return null;

  return (
    <div className={`${styles.hud} no-print`} aria-hidden="true">
      <CoinSprite digit="1" scale={2} />
      <span>× {score}</span>
    </div>
  );
});
