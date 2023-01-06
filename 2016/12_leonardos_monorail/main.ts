import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

interface State { cursor: number, a: number, b: number, c: number, d: number }
type Instruction = (State) => State

const parse = (line: string): Instruction => {
  const command = line.split(" ")[0]
  const args = line.split(" ").slice(1)
  const iargs = args.map(v => parseInt(v))

  if (command === "cpy") {
    return (state) => ({
      ...state,
      cursor: state.cursor + 1,
      [args[1]]: isNaN(parseInt(args[0])) ? state[args[0]] : iargs[0]
    })
  }
  if (command === "inc") {
    return (state) => ({
      ...state,
      cursor: state.cursor + 1,
      [args[0]]: state[args[0]] + 1
    })
  }
  if (command === "dec") {
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
        cursor: state.cursor + (testValue ? iargs[1] : 1),
      }
    }
  }
} 

const program = readLines(__dirname, inputFile())
  .map(parse)

let state: State = { cursor: 0, a: 0, b: 0, c: 0, d: 0 }

while (state.cursor < program.length) {
  state = program[state.cursor](state)
}

console.log("(P1): " + state.a)

state = { cursor: 0, a: 0, b: 0, c: 1, d: 0 }

while (state.cursor < program.length) {
  state = program[state.cursor](state)
}

console.log("(P2): " + state.a)