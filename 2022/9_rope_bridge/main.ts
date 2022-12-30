import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const DIRECTIONS = {
  "R": [1, 0],
  "L": [-1, 0],
  "D": [0, 1],
  "U": [0, -1]
}

function partOne() {
  console.log("(P1) Answer: " + measureSpotsTailVisits(2))
}

function partTwo() {
  console.log("(P2) Answer: " + measureSpotsTailVisits(10))
}

const parse = (): number[][] => readLines(__dirname, inputFile())
  .map(line => line.split(" "))
  .map(([direction, amount]) => [direction, parseInt(amount)] as [string, number])
  .flatMap(([direction, amount]) => Array(amount).fill(DIRECTIONS[direction]))

function measureSpotsTailVisits(snakeSize: number): number {
  const instructions = parse()
  const initialRope = Array(snakeSize).fill([0, 0])
  const tailLocations: number[][] = []

  const moveRopeHead = (rope: number[][], [dX, dY]: number[]): number[][] => {
    const newRope = rope.slice(1).reduce((newRope, knot) => 
      [...newRope, moveTowardsParent(knot, newRope.at(-1))],
      [[rope[0][0] + dX, rope[0][1] + dY]])
    if (!tailLocations.some(location => coordEqual(location, newRope.at(-1)))) {
      tailLocations.push(newRope.at(-1))
    }
    return newRope
  }

  const moveTowardsParent = ([knotX, knotY]: number[], [parentX, parentY]: number[]) =>
    Math.abs(parentX - knotX) > 1 || Math.abs(parentY - knotY) > 1
      ? [knotX + Math.sign(parentX - knotX), knotY + Math.sign(parentY - knotY)]
      : [knotX, knotY]
  
  instructions.reduce(moveRopeHead, initialRope)
  return tailLocations.length
}

const coordEqual = ([x1, y1]: number[], [x2, y2]: number[]): boolean =>
  x1 === x2 && y1 === y2

partOne()
partTwo()
