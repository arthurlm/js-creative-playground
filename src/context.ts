import { Rgba } from "./colors";

export class Context {
  public lastRequestFrameId?: number;

  public timestamp: number;
  public tickCount: number;
  public ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private debugDisplay: HTMLElement
  ) {
    this.tickCount = 0;
    this.timestamp = Date.now() / 1000.0;
    this.ctx = canvas.getContext("2d");
  }

  reset(): void {
    this.tickCount = 0;
    this.timestamp = Date.now() / 1000.0;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 1;
  }

  nextTick() {
    this.tickCount += 1;
    this.timestamp = Date.now() / 1000.0;
  }

  setDebugVisibility(visible: boolean): void {
    this.debugDisplay.style.visibility = visible ? "visible" : "hidden";
  }

  setDebugInfo(infos: string[]): void {
    this.debugDisplay.innerText = infos.join("\n");
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }
}

export interface Entity {
  annimate(context: Context): void;
  draw(context: Context): void;
}

export class Scene {
  public frameOpacity: number;
  public entites: Entity[];
  public onStart: (context: Context) => void;
  public onEnd: (context: Context) => void;

  constructor(public filename: string) {
    function identity() {}

    this.frameOpacity = 1.0;
    this.entites = [];
    this.onStart = identity;
    this.onEnd = identity;
  }

  clearEntities(): void {
    this.entites.splice(0, this.entites.length);
  }

  private clearScreen(context: Context) {
    const ctx = context.ctx;

    if (this.frameOpacity < 1.0) {
      ctx.fillStyle = new Rgba(0, 0, 0, this.frameOpacity).toString();
      ctx.fillRect(0, 0, context.width, context.height);
    } else {
      ctx.clearRect(0, 0, context.width, context.height);
    }
  }

  update(context: Context) {
    for (let entity of this.entites) {
      entity.annimate(context);
    }
  }

  render(context: Context) {
    this.clearScreen(context);
    this.onStart(context);

    for (let entity of this.entites) {
      entity.draw(context);
    }

    this.onEnd(context);
  }
}

export interface LoopOptions {
  debugEnabled?: boolean;
}

export function mainLoop(
  context: Context,
  scene: Scene,
  options: LoopOptions = {}
): void {
  // Prepare DOM
  context.setDebugVisibility(options.debugEnabled);

  // Define main loop
  function onAnimationFrame() {
    context.nextTick();

    const tUpdateStart = performance.now();
    scene.update(context);
    const tUpdateEnd = performance.now();

    const tRenderStart = performance.now();
    scene.render(context);
    const tRenderEnd = performance.now();

    if (options.debugEnabled) {
      context.setDebugInfo([
        `name: ${scene.filename}`,
        `entity count: ${scene.entites.length}`,
        `update time: ${tUpdateEnd - tUpdateStart}ms`,
        `rendering time: ${tRenderEnd - tRenderStart}ms`,
        `request frame ID: ${context.lastRequestFrameId}`,
        `tick: ${context.tickCount}`,
        `timestamp: ${context.timestamp}`,
      ]);
    }

    context.lastRequestFrameId = requestAnimationFrame(onAnimationFrame);
  }

  context.lastRequestFrameId = requestAnimationFrame(onAnimationFrame);
}

export default {
  Context,
  Scene,
  mainLoop,
};
