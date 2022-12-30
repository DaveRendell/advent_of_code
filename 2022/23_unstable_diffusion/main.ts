import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange, range } from "../../utils/numbers"
import Cycle from "../../utils/cycle"
import { max, min, sum } from "../../utils/reducers"
import Display from "../../utils/display"

interface Elf { x: number, y: number }

const NW = [-1, -1]
const N = [0, -1]
const NE = [1, -1]
const E = [1, 0]
const SE = [1, 1]
const S = [0, 1]
const SW = [-1, 1]
const W = [-1, 0]

const lines = readLines(__dirname, inputFile())
const startElves: Elf[] = range(0, lines.length).flatMap(y =>
  range(0, lines[0].length).map(x => ({ x, y })))
  .filter(({x, y}) => lines[y][x] === "#")
const adjacencies = [NW, N, NE, E, SE, S, SW, W]
let directions = Cycle.fromValues([
  [NW, N, NE],
  [SE, S, SW],
  [NW, W, SW],
  [NE, E, SE],
])
let elves = startElves
let elfMoved = true
const display = new Display()

const containsElf = (fx: number, fy: number): boolean =>
  elves.some(({x, y}) => x === fx && y === fy)

const equals = ({x, y}: Elf) => ({x: x2, y: y2}: Elf): boolean =>
  x === x2 && y === y2

const extents = (elves: Elf[]) => [
  elves.map(({x}) => x).reduce(min),
  elves.map(({x}) => x).reduce(max),
  elves.map(({y}) => y).reduce(min),
  elves.map(({y}) => y).reduce(max),
]

const draw = (elves: Elf[]) => {
  const [minX, maxX, minY, maxY] = extents(elves)
  return inclusiveRange(minY, maxY)
    .map(row => inclusiveRange(minX, maxX)
      .map(col =>
        elves.some(({x, y}) => y === row && x === col) ? "🧝" : "  ")
      .join("")).join("\n")
}

const countFree = (elves: Elf[]): number => {
  const [minX, maxX, minY, maxY] = extents(elves)
  return inclusiveRange(minY, maxY)
    .map(row => inclusiveRange(minX, maxX)
      .filter(col =>
        !elves.some(({x, y}) => y === row && x === col)).length)
      .reduce(sum)
}

let i = 0
while (elfMoved) {
  elfMoved = false
  const checks = directions.getNext(4)
  const proposedPositions = elves.map(({ x: x1, y: y1 }) => {
    if (adjacencies.every(([dx, dy]) => !containsElf(x1 + dx, y1 + dy))) {
      return { x: x1, y: y1 }
    }
    const possibleMove = checks.find(spaces => spaces.every(([dx, dy]) =>
      !elves.some(({ x: x2, y: y2 }) =>
        x1 + dx === x2 && y1 + dy === y2)))
    if (!possibleMove) { return { x: x1, y: y1 } }
    elfMoved = true
    const [,[dx, dy]] = possibleMove
    return { x: x1 + dx, y: y1 + dy }
  })

  display.clear()
  if (i === 10) {
    console.log("(P1): " + countFree(elves))
  }

  elves = elves.map((elf, i) =>
    proposedPositions.some((position, j) => equals(proposedPositions[i])(position) && i !== j)
      ? elf : proposedPositions[i])

  display.print("Turn " + (i + 1))
  display.print(draw(elves))
  display.print("")
  directions = directions.next
  i++
}


console.log("(P2): " + i) // 966 too high