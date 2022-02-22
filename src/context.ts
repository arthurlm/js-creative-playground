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

interface Entity {
  annimate(context: Context): void;
  draw(context: Context): void;
}

export class Scene {
  public entites: Entity[];
  public onStart: () => void;
  public onEnd: () => void;

  constructor() {
    function identity() {}

    this.entites = [];
    this.onStart = identity;
    this.onEnd = identity;
  }

  loop(context: Context) {
    context.nextTick();

    this.onStart();

    for (let entity of this.entites) {
      entity.draw(context);
      entity.annimate(context);
    }

    this.onEnd();
  }
}

export default {
  Context,
  Scene,
};
