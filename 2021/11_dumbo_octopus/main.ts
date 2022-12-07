import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"

const getCoordinatePairs = (grid: number[][]): number[][] =>
  range(0, grid.length)
    .map(x => range(0, grid[0].length).map(y => [x, y]))
    .flat()

function partOne() {
  const grid = readLines(__dirname, inputFile())
    .map(line => [...line].map(v => parseInt(v)))
  
  var explosions = 0
  var newGrid = grid
  for (let i = 1; i <= 100; i++) {
    newGrid = newGrid.map(line => line.map(value => value + 1))
    while (newGrid.some(line => line.some(value => value > 9))) {
      const explodingCoords = getCoordinatePairs(grid)
        .filter(([x, y]) => newGrid[x][y] > 9)
      // Set exploders to 0, then increment adjacent cells, unless they're already 0
      explosions += explodingCoords.length
      explodingCoords.forEach(([x, y]) => {
        newGrid[x][y] = 0
        const getAdjacentCoordinates = getCoordinatePairs(grid)
          .filter(([i, j]) => Math.abs(i - x) <= 1)
          .filter(([i, j]) => Math.abs(j - y) <= 1)
          .filter(([i, j]) => i !== x || j !== y)
        getAdjacentCoordinates.map(([i, j]) =>
          newGrid[i][j] = newGrid[i][j] === 0 ? 0 : newGrid[i][j] + 1)
      })
    }
  }

  console.log("(P1) Answer: " + explosions)
}

function partTwo() {
  const grid = readLines(__dirname, inputFile())
    .map(line => [...line].map(v => parseInt(v)))
  
  var turn = 0
  var newGrid = grid
  while (new Set(newGrid.flat()).size > 1) {
    turn++
    newGrid = newGrid.map(line => line.map(value => value + 1))
    while (newGrid.some(line => line.some(value => value > 9))) {
      const explodingCoords = getCoordinatePairs(grid)
        .filter(([x, y]) => newGrid[x][y] > 9)
      // Set exploders to 0, then increment adjacent cells, unless they're already 0
      explodingCoords.forEach(([x, y]) => {
        newGrid[x][y] = 0
        const getAdjacentCoordinates = getCoordinatePairs(grid)
          .filter(([i, j]) => Math.abs(i - x) <= 1)
          .filter(([i, j]) => Math.abs(j - y) <= 1)
          .filter(([i, j]) => i !== x || j !== y)
        getAdjacentCoordinates.map(([i, j]) =>
          newGrid[i][j] = newGrid[i][j] === 0 ? 0 : newGrid[i][j] + 1)
      })
    }
  }

  console.log("(P2) Answer: " + turn)
}

partOne()
partTwo()