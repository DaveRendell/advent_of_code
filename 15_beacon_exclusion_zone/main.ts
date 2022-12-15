import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { sum } from "../utils/reducers"

const ROW = inputFile() === "sample.txt" ? 10 : 2000000
const AREA = inputFile() === "sample.txt"
  ? 20 : 4000000

function partOne() {
  const scanners = readLines(__dirname, inputFile()).map(parse)

  const spacesOnRow = countRow(scanners)(ROW)
  const beaconsOnRow = new Set(
    scanners
      .filter(([_sX, _sY, _bX, bY]) => bY === ROW)
      .map(([_sX, _sY, bX, bY]) => `${bX}${bY}`)
  ).size

  console.log("(P1) Answer: " + (spacesOnRow - beaconsOnRow))
}

function partTwo() {
  const scanners = readLines(__dirname, inputFile()).map(parse)
  
  let answer = 0
  searchLoop:
  for (let y = 0; y <= AREA; y++) {
    const freeRanges = freeRangesOnRow(scanners)(y)
    for (let x = 0; x <= AREA; x++) {
      const range = freeRanges.find(([l, h]) => x >= l && x <= h)
      if (!range) {
        answer = 4000000 * x + y
        break searchLoop
      }
      x = range[1]
    }    
  }

  console.log("(P2) Answer: " + answer)
}

const parse = (line: string): [number, number, number, number] =>
  [
    parseInt(line.split(" ")[2].slice(2, -1)),
    parseInt(line.split(" ")[3].slice(2, -1)),
    parseInt(line.split(" ")[8].slice(2, -1)),
    parseInt(line.split(" ")[9].slice(2)),
  ]

const freeRangesOnRow = (scanners: number[][]) => 
(y: number): number[][] => scanners
    .map(([sensorX, sensorY, nearestX, nearestY]) =>
      [sensorX, sensorY, dist([sensorX, sensorY])([nearestX, nearestY])])
    .filter(([_, sensorY, radius]) =>
      Math.abs(y - sensorY) <= radius)
    .map(([sensorX, sensorY, radius]) =>
      [sensorX - radius + (Math.abs(y - sensorY)), sensorX + radius - (Math.abs(y - sensorY))])
    .reduce(exclusive, [])

const countRow = (scanners: number[][]) => 
  (y: number): number => freeRangesOnRow(scanners)(y)
      .map(measure)
      .reduce(sum)

const dist = ([x0, y0]: number[]) => ([x1, y1]: number[]): number =>
  Math.abs(x1 - x0) + Math.abs(y1 - y0)

const exclusive = (merged: number[][], [lower, higher]: number[]): number[][] => [
  ...merged.flatMap(([otherLower, otherHigher]) => [
    [otherLower, Math.min(lower - 1, otherHigher)],
    [Math.max(higher + 1, otherLower), otherHigher]
  ].filter(([l, h]) => h >= l)),
  [lower, higher]
]

const measure = ([l, h]: number[]) => h - l + 1

partOne()
partTwo()
