import { Hsla, Rgba } from "../colors";
import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { randRange } from "../math";

const scene = new Scene();

const POINT_COUNT = 10.0;

class Circle implements Entity {
  direction: Point2;
  color: Hsla;
  radius: number;

  constructor(context: Context, private center: Point2) {
    this.direction = Point2.random().scale(randRange(1, 10));
    this.color = Rgba.fromHex("#f72585FF").toHsla();
    this.radius = Math.min(
      context.width / (POINT_COUNT + 1) / 2,
      context.height / (POINT_COUNT + 1) / 2
    );
  }

  annimate(context: Context): void {
    this.center = this.center.translateVec(
      this.direction.scale(1 / context.tickCount)
    );

    if (context.tickCount % 2 == 0) {
      this.color.lightness = Math.max(0, this.color.lightness - 1);
    } else {
      this.color.saturation = Math.max(0, this.color.saturation + 1);
    }

    this.radius *= 0.999;
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

scene.frameOpacity = 0;

export default scene;
