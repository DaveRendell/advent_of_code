import { range } from "./numbers"

export class Range {
  start: number
  end: number //exclusive
  length: number

  constructor(start: number, end: number) {
    this.start = start
    this.end = end
    this.length = this.end - this.start
  }

  split(at: number): Range[] {
    if (at < this.start) {
      return [new Range(at, at), this.copy()]
    }

    if (at <= this.end) {
      return [this.copy(), new Range(at, at)]
    }

    return [
      new Range(this.start, at),
      new Range(at, this.end)
    ]
  }

  intersect(other: Range): Range {
    if (other.start >= this.end) {
      return new Range(this.end, this.end)
    }
    if (other.end <= this.start) {
      return new Range(this.start, this.start)
    }
    return new Range(
      Math.max(this.start, other.start),
      Math.min(this.end, other.end)
    )
  }

  overlaps(other: Range): boolean {
    return other.start < this.end && other.end > this.start
  }

  copy() {
    return new Range(this.start, this.end)
  }

  contains(value: number) {
    return value >= this.start && value < this.end
  }

  merge(other: Range): Range[] {
    if (this.end < other.start || other.end < this.start) {
      return [this.copy(), other.copy()]
    }

    return [new Range(
      Math.min(this.start, other.start),
      Math.max(this.end, other.end)
    )]
  }

  toArray(): number[] {
    return range(this.start, this.end)
  }

  static inclusive(a: number, b: number): Range {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    return new Range(min, max + 1)
  }

  static exclusive(a: number, b: number): Range {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    return new Range(min + 1, max)
  }
}