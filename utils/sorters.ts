export const ascending = (a: number, b: number) => a - b
export const descending = (a: number, b: number) => b - a

export const descendingBy = <T>(property: (T) => number) =>
  (a: T, b: T) => descending(property(a), property(b))

export const ascendingBy = <T>(property: (T) => number) =>
  (a: T, b: T) => ascending(property(a), property(b))