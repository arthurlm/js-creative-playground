/**
 * Standard Normal variate using Box-Muller transform.
 *
 * @returns Random number.
 * @see https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 */
export function randNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num / 10.0 + 0.5;
}

export default {
  randNormal,
};
