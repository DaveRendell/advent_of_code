import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readParagraphs from "../../utils/readParagraphs"
import { ascending } from "../../utils/sorters"

function runSteps(steps: number) {
  const { 0: [startState], 1: instructions } = readParagraphs(__dirname, inputFile())
  const replacementMap = instructions.reduce(addToMap, {})
  
  const polymer = range(0, steps).reduce(processStep(replacementMap), startState)
  const lengths = Object.values([...polymer].reduce(getCharacterCounts, {})).sort(ascending)
  return (lengths.at(-1) - lengths.at(0))
}

function partOne() {
  console.log("(P1) Answer: " + runSteps(10))
}

function partTwo() {
  console.log("(P2) Answer: " + runSteps(40)) // Too slow -_-
}

function addToMap(map: Record<string, string>, instruction: string): Record<string, string> {
  const [pair, insert] = instruction.split(" -> ")
  const start = pair[0]
  return { ...map, [pair]: start + insert }
}

const processStep = (replacementMap: Record<string, string>) => (polymer: string, step: number): string => {
  console.log("Step " + step + ". Polymer length " + polymer.length)
  var out = ""
  for (let i = 0; i < polymer.length; i++) {
    var slice = polymer.slice(i, i + 2)
    var replacement = replacementMap[slice]
    if (replacement) { out += replacement }
    else { out += polymer[i] }
  }
  return out
}

const getCharacterCounts = (counts: Record<string, number>, next: string): Record<string, number> =>
  ({ ...counts, [next]: counts[next] ? counts[next] + 1 : 1})

partOne()
partTwo()
