import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"

type Instruction = (State) => State
interface State { program: string[], cursor: number, a: number, b: number, c: number, d: number }

const identity: Instruction = (state) => state

const parse = (line: string): Instruction => {
  const command = line.split(" ")[0]
  const args = line.split(" ").slice(1)
  const iargs = args.map(v => parseInt(v))

  if (command === "cpy") {
    if (!isNaN(iargs[1])) { return identity }
    return (state) => ({
      ...state,
      cursor: state.cursor + 1,
      [args[1]]: isNaN(parseInt(args[0])) ? state[args[0]] : iargs[0]
    })
  }
  if (command === "inc") {
    if (!isNaN(iargs[0])) { return identity }
    return (state) => ({
      ...state,
      cursor: state.cursor + 1,
      [args[0]]: state[args[0]] + 1
    })
  }
  if (command === "dec") {
    if (!isNaN(iargs[0])) { return identity }
    return (state) => ({
      ...state,
      cursor: state.cursor + 1,
      [args[0]]: state[args[0]] - 1
    })
  }
  if (command === "jnz") {
    return (state) => {
      const testValue = isNaN(parseInt(args[0])) ? state[args[0]] : iargs[0]
      return {
        ...state,
        cursor: state.cursor + (testValue ? (isNaN(iargs[1]) ? state[args[1]] : iargs[1]) : 1),
      }
    }
  }
  if (command === "tgl") {
    return (state: State) => {
      const togglePosition = state.cursor + (isNaN(iargs[0]) ? state[args[0]] : iargs[0])
      const toggledInstruction = state.program[togglePosition]
      if (toggledInstruction) {
        const newInstructionType =
          toggledInstruction.startsWith("inc") ? "dec"
            : toggledInstruction.startsWith("jnz") ? "cpy"
            : toggledInstruction.split(" ").length === 2 ? "inc"
            : "jnz"
        return {
          ...state,
          cursor: state.cursor + 1,
          program: [
            ...state.program.slice(0, togglePosition),
            newInstructionType + toggledInstruction.slice(3),
            ...state.program.slice(togglePosition + 1),
          ]
        }
      }     
      
      return { ...state, cursor: state.cursor + 1 }
    }
  }
  throw new Error("Unsupported operation")
} 

function runProgram(initialState: State): State {
  let state: State = { ...initialState, program: initialState.program.slice() }

  while (state.cursor < state.program.length) {
    // console.log(`${state.program[state.cursor]}`)
    state = parse(state.program[state.cursor])(state)
    // console.log(`\t[a: ${state.a}, b: ${state.b}, c: ${state.c}, d: ${state.d}, cursor: ${state.cursor}]`)
    // console.log(`\t${state.program.join(", ")}`)
  }
  return state
}

const p1Answer = runProgram({ program: readLines(__dirname, inputFile()), cursor: 0, a: 7, b: 0, c: 0, d: 0 }).a
console.log("(P1): " + p1Answer)

const factorial = (n: number): number => range(1, n + 1).reduce((a, b) => a * b, 1)

for (let i = 7; i < 10; i++) {
  const answer = runProgram({ program: readLines(__dirname, inputFile()), cursor: 0, a: i, b: 0, c: 0, d: 0 }).a
  console.log(`${i}:\t${answer - factorial(i)}`)
}

console.log("(P2): " + (factorial(12) + p1Answer - factorial(7)))