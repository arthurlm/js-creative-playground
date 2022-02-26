import { Context, Entity, Scene } from "../context";
import { buildSceneTitle } from "../entities/text";
import { Point2 } from "../geometry";
import {
  NoiseGenerator,
  Perlin1DHarmonicNoiseGenerator,
  Perlin1DNoiseGenerator,
} from "../random";

class Circle implements Entity {
  constructor(
    private color: string,
    private center: Point2,
    private noiseGeneratorX: NoiseGenerator,
    private noiseGeneratorY: NoiseGenerator
  ) {}

  annimate(context: Context): void {
    this.center.x = this.noiseGeneratorX.nextValue();
    this.center.y = this.noiseGeneratorY.nextValue();
  }

  draw(context: Context): void {
    const radius = 20;

    context.ctx.fillStyle = this.color;
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

    scene.entites.push(
      new Circle(
        "red",
        Point2.center(context),
        new Perlin1DNoiseGenerator({
          amplitude: context.width,
        }),
        new Perlin1DNoiseGenerator({
          amplitude: context.height,
          waveLength: 256,
        })
      )
    );

    scene.entites.push(
      new Circle(
        "green",
        Point2.center(context),
        new Perlin1DHarmonicNoiseGenerator({
          amplitude: context.width,
        }),
        new Perlin1DHarmonicNoiseGenerator({
          amplitude: context.height,
          waveLength: 256,
        })
      )
    );
  }
};

export default scene;
