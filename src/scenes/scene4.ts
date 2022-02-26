import { Context, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { degToRad, randRange } from "../math";
import { LinearOscillator, Oscillator, SineOscilator } from "../oscillator";
import {
  NoiseGenerator,
  Perlin1DHarmonicNoiseGenerator,
  Perlin1DNoiseGenerator,
} from "../random";

class AnimatedPolygon extends Polygon {
  radiusGenerator: NoiseGenerator;
  rotationGenerator: Oscillator;
  shapeGenerator: NoiseGenerator;
  hue: number;

  constructor(idx: number, public lineWidth: number, public lighness: number) {
    super();
    this.radiusGenerator = new Perlin1DHarmonicNoiseGenerator({
      amplitude: 128 * idx,
      waveLength: 512,
    });
    this.rotationGenerator = new LinearOscillator({
      min: 0,
      max: 2 * Math.PI,
      speed: idx / 25,
    });
    this.shapeGenerator = new Perlin1DNoiseGenerator({
      amplitude: 8,
    });
    this.hue = Math.floor(randRange(0, 360));
  }

  override annimate(context: Context): void {
    const radius = this.radiusGenerator.nextValue();
    const offset = this.rotationGenerator.valueTimed(context);
    const shape = this.shapeGenerator.nextValue() + 8;
    this.updatePoints(Point2.center(context), shape, radius, -offset);
  }

  override drawBegin(context: Context): void {
    context.ctx.strokeStyle = `hsl(${this.hue}, 30%, ${this.lighness}%)`;
    context.ctx.lineWidth = this.lineWidth;
  }
}

const scene = new Scene();

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    for (let idx = 0; idx < 7; idx++) {
      scene.entites.push(new AnimatedPolygon(idx, 2, 90));
      for (let j = 0; j < 5; j++) {
        scene.entites.push(new AnimatedPolygon(idx, 0.2, 40));
      }
      for (let j = 0; j < 50; j++) {
        scene.entites.push(new AnimatedPolygon(idx, 0.05, 30));
      }
    }
  }
};

scene.frameOpacity = 0.025;

export default scene;
