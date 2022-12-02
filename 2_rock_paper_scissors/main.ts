import readLines from "../utils/readLines"
import { sum } from "../utils/reducers"


const INPUT_NAME = "input.txt"

const getScore = (p1: number, p2: number) => 3 * ((p1 - p2 + 4) % 3)
const getP1 = (p2: number, outcome: number) => (p2 + outcome + 5) % 3

function partOne() {
  const score = readLines(__dirname, INPUT_NAME)
    .filter(line => line)
    .map(line => [line.charCodeAt(2) - 88, line.charCodeAt(0) - 65])
    .map(([p1, p2]) => p1 + 1 + getScore(p1, p2))
    .reduce(sum)
  console.log("(P1) Score: " + score)
}

function partTwo() {
  const score = readLines(__dirname, INPUT_NAME)
    .filter(line => line)
    .map(line => [line.charCodeAt(0) - 65, line.charCodeAt(2) - 88])
    .map(([p2, outcome]) => [getP1(p2, outcome), p2])
    .map(([p1, p2]) => p1 + 1 + getScore(p1, p2))
    .reduce(sum)
  console.log("(P2) Score: " + score)
}

partOne()
partTwo()
