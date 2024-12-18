import { NodeBuilderFlags } from "../node_modules/typescript/lib/typescript";
import Queue, { QueueNode } from "./queue";

// Queue that inserts new elements so ones with a lower priority value come first
export default class PriorityQueue<T> extends Queue<T> {
  priority: (item: T) => number
  constructor(priority: (item: T) => number) {
    super()
    this.priority = priority
  }

  add(item: T): void {
    const node: QueueNode<T> = { value: item }
    if (this.length === 0) {
      this.front = node
      this.back = node
    } else if (this.priority(item) > this.priority(this.back.value)) {
      this.back.behind = node
      node.ahead = this.back
      this.back = node
    } else {
      let cursor = this.back
      while (cursor && this.priority(cursor.value) > this.priority(item)) {
        cursor = cursor.ahead
      }
      if (cursor) {
        const behind = cursor.behind
        cursor.behind = node
        node.ahead = cursor
        if (behind) {
          behind.ahead = node
          node.behind = behind
        }
      } else {
        node.behind = this.front
        this.front = node
      }
    }
    this.length++
    if (!node.behind && node !== this.back) {
      console.log(node)
      console.log(this.back === node)
      console.log(this.back)
      console.log(node.behind)
      throw new Error("werwer")
    }
  }
}