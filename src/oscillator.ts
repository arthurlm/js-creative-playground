import { Context } from "./context";

/**
 * Represent any periodic function.
 */
export interface Oscillator {
  /**
   * Get next value based on frame count.
   *
   * @param context Rendering context
   */
  valueFramed(context: Context): number;

  /**
   * Get next value based on timestamp.
   *
   * @param context Rendering context.
   */
  valueTimed(context: Context): number;
}

/**
 * Base class for oscillator implementations.
 */
export abstract class GenericOscillator implements Oscillator {
  abstract compute(t: number): number;

  valueFramed(context: Context): number {
    return this.compute(context.tickCount);
  }

  valueTimed(context: Context): number {
    return this.compute(context.timestamp);
  }
}

/**
 * Oscillator returning constant value
 */
export class ConstOscillator extends GenericOscillator {
  constructor(public value: number) {
    super();
  }

  override compute(t: number): number {
    return this.value;
  }
}

/**
 * Optional parameters for SineOscilator.
 */
export interface SineOscilatorParam {
  min?: number;
  max?: number;
  thetaOffset?: number;
  speed?: number;
}

/**
 * Oscilator following trigonometric functions.
 */
export class SineOscilator extends GenericOscillator {
  public min: number;
  public max: number;
  public thetaOffset: number;
  public speed: number;

  constructor(param: SineOscilatorParam = {}) {
    super();
    this.min = param.min || 0.0;
    this.max = param.max || 1.0;
    this.thetaOffset = param.thetaOffset || 0.0;
    this.speed = param.speed || 1.0;
  }

  override compute(t: number): number {
    // Move from [-1, +1] to [0, 1]
    const num = (Math.sin(t * this.speed + this.thetaOffset) + 1.0) / 2.0;

    // Scale to [min, max]
    return num * (this.max - this.min) + this.min;
  }
}

/**
 * Optional parameters for LinearOscillator.
 */
export interface LinearOscillatorParam {
  min?: number;
  max?: number;
  speed?: number;
}

/**
 * Linear oscillator
 */
export class LinearOscillator extends GenericOscillator {
  public min: number;
  public max: number;
  public speed: number;

  constructor(param: LinearOscillatorParam = {}) {
    super();
    this.min = param.min || 0.0;
    this.max = param.max || 1.0;
    this.speed = param.speed || 1.0;
  }

  override compute(t: number): number {
    return ((t * this.speed) % (this.max - this.min)) + this.min;
  }
}

/**
 * Combine multiple oscillators.
 */
export class CompositeOscillator implements Oscillator {
  constructor(public components: Oscillator[]) {}

  valueFramed(context: Context): number {
    return this.components
      .map((x) => x.valueFramed(context))
      .reduce((acc, x) => acc + x, 0.0);
  }

  valueTimed(context: Context): number {
    return this.components
      .map((x) => x.valueTimed(context))
      .reduce((acc, x) => acc + x, 0.0);
  }
}
