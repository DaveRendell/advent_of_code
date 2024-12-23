export default function memoise<
  Arguments extends any[],
  Return
>(
  method: (...args: Arguments) => Return,
  store: Map<string, Return>,
  serialise: (args: Arguments) => string = (args) => JSON.stringify(args)
): (...args: Arguments) => Return {
  return (...args: Arguments) => {
    const key = serialise(args)
    if (store.has(key)) { return store.get(key) }
    const result = method(...args)
    store.set(key, result)
    return result
  }
}
