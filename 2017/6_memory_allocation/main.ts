import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0]
  .split("\t").map(x => parseInt(x))

const findLoop = () => {
  let state = input.slice()
  let cycles = 0
  const memory: Map<string, number> = new Map()
  do {
    memory.set(state.join(","), cycles)
    let newState = state.slice()
    const largestBlockIndex = state.findIndex(x => x === state.reduce(max))
    newState[largestBlockIndex] = 0
    for (let i = 1; i <= state[largestBlockIndex]; i++) {
      newState[(largestBlockIndex + i) % newState.length]++
    }
    state = newState
    cycles++
  } while (!memory.has(state.join(",")))
  return [cycles, cycles - memory.get(state.join(","))]
}

const [cyclesToRepeat, cycleLength] = findLoop()

console.log("(P1): " + cyclesToRepeat)

console.log("(P2): " + cycleLength)