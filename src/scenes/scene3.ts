import { Context, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { randRange } from "../math";
import {
  CompositeOscillator,
  ConstOscillator,
  LinearOscillator,
  Oscillator,
  SineOscilator,
} from "../oscillator";

const scene = new Scene();
scene.frameOpacity = 0.05;

class AnimatedPolygon extends Polygon {
  radiusRatio: number;
  hue: number;
  lineWidth: number;
  angleOscillator: Oscillator;

  constructor(context: Context) {
    super();

    this.radiusRatio = 20.0;
    this.hue = (context.tickCount / 2) % 360;
    this.lineWidth = randRange(0, 5);

    this.angleOscillator = new CompositeOscillator([
      new SineOscilator({
        speed: 0.002,
        min: 0,
        max: 2 * Math.PI,
        thetaOffset: context.tickCount,
      }),
      new SineOscilator({
        speed: 0.005,
        min: 0,
        max: 2 * Math.PI,
      }),
      new ConstOscillator(context.tickCount),
    ]);
  }

  annimate(context: Context): void {
    const theta = this.angleOscillator.valueFramed(context);
    const radius = this.radiusRatio;
    this.updatePoints(Point2.center(context), 5, radius, theta);

    this.radiusRatio *= 1.005;
  }

  drawBegin(context: Context): void {
    context.ctx.strokeStyle = `hsl(${this.hue}, 40%, 65%)`;
    context.ctx.lineWidth = this.lineWidth;
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
