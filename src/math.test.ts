import { clip, cosineInterpolate, degToRad, lerp, radToDeg } from "./math";

test("clip", () => {
  expect(clip(-5, 10, 20)).toBe(10);
  expect(clip(50, 10, 20)).toBe(20);
  expect(clip(15, 10, 20)).toBe(15);
});

test("degToRad", () => {
  expect(degToRad(0)).toBe(0);
  expect(degToRad(90)).toBe(Math.PI / 2);
  expect(degToRad(180)).toBe(Math.PI);
  expect(degToRad(360)).toBe(Math.PI * 2);
});

test("radToDeg", () => {
  expect(radToDeg(0)).toBe(0);
  expect(radToDeg(Math.PI / 2)).toBe(90);
  expect(radToDeg(Math.PI)).toBe(180);
  expect(radToDeg(Math.PI * 2)).toBe(360);
});

test("cosineInterpolate", () => {
  expect(cosineInterpolate(0, 100, 0.5)).toBeCloseTo(50);
  expect(cosineInterpolate(0, 100, 0.1)).toBeCloseTo(2.4471);
  expect(cosineInterpolate(0, 100, 0.9)).toBeCloseTo(97.552);
});

test("lerp", () => {
  expect(lerp(0, 100, 0.5)).toBe(50);
  expect(lerp(0, 100, 0.25)).toBe(25);
  expect(lerp(50, 100, 0.5)).toBe(75);
  expect(lerp(0, 50, 0.5)).toBe(25);
});
