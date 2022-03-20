import { Point2 } from "./geometry";

export class Matrix {
  private _width: number;
  private _height: number;
  private capacity: number;
  private data: number[];

  constructor(height: number, width: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid matrix shape");
    }
    this._width = width;
    this._height = height;

    this.capacity = 0;
    this.data = new Array(width * height);
  }

  clear(): Matrix {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = 0;
    }
    return this;
  }

  private indexOf(i: number, j: number): number {
    if (j >= this._width || i >= this._height || i < 0 || j < 0) {
      return -1;
    }
    return i * this._width + j;
  }

  push(row: number[]) {
    if (this._width != row.length) {
      throw new Error("Invalid row length");
    }

    if (this.capacity == this.height) {
      throw new Error("Matrix already full");
    }

    for (let j = 0; j < row.length; j++) {
      this.data[this.indexOf(this.capacity, j)] = row[j];
    }

    this.capacity++;
  }

  pushPoint(x: number, y: number, z: number) {
    this.push([x, y, z, 1]);
  }

  get height(): number {
    return this._height;
  }

  get width(): number {
    return this._width;
  }

  cell(i: number, j: number): number {
    return this.data[this.indexOf(i, j)];
  }

  toString(): string {
    let out = "[";
    for (let i = 0; i < this.height; i++) {
      if (i > 0) {
        out += ",";
      }

      out += "[";
      for (let j = 0; j < this.width; j++) {
        if (j > 0) {
          out += ",";
        }
        let value = this.data[this.indexOf(i, j)];
        out += (Math.round(value * 1e6) / 1e6).toString();
      }
      out += "]";
    }
    out += "]";

    return out;
  }

  transpose(): Matrix {
    const result = new Matrix(this._width, this._height);

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        result.data[result.indexOf(i, j)] = this.data[this.indexOf(j, i)];
      }
    }

    return result;
  }

  get T(): Matrix {
    return this.transpose();
  }

  copy(): Matrix {
    const out = new Matrix(this._height, this._width);
    out.capacity = this.capacity;

    for (let i = 0; i < this.data.length; i++) {
      out.data[i] = this.data[i];
    }

    return out;
  }

  add(value: number): Matrix {
    const out = this.copy();

    for (let i = 0; i < this.data.length; i++) {
      out.data[i] += value;
    }

    return out;
  }

  addMat(other: Matrix): Matrix {
    if (this._width != other._width || this._height != other._height) {
      throw new Error("Cannot add matrix together: invalid size");
    }

    const out = this.copy();

    for (let i = 0; i < out.data.length; i++) {
      out.data[i] += other.data[i];
    }

    return out;
  }

  scale(value: number): Matrix {
    const out = this.copy();

    for (let i = 0; i < this.data.length; i++) {
      out.data[i] *= value;
    }

    return out;
  }

  dot(other: Matrix): Matrix {
    if (this.width != other.height) {
      throw new Error("Invalid dot matrix size");
    }

    const result = new Matrix(this.height, other.width);

    for (let i = 0; i < result.height; i++) {
      for (let j = 0; j < result.width; j++) {
        let v = 0;

        for (let k = 0; k < this.width; k++) {
          v += this.data[this.indexOf(i, k)] * other.data[other.indexOf(k, j)];
        }

        result.data[result.indexOf(i, j)] = v;
      }
    }

    result.capacity = result.height;

    return result;
  }

  project(f: number): Matrix {
    if (this.width != 4) {
      throw new Error("invalid points matrix input");
    }

    const out = new Matrix(this.height, 2);

    for (let i = 0; i < this.height; i++) {
      const s = f / this.data[this.indexOf(i, 2)];
      const x = s * this.data[this.indexOf(i, 0)];
      const y = s * this.data[this.indexOf(i, 1)];
      out.data[out.indexOf(i, 0)] = x;
      out.data[out.indexOf(i, 1)] = y;
    }

    return out;
  }

  toPointArray(): Point2[] {
    if (this.width != 2) {
      throw new Error("matrix width is not 2");
    }

    const out = new Array(this.height);

    for (let i = 0; i < this.height; i++) {
      const x = this.data[this.indexOf(i, 0)];
      const y = this.data[this.indexOf(i, 1)];
      out[i] = new Point2(x, y);
    }

    return out;
  }
}

export function rotMatrixX(theta: number): Matrix {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  const out = new Matrix(4, 4);
  out.push([1, 0, 0, 0]);
  out.push([0, ct, -st, 0]);
  out.push([0, st, ct, 0]);
  out.push([0, 0, 0, 1]);
  return out;
}

export function rotMatrixY(theta: number): Matrix {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  const out = new Matrix(4, 4);
  out.push([ct, 0, st, 0]);
  out.push([0, 1, 0, 0]);
  out.push([-st, 0, ct, 0]);
  out.push([0, 0, 0, 1]);
  return out;
}

export function rotMatrixZ(theta: number): Matrix {
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  const out = new Matrix(4, 4);
  out.push([ct, -st, 0, 0]);
  out.push([st, ct, 0, 0]);
  out.push([0, 0, 1, 0]);
  out.push([0, 0, 0, 1]);
  return out;
}

export function translateMatrix(x: number, y: number, z: number): Matrix {
  const out = new Matrix(4, 4);
  out.push([1, 0, 0, x]);
  out.push([0, 1, 0, y]);
  out.push([0, 0, 1, z]);
  out.push([0, 0, 0, 1]);
  return out.T; // Points are stored in line
}
