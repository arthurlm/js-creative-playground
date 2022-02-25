import { Context, Entity } from "../context";
import { Point2 } from "../geometry";

/**
 * Optional parameters for TextEntity.
 */
export interface TextEntityParams {
  font?: string;
  color?: string;
}

/**
 * Generic text entity.
 */
export default class TextEntity implements Entity {
  public font: string;
  public color: string;

  constructor(
    public text: string,
    public center: Point2,
    params: TextEntityParams = {}
  ) {
    this.font = params.font || "30px Arial";
    this.color = params.color || "white";
  }

  annimate(context: Context): void {}

  draw(context: Context): void {
    const ctx = context.ctx;

    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.center.x, this.center.y);
  }
}

export function buildSceneTitle(context: Context, text: string): Entity {
  const center = new Point2(context.width / 2.0, 50);
  return new TextEntity(text, center);
}
