import readLines from "../utils/readLines"
import { sum } from "../utils/reducers"


const INPUT_NAME = "input.txt"

function partOne() {
  const score = readLines(__dirname, INPUT_NAME)
    .map(scoreForLine_p1)
    .reduce(sum)

  console.log("(P1) Score: " + score)
}

function partTwo() {
  const score = readLines(__dirname, INPUT_NAME)
    .map(scoreForLine_p2)
    .reduce(sum)

  console.log("(P2) Score: " + score)
}

type ABC = "A" | "B" | "C"
type XYZ = "X" | "Y" | "Z"

const CHOICE_SCORE = {
  "X": 1,
  "Y": 2,
  "Z": 3,
}

const OUTCOME_SCORE = {
  "A": { "X": 3, "Y": 6, "Z": 0},
  "B": { "X": 0, "Y": 3, "Z": 6},
  "C": { "X": 6, "Y": 0, "Z": 3},
}

function scoreForLine_p1(line: string): number {
  if (!line) { return 0 }
  const opponentPlay = line[0] as ABC
  const yourPlay = line[2] as XYZ

  return CHOICE_SCORE[yourPlay] + OUTCOME_SCORE[opponentPlay][yourPlay]
}

const YOUR_PLAY = {
  "A": { "X": "Z", "Y": "X", "Z": "Y"},
  "B": { "X": "X", "Y": "Y", "Z": "Z"},
  "C": { "X": "Y", "Y": "Z", "Z": "X"},
}

function scoreForLine_p2(line: string): number {
  if (!line) { return 0 }
  const opponentPlay = line[0] as ABC
  const outcome = line[2] as XYZ
  const yourPlay = YOUR_PLAY[opponentPlay][outcome] as XYZ

  return CHOICE_SCORE[yourPlay] + OUTCOME_SCORE[opponentPlay][yourPlay]
}

partOne()
partTwo()
