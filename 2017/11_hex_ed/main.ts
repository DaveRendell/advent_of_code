import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0].split(",")

// q + r + s = 0

const steps: { [k: string]: number[]} = {
  "n" : [+0, -1, +1],
  "ne": [+1, -1, +0],
  "se": [+1, +0, -1],
  "s" : [+0, +1, -1],
  "sw": [-1, +1, +0],
  "nw": [-1, +0, +1],
}

const addVectors = (v1: number[], v2: number[]): number[] =>
  v1.map((x, i) => x + v2[i])

const distance = (v: number[]): number => {
  return v.map(x => Math.abs(x)).reduce(sum) / 2
}

let position = [0, 0, 0]
let furthestDistance = 0

for (let direction of input) {
  position = addVectors(position, steps[direction])
  furthestDistance = Math.max(furthestDistance, distance(position))
}

console.log("(P1): " + distance(position))

console.log("(P2): " + furthestDistance)