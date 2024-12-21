import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { min, sum } from "../../utils/reducers"
import HashSet from "../../utils/hashset"

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

interface ButtonPresses { button: string, presses: number }

const getCoordinate = (pad: string[][], button: string): [number, number] => {
  const rowId = pad.findIndex(row => row.includes(button))
  const colId = pad[rowId].findIndex(c => c === button)
  return [colId, rowId]
}

const paths = (pad: string[][], code: ButtonPresses[]): ButtonPresses[][] => {
  return [...code].reduce((options: ButtonPresses[][], { button, presses }, i) => {
    const previousPosition = i === 0 ? "A" : code[i - 1].button
    const previousCoordinates = getCoordinate(pad, previousPosition)
    const nextCoordinates = getCoordinate(pad, button)

    const horizontalDifference = previousCoordinates[0] - nextCoordinates[0]
    const verticalDifference = previousCoordinates[1] - nextCoordinates[1]

    const horizontalButton = horizontalDifference > 0 ? "<" : ">"
    const verticalButton = verticalDifference > 0 ? "^" : "v"

    const horizontalPresses = Math.abs(horizontalDifference)
    const verticalPresses = Math.abs(verticalDifference)

    const horizontal = { button: horizontalButton, presses: horizontalPresses }
    const vertical = { button: verticalButton, presses: verticalPresses}
    const press = { button: "A", presses }

    if (horizontalPresses === 0) {
      return options.map(previous =>
        [...previous, vertical, press]
      )
    }

    if (verticalPresses === 0) {
      return options.map(previous =>
        [...previous, horizontal, press]
      )
    }

    const horizontalFirst = [vertical, horizontal, press]
    const verticalFirst = [horizontal, vertical, press]

    if (pad[previousCoordinates[1]].includes("X")) { // Do the vertical first 
      return options.map(previous =>
        [...previous, ...verticalFirst]
      )
    }

    if (pad.map((row, i) => row[previousCoordinates[0]]).includes("X")) { // Do the horizontal first
      return options.map(previous =>
        [...previous, ...horizontalFirst]
      )
    }

    return options.flatMap(previous => 
      [
        horizontalPresses > 0 ? [...previous, horizontal, vertical, { button: "A", presses }] : [],
        verticalPresses > 0 ? [...previous, horizontal, vertical, { button: "A", presses }] : [],
      ]
    )
  }, [[]])
}

let minimalPaths: HashSet<ButtonPresses[]> = new HashSet(x => JSON.stringify(x), [[..."029A"].map(c => ({ button: c, presses: 1 }))])
for (let i = 0; i < 5; i++) {
  console.log("Depth:", i)
  const pad = i === 0 ? keypad : dpad
  const newPaths = minimalPaths.entries().flatMap(path => paths(pad, path))
  const shortestLength = newPaths.map(path => path.map(({ presses }) => presses).reduce(sum)).reduce(min)
  console.log("Shortest length of button presses found:", shortestLength)
  minimalPaths = new HashSet(x => JSON.stringify(x), newPaths.filter(path => path.map(({ presses }) => presses).reduce(sum) === shortestLength))
  console.log("Number of minimal paths found", minimalPaths.size)
}
console.log(paths(keypad, [..."029A"].map(c => ({ button: c, presses: 1 }))))

console.log("(P1): ", 0) // 109758

console.log("(P2): ", 0)