/* Shared pixel-art helpers. All art is generated from ASCII bitmaps and integer rects, so pixels stay square. */

export const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;

/** Path covering every cell of `rows` whose character is in `chars`, one rect per horizontal run. */
export function cellsToPath(rows: readonly string[], chars: string, unit = 1, originX = 0, originY = 0): string {
  let d = "";
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      if (!chars.includes(row[x])) {
        x++;
        continue;
      }
      let end = x;
      while (end < row.length && chars.includes(row[end])) end++;
      d += rect(originX + x * unit, originY + y * unit, (end - x) * unit, unit);
      x = end;
    }
  });
  return d;
}

/** Small deterministic generator: server-rendered scenery must be identical on every render. */
export function lcg(seed: number) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
