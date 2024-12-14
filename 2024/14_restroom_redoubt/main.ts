import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import sampleSpecificValue from "../../utils/sampleSpecificValue"
import { hcf, lcm, positiveMod, range } from "../../utils/numbers"

interface Robot {
  start: number[],
  velocity: number[],
  uniquePositionCounts: number[],
  uniquePositions: number[][],
}

const width = sampleSpecificValue(11, 101)
const height = sampleSpecificValue(7, 103)
const bounds = [width, height]

const robots: Robot[] = readNumbersFromLines(__dirname, inputFile())
  .map(([px, py, vx, vy]) => {
    const start = [px, py]
    const velocity = [vx, vy]
    const uniquePositionCounts = bounds.map((bound, dimension) =>
      bound / hcf(Math.abs(velocity[dimension]), bound)
    )
    const uniquePositions = bounds.map((bound, dimension) =>
      range(0, uniquePositionCounts[dimension]).map(i =>
        positiveMod(start[dimension] + i * velocity[dimension], bound)))
    return { start, velocity, uniquePositionCounts, uniquePositions }
  })

const getPositionGrid = (step: number): number[][] => {
  const positions = [...new Array(height)].map(_ => new Array(width).fill(0))
  robots.forEach(robot => {
    const x = robot.uniquePositions[0][step % robot.uniquePositionCounts[0]]
    const y = robot.uniquePositions[1][step % robot.uniquePositionCounts[1]]
    positions[y][x]++
  })
  return positions
}

const getQuadrantCounts = (step: number): number[] => {
  let topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0
  const widthMiddle = (width - 1) / 2
  const heightMiddle = (height - 1) / 2
  robots.forEach(robot => {
    const x = robot.uniquePositions[0][step % robot.uniquePositionCounts[0]]
    const y = robot.uniquePositions[1][step % robot.uniquePositionCounts[1]]
    if (x < widthMiddle && y < heightMiddle) { topLeft++ }
    if (x > widthMiddle && y < heightMiddle) { topRight++ }
    if (x < widthMiddle && y > heightMiddle) { bottomLeft++ }
    if (x > widthMiddle && y > heightMiddle) { bottomRight++ }
  })
  return [topLeft, topRight, bottomLeft, bottomRight]
}

const getSafetyScore = (step: number): number => {
  const [topLeft, topRight, bottomLeft, bottomRight] = getQuadrantCounts(step)
  return topLeft * topRight * bottomLeft * bottomRight
}

console.log("(P1): ", getSafetyScore(100))

const display = (step: number): string[] => {
  const positions = getPositionGrid(step)
  return positions.map(row =>
    row.map(x => x > 0 ? "#" : ".").join("")
  )
}

const positionsContainLine = (step: number): boolean => {
  const lineLength = 7
  const positions = getPositionGrid(step)
  return positions.some((row, y) =>
    range(0, row.length - lineLength).some(x =>
      range(0, lineLength).every(i =>
        positions[y][x + i] > 0
      )
    )
  )
}

const upperBound = robots
  .flatMap(robot => robot.uniquePositionCounts)
  .reduce(lcm, 1)

console.log("Unique positions:", upperBound)

let i = 0
do {
  if (i % 1000 === 0) { console.log("Tried positions", i, "/", upperBound)}
  i++
} while (!positionsContainLine(i) && i < upperBound)
display(i).forEach(line => console.log(line))

console.log("(P2): ", i)