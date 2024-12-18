export default class Queue<T> {
  length: number
  protected front?: QueueNode<T>
  protected back?: QueueNode<T>

  constructor() {
    this.length = 0
  }

  add(item: T): void {
    const node: QueueNode<T> = { value: item, ahead: this.back }
    if (this.length === 0) {
      this.front = node
    } else {
      this.back.behind = node
    }    
    this.back = node
    this.length++
  }

  receive(): T {
    if (this.front === undefined) {
      console.log(this)
      throw new Error("Cannot receive empty queue")
    }
    const { value } = this.front
    this.front = this.front.behind
    if (this.front) { this.front.ahead = undefined }
    this.length--
    return value
  }

  hasNext(): boolean {
    return this.length > 0
  }

  peek(): T| undefined {
    return this.front ? this.front.value : undefined
  }
}

export interface QueueNode<T> {
  ahead?: QueueNode<T> | undefined,
  behind?: QueueNode<T> | undefined,
  value: T
}
