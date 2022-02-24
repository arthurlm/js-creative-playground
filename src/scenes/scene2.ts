import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { rgba } from "../helpers";

const scene = new Scene();

const MAIN_CIRCLE_RADIUS = 200;

class Particle implements Entity {
  position: Point2;
  tick: number;
  alpha: number;

  constructor(context: Context, phi: number) {
    this.position = new Point2(
      context.width / 2 -
        Math.sin(context.tickCount / 50 + phi) * MAIN_CIRCLE_RADIUS,
      context.height / 2 +
        Math.cos(context.tickCount / 50 + phi) * MAIN_CIRCLE_RADIUS
    );
    this.tick = 0;
    this.alpha = 10.0;
  }

  annimate(context: Context): void {
    this.tick += 1;
    this.alpha *= 0.95;
  }

  draw(context: Context): void {
    const ctx = context.ctx;

    ctx.strokeStyle = rgba(1, 1, 1, Math.min(this.alpha, 1.0));

    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.tick * 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.stroke();
  }
}

scene.onStart = (context) => {
  if (context.tickCount % 10 == 0) {
    scene.entites.push(new Particle(context, 0));
    scene.entites.push(new Particle(context, Math.PI / 2));
    scene.entites.push(new Particle(context, Math.PI));
    scene.entites.push(new Particle(context, (Math.PI * 3) / 2));
  }
};

scene.onEnd = () => {
  scene.entites = scene.entites.filter((x) => {
    if (x instanceof Particle) {
      return x.alpha > 0.01;
    }
    return true;
  });
};

export default scene;
