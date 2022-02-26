import { Palette, Hsla } from "../colors";
import { Context, Entity, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { randRange } from "../math";
import { LinearOscillator, Oscillator } from "../oscillator";
import {
  NoiseGenerator,
  Perlin1DHarmonicNoiseGenerator,
  Perlin1DNoiseGenerator,
} from "../random";

const PALETTE = new Palette(
  "f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0"
);

class SharedState implements Entity {
  private directionX: NoiseGenerator;
  private directionY: NoiseGenerator;

  public center: Point2;

  constructor(context: Context) {
    this.directionX = new Perlin1DNoiseGenerator({ amplitude: 200 });
    this.directionY = new Perlin1DNoiseGenerator({ amplitude: 200 });
    this.annimate(context);
  }

  annimate(context: Context): void {
    this.center = new Point2(
      context.width / 2 + this.directionX.nextValue() - 100,
      context.height / 2 + this.directionY.nextValue() - 100
    );
  }

  draw(context: Context): void {
    // NO DRAW !
    // this is a hack to have global variables
  }
}

class AnimatedPolygon extends Polygon {
  radiusGenerator: NoiseGenerator;
  rotationGenerator: Oscillator;
  shapeGenerator: NoiseGenerator;
  color: Hsla;

  constructor(
    public shared: SharedState,
    idx: number,
    public lineWidth: number,
    lightnessRatio: number = 1.0
  ) {
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

    this.color = PALETTE.getColor(randRange(0, 50)).toHsla();
    this.color.lightness *= lightnessRatio;
  }

  override annimate(context: Context): void {
    const radius = this.radiusGenerator.nextValue();
    const offset = this.rotationGenerator.valueTimed(context);
    const shape = this.shapeGenerator.nextValue() + 8;
    this.updatePoints(this.shared.center, shape, radius, -offset);
  }

  override drawBegin(context: Context): void {
    context.ctx.strokeStyle = this.color.toString();
    context.ctx.lineWidth = this.lineWidth;
  }
}

const scene = new Scene();

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    const shared = new SharedState(context);
    scene.entites.push(shared);

    for (let idx = 0; idx < 7; idx++) {
      scene.entites.push(new AnimatedPolygon(shared, idx, 2));
      for (let j = 0; j < 5; j++) {
        scene.entites.push(new AnimatedPolygon(shared, idx, 0.2, 0.8));
      }
      for (let j = 0; j < 50; j++) {
        scene.entites.push(new AnimatedPolygon(shared, idx, 0.05, 0.7));
      }
    }
  }
};

scene.frameOpacity = 0.025;

export default scene;
