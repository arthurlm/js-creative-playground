import { Point2 } from "./geometry";
import { degToRad } from "./math";
import {
  Matrix,
  rotMatrixX,
  rotMatrixY,
  rotMatrixZ,
  translateMatrix,
} from "./matrix";

test("invalid matrix size", () => {
  expect(() => new Matrix(0, 0)).toThrow("Invalid matrix shape");
});

test("matrix size", () => {
  let m: Matrix;

  m = new Matrix(3, 5);
  expect(m.width).toBe(5);
  expect(m.height).toBe(3);

  m = new Matrix(4, 8);
  expect(m.width).toBe(8);
  expect(m.height).toBe(4);
});

test("matrix invalid row size", () => {
  const m = new Matrix(2, 2);

  expect(() => {
    m.push([]);
  }).toThrow("Invalid row length");

  expect(() => {
    m.push([4, 3, 2]);
  }).toThrow("Invalid row length");
});

test("matrix full", () => {
  const m = new Matrix(3, 2);
  m.push([1, 2]);
  m.push([3, 4]);
  m.push([5, 6]);
  expect(() => {
    m.push([7, 8]);
  }).toThrow("Matrix already full");
});

test("matrix read cell", () => {
  const m = new Matrix(2, 4);
  m.pushPoint(1, 2, 3);
  m.pushPoint(4, 5, 6);

  expect(m.cell(-1, -1)).toBeUndefined();
  expect(m.cell(-1, 0)).toBeUndefined();
  expect(m.cell(-1, 5)).toBeUndefined();

  expect(m.cell(0, -1)).toBeUndefined();
  expect(m.cell(0, 0)).toBe(1);
  expect(m.cell(0, 1)).toBe(2);
  expect(m.cell(0, 2)).toBe(3);
  expect(m.cell(0, 3)).toBe(1);
  // expect(m.cell(0, 3)).toBeUndefined();
  expect(m.cell(0, 5)).toBeUndefined();

  expect(m.cell(1, -1)).toBeUndefined();
  expect(m.cell(1, 0)).toBe(4);
  expect(m.cell(1, 1)).toBe(5);
  expect(m.cell(1, 2)).toBe(6);
  expect(m.cell(1, 3)).toBe(1);
  // expect(m.cell(1, 3)).toBeUndefined();
  expect(m.cell(1, 5)).toBeUndefined();
});

test("matrix to string", () => {
  const m = new Matrix(2, 2).clear();
  expect(`${m}`).toBe("[[0,0],[0,0]]");

  m.push([1, 2]);
  expect(`${m}`).toBe("[[1,2],[0,0]]");

  m.push([3, 4]);
  expect(`${m}`).toBe("[[1,2],[3,4]]");
});

test("matrix transpose", () => {
  const m = new Matrix(3, 2).clear();
  expect(`${m.T}`).toBe("[[0,0,0],[0,0,0]]");

  m.push([1, 2]);
  expect(`${m}`).toBe("[[1,2],[0,0],[0,0]]");
  expect(`${m.T}`).toBe("[[1,0,0],[2,0,0]]");

  m.push([3, 4]);
  expect(`${m}`).toBe("[[1,2],[3,4],[0,0]]");
  expect(`${m.T}`).toBe("[[1,3,0],[2,4,0]]");

  m.push([5, 6]);
  expect(`${m}`).toBe("[[1,2],[3,4],[5,6]]");
  expect(`${m.T}`).toBe("[[1,3,5],[2,4,6]]");

  expect(m.width).toBe(2);
  expect(m.height).toBe(3);
  expect(m.T.width).toBe(3);
  expect(m.T.height).toBe(2);
});

test("matrix add scalar", () => {
  const m = new Matrix(2, 3);
  m.push([1, 2, 0]);
  m.push([4, 3, -1]);

  const r = m.add(1);
  expect(r.toString()).toBe("[[2,3,1],[5,4,0]]");
});

test("matrix add matrix", () => {
  const m1 = new Matrix(2, 2);
  m1.push([1, 3]);
  m1.push([8, 5]);
  const m2 = new Matrix(2, 2);
  m2.push([2, -5]);
  m2.push([-7, 3]);

  const expected = new Matrix(2, 2);
  expected.push([3, -2]);
  expected.push([1, 8]);

  const res = m1.addMat(m2);
  expect(res).toStrictEqual(expected);
});

