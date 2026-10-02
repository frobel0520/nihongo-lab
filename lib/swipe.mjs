/** Left advances, right goes back; reject taps, vertical scrolls and long drags. @param {number} dx @param {number} dy @param {number} elapsed */
export function swipeStep(dx, dy, elapsed) {
  if (elapsed < 0 || elapsed > 1000 || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return 0;
  return dx < 0 ? 1 : -1;
}
