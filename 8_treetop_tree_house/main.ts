import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { range } from "../utils/numbers"
import { sum } from "../utils/reducers"

interface HeightCheckState {
  isVisible: boolean[]
  currentMax: number
}

const checkRow = ({ isVisible, currentMax }: HeightCheckState, next: number, index: number): HeightCheckState => ({
  isVisible: isVisible.map((value, i) => i === index ? value || next > currentMax : value),
  currentMax: Math.max(currentMax, next)
})

function partOne() {
  const treeGrid = readLines(__dirname, inputFile())
    .map(line => [...line].map(char => parseInt(char)))

  const initialState = { isVisible: Array(treeGrid[0].length).fill(false), currentMax: -1 }

  const fromLeft = treeGrid.map(row =>
    row.reduce(checkRow, initialState).isVisible)
  const fromRows = treeGrid.map((row, rowIndex) =>
    row.slice()
      .reverse()
      .reduce(
        checkRow,
        { isVisible: fromLeft[rowIndex].reverse(), currentMax: -1 }).isVisible.reverse())
  const fromTopAlso = transpose(transpose(treeGrid).map((row, rowIndex) =>
    row.reduce(checkRow, { isVisible: transpose(fromRows)[rowIndex], currentMax: -1 }).isVisible))
  const isVisible = transpose(transpose(treeGrid).map((row, rowIndex) =>
    row.slice()
      .reverse()
      .reduce(checkRow, { isVisible: transpose(fromTopAlso)[rowIndex].reverse(), currentMax: -1 }).isVisible.reverse()))
  
  const answer = isVisible.map(row => row.filter(value => value).length).reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {}

partOne()
partTwo()

function transpose<T>(grid: T[][]) {
  return range(0, grid[0].length).map(colIndex => grid.map(row => row[colIndex]))
}

function printGrid(grid: number[][], results: boolean[][]) {
  console.log(
    grid
      .map((line, rowIndex) => line
        .map((value, colIndex) => results[rowIndex][colIndex] ? `\x1b[32m${value}\x1b[0m` : value.toString())
        .join(" "))
      .join("\n"))
}
