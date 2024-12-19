import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import memoise from "../../utils/memoise"

const input = readLines(__dirname, inputFile())
const towels = input[0].split(", ")
const patterns = input.slice(2)

const countPossibleArrangements = memoise((pattern: string): number =>
  towels.map(towel =>
    pattern.startsWith(towel)
      ? countPossibleArrangements(pattern.slice(towel.length))
      : 0
  ).reduce(sum),
  new Map<string, number>([["", 1]]))

const arrangements = patterns.map(countPossibleArrangements)

console.log("(P1): ", arrangements.filter(count => count > 0).length)
console.log("(P2): ", arrangements.reduce(sum))
