import { isIntersectionTypeNode } from "../node_modules/typescript/lib/typescript"

export default class HashSet<Item> {
  hash: (Item) => string
  size: number

  private data: Map<string, Item>

  constructor(hash: (item: Item) => string, data: Item[] = []) {
    this.hash = hash
    this.data = new Map(data.map(item => [hash(item), item]))
    this.size = this.data.size
  }

  add(item: Item): void {
    this.data.set(this.hash(item), item)
    this.size = this.data.size
  }

  remove(item: Item): void {
    this.data.delete(this.hash(item))
    this.size = this.data.size
  }

  has(item: Item): boolean {
    return this.data.has(this.hash(item))
  }

  clear() {
    this.data.clear()
    this.size = this.data.size
  }

  entries(): Item[] {
    return [...this.data.values()]
  }

  intersect(other: HashSet<Item> | undefined): HashSet<Item> {
    const newEntries = other === undefined ? this.entries() : this.entries().filter(a => other.has(a))
    return new HashSet<Item>(this.hash, newEntries)
  }
}