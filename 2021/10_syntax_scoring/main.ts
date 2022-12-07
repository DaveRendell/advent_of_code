import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import { ascending } from "../../utils/sorters"

const MATCHING_BRACKETS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
}

const CORRUPT_SCORES = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137
}

const INCOMPLETE_SCORES = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4
}

function partOne() {
  const input = readLines(__dirname, inputFile()).map(line => [...line])
  const answer = input
    .map(line => line.reduce(parseLine, []))
    .filter(parsedState => typeof parsedState === "number")
    .reduce(sum)
  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const input = readLines(__dirname, inputFile()).map(line => [...line])
  const scores = input
    .map(line => line.reduce(parseLine, []))
    .map(getIncompleteScore)
    .filter(score => score !== 0)
    .sort(ascending)
  
  const answer = scores[Math.floor(scores.length / 2)]
  
  console.log("(P2) Answer: " + answer)
}

type ScoringState = number | string[]

const parseLine = (state: ScoringState, char: string): ScoringState => {
  if (typeof state === "number") { return state }
  if ("([{<".includes(char)) { return [...state, char] }
  const popped = state[state.length - 1]
  if (MATCHING_BRACKETS[popped] === char) { return state.slice(0, state.length - 1) }
  return CORRUPT_SCORES[char]
}

const getIncompleteScore = (state: ScoringState): number => {
  if (typeof state === "number") { return 0 } // Ignore corrupted lines
  var completion = state.reverse().map(open => MATCHING_BRACKETS[open])
  return completion.reduce((score, char) => 5 * score + INCOMPLETE_SCORES[char], 0)
} 

partOne()
partTwo()
