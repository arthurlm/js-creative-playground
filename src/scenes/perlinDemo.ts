import { Context, Entity, Scene } from "../context";
import { buildSceneTitle } from "../entities/text";
import { Point2 } from "../geometry";
import { NoiseGenerator, Perlin1DNoiseGenerator } from "../random";

class Circle implements Entity {
  center: Point2;
  noiseGeneratorX: NoiseGenerator;
  noiseGeneratorY: NoiseGenerator;

  constructor(context: Context) {
    this.center = Point2.center(context);
    this.noiseGeneratorX = new Perlin1DNoiseGenerator({
      amplitude: context.width,
    });
    this.noiseGeneratorY = new Perlin1DNoiseGenerator({
      amplitude: context.height,
      waveLength: 256,
    });
  }

  annimate(context: Context): void {
    this.center.x = this.noiseGeneratorX.nextValue();
    this.center.y = this.noiseGeneratorY.nextValue();
  }

  draw(context: Context): void {
    const radius = 20;

    context.ctx.fillStyle = "white";
    context.ctx.beginPath();
    context.ctx.arc(
      this.center.x,
      this.center.y,
      radius,
      0,
      Math.PI * 2,
      false
    );
    context.ctx.fill();
  }
}

const scene = new Scene();

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    scene.entites.push(buildSceneTitle(context, "Demo perlin noise"));
    scene.entites.push(new Circle(context));
  }
};

export default scene;
