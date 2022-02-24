export class Context {
  public tickCount: number = 0;
  public ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private debugDisplay: HTMLElement
  ) {
    this.ctx = canvas.getContext("2d");
  }

  nextTick() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  public entites: Entity[];
  public onStart: (context: Context) => void;
  public onEnd: (context: Context) => void;

  constructor() {
    function identity() {}

    this.entites = [];
    this.onStart = identity;
    this.onEnd = identity;
  }

  update(context: Context) {
    for (let entity of this.entites) {
      entity.annimate(context);
    }
  }

  render(context: Context) {
    context.nextTick();

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
      ]);
    }

    requestAnimationFrame(onAnimationFrame);
  }

  requestAnimationFrame(onAnimationFrame);
}

export default {
  Context,
  Scene,
  mainLoop,
};