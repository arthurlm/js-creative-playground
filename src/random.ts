import { cosineInterpolate } from "./math";

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

/**
 * Generic noise generator with no memory.
 */
export interface NoiseGenerator {
  nextValue(): number;
}

/**
 * 1D Perlin noise generator optional parameters.
 */
export interface Perlin1DNoiseGeneratorParams {
  amplitude?: number;
  waveLength?: number;
}

/**
 * 1D Perlin noise generator.
 *
 * @see https://oliverbalfour.github.io/javascript/2016/03/19/1d-perlin-noise.html
 */
export class Perlin1DNoiseGenerator implements NoiseGenerator {
  public amplitude: number;
  public waveLength: number;

  private a: number;
  private b: number;
  private x: number;

  constructor(params: Perlin1DNoiseGeneratorParams = {}) {
    // Generator params
    this.amplitude = params.amplitude || 1.0;
    this.waveLength = params.waveLength || 128.0;

    // Internal state
    this.x = 0.0;
    this.a = Math.random();
    this.b = Math.random();
  }

  nextValue(): number {
    let y = 0.0;

    if (this.x % this.waveLength === 0) {
      this.a = this.b;
      this.b = Math.random();
      y = this.a * this.amplitude;
    } else {
      y =
        cosineInterpolate(
          this.a,
          this.b,
          (this.x % this.waveLength) / this.waveLength
        ) * this.amplitude;
    }

    this.x += 1.0;

    return y;
  }
}

export default {
  randNormal,
  Perlin1DNoiseGenerator,
};
