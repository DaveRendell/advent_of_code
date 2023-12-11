import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readCharArray from "../../utils/readCharArray"
import { sum } from "../../utils/reducers"

const input = readCharArray(__dirname, inputFile())

let galaxies: number[][] = []

for (let y = 0; y < input.length; y++) {
  for (let x= 0; x < input[0].length; x++) {
    if (input[y][x] == "#") { galaxies.push([x, y]) }
  }
}

const emptyRows = range(0, input.length)
    .filter(i => !input[i].includes("#"))
const emptyCols = range(0, input[0].length)
  .filter(i => input.every(row => row[i] != "#"))

const expandedDistance = ([x1, y1]: number[], [x2, y2]: number[], expansion: number): number => {
  const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)]
  const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)]

  let distance = 0
  for (let i = minX; i < maxX; i++) {
    emptyCols.includes(i) ? distance += expansion : distance++
  }
  for (let i = minY; i < maxY; i++) {
    emptyRows.includes(i) ? distance += expansion : distance++
  }

  return distance
}

const getPairs = <T>(pairs: T[][], next: T, i: number, arr: T[]): T[][] =>
  [...pairs, ...arr.slice(i + 1).map(x => [next, x])]

const pairs = galaxies.reduce(getPairs, [])

console.log("(P1): " + pairs
  .map(([g1, g2]) => expandedDistance(g1, g2, 2))
  .reduce(sum))

console.log("(P2): " + pairs
  .map(([g1, g2]) => expandedDistance(g1, g2, 1000000))
  .reduce(sum))