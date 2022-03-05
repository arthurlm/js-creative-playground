import { Palette } from "../colors";
import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { randRange } from "../math";
import { NoiseGenerator, Perlin1DNoiseGenerator, randNormal } from "../random";

const coolors =
  "d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77";
const palette = new Palette(coolors);

const scene = new Scene(__filename);
scene.frameOpacity = 0;

const ELEMENT_COUNT = 400;

class Element implements Entity {
  color: string;
  size: number;
  position: Point2;
  directionGenerator: NoiseGenerator;

  constructor(context: Context) {
    this.color = palette.getRandColor().toString();
    this.size = randRange(2, 5);
    this.position = new Point2(randNormal(), randNormal()).scaleSized(context);
    this.directionGenerator = new Perlin1DNoiseGenerator({
      amplitude: Math.PI * 2,
    });

    this.annimate(context);
  }

  annimate(context: Context): void {
    const direction = new Point2(1.0).rotate(
      this.directionGenerator.nextValue()
    );
    this.position = this.position.translateVec(direction).clip(context);
  }

  draw(context: Context): void {
    const ctx = context.ctx;

    const top_left = this.position.translate(-this.size / 2.0);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(top_left.x, top_left.y, this.size, this.size);
    ctx.fill();
  }
}

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    for (let i = 1; i <= ELEMENT_COUNT; i++) {
      scene.entites.push(new Element(context));
    }
  }
};

export default scene;
