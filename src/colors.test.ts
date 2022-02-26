import { Palette, Hsla, Rgba } from "./colors";

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

test("build palette", () => {
  const palette = new Palette(
    "f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0"
  );

  expect(palette.colors).toStrictEqual([
    new Rgba(247, 37, 133),
    new Rgba(181, 23, 158),
    new Rgba(114, 9, 183),
    new Rgba(86, 11, 173),
    new Rgba(72, 12, 168),
    new Rgba(58, 12, 163),
    new Rgba(63, 55, 201),
    new Rgba(67, 97, 238),
    new Rgba(72, 149, 239),
    new Rgba(76, 201, 240),
  ]);
});

test("palette index", () => {
  const palette = new Palette("000000-ff0000-00ff00-0000ff");

  // Integer
  expect(palette.getColor(0)).toStrictEqual(Rgba.fromHex("#000000"));
  expect(palette.getColor(1)).toStrictEqual(Rgba.fromHex("#ff0000"));
  expect(palette.getColor(2)).toStrictEqual(Rgba.fromHex("#00ff00"));
  expect(palette.getColor(3)).toStrictEqual(Rgba.fromHex("#0000ff"));

  // Float
  expect(palette.getColor(0.9)).toStrictEqual(Rgba.fromHex("#000000"));
  expect(palette.getColor(2.5)).toStrictEqual(Rgba.fromHex("#00ff00"));

  // Negative
  expect(palette.getColor(-0.9)).toStrictEqual(Rgba.fromHex("#000000"));
  expect(palette.getColor(-2.5)).toStrictEqual(Rgba.fromHex("#00ff00"));

  // Out of range
  expect(palette.getColor(4)).toStrictEqual(Rgba.fromHex("#000000"));
  expect(palette.getColor(8)).toStrictEqual(Rgba.fromHex("#000000"));
  expect(palette.getColor(5)).toStrictEqual(Rgba.fromHex("#ff0000"));
});
