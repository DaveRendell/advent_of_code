import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

interface Input { target: number, operands: number[]}

const input: Input[] = readLines(__dirname, inputFile())
  .map(line => {
    const [target, operands] = line.split(": ")
    return {
      target: Number(target),
      operands: operands.split(" ").map(operand => Number(operand))
    }
  })

const hasSolution = (
  target: number, acc: number, operands: number[], useConcat: boolean
): boolean => {
  if (operands.length === 0) { return target === acc }
  if (acc > target) { return false }
  const [head, ...tail] = operands
  return hasSolution(target, acc * head, tail, useConcat)
    || hasSolution(target, acc + head, tail, useConcat)
    || (useConcat && hasSolution(target, parseInt(`${acc}${head}`), tail, useConcat))
}

const getCalibrationValue = (useConcat: boolean) => input
  .filter(({ target, operands }) => hasSolution(target, 0, operands, useConcat))
  .map(({ target }) => target)
  .reduce(sum)

console.log("(P1): ", getCalibrationValue(false))
console.log("(P2): ", getCalibrationValue(true))
