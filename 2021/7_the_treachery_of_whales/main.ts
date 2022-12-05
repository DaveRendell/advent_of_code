import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

const INPUT_TEXT = "input.txt"

function partOne() {
  const positions = readLines(__dirname, INPUT_TEXT)[0]
    .split(",")
    .map(v => parseInt(v))

  const highestPosition = positions.reduce((a, b) => Math.max(a, b))
  const lowestCost = [...Array(highestPosition).keys()]
    .map(movementCostToPosition(positions))
    .reduce((a, b) => Math.min(a, b))
  console.log("(P1) Answer: " + lowestCost)
}

function partTwo() {
  const positions = readLines(__dirname, INPUT_TEXT)[0]
    .split(",")
    .map(v => parseInt(v))

  const highestPosition = positions.reduce((a, b) => Math.max(a, b))
  const lowestCost = [...Array(highestPosition).keys()]
    .map(geometricCostToPosition(positions))
    .reduce((a, b) => Math.min(a, b))
  console.log("(P2) Answer: " + lowestCost)
}

const movementCostToPosition = (positions: number[]) => (target: number) =>
  positions
    .map(position => Math.abs(position - target))
    .reduce(sum)

const geometricCostToPosition = (positions: number[]) => (target: number) =>
  positions
    .map(position => Math.abs(position - target))
    .map(n => n * (n + 1) / 2)
    .reduce(sum)

partOne()
partTwo()
