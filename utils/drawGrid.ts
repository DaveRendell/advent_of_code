import Vector2 from "./vector2";

export function drawGrid(
  grid: string[][],
  red: (v: Vector2) => boolean = () => false,
  green: (v: Vector2) => boolean = () => false,
  sep = " "
): string[] {
  const colouredGrid = grid.map((row, y) =>
    row.map((cell, x) =>
      red(new Vector2(x, y))
        ? `\x1b[31m${cell}\x1b[0m`
        : green(new Vector2(x, y))
          ? `\x1b[32m${cell}\x1b[0m`
          : cell))

  return colouredGrid.map(row => row.join(sep))
}