import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"
import { ascending } from "../../utils/sorters"

function partOne() {
  const input = readParagraphs(__dirname, inputFile())
    .map(paragraph => paragraph.slice(1).map(line =>
      line.split(",").map(v => parseInt(v))))

  const totalBeacons = input.map(scanner => scanner.length).reduce(sum)
  const repeats = input
    .map((scanner1, i) =>
      input.slice(i + 1)
        .map(scanner2 => amountOfOverlaps(scanner1, scanner2))
        .filter(overlaps => overlaps >= 12)
        .reduce(sum, 0))
    .reduce(sum)
  
  console.log(totalBeacons)
  console.log(repeats)
  console.log(totalBeacons - repeats)
  console.log("(P1) Answer: " + (totalBeacons - repeats))
  // 453 too low
}

function partTwo() {}

const dist = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)

const getDistances = (beacons: number[][]): number[][] =>
  beacons.map(beacon => beacons.map(other => dist(beacon, other)).sort(ascending).slice(1))

const getAmountOfOverlaps = (list1: number[], list2: number[]): number =>
  list1.length + list2.length - new Set([...list1, ...list2]).size

const isPotentialOverlap = (scanner1: number[][], scanner2: number[][]): boolean =>
  amountOfOverlaps(scanner1, scanner2) >= 12

const amountOfOverlaps = (scanner1: number[][], scanner2: number[][]): number => {
  const distances1 = getDistances(scanner1)
  const distances2 = getDistances(scanner2)

  return distances1
    .filter(beaconDistances => 
      distances2.some(possibleMatch => getAmountOfOverlaps(beaconDistances, possibleMatch) >= 11))
    .length
}

partOne()
partTwo()
