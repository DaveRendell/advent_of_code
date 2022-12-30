import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { chunks, sum } from "../../utils/reducers"
import { range } from "../../utils/numbers"

const input = readLines(__dirname, inputFile())
  .map(line =>
    [line.slice(0, 5), line.slice(5, 10), line.slice(10, 15)]
      .map(v => parseInt(v)))

const countValid = (triangles: number[][]): number =>
  triangles.filter(lengths => lengths.every(length =>
    length < (lengths.reduce(sum) / 2))).length

console.log("(P1): " + countValid(input)) //116 too low, 995 too high

const columnInput = range(0, 3)
  .flatMap(i => input.map(l => l[i]))
  .reduce(chunks(3), [[]])

console.log("(P2): " + countValid(columnInput))