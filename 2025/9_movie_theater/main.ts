import inputFile from "../../utils/inputFile"
import { positiveMod } from "../../utils/numbers"
import { Range } from "../../utils/range"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { max } from "../../utils/reducers"
import Vector2 from "../../utils/vector2"

const redTiles = readNumbersFromLines(__dirname, inputFile())
  .map(([x, y]) => new Vector2(x, y))

interface Rectangle { a: Vector2, b: Vector2, area: number }

const rectangles = redTiles.flatMap((a, i) =>
  redTiles.slice(i).map(b => ({ a, b, area: (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1) })))

console.log("(P1): ", rectangles.map(r => r.area).reduce(max))

interface Line { from: Vector2, to: Vector2 }

const lines = redTiles.map((tile, i) => ({ from: tile, to: redTiles.at(positiveMod(i + 1, redTiles.length))}))

const lineIntersectsRectangle = (rectangle: Rectangle, line: Line): boolean => {
  const { from, to } = line
  const { a, b } = rectangle

  const lineXRange = Range.inclusive(from.x, to.x)
  const lineYRange = Range.inclusive(from.y, to.y)

  const rectXRange = Range.exclusive(a.x, b.x)
  const rectYRange = Range.exclusive(a.y, b.y)

  return lineXRange.overlaps(rectXRange) && lineYRange.overlaps(rectYRange)
}

const isCromulent = (rectangle: Rectangle): boolean => !lines.some(line => lineIntersectsRectangle(rectangle, line))

console.log("(P2): ", rectangles.filter(isCromulent).map(r => r.area).reduce(max))