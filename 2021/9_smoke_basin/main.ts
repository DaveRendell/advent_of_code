import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { min, sum } from "../../utils/reducers"

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
  
  console.log("(P2) Answer: ")
}

const getCoordinatePairs = (heightMap: number[][]): number[][] =>
  range(0, heightMap.length)
    .map(x => range(0, heightMap[0].length).map(y => [x, y]))
    .flat()

const getAdjacentValues = (
  heightMap: number[][],
  [i, j]: number[]
): number[] =>
  [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([x, y]) => 
      x >= 0 && x < heightMap.length
        && y >= 0 && y < heightMap[0].length)
    .map(([x, y]) => heightMap[x][y])

partOne()
partTwo()
