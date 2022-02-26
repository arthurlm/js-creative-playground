import { Hsla, Palette } from "../colors";
import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { randRange } from "../math";
import { NoiseGenerator, Perlin1DNoiseGenerator } from "../random";

const scene = new Scene();

const POINT_COUNT = 25.0;
const PALETTE = new Palette(
  "f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0"
);

class Circle implements Entity {
  color: Hsla;

  directionX: NoiseGenerator;
  directionY: NoiseGenerator;

  radius: number;
  radiusGenerator: NoiseGenerator;

  constructor(context: Context, private center: Point2) {
    this.directionX = new Perlin1DNoiseGenerator({
      amplitude: 5,
    });
    this.directionY = new Perlin1DNoiseGenerator({
      amplitude: 5,
    });

    this.color = PALETTE.getColor(randRange(0, 50)).toHsla();
    this.radiusGenerator = new Perlin1DNoiseGenerator({
      amplitude: Math.min(
        context.width / (POINT_COUNT + 1) / 2,
        context.height / (POINT_COUNT + 1) / 2
      ),
      waveLength: 64,
    });
  }

  annimate(context: Context): void {
    this.center = this.center
      .translateX(this.directionX.nextValue() - 2.5)
      .translateY(this.directionY.nextValue() - 2.5)
      .clip(context);
    this.radius = this.radiusGenerator.nextValue();
  }

  draw(context: Context): void {
    context.ctx.fillStyle = this.color.toString();
    context.ctx.beginPath();
    context.ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    context.ctx.fill();
  }
}

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    for (let x = 1; x < POINT_COUNT; x++) {
      for (let y = 1; y < POINT_COUNT; y++) {
        const center = new Point2(
          (x * context.width) / POINT_COUNT,
          (y * context.height) / POINT_COUNT
        );

        scene.entites.push(new Circle(context, center));
      }
    }
  }
};

scene.frameOpacity = 0.05;

export default scene;
