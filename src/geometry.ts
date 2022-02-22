export interface Sized {
  width: number;
  height: number;
}

export class Point2 {
  constructor(public x: number = 0, public y: number = 0) {}

  clone(): Point2 {
    return new Point2(this.x, this.y);
  }

  translateX(factor: number): Point2 {
    return new Point2(this.x + factor, this.y);
  }

  translateY(factor: number): Point2 {
    return new Point2(this.x, this.y + factor);
  }

  translate(factor: number): Point2 {
    return this.translateX(factor).translateY(factor);
  }

  translateSized(other: Sized): Point2 {
    return this.translateX(other.width).translateY(other.height);
  }

  translateVec(other: Point2): Point2 {
    return this.translateX(other.x).translateY(other.y);
  }

  scaleX(factor: number): Point2 {
    return new Point2(this.x * factor, this.y);
  }

  scaleY(factor: number): Point2 {
    return new Point2(this.x, this.y * factor);
  }

  scale(factor: number): Point2 {
    return this.scaleX(factor).scaleY(factor);
  }

  scaleSized(other: Sized): Point2 {
    return this.scaleX(other.width).scaleY(other.height);
  }

  scaleVec(other: Point2): Point2 {
    return this.scaleX(other.x).scaleY(other.y);
  }

  rotate(angle: number): Point2 {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const x_1 = this.x * cosA - this.y * sinA;
    const y_1 = this.x * sinA + this.y * cosA;

    return new Point2(x_1, y_1);
  }

  distanceTo2(other: Point2): number {
    const x = this.x - other.x;
    const y = this.y - other.y;
    return x * x + y * y;
  }

  distanceTo(other: Point2) {
    return Math.sqrt(this.distanceTo2(other));
  }

  clip(screen: Sized): Point2 {
    const p = this.clone();

    if (p.x < 0) {
      p.x += screen.width;
    }
    if (p.x >= screen.width) {
      p.x -= screen.width;
    }

    if (p.y >= screen.height) {
      p.y -= screen.height;
    }
    if (p.y < 0) {
      p.y += screen.height;
    }

    return p;
  }

  static center(element: Sized): Point2 {
    return new Point2(element.width / 2, element.height / 2);
  }

  static random(): Point2 {
    return new Point2(Math.random(), Math.random());
  }
}

export default {
  Point2,
};
