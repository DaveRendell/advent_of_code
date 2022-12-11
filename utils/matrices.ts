import { range } from "./numbers"
import { sum } from "./reducers"

export const multiply = (a: number[][], b: number[][]): number[][] =>
  range(0, b[0].length).map(j =>
    range(0, a.length).map(i =>
      range(0, b.length)
        .map(k => a[i][k] * b[k][j])
        .reduce(sum)))

//export const rotation3D = ()

const v = [
  [1, 2],
  [3, 4]
]

const w = [
  [5],
  [6]
]

console.log(multiply(v, w))