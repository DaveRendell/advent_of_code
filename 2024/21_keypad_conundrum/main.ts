import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import * as assert from "node:assert"
import Vector2, { VectorMap } from "../../utils/vector2"
import { findLowestCosts } from "../../utils/pathFinding"
import { ascendingBy } from "../../utils/sorters"

const codes = readLines(__dirname, inputFile())

const keypad = VectorMap.fromGrid([
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["X", "0", "A"],
])
const dpad = VectorMap.fromGrid([
  ["X", "^", "A"],
  ["<", "v", ">"],
])

interface State {
  robots: Vector2[],
  output: string,
}
const start: State = {
  robots: [new Vector2(2, 3), new Vector2(2, 0), new Vector2(2, 0)],
  output: ""
}

const getNeighbours = (state: State): State[] => {
  const getNextState = (command: string, robots: Vector2[], output: string): State => {
    if (robots.length === 0) { return { robots: [], output: output + command} }
    const newRobots = robots.map(r => r.copy())
    const topRobot = newRobots.at(-1)
    const pad: VectorMap<string> = robots.length === 1 ? keypad : dpad
    const isValidPosition = (position: Vector2): boolean =>
      pad.has(position) && pad.get(position) !== "X"
    const height = robots.length === 1 ? 4 : 3
    if (command === "<" && isValidPosition(topRobot.add(Vector2.LEFT))) {
      newRobots[newRobots.length - 1] = topRobot.add(Vector2.LEFT)
    }
    if (command === ">" && isValidPosition(topRobot.add(Vector2.RIGHT))) {
      newRobots[newRobots.length - 1] = topRobot.add(Vector2.RIGHT)
    }
    if (command === "^" && isValidPosition(topRobot.add(Vector2.UP))) {
      newRobots[newRobots.length - 1] = topRobot.add(Vector2.UP)
    }
    if (command === "v" && isValidPosition(topRobot.add(Vector2.DOWN))) {
      newRobots[newRobots.length - 1] = topRobot.add(Vector2.DOWN)
    }
    if (command === "A") {
      const subState = getNextState(pad.get(topRobot), robots.slice(0, -1), output)
      return {
        robots: [...subState.robots, topRobot], output: subState.output
      }
    }
    return { robots: newRobots, output }
  }
  return [..."><^vA"].map(command => getNextState(command, state.robots, state.output))
}

const cost = (target: string) => (from: State, to: State): number => {
  if (!target.startsWith(to.output)) { return Infinity }
  if (from.output.length >= target.length) { return Infinity }
  return 1
}

const getNumericValue = (code: string) => Number(code.slice(0, -1))

const getStart = (depth: number): State => ({
  robots: [new Vector2(2, 3), ...[...new Array(depth)].map(_ => new Vector2(2, 0))],
  output: ""
})

const complexitySum = (depth: number) => codes.map(code => {
  return getNumericValue(code) * findLowestCosts(
      state => JSON.stringify(state),
      getStart(depth),
      cost(code),
      getNeighbours)
    .entries()
    .filter(([state]) => state.output === code)
    .sort(ascendingBy(([_, cost]) => cost))[0][1]
}).reduce(sum)

console.log("(P1): ", complexitySum(2)) // 110902 too high
console.log("(P2): ", complexitySum(25))


// const getPadCoordinate = (pad: string[][], button: string): [number, number] => {
//   const rowId = pad.findIndex(row => row.includes(button))
//   const colId = pad[rowId].findIndex(c => c === button)
//   return [colId, rowId]
// }

// const getLeastButtonPressesForCode = (code: string, robots: number): string[] => {
//   if (robots === 0) { return [code] }
//   const pad = robots === 1 ? keypad : dpad
//   return getLeastButtonPressesForCode(code, robots - 1).flatMap(target =>
//     const possibilities = [...target].map((button, i) => {
//       const previousLocation = i === 0 ? "A" : target[i - 1]
//       const previousCoordinates = getPadCoordinate(pad, previousLocation)
//       const newCoordinates = getPadCoordinate(pad, button)

//       const horizontalShift = previousCoordinates[0] - newCoordinates[0]
//       const horizontalButton = horizontalShift > 0 ? "<" : ">"
//       const horizontalPresses = Math.abs(horizontalShift)
//       const horizontal = new Array(horizontalPresses).fill(horizontalButton).join("")

//       const verticalShift = previousCoordinates[1] - newCoordinates[1]
//       const verticalButton = verticalShift > 0 ? "^" : "v"
//       const verticalPresses = Math.abs(verticalShift)
//       const vertical = new Array(verticalPresses).fill(verticalButton).join("")

//       if (horizontal === vertical) { return [horizontal + vertical + "A"] }
//       return [...new Set([
//         horizontal + vertical + "A",
//         vertical + horizontal + "A",
//       ]).entries()]
//     })

//   )
// }

// console.log(getLeastButtonPressesForCode("029A", 1))

