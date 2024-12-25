export default class ArrayMap<Key, Value> {
  data: Map<Key, Value[]>
  constructor() {
    this.data = new Map<Key, Value[]>
  }

  get(key: Key): Value[] {
    if (!this.data.has(key)) { this.data.set(key, []) }
    return this.data.get(key)
  }
}
