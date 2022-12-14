import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max, windows } from "../utils/reducers"
import { ascending } from "../utils/sorters"

type Point = number[]
type Line = Point[]

function partOne() {
  const lines = readLines(__dirname, inputFile()).flatMap(parseLines)

  let settledSand: Point[] = []
  
  let lastSandSettled = true
  while(lastSandSettled) {
    lastSandSettled = dropSand(lines, settledSand)
  }

  console.log("(P1) Answer: " + settledSand.length)
}

function partTwo() {
  const lines = readLines(__dirname, inputFile()).flatMap(parseLines)
  const floorHeight = lines.flat().map(([_, y]) => y).reduce(max) + 2
  const floor = [[-Infinity, floorHeight], [Infinity, floorHeight]]

  let settledSand: Point[] = []
  
  let lastSandSettled = true
  while(lastSandSettled && !settledSand.some(([x, y]) => x === 500 && y === 0)) {
    lastSandSettled = dropSand([...lines, floor], settledSand)
  }

  console.log("(P2) Answer: " + settledSand.length)
}

const dropSand = (lines: Line[], settledSand: Point[]): boolean => {
  const canMoveToPoint = ([x, y]: Point): boolean => {
    const settled = settledSand.find(([i, j]) => i === x && j === y)
    const line = lines.find(line => pointIsOnLine(line)([x, y]))
    return !settled && !line
  }
  const notFallingIntoAbyss = ([_, y]: Point): boolean =>
    lines.some(line => line.some(([_, j]) => j > y))

  let sand = [500, 0]
  let canMove = true
  while(canMove) {
    canMove = false
    if (notFallingIntoAbyss(sand)) {
      const [x, y] = sand
      if (canMoveToPoint([x, y + 1])) {
        canMove = true
        sand = [x, y + 1]
      } else {
        if (canMoveToPoint([x - 1, y + 1])) {
          canMove = true
          sand = [x - 1, y + 1]
        } else {
          if (canMoveToPoint([x + 1, y + 1])) {
            canMove = true
            sand = [x + 1, y + 1]
          } else {
            settledSand.push(sand)
            return true
          }
        }
      }
    } else { return false }
  }
}


const parseLines = (line: string): Line[] =>
  line.split(" -> ")
    .map(parsePoint)
    .reduce(windows(2), [])

const parsePoint = (pointString: string): Point =>
  pointString.split(",").map(v => parseInt(v))

const pointIsOnLine = ([[x0, y0], [x1, y1]]: Line) => ([x, y]: Point): boolean =>
  (x === x0 && x === x1 && [y0, y, y1].sort(ascending)[1] === y)
  || (y === y0 && y === y1 && [x0, x, x1].sort(ascending)[1] === x)

partOne()
partTwo()
