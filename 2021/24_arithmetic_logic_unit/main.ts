import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

function partOne() {
  const instructions = readLines(__dirname, inputFile())

  // let notFoundYet = true
  // let modelNumber = 99999999999999
  // while(notFoundYet) {
  //   modelNumber--
  //   console.log(modelNumber)
  //   const inputs = [...modelNumber.toString()].map(x => parseInt(x))
  //   if (!inputs.some(x => x === 0)) {
  //     const { registers: {z: result } } = instructions.reduce(
  //       apply("off"),
  //       { registers: { w: 0, x: 0, y: 0, z: 0 }, inputs })
  //     if (result === 0) { notFoundYet = false }
  //   }    
  // }

  // [3] == [2] + 6
  // [6] == [5] + 7
  // [9] == [8] + 3
  // Guess?: [12] == [11] + 1
  // Still doesn't get to zero though... not sure what I'm missing
  const modelNumber = 99179189149129
  const inputs = [...modelNumber.toString()].map(x => parseInt(x))
  instructions.reduce(
          apply("print"),
          { registers: { w: 0, x: 0, y: 0, z: 0 }, inputs })

  console.log("(P1) Answer: " + modelNumber)
}

function partTwo() {}

interface State {
  registers: {w: number, x: number, y: number, z: number },
  inputs: number[]
}

type DebugMode = "off" | "print"

const apply = (debugMode: DebugMode) => (
  { registers, inputs }: State,
  instruction: string,
  index: number
): State => {
  const {w, x, y, z} = registers
  let newState = { registers, inputs }
  if (instruction.startsWith("inp")) {
    const register = instruction.split(" ")[1]
    newState = { registers: { ...registers, [register]: inputs[0] }, inputs: inputs.slice(1) }
  }

  const binaryOperation = (operation: (a: number, b: number) => number): State => {
    const targetVariable = instruction.split(" ")[1]
    const operandString = instruction.split(" ")[2]
    const operand1: number = registers[targetVariable]
    const operand2: number = "wxyz".includes(operandString)
      ? registers[operandString]
      : parseInt(operandString)
    const result = operation(operand1, operand2)
    return { registers: { ...registers, [targetVariable]: result }, inputs }
  }

  if (instruction.startsWith("add")) {
    newState = binaryOperation((a, b) => a + b)
  }
  if (instruction.startsWith("mul")) {
    newState = binaryOperation((a, b) => a * b)
  }
  if (instruction.startsWith("div")) {
    newState = binaryOperation((a, b) => Math.floor(a / b))
  }
  if (instruction.startsWith("mod")) {
    newState = binaryOperation((a, b) => a % b)
  }
  if (instruction.startsWith("eql")) {
    newState = binaryOperation((a, b) => a === b ? 1 : 0)
  }
  if (debugMode === "print") {
    const pre = JSON.stringify({ registers, inputs }) === JSON.stringify(newState)
      ? ""
      : "\x1b[32m"
    console.log(`${pre}${index + 1}: ${instruction.padEnd(12)}<- ${JSON.stringify(newState.registers)}, in: ${JSON.stringify(newState.inputs)}\x1b[0m`)
  }
  return newState
}

partOne()
partTwo()
