import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import memoise from "../../utils/memoise"
import { descending } from "../../utils/sorters"
import { min } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0]

const reducedLength = memoise((polymer: string): number => {
  const firstReduction = polymer.split("")
    .findIndex((c, i) =>
      i !== 0
      && c !== polymer[i - 1]
      && (c.toLowerCase() === polymer[i - 1].toLowerCase()))

  if (firstReduction === -1) { return polymer.length }

  const cLower = polymer[firstReduction].toLowerCase()
  const cUpper = cLower.toUpperCase()
  return reducedLength(polymer.replaceAll(cLower + cUpper, "").replaceAll(cUpper + cLower, ""))
}, new Map<string, number>)

console.log("(P1): ", reducedLength(input))

const best = "abcdefghijklmnopqrstuvwxyz".split("").map(c => {
  const newPolymer = input.replaceAll(c, "").replaceAll(c.toUpperCase(), "")
  console.log(c, reducedLength(newPolymer))
  return reducedLength(newPolymer)
}).reduce(min)

console.log("(P2): ", best)