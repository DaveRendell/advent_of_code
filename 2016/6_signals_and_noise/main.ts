import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { groupBy } from "../../utils/reducers"
import { ascendingBy, descendingBy } from "../../utils/sorters"

const input = readLines(__dirname, inputFile())

const transposed = range(0, input[0].length)
  .map(i => input.map(line => line[i]))

const mode = (characters: string[]): string =>
  Object.entries(characters.reduce(groupBy(c => c), {}))
    .sort(descendingBy(([_, list]) => list.length))
    [0][0]

console.log("(P1): " + transposed.map(mode).join(""))

const antiMode = (characters: string[]): string =>
  Object.entries(characters.reduce(groupBy(c => c), {}))
    .sort(ascendingBy(([_, list]) => list.length))
    [0][0]

console.log("(P2): " + transposed.map(antiMode).join(""))