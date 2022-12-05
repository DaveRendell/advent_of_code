import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

const INPUT_TEXT = "input.txt"

function partOne() {
  console.log("(P1) Answer: " + getStateAfterDays(80).reduce(sum))
}

function partTwo() {
  console.log("(P2) Answer: " + getStateAfterDays(256).reduce(sum))
}

// State is the number of fish at a given point in the life cycle
function getStateAfterDays(days: number): number[] {
  const initialState = readLines(__dirname, INPUT_TEXT)[0]
    .split(",")
    .map(v => parseInt(v))
    .reduce(populateInitialState, Array(9).fill(0))
  console.log(initialState)
  return [...Array(days).keys()].reduce(iterate, initialState)

}

const populateInitialState = (state: number[], value: number): number[] =>
  [...Array(9).keys()].map(i => i === value ? state[i] + 1 : state[i])

const iterate = (state: number[]): number[] =>
  [...Array(9).keys()].map(i => {
    if (i == 8) { return state[0] }
    if (i == 6) { return state[0] + state[7] }
    return state[i + 1]
  })

partOne()
partTwo()
