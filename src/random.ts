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

/**
 * Merge multiple noise generator together.
 */
export class CompositeNoiseGenerator implements NoiseGenerator {
  constructor(private generators: NoiseGenerator[]) {}

  nextValue(): number {
    return this.generators
      .map((x) => x.nextValue())
      .reduce((acc, x) => acc + x, 0.0);
  }
}

export interface Perlin1DHarmonicNoiseGeneratorParams
  extends Perlin1DNoiseGeneratorParams {
  octave?: number;
  divisor?: number;
}

export class Perlin1DHarmonicNoiseGenerator implements NoiseGenerator {
  private composite: CompositeNoiseGenerator;

  constructor(params: Perlin1DHarmonicNoiseGeneratorParams = {}) {
    let amplitude = params.amplitude || 1.0;
    let waveLength = params.waveLength || 128.0;
    const octave = params.octave || 8;
    const divisor = params.divisor || 4.0;

    const generators = [];
    for (let i = 0; i < octave; i++) {
      generators.push(
        new Perlin1DNoiseGenerator({
          amplitude,
          waveLength,
        })
      );

      amplitude /= divisor;
      waveLength /= divisor;
    }

    this.composite = new CompositeNoiseGenerator(generators);
  }

  nextValue(): number {
    return this.composite.nextValue();
  }
}

/**
 * Generate 1 value every each period
 */
export class DiracNoiseGenerator implements NoiseGenerator {
  private timeout: number;

  constructor(public period_ms: number) {
    if (period_ms < 0) {
      throw new Error("period cannot be lower than 0");
    }

    this.timeout = 0;
  }

  nextValue(): number {
    const now = Date.now();
    if (this.timeout < now) {
      this.timeout = now + this.period_ms;
      return 1;
    }

    return 0;
  }
}

export default {
  randNormal,
  CompositeNoiseGenerator,
  Perlin1DNoiseGenerator,
  Perlin1DHarmonicNoiseGenerator,
  DiracNoiseGenerator,
};
