import { inclusiveRange } from "../../utils/numbers"
import readLines from "../../utils/readLines"

const INPUT_NAME = "input.txt"

const parse = (line: string): number[] =>
  line
    .split(" -> ")
    .map(point => point.split(","))
    .flat()
    .map(value => parseInt(value))

const isOrthagonal = ([x1, y1, x2, y2]: number[]): boolean =>
  x1 == x2 || y1 == y2


type Grid = { [ix: number]: { [j: number]: number}}
const addToGrid = (grid: Grid, [x, y]: number[]) => 
  ({
    ...grid,
    [x]: grid[x] === undefined
      ? { [y]: 1 }
      : Object.fromEntries([...Object.entries(grid[x]), [y, grid[x][y] === undefined ? 1 : grid[x][y] + 1]])
  })

function partOne() {
  const grid = readLines(__dirname, INPUT_NAME)
    .map(parse)
    .filter(isOrthagonal)
    .map(([x1, y1, x2, y2]) => [x1, y1, x2 - x1, y2 - y1])
    .map(([x1, y1, dx, dy]) => [x1, y1, Math.max(Math.abs(dx), Math.abs(dy)), dx, dy])
    .map(([x1, y1, steps, dx, dy]) => [x1, y1, steps, Math.floor(dx / steps), Math.floor(dy / steps)])
    .map(([x1, y1, steps, sx, sy]) => inclusiveRange(0, steps).map(step => [x1 + step * sx, y1 + step * sy]))
    .flat()
    .reduce(addToGrid, {})
  
  var answer = Object.values(grid)
    .flatMap(row => Object.values(row))
    .filter(value => value >= 2)
    .length

  console.log("(P1) Number of overlapping vents: " + answer)
}

function partTwo() {
  const grid = readLines(__dirname, INPUT_NAME)
    .map(parse)
    .map(([x1, y1, x2, y2]) => [x1, y1, x2 - x1, y2 - y1])
    .map(([x1, y1, dx, dy]) => [x1, y1, Math.max(Math.abs(dx), Math.abs(dy)), dx, dy])
    .map(([x1, y1, steps, dx, dy]) => [x1, y1, steps, Math.floor(dx / steps), Math.floor(dy / steps)])
    .map(([x1, y1, steps, sx, sy]) => inclusiveRange(0, steps).map(step => [x1 + step * sx, y1 + step * sy]))
    .flat()
    .reduce(addToGrid, {})
  
  var answer = Object.values(grid)
    .flatMap(row => Object.values(row))
    .filter(value => value >= 2)
    .length

  console.log("(P1) Number of overlapping vents: " + answer)
}

partOne()
partTwo()
