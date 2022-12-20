import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = [...readLines(__dirname, inputFile())[0]]

const getFloor = (instructions: string[]): number => 
  instructions.length - 2 * instructions.filter(x => x === ")").length

console.log("(P1): " + getFloor(input))

const p2Answer = input.findIndex((_, i) =>
  getFloor(input.slice(0, i + 1)) === -1) + 1
console.log("(P2): " + p2Answer)
