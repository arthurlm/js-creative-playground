import { Context, Entity, Scene } from "../context";
import { degToRad } from "../math";
import {
  Matrix,
  rotMatrixZ,
  rotMatrixX,
  rotMatrixY,
  translateMatrix,
} from "../matrix";
import { Oscillator, SineOscilator } from "../oscillator";

const CAMERA_F_MIN = 0.4;
const CAMERA_F_MAX = 1.2;
const CAMERA_POS = translateMatrix(0, 0, -3);

class Cube implements Entity {
  coord: Matrix;
  focale: Oscillator;

  constructor(context: Context) {
    this.coord = new Matrix(8, 4);
    // Front plane
    this.coord.pushPoint(-1, -1, -1);
    this.coord.pushPoint(+1, -1, -1);
    this.coord.pushPoint(+1, +1, -1);
    this.coord.pushPoint(-1, +1, -1);
    // Back plane
    this.coord.pushPoint(-1, -1, +1);
    this.coord.pushPoint(+1, -1, +1);
    this.coord.pushPoint(+1, +1, +1);
    this.coord.pushPoint(-1, +1, +1);

    // Create an oscillator to change camera F on the fly :p
    this.focale = new SineOscilator({
      min: CAMERA_F_MIN,
      max: CAMERA_F_MAX,
    });
  }

  annimate(context: Context): void {
    this.coord = this.coord
      .dot(rotMatrixY(Math.cos(context.timestamp) / 200))
      .dot(rotMatrixX(degToRad(0.3)))
      .dot(rotMatrixZ(Math.sin(context.timestamp / 2) / 200));
  }

  draw(context: Context): void {
    const ctx = context.ctx;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    const points = this.coord
      .dot(CAMERA_POS)
      .project(this.focale.valueTimed(context))
      .add(1)
      .scale(0.5)
      .toPointArray();

    const screenPoints = points.map((x) => x.scaleSized(context));

    ctx.beginPath();

    ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
    ctx.lineTo(screenPoints[1].x, screenPoints[1].y);
    ctx.lineTo(screenPoints[2].x, screenPoints[2].y);
    ctx.lineTo(screenPoints[3].x, screenPoints[3].y);
    ctx.lineTo(screenPoints[0].x, screenPoints[0].y);

    ctx.moveTo(screenPoints[4].x, screenPoints[4].y);
    ctx.lineTo(screenPoints[5].x, screenPoints[5].y);
    ctx.lineTo(screenPoints[6].x, screenPoints[6].y);
    ctx.lineTo(screenPoints[7].x, screenPoints[7].y);
    ctx.lineTo(screenPoints[4].x, screenPoints[4].y);

    ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
    ctx.lineTo(screenPoints[4].x, screenPoints[4].y);

    ctx.moveTo(screenPoints[1].x, screenPoints[1].y);
    ctx.lineTo(screenPoints[5].x, screenPoints[5].y);

    ctx.moveTo(screenPoints[2].x, screenPoints[2].y);
    ctx.lineTo(screenPoints[6].x, screenPoints[6].y);

    ctx.moveTo(screenPoints[3].x, screenPoints[3].y);
    ctx.lineTo(screenPoints[7].x, screenPoints[7].y);

    ctx.stroke();
  }
}

const scene = new Scene(__filename);

scene.onStart = (context) => {
  if (scene.entites.length == 0) {
    scene.entites.push(new Cube(context));
  }
};

export default scene;
