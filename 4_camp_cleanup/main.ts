import readLines from "../utils/readLines"

const INPUT_NAME = "input.txt"

const parse = (line: string): number[][] =>
  line.split(",")
    .map(range => 
      range
        .split("-")
        .map(value => parseInt(value)))

const rangesFullyOverlap = ([[l1, h1], [l2, h2]]: number[][]): boolean =>
  (l1 <= l2 && h1 >= h2) || (l2 <= l1 && h2 >= h1)

const rangesOverlap = ([[l1, h1], [l2, h2]]: number[][]): boolean =>
  !(l1 > h2 || l2 > h1)

function partOne() {
  const answer = readLines(__dirname, INPUT_NAME)
    .map(parse)
    .filter(rangesFullyOverlap)
    .length

  console.log("(P1) Number of fully overlapping assignments: " + answer)
}

function partTwo() {
  const answer = readLines(__dirname, INPUT_NAME)
    .map(parse)
    .filter(rangesOverlap)
    .length

  console.log("(P2) Number of overlapping assignments: " + answer)
}

partOne()
partTwo()
