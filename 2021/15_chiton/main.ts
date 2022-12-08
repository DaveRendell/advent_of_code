import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readDigitGrid from "../../utils/readDigitGrid"

function partOne() {
  const grid = readDigitGrid(__dirname, inputFile())
  const lowestRisk = getLowestRiskMap(grid)

  console.log("(P1) Answer: " + lowestRisk.at(-1).at(-1))
}

function partTwo() {
  const grid = readDigitGrid(__dirname, inputFile())
  const expandedGrid = expandMap(grid)
  const lowestRisk = getLowestRiskMap(expandedGrid)
  
  console.log("(P2) Answer: " + lowestRisk.at(-1).at(-1))
}

function getLowestRiskMap(grid: number[][]): number[][] {
  const width = grid[0].length
  const height = grid.length
  var risks = grid.map(row => row.map(() => null))
  risks[0][0] = 0
  var updates = [[0, 0]]

  while (updates.length > 0) {
    var newUpdates = []
    for (const [u_x, u_y] of updates) {
      const u_risk = risks[u_y][u_x]
      const adjacentCells = [[u_x - 1, u_y], [u_x + 1, u_y], [u_x, u_y - 1], [u_x, u_y + 1]]
        .filter(([i, j]) => i >= 0 && i < width && j >= 0 && j < height)
      for (const [a_x, a_y] of adjacentCells) {
        const a_cost = grid[a_y][a_x]
        if (risks[a_y][a_x] === null || u_risk + a_cost < risks[a_y][a_x]) {
          risks[a_y][a_x] = u_risk + a_cost
          newUpdates.push([a_x, a_y])
        }
      }
    }
    updates = newUpdates
  }
  return risks
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
