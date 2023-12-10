import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max } from "../../utils/reducers"

interface Instruction {
  targetRegister: string
  change: number
  testRegister: string
  condition: string
  testValue: number
}

const instructions: Instruction[] = readLines(__dirname, inputFile())
  .map(line => {
    const [
      targetRegister, incOrDec, incAmount, , testRegister, condition, testValueString
    ] = line.split(" ")
    return {
      targetRegister,
      change: (incOrDec == "inc" ? +1 : -1) * parseInt(incAmount),
      testRegister,
      condition,
      testValue: parseInt(testValueString),
    }
  })

const registers: { [register: string]: number } = {}

let highestValue = -Infinity

const processInstruction = ({
  targetRegister, change, testRegister, condition, testValue
}: Instruction) => {
  const testRegisterValue = registers[testRegister] || 0
  let test: boolean
  if (condition == "==") { test = testRegisterValue == testValue }
  if (condition == "!=") { test = testRegisterValue != testValue }
  if (condition == "<") { test = testRegisterValue < testValue }
  if (condition == ">") { test = testRegisterValue > testValue }
  if (condition == "<=") { test = testRegisterValue <= testValue }
  if (condition == ">=") { test = testRegisterValue >= testValue }
  if (test === undefined) { throw new Error("Unknown test " + condition) }

  if (test) {
    registers[targetRegister] = (registers[targetRegister] || 0) + change
    highestValue = Math.max(highestValue, registers[targetRegister])
  }
}

instructions.forEach(instr => {
  processInstruction(instr)
})

console.log("(P1): " + Object.values(registers).reduce(max))

console.log("(P2): " + highestValue)