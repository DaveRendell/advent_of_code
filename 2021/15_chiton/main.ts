import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { findLowestCostsOld } from "../../utils/pathFinding"
import readDigitGrid from "../../utils/readDigitGrid"

function partOne() {
  const grid = readDigitGrid(__dirname, inputFile())
  const lowestRisk = findLowestCostsOld(
    grid,
    [0, 0],
    (_, [toX, toY]) => grid[toY][toX])

  console.log("(P1) Answer: " + lowestRisk.at(-1).at(-1))
}

function partTwo() {
  const grid = readDigitGrid(__dirname, inputFile())
  const expandedGrid = expandMap(grid)
  const lowestRisk = findLowestCostsOld(
    expandedGrid,
    [0, 0],
    (_, [toX, toY]) => expandedGrid[toY][toX])
  
  console.log("(P2) Answer: " + lowestRisk.at(-1).at(-1))
}

function expandMap(grid: number[][]): number[][] {
  return range(0, 5)
    .flatMap(increment => grid.map(incrementRow(increment)))
    .map(row => range(0, 5).flatMap(increment => row.map(incrementRisk(increment))))
}

const incrementRisk = (increment: number) => (risk: number): number => ((risk + increment - 1) % 9) + 1
const incrementRow = (increment: number) => (row: number[]): number[] => row.map(incrementRisk(increment))

partOne()
partTwo()
