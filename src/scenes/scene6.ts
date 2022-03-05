import { Hsla, Palette } from "../colors";
import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { randRange } from "../math";
import {
  CompositeOscillator,
  ConstOscillator,
  LinearOscillator,
  Oscillator,
} from "../oscillator";
import {
  NoiseGenerator,
  Perlin1DHarmonicNoiseGenerator,
  Perlin1DNoiseGenerator,
} from "../random";

const ENTITY_COUNT = 75;

const scene = new Scene(__filename);
const palette = new Palette(
  "fffae5-fff6cc-fff2b2-ffee99-ffe97f-ffe566-ffe14c-ffdd32-ffd819-ffd400"
);

class Shared implements Entity {
  ratioGenerator: NoiseGenerator;
  radiusGenerator: NoiseGenerator;

  ratio: number;
  radius: number;

  constructor(context: Context) {
    this.ratioGenerator = new Perlin1DNoiseGenerator({
      amplitude: 2.0,
    });

    this.radiusGenerator = new Perlin1DHarmonicNoiseGenerator({
      amplitude: 100,
    });

    this.annimate(context);
  }

  annimate(context: Context): void {
    this.ratio = this.ratioGenerator.nextValue() + 1 / 3;
    this.radius = this.radiusGenerator.nextValue() + 50;
  }

  draw(context: Context): void {}
}

class Circle implements Entity {
  shared: Shared;
  lineWidth: number;
  color: Hsla;

  angleOscillator: Oscillator;

  ratio: number;
  radius: number;
  angle: number;

  constructor(context: Context, shared: Shared, public idx: number) {
    this.shared = shared;
    this.lineWidth = randRange(1.5, 3);
    this.color = palette.getColor(randRange(0, 100)).toHsla();

    this.angleOscillator = new CompositeOscillator([
      new LinearOscillator({
        min: 0,
        max: 2 * Math.PI,
        speed: (idx / ENTITY_COUNT) * 0.5 + 1.0,
      }),
      new ConstOscillator(context.tickCount),
    ]);

    this.annimate(context);
  }

  annimate(context: Context): void {
    this.ratio = this.shared.ratio;
    this.radius = this.shared.radius + this.idx * 5.0;
    this.angle = this.angleOscillator.valueTimed(context);
    // this.angle = 0;
  }

  draw(context: Context): void {
    const ctx = context.ctx;

    const center = Point2.center(context);

    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color.toString();
    ctx.beginPath();
    ctx.ellipse(
      center.x,
      center.y,
      this.radius,
      this.radius * this.ratio,
      this.angle,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    const shared = new Shared(context);

    scene.entites.push(shared);
    for (let i = 1; i <= ENTITY_COUNT; i++) {
      scene.entites.push(new Circle(context, shared, i));
    }
  }
};

scene.frameOpacity = 0.2;

export default scene;
