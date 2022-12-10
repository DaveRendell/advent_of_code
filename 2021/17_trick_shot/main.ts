import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { ascending } from "../../utils/sorters"
import { range } from "../../utils/numbers"
import { max } from "../../utils/reducers"

function partOne() {
  const targetArea = getTargetArea()
  const [xMin, xMax, yMin, yMax] = targetArea

  const isInTargetArea = ([x, y]) =>
    x >= xMin && x <= xMax && y >= yMin && y <= yMax
  const passesThroughTargetArea = (trajectory: number[][]) =>
    trajectory.some(isInTargetArea)
  
  var highestPoint = range(0, xMax + 1)
    .flatMap(vX => range(0, -yMin)
      .map(vY => runSimulation(vX, vY, targetArea)))
    .filter(passesThroughTargetArea)
    .flatMap(trajectory => trajectory.map(([_, y]) => y))
    .reduce(max)

  console.log("(P1) Answer: " + highestPoint)
}

function partTwo() {
  const targetArea = getTargetArea()
  const [xMin, xMax, yMin, yMax] = targetArea

  const isInTargetArea = ([x, y]) =>
    x >= xMin && x <= xMax && y >= yMin && y <= yMax
  const passesThroughTargetArea = (trajectory: number[][]) =>
    trajectory.some(isInTargetArea)
  
  var validTrajectories = range(0, xMax + 1)
    .flatMap(vX => range(yMin, -yMin)
      .map(vY => runSimulation(vX, vY, targetArea)))
    .filter(passesThroughTargetArea)

  console.log("(P2) Answer: " + validTrajectories.length)
}

function getTargetArea(): number[] {
  const [,, xSegment, ySegment] = readLines(__dirname, inputFile())[0].split(" ")
  return [
    ...parseCoords(xSegment).sort(ascending),
    ...parseCoords(ySegment).sort(ascending)
  ]
}

const parseCoords = (segment: string): number[] =>
  segment.slice(2).split("..").map(v => parseInt(v))

function runSimulation(
  vX0: number,
  vY0: number,
  [xMin, xMax, yMin, yMax]: number[]): number[][] {
  let vX = vX0
  let vY = vY0
  let x = 0
  let y = 0
  let positions = [[x, y]]
  
  // Note doesn't work for targets higher than 0, 0
  while (y >= yMin) {
    x += vX
    y += vY
    vX -= Math.sign(vX)
    vY -= 1
    positions.push([x, y])
  }

  return positions
}

partOne()
partTwo()
