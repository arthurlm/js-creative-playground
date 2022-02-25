import { Context, Entity, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { degToRad } from "../math";

const scene = new Scene();
scene.frameOpacity = 0.05;

class AnimatedPolygon extends Polygon {
  alpha: number;
  radiusRatio: number;
  hue: number;

  constructor(context: Context) {
    super();

    this.alpha = context.tickCount;
    this.radiusRatio = 20.0;
    this.hue = (context.tickCount / 2) % 360;
  }

  annimate(context: Context): void {
    const theta = context.tickCount / 500 + this.alpha;
    const radius = this.radiusRatio;
    this.updatePoints(Point2.center(context), 5, radius, theta);

    this.radiusRatio *= 1.005;
  }

  drawBegin(context: Context): void {
    context.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
    context.ctx.lineWidth = 2;
  }
}

scene.onStart = (context) => {
  if (context.tickCount % 20 == 0) {
    scene.entites.push(new AnimatedPolygon(context));
  }
};

scene.onEnd = () => {
  scene.entites = scene.entites.filter((x) => {
    if (x instanceof AnimatedPolygon) {
      return x.radiusRatio < 2000.0;
    }
    return true;
  });
};

export default scene;
