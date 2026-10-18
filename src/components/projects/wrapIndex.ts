/** Keeps an index inside [0, length) so navigation wraps around at both ends. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}
