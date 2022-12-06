import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { min, product, sum } from "../../utils/reducers"
import { descending } from "../../utils/sorters"

function partOne() {
  const heightMap = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const coordinatePairs = getCoordinatePairs(heightMap)

  const lowPoints = coordinatePairs.filter(([x, y]) =>
    getAdjacentValues(heightMap, [x, y]).reduce(min) > heightMap[x][y])
  
  const riskSum = lowPoints.map(([x, y]) => heightMap[x][y] + 1).reduce(sum)

  console.log("(P1) Answer: " + riskSum)
}

function partTwo() {
  const heightMap = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const coordinatePairs = getCoordinatePairs(heightMap)

  const lowPoints = coordinatePairs.filter(([x, y]) =>
    getAdjacentValues(heightMap, [x, y]).reduce(min) > heightMap[x][y])
  
  const basinSizes = lowPoints.map(lowPoint => getBasinSize(heightMap, lowPoint))
  const answer = basinSizes.sort(descending).slice(0, 3).reduce(product)

  console.log("(P2) Answer: " + answer)
}

const getCoordinatePairs = (heightMap: number[][]): number[][] =>
  range(0, heightMap.length)
    .map(x => range(0, heightMap[0].length).map(y => [x, y]))
    .flat()

const getAdjacentCoordinates = (
  heightMap: number[][],
  [i, j]: number[]
): number[][] =>
  [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([x, y]) => 
      x >= 0 && x < heightMap.length
        && y >= 0 && y < heightMap[0].length)

const getAdjacentValues = (
  heightMap: number[][],
  [i, j]: number[]
): number[] =>
  getAdjacentCoordinates(heightMap, [i, j])
    .map(([x, y]) => heightMap[x][y])

const getBasinSize = (heightMap: number[][], [x, y]: number[]): number => {
  var basinCells = [[x, y]]
  var updates = [[x, y]]

  while (updates.length > 0) {
    const newCells = updates
      .flatMap(update => getAdjacentCoordinates(heightMap, update))
      .filter(([i, j]) => heightMap[i][j] !== 9)
    updates = []
    newCells.forEach(newCell => {
      if (!basinCells.some(cell => coordEqual(cell, newCell))) {
        basinCells.push(newCell)
        updates.push(newCell)
      }
    })
  }

  return basinCells.length
}

const coordEqual = ([a, b]: number[], [c, d]: number[]) => a === c && b === d

partOne()
partTwo()
