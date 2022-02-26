export class Hsla {
  constructor(
    public hue: number,
    public saturation: number,
    public lightness: number,
    public alpha = 100
  ) {}

  toString(): string {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha}%)`;
  }
}

export class Rgba {
  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public alpha: number = 255
  ) {}

  toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }

  static fromHex(value: string): Rgba {
    if (!value.startsWith("#")) {
      throw new Error(`invalid value: ${value}`);
    }
    if (value.length < 7 || value.length > 9) {
      throw new Error(`invalid value length: ${value}`);
    }

    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    const a = value.length == 9 ? parseInt(value.slice(7, 9), 16) : 255;
    return new Rgba(r, g, b, a);
  }

  toHsla(): Hsla {
    const r = this.red / 255.0;
    const g = this.green / 255.0;
    const b = this.blue / 255.0;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0.0;
    let s = 0.0;
    let l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return new Hsla(
      Math.round(h * 360.0),
      Math.round(s * 100.0),
      Math.round(l * 100.0),
      Math.round((this.alpha / 255.0) * 100.0)
    );
  }
}

export function buildPalette(value: string): Rgba[] {
  return value.split("-").map((x) => Rgba.fromHex(`#${x}`));
}

export default {
  Hsla,
  Rgba,
};
