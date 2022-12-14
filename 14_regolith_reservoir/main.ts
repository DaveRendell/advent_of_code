import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { windows } from "../utils/reducers"
import { ascending } from "../utils/sorters"

type Point = number[]
type Line = Point[]

function partOne() {
  const lines = readLines(__dirname, inputFile()).flatMap(parseLines)

  let settledSand: Point[] = []
  const canMoveToPoint = ([x, y]: Point): boolean => {
    const settled = settledSand.find(([i, j]) => i === x && j === y)
    const line = lines.find(line => pointIsOnLine(line)([x, y]))
    return !settled && !line
  }
  const notFallingIntoAbyss = ([_, y]: Point): boolean =>
    lines.some(line => line.some(([_, j]) => j > y))


  let lastSandSettled = true
  while(lastSandSettled) {
    lastSandSettled = false
    let sand = [500, 0]
    let canMove = true
    if (notFallingIntoAbyss(sand)) {
      while(canMove) {
        const [x, y] = sand
        canMove = false
        // Is there something below the sand?
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
              lastSandSettled = true
              settledSand.push(sand)
            }
          }
        }
      }
    }
  }

  console.log("(P1) Answer: " + settledSand.length)
}

function partTwo() {}

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