// console.log("(P1): ", 0) // 112958 too high

// console.log("(P2): ", 0)

/*
Ignore X:
4 5 6 A
<< ^^ A //      > A > A vv A
<< v AA > ^ AA > A //                 v A ^ A v A ^ A < v AA > ^ A
<< v AA > A > ^ AA v A < ^ A > AA v A ^ A //                            < v A > ^ A < A > A < v A > ^ A < A > A << v A > A > ^ AA v A < ^ A > A

Avoid X:
4 5 6 A
^^ << A //      > A > A vv A
< AA v < AA >> ^ A //                      v A ^ A v A ^ A v < AA > ^ A
v << A >> ^ AA v < A < A >> ^ AA v AA < ^ A > A //                      v < A > ^ A < A > A v < A > ^ A < A > A v < A < A >> ^ AA v A < ^ A > A
*/

// interface ButtonPress { button: string, presses: number }

// // Note - simplified as no repeating digits in input
// const codeToButtonPresses = (code: string): ButtonPress[] =>
//   ([...code]).map(button => ({ button, presses: 1 }))

// const getPadCoordinate = (pad: string[][], button: string): [number, number] => {
//   const rowId = pad.findIndex(row => row.includes(button))
//   const colId = pad[rowId].findIndex(c => c === button)
//   return [colId, rowId]
// }

// const getButtonPresses = (code: string, dpads: number): ButtonPress[] => {
//   if (dpads === 0) { return codeToButtonPresses(code) }

//   const pad = dpads === 1 ? keypad : dpad
//   const targets = getButtonPresses(code, dpads - 1)
//   return targets.flatMap(({ button, presses }, i) => {
//     const previousLocation = i === 0 ? "A" : targets[i - 1].button
//     assert.notEqual(presses, 0)
//     assert.notEqual(previousLocation, button)
//     const previousCoordinates = getPadCoordinate(pad, previousLocation)
//     const newCoordinates = getPadCoordinate(pad, button)

//     const horizontalShift = previousCoordinates[0] - newCoordinates[0]
//     const horizontalButton = horizontalShift > 0 ? "<" : ">"
//     const horizontalPresses = Math.abs(horizontalShift)

//     const verticalShift = previousCoordinates[1] - newCoordinates[1]
//     const verticalButton = verticalShift > 0 ? "^" : "v"
//     const verticalPresses = Math.abs(verticalShift)

//     if (pad[previousCoordinates[1]].includes("X") || verticalButton === "v") { //Do vertical first to avoid X
//       return [
//         verticalPresses > 0 ? [{ button: verticalButton, presses: verticalPresses }] : [],
//         horizontalPresses > 0 ? [{ button: horizontalButton, presses: horizontalPresses }] : [],
//         [{ button: "A", presses }]
//       ].flat()
//     }

//     return [ // Otherwise do horizontal first
//       horizontalPresses > 0 ? [{ button: horizontalButton, presses: horizontalPresses }] : [],
//       verticalPresses > 0 ? [{ button: verticalButton, presses: verticalPresses }] : [],
//       [{ button: "A", presses }]
//     ].flat()
//   })
// }

// // For debugging
// const runString = (pad: string[][], commands: string): string => {
//   let [x, y] = getPadCoordinate(pad, "A")
//   let output = "";
//   [...commands].forEach(c => {
//     switch (c) {
//       case "^": y--; break
//       case "v": y++; break
//       case ">": x++; break
//       case "<": x--; break
//       case "A": output += pad[y][x]
//     }
//     // assert.notEqual(pad[y][x], "X")
//     assert.notEqual(pad[y][x], undefined)
//   })
//   return output
// }

// // const code1 = codes[0]
// // const commands1 =  getButtonPresses(codes[0], 1).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" ")
// // const commands2 =  getButtonPresses(codes[0], 2).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" ")
// // const rerun1 = runString(keypad, commands1)
// // const rerun2 = runString(dpad, commands2)
// // const rerun2a = runString(keypad, rerun2)

// // console.log({ code1, commands1, rerun1, commands2, rerun2, rerun2a })

// codes.slice(3, 4).forEach(code => {
//   console.log(getButtonPresses(code, 0).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" "))
//   console.log(getButtonPresses(code, 1).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" "))
//   console.log(getButtonPresses(code, 2).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" "))
//   console.log(getButtonPresses(code, 3).map(({ button, presses}) => new Array(presses).fill(button).join("")).join(" "))
// })

// const getNumericValue = (code: string) => Number(code.slice(0, -1))

// console.log(codes.map(getNumericValue))
// console.log(codes.map(code => getButtonPresses(code, 3).map(({ presses }) => presses).reduce(sum)))

// const complexitySum = codes
//   .map(code => getNumericValue(code) * getButtonPresses(code, 3).map(({ presses }) => presses).reduce(sum)).reduce(sum)

// console.log("(P1): ", complexitySum) // 110902 too high

// console.log("(P2): ", 0)