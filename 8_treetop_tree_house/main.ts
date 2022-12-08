import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { range } from "../utils/numbers"
import { max, sum } from "../utils/reducers"

interface VisibilityAccumulator {
  visible: boolean[]
  max: number
}

const visiblityFromLeft = ({ visible, max }: VisibilityAccumulator, next: number): VisibilityAccumulator => ({
  visible: [...visible, next > max],
  max: Math.max(max, next)
})

const getVisibilityFromLeft = (grid: number[][]) => grid.map(row =>
  row.reduce(visiblityFromLeft, { visible: [], max: -1 }).visible)

function partOne() {
  const treeGrid = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const fromLeft = getVisibilityFromLeft(treeGrid)
  const fromRight = flipH(getVisibilityFromLeft(flipH(treeGrid)))
  const fromTop = transpose(getVisibilityFromLeft(transpose(treeGrid)))
  const fromBottom = transpose(flipH(getVisibilityFromLeft(flipH(transpose(treeGrid)))))

  const visibility = [fromBottom, fromTop, fromRight].reduce(mergeBoolGrid, fromLeft)

  const answer = visibility.map(row => row.filter(v => v).length).reduce(sum)
  console.log("(P1) Answer: " + answer)
}

const getScoreFromLeft = (grid: number[][]) =>
  grid.map(row => row.map((cell, i) =>
    i - (row.slice(0, i)
      .map((tree, j) => [j, tree])
      .filter(([j, tree]) => tree >= cell)
      .pop() || [0])[0]))

function partTwo() {
  const treeGrid = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const fromLeft = getScoreFromLeft(treeGrid)
  const fromRight = flipH(getScoreFromLeft(flipH(treeGrid)))
  const fromTop = transpose(getScoreFromLeft(transpose(treeGrid)))
  const fromBottom = transpose(flipH(getScoreFromLeft(flipH(transpose(treeGrid)))))

  const scores = [fromBottom, fromTop, fromRight].reduce(mergeScoreGrid, fromLeft)

  const answer = scores.map(row => row.reduce(max)).reduce(max)
  console.log("(P2) Answer: " + answer)
}


function transpose<T>(grid: T[][]) {
  return range(0, grid[0].length).map(colIndex => grid.map(row => row[colIndex]))
}

function flipH<T>(grid: T[][]) {
  return grid.map(row => row.slice().reverse())
}

function mergeBoolGrid(grid1: boolean[][], grid2: boolean[][]): boolean[][] {
  return grid1.map((row, rowIndex) => row.map((cell, colIndex) => cell || grid2[rowIndex][colIndex]))
}

function mergeScoreGrid(grid1: number[][], grid2: number[][]): number[][] {
  return grid1.map((row, rowIndex) => row.map((cell, colIndex) => cell * grid2[rowIndex][colIndex]))
}

partOne()
partTwo()