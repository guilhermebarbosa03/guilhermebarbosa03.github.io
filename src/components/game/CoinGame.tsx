"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, subscribeClock } from "@/components/scene/clock";
import { CoinSprite } from "./CoinSprite";
import { playCoinSound } from "./coinSound";
import {
  COIN_SCALE,
  coinBox,
  coinPixels,
  countsForWidth,
  digitFor,
  reconcile,
  type Coin,
} from "./coins";
import { findSpot, measureLayout } from "./placement";
import { ScoreHud } from "./ScoreHud";
import { addCoinToScore, useCoinScore } from "./useCoinScore";
import styles from "./CoinGame.module.css";

/** Debounce for layout changes: coins only need to dodge the content once the page settles. */
const REVALIDATE_MS = 250;
const RESPAWN_MS = 250;
const POP_STEP_MS = 150;
const POP_END_MS = 400;
const POP_RISE = 8;
const RESPAWN_MIN_DISTANCE = 120;
const VIEW_EDGE = 8;

interface Pop {
  id: number;
  x: number;
  y: number;
  width: number;
  /** 0 at first, 1 after one 8px step up. */
  step: 0 | 1;
}

function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 1000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 200);
  return () => window.clearTimeout(handle);
}

interface CoinButtonProps {
  coin: Coin;
  onCollect: (coin: Coin) => void;
}

// Memoized: bobbing never touches React, and a coin only re-renders when it moves
const CoinButton = memo(function CoinButton({ coin, onCollect }: CoinButtonProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      className={styles.coin}
      data-size={coin.size}
      data-phase={coin.id % 2}
      style={{ left: coin.x, top: coin.y }}
      onClick={() => onCollect(coin)}
    >
      <CoinSprite digit={coin.digit} scale={COIN_SCALE[coin.size]} />
    </button>
  );
});

/**
 * Easter egg: pixel coins scattered over the page (in document coordinates, so they scroll with
 * the content). They only sit in free space, collecting one plays a jingle and bumps a stored score.
 */
export function CoinGame() {
  const score = useCoinScore();
  const [coins, setCoins] = useState<readonly Coin[]>([]);
  const [pops, setPops] = useState<readonly Pop[]>([]);

  const layerRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<readonly Coin[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Set<number>());

  const nextId = useCallback(() => idRef.current++, []);

  const commit = useCallback((next: readonly Coin[]) => {
    if (next === coinsRef.current) return;
    coinsRef.current = next;
    setCoins(next);
  }, []);

  const later = useCallback((callback: () => void, ms: number) => {
    const timers = timersRef.current;
    const handle = window.setTimeout(() => {
      timers.delete(handle);
      callback();
    }, ms);
    timers.add(handle);
  }, []);

  const respawn = useCallback(
    (old: Coin) => {
      const counts = countsForWidth(window.innerWidth);
      if (coinsRef.current.filter((coin) => coin.size === old.size).length >= counts[old.size]) return;

      const layout = measureLayout();
      const size = coinPixels(old.size);
      const others = coinsRef.current.map(coinBox);
      const avoid = { x: old.x + size / 2, y: old.y + size / 2, distance: RESPAWN_MIN_DISTANCE };
      // Visible area = viewport below the sticky header, converted to document coordinates
      const visible = [
        window.scrollY + layout.minY,
        window.scrollY + window.innerHeight - size - VIEW_EDGE,
      ] as const;

      const spot =
        findSpot(layout, size, others, { yRange: visible, avoid }) ??
        findSpot(layout, size, others, { avoid }) ??
        findSpot(layout, size, others);
      if (!spot) return;

      const id = nextId();
      commit([...coinsRef.current, { id, size: old.size, digit: digitFor(id), ...spot }]);
    },
    [commit, nextId],
  );

  const collect = useCallback(
    (coin: Coin) => {
      // A fast double click can fire twice before React removes the button
      if (!coinsRef.current.includes(coin)) return;

      playCoinSound();
      addCoinToScore();
      commit(coinsRef.current.filter((other) => other !== coin));

      const pop: Pop = { id: coin.id, x: coin.x, y: coin.y, width: coinPixels(coin.size), step: 0 };
      setPops((current) => [...current, pop]);
      later(() => setPops((current) => current.map((p) => (p.id === pop.id ? { ...p, step: 1 } : p))), POP_STEP_MS);
      later(() => setPops((current) => current.filter((p) => p.id !== pop.id)), POP_END_MS);
      later(() => respawn(coin), RESPAWN_MS);
    },
    [commit, later, respawn],
  );

  // Placement: client only, once fonts are in (text widths decide where the obstacles are) and the browser is idle
  useEffect(() => {
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;
    let debounce: number | undefined;
    let observer: ResizeObserver | undefined;

    const revalidate = () => {
      commit(reconcile(coinsRef.current, countsForWidth(window.innerWidth), measureLayout(), nextId));
    };
    const scheduleRevalidate = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(revalidate, REVALIDATE_MS);
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(() => {
      if (cancelled) return;
      cancelIdle = whenIdle(() => {
        revalidate();
        observer = new ResizeObserver(scheduleRevalidate);
        observer.observe(document.body);
        window.addEventListener("resize", scheduleRevalidate);
      });
    });

    return () => {
      cancelled = true;
      cancelIdle?.();
      window.clearTimeout(debounce);
      observer?.disconnect();
      window.removeEventListener("resize", scheduleRevalidate);
    };
  }, [commit, nextId]);

  // Bobbing: one attribute write per clock tick; CSS does the rest
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || prefersReducedMotion()) return;
    let frame = 0;
    return subscribeClock(() => {
      frame ^= 1;
      layer.dataset.frame = String(frame);
    });
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const handle of timers) window.clearTimeout(handle);
      timers.clear();
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className={`${styles.layer} no-print`} aria-hidden="true" data-frame="0">
        {coins.map((coin) => (
          <CoinButton key={coin.id} coin={coin} onCollect={collect} />
        ))}
        {pops.map((pop) => (
          <div
            key={pop.id}
            className={styles.pop}
            style={{ left: pop.x, top: pop.y - pop.step * POP_RISE, width: pop.width }}
          >
            <span>+1</span>
          </div>
        ))}
      </div>
      <ScoreHud score={score} />
    </>
  );
}
