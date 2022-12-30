import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

interface State { a: number, b: number, c: number }

const program = readLines(__dirname, inputFile())

const execute = (program: string[], input: number): State => {
  let state = { a: input, b: 0, c: 0 }
  executionLoop:
  while (state.c >= 0 && state.c < program.length) {
    const { c } = state
    const [command, ...args] = program[c].replace(",", "").split(" ")
    if (command === "hlf") {
      const register = args[0]
      state = { ...state, [register]: Math.floor(state[register] / 2), c: c + 1 }
      continue executionLoop
    }
    if (command === "tpl") {
      const register = args[0]
      state = { ...state, [register]: state[register] * 3, c: c + 1 }
      continue executionLoop
    }
    if (command === "inc") {
      const register = args[0]
      state = { ...state, [register]: state[register] + 1, c: c + 1 }
      continue executionLoop
    }
    if (command === "jmp") {
      const offset = parseInt(args[0])
      state = { ...state, c: c + offset }
      continue executionLoop
    }
    if (command === "jie") {
      const register = args[0]
      const offset = (state[register] % 2 === 0) ? parseInt(args[1]) : 1
      state = { ...state, c: c + offset }
      continue executionLoop
    }
    if (command === "jio") {
      const register = args[0]
      const offset = (state[register] === 1) ? parseInt(args[1]) : 1
      state = { ...state, c: c + offset }
      continue executionLoop
    }
  }
  return state
}

console.log("(P1): " + execute(program, 0).b)
console.log("(P2): " + execute(program, 1).b)