import inputFile from "../../utils/inputFile"
import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

const SEGMENTS = [
  "abcefg",
  "cf", //
  "acdeg",
  "acdfg",
  "bcdf", //
  "abdfg",
  "abdefg",
  "acf", //
  "abcdefg", //
  "abcdfg"
].map(s => [...s])
// 1 missing: 0, 6, 9
// 2 missing: 2, 3, 5
// 6 is the 1 missing with both bits of 1

function partOne() {
  const parsed = readLines(__dirname, inputFile()).map(parse)

  const answer = parsed
    .map(numberOfUniqueSignals)
    .reduce(sum)
  
  console.log("(P1) Number of unique length signals: " + answer)
}

function partTwo() {
  const parsed = readLines(__dirname, inputFile()).map(parse)

  const total = parsed.map(getValue).reduce(sum)

  console.log("(P2) Total: " + total)
}

function parse(line: string): string[][] {
  return line.split(" | ").map(section => section.split(" ").map(s => [...s].sort().join("")))
}

const numberOfUniqueSignals = ([_reference, output]: string[][]): number =>
  output
    .map(digit => digit.length)
    .filter(digitLength => [2, 4, 3, 7].includes(digitLength))
    .length

const decodeReferences = (references: string[]): string[] => {
  const decoder = []

  decoder[1] = getReferenceSegmentsOfLength(references, 2)[0]
  decoder[4] = getReferenceSegmentsOfLength(references, 4)[0]
  decoder[7] = getReferenceSegmentsOfLength(references, 3)[0]
  decoder[8] = getReferenceSegmentsOfLength(references, 7)[0]

  // 6 is the reference with 6 segments that is missing one from 1 (unlike 0 and 9)
  // Segment C is the segment that is missing, segment F is the one that isn't
  decoder[6] = getReferenceSegmentsOfLength(references, 6)
    .find(reference => decoder[1].some(segment => !reference.includes(segment)))
  const segmentC = decoder[1].find(segment => !decoder[6].includes(segment))
  const segmentF = decoder[1].find(segment => decoder[6].includes(segment))

  // 2 is the reference with 5 segments missing segment f
  // The other missing segment is B
  decoder[2] = getReferenceSegmentsOfLength(references, 5)
    .find(reference => !reference.includes(segmentF))
  const segmentB = decoder[8]
    .filter(segment => segment !== segmentF)
    .find(segment => !decoder[2].includes(segment))
  
  // 3 is the other 5 segment reference missing B
  // It's also missing E
  decoder[3] = getReferenceSegmentsOfLength(references, 5)
    .filter(reference => ![...decoder[2]].every(segment => reference.includes(segment)))
    .find(reference => !reference.includes(segmentB))
  const segmentE = decoder[8]
    .filter(segment => segment !== segmentB)
    .find(segment => !decoder[3].includes(segment))
  
  // 9 is missing E. 0 is the other 6 segment code
  decoder[9] = getReferenceSegmentsOfLength(references, 6)
    .find(reference => !reference.includes(segmentE))
  decoder[0] = getReferenceSegmentsOfLength(references, 6)
    .find(reference => reference.includes(segmentC) && reference.includes(segmentE))
  
  // 5 is missing segments C and E
  decoder[5] = getReferenceSegmentsOfLength(references, 5)
    .find(reference => !reference.includes(segmentC) && !reference.includes(segmentE))
  
  return decoder.map(x => x.join(""))
}

const getValue = ([references, output]: string[][]): number => {
  const decoder = decodeReferences(references)
  const outputString = output.map(digit => decoder.findIndex(reference => reference === digit)).join("")
  return parseInt(outputString)
}

const getReferenceSegmentsOfLength = (references: string[], length: number): string[][] =>
  references.filter(reference => reference.length === length).map(reference => [...reference])

partOne()
partTwo()
