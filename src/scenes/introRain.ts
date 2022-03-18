import { Hsla, Palette } from "../colors";
import { Context, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { randRange } from "../math";

const palette = new Palette(
  "03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08"
);

class RainDrop extends Polygon {
  center: Point2;
  arcCount: number;
  radius: number;
  growthSpeed: number;
  color: Hsla;

  constructor(context: Context) {
    super();
    this.center = Point2.random().scaleSized(context);
    this.arcCount = Math.floor(randRange(5, 8));
    this.growthSpeed = randRange(0.1, 2);
    this.radius = 0;
    this.color = palette.getRandColor().toHsla();
  }

  annimate(context: Context): void {
    this.updatePoints(
      this.center,
      this.arcCount,
      this.radius,
      context.tickCount / 100
    );
    this.radius += this.growthSpeed;
    this.color.alpha *= 0.97;
  }

  override drawBegin(context: Context): void {
    context.ctx.fillStyle = this.color.toString();
  }

  override drawEnd(context: Context): void {
    context.ctx.fill();
  }
}

const scene = new Scene(__filename);

scene.onStart = (context) => {
  if (Math.floor(randRange(0, 20)) == 0) {
    for (let i = 0; i < 10; i++) {
      scene.entites.push(new RainDrop(context));
    }
  }
};

scene.onEnd = () => {
  scene.entites = scene.entites.filter((x) => {
    if (x instanceof RainDrop) {
      return x.color.alpha >= 0.05;
    }
    return true;
  });
};

export default scene;
