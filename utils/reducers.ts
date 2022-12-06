export const sum = (a: number, b: number) => a + b
export const product = (a: number, b: number) => a * b
export const max = (a: number, b: number) => Math.max(a, b)
export const min = (a: number, b: number) => Math.min(a, b)

export const chunks = <T>(chunkSize: number) => (acc: T[][], next: T) =>
  acc[acc.length - 1].length === chunkSize
    ? [...acc, [next]]
    : [...acc.slice(0, acc.length - 1), [...acc[acc.length - 1], next]]  
