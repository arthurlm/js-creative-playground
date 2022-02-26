/**
 * Make sure value is between min and max.
 *
 * @param v Value
 * @param min Min allowed
 * @param max Max allowed
 * @returns Clipped value
 */
export function clip(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/**
 * Helpers to get random value.
 *
 * @param min Min range value
 * @param max Max range value
 * @returns Random value between min and max
 */
export function randRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Convert between degree and radian.
 *
 * @param value Degree
 * @returns Radian
 */
export function degToRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Convert between degree and radian.
 *
 * @param value Radian
 * @returns Degree
 */
export function radToDeg(value: number): number {
  return (value * 180) / Math.PI;
}

/**
 * Cosine interpolation.
 *
 * @param y0 y0 value
 * @param y1 y1 value
 * @param x x value
 * @returns Y between Y0 and Y1
 */
export function cosineInterpolate(y0: number, y1: number, x: number): number {
  const ft = x * Math.PI;
  const f = (1.0 - Math.cos(ft)) * 0.5;
  return y0 * (1.0 - f) + y1 * f;
}

/**
 * Linear interpolation.
 *
 * @param y0 y0 value
 * @param y1 y1 value
 * @param x x value
 * @returns Y between Y0 and Y1
 *
 * @see https://en.wikipedia.org/wiki/Linear_interpolation
 */
export function lerp(y0: number, y1: number, x: number): number {
  return (1.0 - x) * y0 + x * y1;
}

export default {
  clip,
  randRange,
  radToDeg,
  degToRad,
  cosineInterpolate,
  lerp,
};
