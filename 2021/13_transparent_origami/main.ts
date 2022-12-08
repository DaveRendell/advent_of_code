import readParagraphs from "../../utils/readParagraphs"
import inputFile from "../../utils/inputFile"
import { max, sum } from "../../utils/reducers"

function partOne() {
  const [dots, instructions] = readParagraphs(__dirname, inputFile())

  const startGrid = createStartGrid(dots)
  const newGrid = processInstruction(startGrid, instructions[0])
  const answer = newGrid
    .map(row => row.filter(cell => cell === "#").length)
    .reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const [dots, instructions] = readParagraphs(__dirname, inputFile())

  const startGrid = createStartGrid(dots)
  const newGrid = instructions.reduce(processInstruction, startGrid)
  
  console.log("(P2):")
  printGrid(newGrid)
}

function createStartGrid(input: string[]): string[][] {
  const dots = input.map(line => line.split(",").map(v => parseInt(v)))
  const width = dots.map(d => d[0]).reduce(max) + 1
  const height = dots.map(d => d[1]).reduce(max) + 1

  const emptyGrid = Array(height).fill(Array(width).fill("."))

  return dots.reduce((grid, [x, y]) => 
    grid.map((row, rowIndex) =>
      rowIndex === y
        ? row.map((cell, columnIndex) =>
          columnIndex === x
            ? "#"
            : cell)
        : row),
      emptyGrid)
}

const processInstruction = (grid: string[][], instruction: string): string[][] => {
  const [axis, valueString] = instruction.slice(11).split("=")
  const value = parseInt(valueString)

  if (axis === "y") {
    return grid.slice(0, value)
      .map((row, rowIndex) => row
        .map((cell, cellIndex) =>
          grid.at(value + (value - rowIndex)) && grid[value + (value - rowIndex)][cellIndex] === "#" ? "#" : cell))
  }

  return grid.map((row, rowIndex) =>
    row.slice(0, value).map((cell, cellIndex) => grid[rowIndex][value + (value - cellIndex)] === "#" ? "#" : cell))
}

partOne()
partTwo()

function printGrid(grid: string[][]) {
  console.log(grid.map(line => line.join(" ")).join("\n"))
}