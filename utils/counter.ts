export default class Counter<T> {
  private data: Map<T, number>

  constructor() {
    this.data = new Map()
  }

  set(key: T, value: number): void {
    this.data.set(key, value)
  }

  get(key: T): number {
    return this.data.get(key) || 0
  }

  increment(key: T, amount: number = 1): void {
    this.set(key, this.get(key) + amount)
  }

  decrement(key: T, amount: number = 1): void {
    this.set(key, this.get(key) - amount)
  }

  keys(): T[] {
    return [...this.data.keys()]
  }

  entries(): [T, number][] {
    return [...this.data.entries()]
  }
}