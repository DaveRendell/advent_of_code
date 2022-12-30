import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { positiveMod, range } from "../../utils/numbers"
import Display from "../../utils/display"

let display = new Display()

interface Coordinate { x: number, y: number }
type Blizzard = Coordinate & { dx: number, dy: number, char: string }

const input = readLines(__dirname, inputFile())
  .map(l => l.split(""))

const height = input.length
const width = input[0].length

const directions = {
  "^": { dx: 0, dy: -1 },
  ">": { dx: 1, dy: 0 },
  "v": { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
}

const blizzards: Blizzard[] = range(0, height)
  .flatMap(y => range(0, width).map(x => ({ x, y, c: input[y][x] })))
  .filter(({c}) => Object.keys(directions).includes(c))
  .map(({x, y, c}) => ({ x, y, ...directions[c], char: c}))

const positionAtTurn = ({ x, dx, y, dy }: Blizzard, t: number): Coordinate => ({
  x: positiveMod(x + t * dx - 1, width - 2) + 1,
  y: positiveMod(y + t * dy - 1, height - 2) + 1,
})

const equals = (a: Coordinate) => (b: Coordinate): boolean =>
  a.x === b.x && a.y === b.y


const mapAtTurn = (b: Blizzard[]) => (t: number): string[][] =>
  range(0, height)
    .map(row => range(0, width).map(col => {
      if (input[row][col] === "#") { return "#" }
      const blizzardsAtPoint = b.filter(b =>
        equals(positionAtTurn(b, t))({ x: col, y: row }))
      
      if (blizzardsAtPoint.length === 0) { return "." }
      return "*"
    }))

const movementOptions = ({ x, y }: Coordinate): Coordinate[] => [
  { x, y }, { x: x + 1, y }, { x: x - 1, y}, { x, y: y + 1 }, { x, y: y - 1 }
]

const inBounds = ({ x, y }: Coordinate): boolean =>
  x >= 0 && x < width && y >= 0 && y < height


const hBlizzards = blizzards.filter(({char}) => "><".includes(char))
const vBlizzards = blizzards.filter(({char}) => "^v".includes(char))

display.clear()
display.print("Calculating horizontal blizzards")
const hMapStates = range(0, width - 2)
  .map(t => mapAtTurn(hBlizzards)(t))

display.clear()
display.print("Calculating vertical blizzards")
const vMapStates = range(0, height - 2)
  .map(t => mapAtTurn(vBlizzards)(t))

const start = { x: 1, y: 0 }
const end = { x: width - 2, y: height - 1}
const asString = ({ x, y }: Coordinate): string => `${x},${y}`
    
let expeditions: Map<string, Coordinate> = new Map([[asString(start), start]])
let t = 0

const waitUntilReaches = (point: Coordinate) => {
  while(!expeditions.has(asString(point))) {
    t++
    const hMap = hMapStates[t % (width - 2)]
    const vMap = vMapStates[t % (height - 2)]
    expeditions = new Map([...expeditions.values()]
      .flatMap(movementOptions)
      .filter(inBounds)
      .filter(({ x, y }) => hMap[y][x] === ".")
      .filter(({ x, y }) => vMap[y][x] === ".")
      .map(c => [asString(c), c]))
  }
}
waitUntilReaches(end)

console.log("(P1): " + t)

expeditions = new Map([[asString(end), end]])
waitUntilReaches(start)

expeditions = new Map([[asString(start), start]])
waitUntilReaches(end)

console.log("(P2): " + t)