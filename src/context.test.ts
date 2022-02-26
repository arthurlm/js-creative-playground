import { Context } from "./context";

test("context lifecycle", () => {
  const beginTs = Date.now() / 1000.0;

  // Build
  const canvas = document.createElement("canvas");
  const debugDisplay = document.createElement("div");
  const context = new Context(canvas, debugDisplay);

  expect(context.tickCount).toBe(0);
  expect(context.timestamp).toBeGreaterThanOrEqual(beginTs);

  // Tick
  const firstTickTs = context.timestamp;

  context.nextTick();
  context.nextTick();
  context.nextTick();

  expect(context.tickCount).toBe(3);
  expect(context.timestamp).toBeGreaterThanOrEqual(firstTickTs);

  // Reset
  const resetTickTs = context.timestamp;

  context.reset();

  expect(context.tickCount).toBe(0);
  expect(context.timestamp).toBeGreaterThanOrEqual(resetTickTs);
});

test("context canvas size", () => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const debugDisplay = document.createElement("div");

  const context = new Context(canvas, debugDisplay);

  expect(context.width).toBe(800);
  expect(context.height).toBe(600);
});

test("context debug helpers", () => {
  const canvas = document.createElement("canvas");
  const debugDisplay = document.createElement("div");

  const context = new Context(canvas, debugDisplay);

  context.setDebugVisibility(true);
  expect(debugDisplay.style.visibility).toBe("visible");

  context.setDebugVisibility(false);
  expect(debugDisplay.style.visibility).toBe("hidden");

  context.setDebugInfo(["hello", "world"]);
  expect(debugDisplay.innerText).toBe("hello\nworld");
});
