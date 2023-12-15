export default class HashMap<Key, Value> {
  hash: (Key) => string | number
  size: number
  
  data: Map<(string | number), [Key, Value]>

  constructor(hash: (key: Key) => string | number, data: [Key, Value][]) {
    this.hash = hash
    this.data = new Map(data.map(([key, value]) => [hash(key), [key, value]]))
    this.size = this.data.size
  }

  set(key: Key, value: Value) {
    this.data.set(this.hash(key), [key, value])
    this.size = this.data.size
  }

  get(key: Key): Value {
    return this.data.get(this.hash(key))[1]
  }

  has(key: Key): boolean {
    return this.data.has(this.hash(key))
  }

  remove(key: Key) {
    this.data.delete(this.hash(key))
    this.size = this.data.size
  }

  clear() {
    this.data.clear()
    this.size = this.data.size
  }

  entries(): [Key, Value][] {
    return [...this.data.values()]
  }

  keys(): Key[] {
    return this.entries().map(([k]) => k)
  }

  values(): Value[] {
    return this.entries().map(([_, v]) => v)
  }
}