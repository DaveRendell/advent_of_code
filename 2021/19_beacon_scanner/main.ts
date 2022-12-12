import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { max } from "../../utils/reducers"
import { ascending } from "../../utils/sorters"

type ScannerWithId = { id: number, scanner: Scanner }

function partOne() {
  const scanners = readParagraphs(__dirname, inputFile())
    .map(paragraph => paragraph.slice(1).map(line =>
      line.split(",").map(v => parseInt(v))))
  const alignedScanners = getAlignedScanners(scanners)

  const alignedBeacons = alignedScanners.flat()
  const uniqueBeacons = alignedBeacons.filter((beacon, i) => !alignedBeacons.slice(i + 1).some(vecEqual(beacon)))
  console.log("(P1) Answer: " + uniqueBeacons.length)
}

function partTwo() {
  // Add a new "beacon" to each scanner at 0, 0, 0 - the scanner itself
  const scanners = readParagraphs(__dirname, inputFile())
    .map(paragraph => paragraph.slice(1).map(line =>
      line.split(",").map(v => parseInt(v))))
    .map(scanner => [[0, 0, 0], ...scanner])
  const alignedScanners = getAlignedScanners(scanners)
  const scannerLocations = alignedScanners.map(scanner => scanner[0])
  const largestDistance = scannerLocations
    .flatMap(scanner => scannerLocations
      .map(other => dist(scanner, other)))
    .reduce(max)
  console.log("(P2) Answer: " + largestDistance)
}

const getAlignedScanners = (scanners: Scanner[]): Scanner[] => {
  const overlapMaps = getOverlapMaps(scanners)
  let alignedScanners: ScannerWithId[] = [{id: 0, scanner: scanners[0]}]
  let unalignedScanners: ScannerWithId[] = scanners.map((scanner, id) => ({scanner, id})).slice(1)

  while (unalignedScanners.length > 0) {
    const alignedScannerWithUnalignedOverlaps =
      alignedScanners.find(({id: alignedId}) =>
        overlapMaps[alignedId].some(j =>
          unalignedScanners.some(({id}) => j === id)))
    if (alignedScannerWithUnalignedOverlaps === undefined) {
      throw new Error("Panic")
    }
    const alignableScannerId = overlapMaps[alignedScannerWithUnalignedOverlaps.id]
      .find(j => unalignedScanners.some(({id}) => id === j))
    const alignableScanner = scanners[alignableScannerId]

    const reference = alignedScannerWithUnalignedOverlaps.scanner
    const newlyAlignedScanner = rotations(alignableScanner)
      .flatMap(offsets(reference))
      .find(overlaps(reference))
    if (newlyAlignedScanner === undefined) { throw new Error("Panic") }
    alignedScanners.push({ id: alignableScannerId, scanner: newlyAlignedScanner })
    unalignedScanners = unalignedScanners.filter(({ id }) => id !== alignableScannerId)
  }

  return alignedScanners.map(({scanner}) => scanner)
}

const dist = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)

const getDistances = (beacons: number[][]): number[][] =>
  beacons.map(beacon => beacons.map(other => dist(beacon, other)).sort(ascending).slice(1))

const getAmountOfOverlaps = (list1: number[], list2: number[]): number =>
  list1.length + list2.length - new Set([...list1, ...list2]).size

const getOverlapMaps = (scanners: Scanner[]): number[][] =>
  scanners.map((scannerA, i) => scanners
    .map((s, j) => [s, j])
    .filter(([scannerB]) => scannerOverlaps(scannerA, scannerB as Scanner) >= 12)
    .filter(([_, j]) => j !== i)
    .map(([_, j]) => j as number))

const scannerOverlaps = (scanner1: number[][], scanner2: number[][]): number => {
  const distances1 = getDistances(scanner1)
  const distances2 = getDistances(scanner2)

  return distances1
    .filter(beaconDistances => 
      distances2.some(possibleMatch => getAmountOfOverlaps(beaconDistances, possibleMatch) >= 11))
    .length
}

const distanceArraysEqual = (distances1: number[], distances2: number[]): boolean =>
  distances1.length === distances2.length && distances1.every((distance, i) => distance === distances2[i])

// Should be 24? Pick x direction freely (+/- 3 options = 6), get 4 choices for y, z is then fixed by right hand rule
type Scanner = number[][]
type Rotation = (scanner: Scanner) => Scanner
const ROTATIONS: Rotation[] = [
  ([x, y, z]) => [ x,  y,  z],
  ([x, y, z]) => [ x, -y, -z],
  ([x, y, z]) => [ x,  z, -y],
  ([x, y, z]) => [ x, -z,  y],
  ([x, y, z]) => [-x,  y, -z],
  ([x, y, z]) => [-x, -y,  z],
  ([x, y, z]) => [-x,  z,  y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [ y,  x, -z],
  ([x, y, z]) => [ y, -x,  z],
  ([x, y, z]) => [ y,  z,  x],
  ([x, y, z]) => [ y, -z, -x],
  ([x, y, z]) => [-y,  x,  z],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y,  z, -x],
  ([x, y, z]) => [-y, -z,  x],
  ([x, y, z]) => [ z,  x,  y],
  ([x, y, z]) => [ z, -x, -y],
  ([x, y, z]) => [ z,  y, -x],
  ([x, y, z]) => [ z, -y,  x],
  ([x, y, z]) => [-z,  x, -y],
  ([x, y, z]) => [-z, -x,  y],
  ([x, y, z]) => [-z,  y,  x],
  ([x, y, z]) => [-z, -y, -x],
].map(vectorRotation => (Scanner: Scanner) => Scanner.map(vectorRotation))

const rotations = (scanner: Scanner) => ROTATIONS.map(r => r(scanner))

const vecEqual = ([x1, y1, z1]: number[]) => ([x2, y2, z2]: number[]): boolean =>
  x1 === x2 && y1 === y2 && z1 === z2

const vecSum = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number[] =>
  [x1 + x2, y1 + y2, z1 + z2]

const vecDiff = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number[] =>
  [x1 - x2, y1 - y2, z1 - z2]

const offsets = (scannerA: Scanner) =>
  (scannerB: Scanner): Scanner[] =>
    scannerB.flatMap(refBeaconB =>
      scannerA.map(refBeaconA =>
        scannerB.map(beacon =>
          vecSum(beacon, vecDiff(refBeaconA, refBeaconB)))))

const overlaps = (scannerA: Scanner) =>
  (scannerB: Scanner) =>
    scannerA
      .filter(beaconA => scannerB.some(vecEqual(beaconA)))
      .length >= 12


partOne()
partTwo()
