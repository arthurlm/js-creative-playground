export class Context {
  public tickCount: number = 0;
  public ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
  }

  nextTick() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.tickCount += 1;
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
  logPerformances?: boolean;
}

export function mainLoop(
  context: Context,
  scene: Scene,
  options: LoopOptions = {}
): void {
  function onAnimationFrame() {
    scene.update(context);

    var startTime = performance.now();
    scene.render(context);
    var endTime = performance.now();

    if (options.logPerformances) {
      console.log(`Rendering loop takes: ${endTime - startTime}ms`);
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
