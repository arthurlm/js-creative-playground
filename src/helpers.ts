export function rgba(r: number, g: number, b: number, a: number): string {
  const rByte = Math.ceil(r * 255);
  const gByte = Math.ceil(g * 255);
  const bByte = Math.ceil(b * 255);
  return `rgba(${rByte}, ${gByte}, ${bByte}, ${a})`;
}
