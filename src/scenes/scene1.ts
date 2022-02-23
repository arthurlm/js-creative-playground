import { Context, Scene } from "../context";
import { Point2 } from "../geometry";
import { rgba } from "../helpers";
import { degToRad, randRange } from "../math";

class Particle {
  public tick: number;

  constructor(
    public position: Point2,
    public direction: Point2,
    public radius: number,
    public offset: number,
    public alpha: number
  ) {
    this.tick = 0;
  }

  annimate(context: Context) {
    this.tick += 1;

    const angle =
      Math.cos(context.tickCount / 10 + this.offset / 5) * 5 * this.offset;

    const delta = this.direction.rotate(degToRad(angle));

    this.position = this.position.translateVec(delta).clip(context);
    this.alpha -= 0.01;
  }

  draw(context: Context) {
    // Draw line depending of distance to center
    const screen_center = Point2.center(context);
    const dist_line_visible = context.height / 2 - 20;
    const distanceToCenter = this.position.distanceTo(screen_center);

    if (distanceToCenter < dist_line_visible) {
      const lineEnd = this.position
        .translateVec(screen_center)
        .scale(0.5)
        .translateVec(this.position.scale(-1))
        .rotate(degToRad(-20))
        .translateVec(this.position);

      // Setup color
      const color = (distanceToCenter * distanceToCenter) / dist_line_visible;

      context.ctx.strokeStyle = rgba(color, color, color, this.alpha);

      // Draw direction
      context.ctx.beginPath();
      context.ctx.moveTo(this.position.x, this.position.y);
      context.ctx.lineTo(lineEnd.x, lineEnd.y);
      context.ctx.stroke();
    }

    // Real draw 😎 !
    context.ctx.fillStyle = rgba(1, 1, 1, this.alpha * this.alpha);
    context.ctx.beginPath();
    context.ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    context.ctx.fill();
  }
}

const scene = new Scene();

scene.onStart = (context) => {
  while (scene.entites.length < 1000) {
    const position = Point2.random().scaleSized(context);
    const size = randRange(1.0, 3.5);
    const direction = Point2.random()
      .translate(-0.5)
      .translateY(-0.5)
      .scale(1 / size)
      .scaleX(2)
      .scaleY(4);
    const offset = randRange(-10, 10);
    const alpha = randRange(0, 0.8);

    scene.entites.push(new Particle(position, direction, size, offset, alpha));
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
