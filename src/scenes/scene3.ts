import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { rgba } from "../helpers";
import { degToRad } from "../math";

const scene = new Scene();

const MAIN_RADIUS = 20;

class Triangle implements Entity {
  p1: Point2;
  p2: Point2;
  p3: Point2;
  alpha: number;
  radiusRatio: number;

  constructor(context: Context) {
    this.alpha = context.tickCount;
    this.radiusRatio = 1.0;
    this.annimate(context);
  }

  annimate(context: Context): void {
    const theta = context.tickCount / 50 + this.alpha;
    const radius = MAIN_RADIUS * this.radiusRatio;

    this.p1 = new Point2(
      context.width / 2 + radius * Math.cos(theta),
      context.height / 2 + radius * Math.sin(theta)
    );
    this.p2 = new Point2(
      context.width / 2 + radius * Math.cos(degToRad(120) + theta),
      context.height / 2 + radius * Math.sin(degToRad(120) + theta)
    );
    this.p3 = new Point2(
      context.width / 2 + radius * Math.cos(degToRad(240) + theta),
      context.height / 2 + radius * Math.sin(degToRad(240) + theta)
    );

    this.radiusRatio *= 1.01;
  }

  draw(context: Context): void {
    const ctx = context.ctx;

    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.stroke();
  }
}

scene.onStart = (context) => {
  if (context.tickCount % 50 == 0) {
    scene.entites.push(new Triangle(context));
  }
};

scene.onEnd = () => {
  scene.entites = scene.entites.filter((x) => {
    if (x instanceof Triangle) {
      return x.radiusRatio < 100.0;
    }
    return true;
  });
};

export default scene;