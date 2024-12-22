import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { min, sum } from "../../utils/reducers"
import memoise from "../../utils/memoise"

const codes = readLines(__dirname, inputFile())

const keypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["X", "0", "A"],
]
const dpad = [
  ["X", "^", "A"],
  ["<", "v", ">"],
]

const getPadCoordinate = (pad: string[][], button: string): [number, number] => {
  const rowId = pad.findIndex(row => row.includes(button))
  const colId = pad[rowId].findIndex(c => c === button)
  return [colId, rowId]
}

const getTraversals = (code: string) => [...code].map((button, i) => {
  const previous = i === 0 ? "A" : code[i - 1]
  return [previous, button]
})

const solve = memoise((depth: number, pad: string[][], from: string, to: string): number => {
  if (depth === 0) { return 1 }

  const fromCoordinates = getPadCoordinate(pad, from)
  const newCoordinates = getPadCoordinate(pad, to)

  const horizontalShift = fromCoordinates[0] - newCoordinates[0]
  const horizontalButton = horizontalShift > 0 ? "<" : ">"
  const horizontalPresses = Math.abs(horizontalShift)
  const horizontal = new Array(horizontalPresses).fill(horizontalButton).join("")

  const verticalShift = fromCoordinates[1] - newCoordinates[1]
  const verticalButton = verticalShift > 0 ? "^" : "v"
  const verticalPresses = Math.abs(verticalShift)
  const vertical = new Array(verticalPresses).fill(verticalButton).join("")

  const xCoordinates = getPadCoordinate(pad, "X")

  let options: string[] = []
  if (newCoordinates[0] === xCoordinates[0] && fromCoordinates[1] === xCoordinates[1]) {
    options = [vertical + horizontal + "A"]
  } else if (newCoordinates[1] === xCoordinates[1] && fromCoordinates[0] === xCoordinates[0]) {
    options = [horizontal + vertical + "A"]
  } else {
    options = [
      horizontal + vertical + "A",
      vertical + horizontal + "A",
    ]
  }

  return options.map(option =>
    getTraversals(option).map(([from, to]) =>
      solve(depth - 1, dpad, from, to)
    ).reduce(sum)
  ).reduce(min)
  
}, new Map<string, number>())

const getMinimumLength = (depth: number) => (code: string): number =>
  getTraversals(code).map(([from, to]) =>
    solve(depth, keypad, from, to)
  ).reduce(sum)

const getNumericValue = (code: string) => Number(code.slice(0, -1))

const complexitySum = (depth: number) => codes.map(code =>
  getNumericValue(code) * getMinimumLength(depth)(code)
).reduce(sum)

console.log("(P1): ", complexitySum(3))
console.log("(P2): ", complexitySum(26))
