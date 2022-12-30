import { positiveMod } from "./numbers"

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

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  scale(magnitude: number) {
    return new Vector2(this.x * magnitude, this.y * magnitude)
  }

  equals(other: Vector2): boolean {
    return other.x === this.x && other.y === this.y
  }

  inBounds(
    minX: number, maxX: Number, minY: number, maxY: number
  ): boolean {
    return minX <= this.x && maxX >= this.x
     && minY <= this.y && maxY >= this.y
  }

  taxiMagnitude(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }

  toString(): string {
    return `[x: ${this.x}, y:${this.y}]`
  }

  static ORIGIN = new Vector2(0, 0)
  static RIGHT = new Vector2(1, 0)
  static DOWN = new Vector2(0, 1)
  static LEFT = new Vector2(-1, 0)
  static UP = new Vector2(0, -1)
}