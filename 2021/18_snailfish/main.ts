import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { max } from "../../utils/reducers"

function partOne() {
  const input = readLines(__dirname, inputFile()).map(parseNumber)
  
  const sum = input.reduce(add)

  console.log("(P1) Answer: " + magnitude(sum))
}

function partTwo() {
  const input = readLines(__dirname, inputFile()).map(parseNumber)
  
  const answer = input
    .flatMap(number1 => range(0, input.length)
      .map(i => add(number1, input[i])))
    .map(magnitude)
    .reduce(max)

  console.log("(P2) Answer: " + answer)
}

type SnailfishNumber = Pair | number
type Key = "left" | "right"
interface Pair {
  left: SnailfishNumber
  right: SnailfishNumber
}

const parseNumber = (input: string): SnailfishNumber => {
  const parsed = JSON.parse(input)
  if (typeof parsed === "number") { return parsed }
  return {
    left: parseNumber(JSON.stringify(parsed[0])),
    right: parseNumber(JSON.stringify(parsed[1])),
  }
}

const willExplode = (number: SnailfishNumber, depth: number = 0): boolean => {
  if (depth > 4) { return true }
  if (typeof number === "number") { return false }
  return willExplode(number.left, depth + 1) || willExplode(number.right, depth + 1)
}

const explode = (number: SnailfishNumber, depth: number = 0): [SnailfishNumber, [number, number]] => {
  if (typeof number === "number") { return [number, [0, 0]] }
  const { left, right } = number
  const isBasePair = typeof left === "number" && typeof right === "number"
  if (depth >= 4 && isBasePair) { return [0, [left, right]] }

  if (willExplode(left, depth + 1)) {
    const [explodedLeft, [remainderLeft, remainderRight]] = explode(left, depth + 1)
    return [{ left: explodedLeft, right: passRemainder(right, remainderRight, "left")}, [remainderLeft, 0]]
  }
  
  const [explodedRight, [remainderLeft, remainderRight]] = explode(right, depth + 1)
  return [{ left: passRemainder(left, remainderLeft, "right"), right: explodedRight}, [0, remainderRight]]
}

const passRemainder = (number: SnailfishNumber, amount: number, key: Key): SnailfishNumber => {
  if (typeof number === "number") { return number + amount }
  return { ...number, [key]: passRemainder(number[key], amount, key) }
}

const willSplit = (number: SnailfishNumber): boolean =>
  typeof number === "number"
    ? number >= 10
    : (willSplit(number.left) || willSplit(number.right))

const split = (number: SnailfishNumber): SnailfishNumber => {
  if (typeof number === "number") {
    return number >= 10 ? { left: Math.floor(number / 2), right: Math.ceil(number / 2) } : number
  }

  if (willSplit(number.left)) { return { left: split(number.left), right: number.right } }
  return { left: number.left, right: split(number.right) }
}

const reduce = (number: SnailfishNumber): SnailfishNumber => {
  let reduced = number

  while (willExplode(reduced) || willSplit(reduced)) {
    if (willExplode(reduced)) { reduced = explode(reduced)[0] }
    else { reduced = split(reduced) }
  }

  return reduced
}

const add = (number1: SnailfishNumber, number2: SnailfishNumber): SnailfishNumber =>
  reduce({ left: number1, right: number2 })

const magnitude = (number: SnailfishNumber): number => {
  if (typeof number === "number") { return number }
  return 3 * magnitude(number.left) + 2 * magnitude(number.right)
}

const print = (number: SnailfishNumber): string => typeof number === "number"
  ? number.toString()
  : `[${print(number.left)},${print(number.right)}]`

partOne()
partTwo()
