import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())
const towels = input[0].split(", ")
const patterns = input.slice(2)

const cache = new Map<string, number>([["", 1]])

const countPossibleArrangements = (pattern: string): number => {
  if (cache.has(pattern)) { return cache.get(pattern) }

  const result = towels.map(towel =>
    pattern.startsWith(towel)
      ? countPossibleArrangements(pattern.slice(towel.length))
      : 0
  ).reduce(sum)

  cache.set(pattern, result)
  return result
}

const arrangements = patterns.map(countPossibleArrangements)

console.log("(P1): ", arrangements.filter(count => count > 0).length)
console.log("(P2): ", arrangements.reduce(sum))
