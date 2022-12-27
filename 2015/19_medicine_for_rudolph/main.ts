import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readParagraphs from "../../utils/readParagraphs"
import { descendingBy } from "../../utils/sorters"

const [replacementStrings, [medicine]] = readParagraphs(__dirname, inputFile())
const replacements = replacementStrings.map(l => l.split(" => "))
  .sort(descendingBy(([from, to]) => to.length - from.length))

const getAllReplacements = (chemical: string): Set<string> =>
  new Set(replacements.flatMap(([from, to]) =>
    range(0, chemical.length)
      .filter(index => chemical.slice(index).startsWith(from))
      .flatMap(index => chemical.slice(0, index) + chemical.slice(index).replace(from, to))
  ))

console.log("(P1): " + getAllReplacements(medicine).size)

const replaceList = (input: string, from: string, to: string): string[] =>
  range(0, input.length)
    .filter(i => input.slice(i).startsWith(from))
    .map(i => input.slice(0, i) + input.slice(i).replace(from, to))

const findPrecedents = (chemical: string): string[] =>
  replacements
    .filter(([_, to]) => chemical.includes(to))
    .flatMap(([from, to]) => replaceList(chemical, to, from))
    .filter(x => !x.includes("e") || x.length === 1)

let variant = medicine
let steps = 0

while (variant !== "e") {
  for (const [from, to] of replacements) {
    for (const r of replaceList(variant, to, from)) {
      variant = r
      steps++
      break;
    }
  }
}

console.log("(P2): " + steps)
