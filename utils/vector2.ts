export default class Vector2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  neighbours4(
    minX?: number,
    maxX?: number,
    minY?: number,
    maxY?: number,
  ): Vector2[] {
    return [
      new Vector2(this.x - 1, this.y),
      new Vector2(this.x + 1, this.y),
      new Vector2(this.x, this.y - 1),
      new Vector2(this.x, this.y + 1)]
        .filter(vector => minX === undefined || minX <= vector.x)
        .filter(vector => maxX === undefined || maxX >= vector.x)
        .filter(vector => minY === undefined || minY <= vector.y)
        .filter(vector => maxY === undefined || maxY >= vector.y)
  }

  neighbours8(
    minX?: number,
    maxX?: number,
    minY?: number,
    maxY?: number,
  ): Vector2[] {
    return [
      new Vector2(this.x - 1, this.y - 1),
      new Vector2(this.x - 1, this.y),
      new Vector2(this.x - 1, this.y + 1),
      new Vector2(this.x + 1, this.y - 1),
      new Vector2(this.x + 1, this.y),
      new Vector2(this.x + 1, this.y + 1),
      new Vector2(this.x, this.y - 1),
      new Vector2(this.x, this.y + 1)]
        .filter(vector => minX === undefined || minX <= vector.x)
        .filter(vector => maxX === undefined || maxX >= vector.x)
        .filter(vector => minY === undefined || minY <= vector.y)
        .filter(vector => maxY === undefined || maxY >= vector.y)
  }

  equals(other: Vector2): boolean {
    return other.x === this.x && other.y === this.y
  }
}