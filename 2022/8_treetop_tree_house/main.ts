import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"

interface VisibilityAccumulator { visible: boolean[]; max: number }

const getVisibilityFromLeft = (grid: number[][]): boolean[][] =>
  grid.map(row =>
    row.reduce(({ visible, max }: VisibilityAccumulator, next: number): VisibilityAccumulator => ({
      visible: [...visible, next > max],
      max: Math.max(max, next)
    }), { visible: [], max: -1 }).visible)

function partOne() {
  const treeGrid = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const fromLeft = getVisibilityFromLeft(treeGrid).flat()
  const fromRight = flipH(getVisibilityFromLeft(flipH(treeGrid))).flat()
  const fromTop = transpose(getVisibilityFromLeft(transpose(treeGrid))).flat()
  const fromBottom = transpose(flipH(getVisibilityFromLeft(flipH(transpose(treeGrid))))).flat()

  const visibility = [...fromLeft.keys()].map(i => fromLeft[i] || fromRight[i] || fromTop[i] || fromBottom[i])
  console.log("(P1) Answer: " + visibility.filter(visible => visible).length)
}

const getScoreFromLeft = (grid: number[][]): number[][] =>
  grid.map(row => row.map((cell, i) =>
    i - (row.slice(0, i)
      .map((tree, j) => [j, tree])
      .filter(([_, tree]) => tree >= cell)
      .pop() || [0])[0]))

function partTwo() {
  const treeGrid = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const fromLeft = getScoreFromLeft(treeGrid).flat()
  const fromRight = flipH(getScoreFromLeft(flipH(treeGrid))).flat()
  const fromTop = transpose(getScoreFromLeft(transpose(treeGrid))).flat()
  const fromBottom = transpose(flipH(getScoreFromLeft(flipH(transpose(treeGrid))))).flat()

  const scores = [...fromLeft.keys()].map(i => fromLeft[i] * fromRight[i] * fromTop[i] * fromBottom[i])
  console.log("(P2) Answer: " + Math.max(...scores))
}

function transpose<T>(grid: T[][]) {
  return range(0, grid[0].length).map(colIndex => grid.map(row => row[colIndex]))
}

function flipH<T>(grid: T[][]) {
  return grid.map(row => row.slice().reverse())
}

partOne()
partTwo()