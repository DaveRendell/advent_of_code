import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

interface State {
  registers: Record<string, number>
  position: number
}

const input = readLines(__dirname, inputFile())

const state: State = {
  registers: Object.fromEntries("abcdefg".split("").map(r => [r, 0])),
  position: 0
}

let mulCount = 0

const getValue = (parameter: string): number => {
  if (isNaN(Number(parameter))) { return Number(parameter) }
  return state.registers[parameter]
}

const runInstruction = () => {
  const words = input[state.position].split(" ")
  const command = words[0]
  const params = words.slice(1)
  const values = params.map(getValue)

  switch (command) {
    case "set":
      state.registers[params[0]] = values[1]
      state.position++
      break
    case "sub":
      state.registers[params[0]] -= values[1]
      state.position++
      break
    case "mul":
      state.registers[params[0]] *= values[1]
      mulCount++
      state.position++
      break
    case "jnz":
      if (values[0]) {
        state.position += values[1]
      }
      break
    default:
      throw new Error(`Unknown command ${command} - state: ${JSON.stringify(state)}`)
  }
}

while (state.position < input.length) {
  runInstruction()
}

const iHateThese = () => {
  let a, b, c, d, e, f, g, h = 0

  b = 65
  c = b

  if (a > 0) {
    b *= 100 //here
    b -= 100000
    c = b
    c -= 17000
  }

  do {
    f = 1
    d = 2

    do {
      e = 2

      do {
        g = d
        g *= e // here
        g -= b
        if (g === 0) {
          f = 0
        }
        e -= -1
        g = e
        g -= b
      } while (g)
        
      d -= -1
      g = d
      g -= b
    } while (g)
    
    if (f === 0) {
      h -= -1
    }

    g = b
    g -= c

    b -= -17 // actually not called the last time
  } while (g)
}

console.log("(P1): ", mulCount)

console.log("(P2): ", 0)