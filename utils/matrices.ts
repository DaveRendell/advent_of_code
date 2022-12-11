import { range } from "./numbers"
import { sum } from "./reducers"

export const multiply = (a: number[][], b: number[][]): number[][] =>
  range(0, b[0].length).map(j =>
    range(0, a.length).map(i =>
      range(0, b.length)
        .map(k => a[i][k] * b[k][j])
        .reduce(sum)))

const I = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
]

export const pow = (a: number[][], exp: number): number[][] =>
  exp === 0
    ? I
    : range(0, exp).reduce((product) => multiply(product, a), a)

const X = [
  [ 1,  0,  0],
  [ 0,  0, -1],
  [ 0,  1,  0]
]

const Y = [
  [ 0,  0,  1],
  [ 0,  1,  0],
  [-1,  0,  0]
]
