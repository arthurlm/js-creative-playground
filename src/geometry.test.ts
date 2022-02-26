import { Point2 } from "./geometry";

test("test point2 clone", () => {
  const origin = new Point2(10, 3);
  expect(origin.clone()).toStrictEqual(origin);
});

test("test point2 translate", () => {
  const origin = new Point2(10, 3);

  expect(origin.translate(4)).toStrictEqual(new Point2(14, 7));
  expect(origin.translate(-4)).toStrictEqual(new Point2(6, -1));

  expect(origin.translateSized({ width: 2, height: 5 })).toStrictEqual(
    new Point2(12, 8)
  );

  expect(origin.translateVec(new Point2(2, -5))).toStrictEqual(
    new Point2(12, -2)
  );
});

test("test point2 scale", () => {
  const origin = new Point2(10, 3);

  expect(origin.scale(4)).toStrictEqual(new Point2(40, 12));
  expect(origin.scale(-4)).toStrictEqual(new Point2(-40, -12));

  expect(origin.scaleSized({ width: 2, height: 5 })).toStrictEqual(
    new Point2(20, 15)
  );

  expect(origin.scaleVec(new Point2(2, -5))).toStrictEqual(new Point2(20, -15));
});

test("test point2 rotate", () => {
  const a = new Point2(10, 0);
  expect(a.rotate(Math.PI / 2).round()).toStrictEqual(new Point2(0, 10));
  expect(a.rotate(Math.PI).round()).toStrictEqual(new Point2(-10, 0));
  expect(a.rotate((3 * Math.PI) / 2).round()).toStrictEqual(
    new Point2(-0, -10)
  );
  expect(a.rotate(Math.PI * 2).round()).toStrictEqual(new Point2(10, -0));
});