test("matrix scale", () => {
  const m = new Matrix(2, 3);
  m.push([1, 2, 0]);
  m.push([4, 3, -1]);

  const r = m.scale(-2);
  expect(r.toString()).toBe("[[-2,-4,0],[-8,-6,2]]");
});

test("matrix dot invalid size", () => {
  const m1 = new Matrix(3, 8);
  const m2 = new Matrix(6, 3);
  expect(() => {
    m1.dot(m2);
  }).toThrow("Invalid dot matrix size");
});

test("matrix dot", () => {
  const m1 = new Matrix(2, 3);
  m1.push([1, 2, 0]);
  m1.push([4, 3, -1]);
  const m2 = new Matrix(3, 2);
  m2.push([5, 1]);
  m2.push([2, 3]);
  m2.push([3, 4]);

  const expected1 = new Matrix(2, 2);
  expected1.push([9, 7]);
  expected1.push([23, 9]);

  const res1 = m1.dot(m2);
  expect(res1.width).toBe(2);
  expect(res1.height).toBe(2);
  expect(res1).toStrictEqual(expected1);

  const expected2 = new Matrix(3, 3);
  expected2.push([9, 13, -1]);
  expected2.push([14, 13, -3]);
  expected2.push([19, 18, -4]);

  const res2 = m2.dot(m1);
  expect(res2.width).toBe(3);
  expect(res2.height).toBe(3);
  expect(res2).toStrictEqual(expected2);
});

test("matrix project", () => {
  const m = new Matrix(9, 4);
  // Plane 0
  m.pushPoint(-1, -1, 1);
  m.pushPoint(-1, +1, 1);
  m.pushPoint(+1, -1, 1);
  m.pushPoint(+1, +1, 1);
  // Plane 1
  m.pushPoint(-1, -1, 2);
  m.pushPoint(-1, +1, 2);
  m.pushPoint(+1, -1, 2);
  m.pushPoint(+1, +1, 2);
  // Plane 2
  m.pushPoint(+1, +1, 4);

  const points = m.project(0.5).toPointArray();
  expect(points).toStrictEqual([
    new Point2(-0.5, -0.5),
    new Point2(-0.5, +0.5),
    new Point2(+0.5, -0.5),
    new Point2(+0.5, +0.5),
    new Point2(-0.25, -0.25),
    new Point2(-0.25, +0.25),
    new Point2(+0.25, -0.25),
    new Point2(+0.25, +0.25),
    new Point2(+0.125, +0.125),
  ]);
});

test("point array invalid", () => {
  const m = new Matrix(9, 3);
  expect(() => m.toPointArray()).toThrow("matrix width is not 2");
});

test("point array", () => {
  const m = new Matrix(3, 2);
  m.push([1, 2]);
  m.push([3, 4]);
  m.push([5, 6]);

  expect(m.toPointArray()).toStrictEqual([
    new Point2(1, 2),
    new Point2(3, 4),
    new Point2(5, 6),
  ]);
});

test("matrix rotation", () => {
  const m = new Matrix(1, 4);
  m.pushPoint(-1, -1, 1);

  expect(m.dot(rotMatrixX(degToRad(90))).toString()).toBe("[[-1,1,1,1]]");
  expect(m.dot(rotMatrixY(degToRad(90))).toString()).toBe("[[-1,-1,-1,1]]");
  expect(m.dot(rotMatrixZ(degToRad(90))).toString()).toBe("[[-1,1,1,1]]");
});

test("matrix translate", () => {
  const m = new Matrix(1, 4);
  m.pushPoint(2, 7, 3);

  expect(m.dot(translateMatrix(+2, +0, +0)).toString()).toBe("[[4,7,3,1]]");
  expect(m.dot(translateMatrix(+0, -4, +0)).toString()).toBe("[[2,3,3,1]]");
  expect(m.dot(translateMatrix(+0, +0, +3)).toString()).toBe("[[2,7,6,1]]");
  expect(m.dot(translateMatrix(+1, -2, +3)).toString()).toBe("[[3,5,6,1]]");
});
