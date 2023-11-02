import { positiveMod } from "./numbers"

export default class Cycle<T> {
  value: T
  next?: Cycle<T>
  previous?: Cycle<T>

  constructor(value: T) {
    this.value = value
  }

  getNext(count: number): T[] {
    let cursor: Cycle<T> = this
    let values: T[] = []
    for (let i = 0; i < count; i++) {
      values.push(cursor.value)
      cursor = cursor.next
    }
    return values
  }

  removePrevious(): void {
    const oldPrevious = this.previous
    this.previous = oldPrevious.previous
    oldPrevious.previous.next = this
  }

  removeAtPositionAhead(position: number): void {
    let toRemove: Cycle<T> = this
    for (let i = 0; i < position; i++) { toRemove = toRemove.next }
    toRemove.next.previous = toRemove.previous
    toRemove.previous.next = toRemove.next
  }

  static fromValues<S>(values: S[]): Cycle<S> {
    const links = values.map(v => new Cycle(v))
    links.forEach((link, index) => {
      link.previous = links[positiveMod(index - 1, links.length)]
      link.next = links[positiveMod(index + 1, links.length)]
    })
    return links[0]
  }
}
