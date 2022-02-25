import { Context, Scene } from "../context";
import { Point2, Polygon } from "../geometry";
import { degToRad } from "../math";
import {
  ConstOscillator,
  LinearOscillator,
  Oscillator,
  SineOscilator,
} from "../oscillator";

class AnimatedPolygon extends Polygon {
  constructor(
    private centerX: number,
    private centerY: number,
    private oscillator: Oscillator
  ) {
    super();
  }

  annimate(context: Context): void {
    const center = new Point2(this.centerX, this.centerY).scaleSized(context);
    const offset = this.oscillator.valueTimed(context);

    this.updatePoints(center, 3, 100, degToRad(offset));
  }
}

const scene = new Scene();

scene.onStart = () => {
  if (scene.entites.length == 0) {
    // Const
    scene.entites.push(
      new AnimatedPolygon(1 / 4, 1 / 3, new ConstOscillator(0.0))
    );
    scene.entites.push(
      new AnimatedPolygon(1 / 4, 2 / 3, new ConstOscillator(180))
    );

    // Sine
    scene.entites.push(
      new AnimatedPolygon(
        2 / 4,
        1 / 3,
        new SineOscilator({
          speed: 2,
          min: -90,
          max: 90,
        })
      )
    );

    scene.entites.push(
      new AnimatedPolygon(
        2 / 4,
        2 / 3,
        new SineOscilator({
          speed: 2,
          min: 45,
          max: -45,
        })
      )
    );

    // Linear
    scene.entites.push(
      new AnimatedPolygon(
        3 / 4,
        1 / 3,
        new LinearOscillator({
          speed: 100,
          min: -90,
          max: 90,
        })
      )
    );
    scene.entites.push(
      new AnimatedPolygon(
        3 / 4,
        2 / 3,
        new LinearOscillator({
          speed: 100,
          min: 0,
          max: 360,
        })
      )
    );
  }
};

export default scene;
