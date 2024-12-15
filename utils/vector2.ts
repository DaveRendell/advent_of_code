import HashMap from "./hashmap"
import HashSet from "./hashset"
import { inclusiveRange, range } from "./numbers"

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

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  scale(magnitude: number) {
    return new Vector2(this.x * magnitude, this.y * magnitude)
  }

  equals(other: Vector2): boolean {
    return other.x === this.x && other.y === this.y
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  inBounds(
    minX: number, maxX: number, minY: number, maxY: number
  ): boolean {
    return minX <= this.x && maxX >= this.x
     && minY <= this.y && maxY >= this.y
  }

  inGrid(width: number, height: number): boolean {
    return this.inBounds(0, width - 1, 0, height - 1)
  }

  taxiMagnitude(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }

  toString(): string {
    return `[x: ${this.x}, y: ${this.y}]`
  }

  rotateRight(): Vector2 {
    return new Vector2(-this.y, this.x)
  }

  rotateLeft(): Vector2 {
    return new Vector2(this.y, -this.x)
  }

  reverse(): Vector2 {
    return new Vector2(-this.x, -this.y)
  }

  up(): Vector2 { return this.add(Vector2.UP) }
  down(): Vector2 { return this.add(Vector2.DOWN) }
  left(): Vector2 { return this.add(Vector2.LEFT) }
  right(): Vector2 { return this.add(Vector2.RIGHT) }

  static ORIGIN = new Vector2(0, 0)
  static RIGHT = new Vector2(1, 0)
  static DOWN = new Vector2(0, 1)
  static LEFT = new Vector2(-1, 0)
  static UP = new Vector2(0, -1)
}

export class VectorSet extends HashSet<Vector2> {
  constructor(data: Vector2[] = []) {
    super(v => v.toString(), data)
  }
}

export class VectorMap<T> extends HashMap<Vector2, T> {
  constructor(data: [Vector2, T][] = []) {
    super(v => v.toString(), data)
  }

  bounds(): number[][] {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const [{ x, y }] of this.entries()) {
      if (x < minX) { minX = x }
      if (x > maxX) { maxX = x }
      if (y < minY) { minY = y }
      if (y > maxY) { maxY = y }
    }
    return [[minX, maxX], [minY, maxY]]
  }

  draw(
    separator: string = " ",
    render: (t: T) => string = (t) => String(t)
  ): string[] {
    const [[minX, maxX], [minY, maxY]] = this.bounds()
    return inclusiveRange(minY, maxY).map(y =>
      inclusiveRange(minX, maxX).map(x =>
        render(this.get(new Vector2(x, y)))).join(separator)
    )
  }

  static fromGrid<T>(input: T[][]): VectorMap<T> {
    const out = new VectorMap<T>()
    input.forEach((row, y) =>
      row.forEach((element, x) => out.set(new Vector2(x, y), element)))
    return out
  }
}