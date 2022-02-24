import { rgba } from "./helpers";

export class Context {
  public lastRequestFrameId?: number;

  public tickCount: number = 0;
  public ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private debugDisplay: HTMLElement
  ) {
    this.ctx = canvas.getContext("2d");
  }

  reset(): void {
    this.tickCount = 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  nextTick() {
    this.tickCount += 1;
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

  constructor() {
    function identity() {}

    this.frameOpacity = 1.0;
    this.entites = [];
    this.onStart = identity;
    this.onEnd = identity;
  }

  clearEntities(): void {
    this.entites.splice(0, this.entites.length);
  }

  update(context: Context) {
    for (let entity of this.entites) {
      entity.annimate(context);
    }
  }

  render(context: Context) {
    context.nextTick();

    const ctx = context.ctx;
    if (this.frameOpacity < 1.0) {
      ctx.fillStyle = rgba(0, 0, 0, this.frameOpacity);
      ctx.fillRect(0, 0, context.width, context.height);
    } else {
      ctx.clearRect(0, 0, context.width, context.height);
    }

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
    const tUpdateStart = performance.now();
    scene.update(context);
    const tUpdateEnd = performance.now();

    const tRenderStart = performance.now();
    scene.render(context);
    const tRenderEnd = performance.now();

    if (options.debugEnabled) {
      context.setDebugInfo([
        `entity count: ${scene.entites.length}`,
        `update time: ${tUpdateEnd - tUpdateStart}ms`,
        `rendering time: ${tRenderEnd - tRenderStart}ms`,
        `request frame ID: ${context.lastRequestFrameId}`,
        `tick: ${context.tickCount}`,
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
