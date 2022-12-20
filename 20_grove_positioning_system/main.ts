import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { sum } from "../utils/reducers"
import { range } from "../utils/numbers"

function partOne() {
  const input = readLines(__dirname, inputFile()).map(x => parseInt(x))
  
  let ordering = mix(input, range(0, input.length))
  const mixed = reorder(input, ordering)

  console.log("(P1) Answer: " + coordinateSum(mixed))
}

function partTwo() {
  const input = readLines(__dirname, inputFile())
    .map(x => 811589153 * parseInt(x))

  let ordering = range(0, input.length)
  for (let i = 0; i < 10; i++) {
    ordering = mix(input, ordering)
  }
  const mixed = reorder(input, ordering)

  console.log("(P2) Answer: " + coordinateSum(mixed))
}

const mix = (original: number[], positions: number[]): number[] => {
  let positionInSequence = [...positions]

  for (let cursor = 0; cursor < original.length; cursor++) {
    const value = original[cursor]
    const position = positionInSequence[cursor]
    const newPosition = positiveMod(position + value - 1, original.length - 1) + 1
    positionInSequence = positionInSequence.map(p => isBetween(position, newPosition)(p)
          ? p + Math.sign(position - newPosition)
          : p)
    positionInSequence[cursor] = newPosition
  }
  return positionInSequence
}

const positiveMod = (n: number, m: number): number =>
  ((n % m) + m) % m

const isBetween = (a: number, b: number) => (x: number): boolean =>
  Math.min(a, b) <= x && x <= Math.max(a, b)

const reorder = (input: number[], ordering: number[]) =>
  range(0, input.length).map(i => input[ordering.findIndex(j => j === i)])

const coordinateSum = (sequence: number[]): number => {
  const zeroIndex = sequence.findIndex(x => x === 0)
  return [1000, 2000, 3000]
    .map(n => sequence[(n + zeroIndex) % sequence.length])
    .reduce(sum)
}

partOne()
partTwo()
