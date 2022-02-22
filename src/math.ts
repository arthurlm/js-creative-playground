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

export default {
  clip,
  randRange,
  radToDeg,
  degToRad,
};
