import inputFile from "../../utils/inputFile"
import { inverse2, multiply, scale } from "../../utils/matrices"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"

interface Machine {
  buttonA: number[]
  buttonB: number[]
  prize: number[]
}

const machines: Machine[] = readParagraphs(__dirname, inputFile())
  .map(lines => ({
    buttonA: lines[0].slice(10).split(", ").map(c => parseInt(c.slice(2))),
    buttonB: lines[1].slice(10).split(", ").map(c => parseInt(c.slice(2))),
    prize: lines[2].slice(7).split(", ").map(c => parseInt(c.slice(2)))
  }))

const isInteger = (x: number): boolean =>
  Math.abs(x - Math.round(x)) < 0.0001

const cost = (increase: number) => (machine: Machine): number => {
  // [u,v] * A = [prize]
  // [u,v] = [prize] * A^-1
  const [[a], [b]] = multiply(
    [machine.prize.map(p => p + increase)],
    inverse2([machine.buttonA, machine.buttonB]))
  if (isInteger(a) && isInteger(b)) {
    return 3 * Math.round(a) + Math.round(b)
  }
  return 0
}

console.log("(P1): ", machines.map(cost(0)).reduce(sum))
console.log("(P2): ", machines.map(cost(10000000000000)).reduce(sum))