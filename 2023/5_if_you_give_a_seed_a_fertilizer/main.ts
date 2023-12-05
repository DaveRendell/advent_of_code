import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { min } from "../../utils/reducers"

const input = readParagraphs(__dirname, inputFile())

const seeds = input[0][0].split(": ")[1].split(" ").map(s => parseInt(s))

const mappings = input.slice(1)
  .map(paragraph => paragraph.slice(1)
    .map(line => line.split(" ").map(s => parseInt(s))))

const apply = (source: number, mapping: number[][]): number => {
  for (let [destStart, sourceStart, length] of mapping) {
    if (source >= sourceStart && source < sourceStart + length) {
      return destStart + (source - sourceStart)
    }
  }
  return source
}

const getLocation = (seed: number): number =>
  mappings.reduce(apply, seed)

console.log("(P1): " + seeds.map(getLocation).reduce(min))

const unApply = (results: number[], mapping: number[][]): number[] => {
  const sources = new Set<number>()

  for (let result of results) {
    for (let [destStart, sourceStart, length] of mapping) {
    if (result >= destStart && result < destStart + length) {
      sources.add(sourceStart + (result - destStart))
    }
  }
  if (!mapping.some(([_, sourceStart, length]) =>
    result >= sourceStart && result < sourceStart + length)) {
      sources.add(result)
    }
  }
  
  return [...sources]
}

let lowestLocation: number = 0

searchLoop:
while (true) {
  console.log("Searching for location ", lowestLocation)
  const possibleSources = mappings.slice().reverse().reduce(unApply, [lowestLocation])

  for (let source of possibleSources) {
    for (let i = 0; i < seeds.length; i += 2) {
      let [seedStart, seedLength] = seeds.slice(i, i + 2)
      if (source >= seedStart && source < seedStart + seedLength) {
        console.log("Winning seed: ", source)
        break searchLoop
      }
    }
  }

  lowestLocation++
}

console.log(getLocation(80))

console.log("(P2): " + lowestLocation)