import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import { range } from "../../utils/numbers"

function partOne() {
  const input = readLines(__dirname, inputFile())
    .map(x => parseInt(x))
  
  let ordering = input.reduce(mix, range(0, input.length))

  console.log("(P1) Answer: " + coordinateSum(input, ordering))
}

function partTwo() {
  const input = readLines(__dirname, inputFile())
    .map(x => 811589153 * parseInt(x))

  let ordering = range(0, input.length)
  for (let i = 0; i < 10; i++) {
    ordering = input.reduce(mix, ordering)
  }

  console.log("(P2) Answer: " + coordinateSum(input, ordering))
}

const mix = (positions: number[], value: number, cursor: number): number[] => {
  const position = positions[cursor]
  const newPosition = positiveMod(position + value - 1, positions.length - 1) + 1
  const newPositions = positions.map(p => isBetween(position, newPosition)(p)
    ? p + Math.sign(position - newPosition)
    : p)
  newPositions[cursor] = newPosition
  return newPositions
}

const positiveMod = (n: number, m: number): number =>
  ((n % m) + m) % m

const isBetween = (a: number, b: number) => (x: number): boolean =>
  Math.min(a, b) <= x && x <= Math.max(a, b)

const coordinateSum = (input: number[], ordering: number[]): number => {
  const zeroIndex = ordering[input.findIndex(x => x === 0)]
  return [1000, 2000, 3000]
    .map(n => input[ordering.findIndex(j => j === (zeroIndex + n) % input.length)])
    .reduce(sum)
}

partOne()
partTwo()
