import { Context, Entity, Scene } from "../context";
import { Point2 } from "../geometry";
import { degToRad, randRange } from "../math";

class Particle implements Entity {
  public radius: number;
  public position: Point2;
  public direction: Point2;
  public offset: number;
  public alpha: number;
  public hue: number;

  constructor(context: Context) {
    this.radius = randRange(3.0, 5.0);

    this.position = Point2.random().scaleSized(context);
    this.direction = Point2.random()
      .translate(-0.5)
      .translateY(-0.5)
      .scale(1 / this.radius)
      .scaleX(2)
      .scaleY(4);

    this.offset = randRange(-10, 10);
    this.alpha = randRange(0, 0.8);
    this.hue = (randRange(0, 120) + context.tickCount) % 360;
  }

  annimate(context: Context) {
    const angle =
      Math.cos(context.tickCount / 10 + this.offset / 5) * 5 * this.offset;

    const delta = this.direction.rotate(degToRad(angle));

    this.position = this.position.translateVec(delta).clip(context);
    this.alpha -= 0.01;
  }

  draw(context: Context) {
    const ctx = context.ctx;
    const alpha = this.alpha * this.alpha;

    ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }
}

const scene = new Scene();

scene.frameOpacity = 0.05;

scene.onStart = (context) => {
  while (scene.entites.length < 5000) {
    scene.entites.push(new Particle(context));
  }
};

scene.onEnd = () => {
  scene.entites = scene.entites.filter((x) => {
    if (x instanceof Particle) {
      return x.alpha > 0;
    }
    return true;
  });
};

export default scene;
