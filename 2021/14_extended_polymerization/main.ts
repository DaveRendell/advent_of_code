import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readParagraphs from "../../utils/readParagraphs"
import { ascending } from "../../utils/sorters"

function runSteps(steps: number) {
  const { 0: [startState], 1: instructions } = readParagraphs(__dirname, inputFile())
  const replacementMap = instructions.reduce(addToMap, {})
  const initialPairCounts = range(0, startState.length - 1)
    .map(i => startState.slice(i, i + 2))
    .reduce(getCounts, {})
  
  const pairCounts = range(0, steps).reduce(processStep(replacementMap), initialPairCounts)
  const elementCounts = Object.entries(pairCounts).reduce((charCounts: Record<string, number>, [pair, count]) => ({
    ...charCounts,
    [pair[0]]: charCounts[pair[0]] ? charCounts[pair[0]] + count : count
  }), { [startState.at(-1)]: 1 }) // Last element is the same at all steps, and wouldn't be counted otherwise
  const lengths = Object.entries(elementCounts).map(([_, count]) => count).sort(ascending)
  return (lengths.at(-1) - lengths.at(0))
}

function partOne() {
  console.log("(P1) Answer: " + runSteps(10))
}

function partTwo() {
  console.log("(P2) Answer: " + runSteps(40))
}

function addToMap(map: Record<string, string[]>, instruction: string): Record<string, string[]> {
  const [pair, insert] = instruction.split(" -> ")
  const [start, end] = pair.split("")
  return { ...map, [pair]: [start + insert, insert + end] }
}

const processStep = (replacementMap: Record<string, string[]>) => (pairCounts: Record<string, number>, step: number): Record<string, number> => {
  return Object.entries(pairCounts).reduce((counts: Record<string, number>, [pair, count]: [string, number]) => {
    const [newPair1, newPair2] = replacementMap[pair]
    return {
      ...counts,
      [newPair1]: counts[newPair1] ? counts[newPair1] + count : count,
      [newPair2]: counts[newPair2] ? counts[newPair2] + count : count,
    }
  }, {})
}

const getCounts = (counts: Record<string, number>, next: string): Record<string, number> =>
  ({ ...counts, [next]: counts[next] ? counts[next] + 1 : 1})

partOne()
partTwo()