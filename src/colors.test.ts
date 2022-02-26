import { Hsla, Rgba } from "./colors";

test("test parse rgba invalid", () => {
  expect(() => Rgba.fromHex("")).toThrow("invalid value");
  expect(() => Rgba.fromHex("#00000000000")).toThrow("invalid value");
  expect(() => Rgba.fromHex("#00000")).toThrow("invalid value");
  expect(() => Rgba.fromHex("#")).toThrow("invalid value");
});

test("test parse rgba valid", () => {
  expect(Rgba.fromHex("#26465340")).toStrictEqual(new Rgba(38, 70, 83, 64));
  expect(Rgba.fromHex("#000000")).toStrictEqual(new Rgba(0, 0, 0, 255));
  expect(Rgba.fromHex("#00000000")).toStrictEqual(new Rgba(0, 0, 0, 0));
  expect(Rgba.fromHex("#FFFFFFFF")).toStrictEqual(new Rgba(255, 255, 255, 255));
});

test("test hsl to rgb", () => {
  let rgb = Rgba.fromHex("#26465340");
  expect(rgb.toHsla()).toStrictEqual(new Hsla(197, 37, 24, 25));

  rgb = Rgba.fromHex("#2A9D8F");
  expect(rgb.toHsla()).toStrictEqual(new Hsla(173, 58, 39));
});
