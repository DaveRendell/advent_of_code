import readParagraphs from "../../utils/readParagraphs"
import { range } from "../../utils/numbers"
import { max, min, sum } from "../../utils/reducers"
import { ascending, descending } from "../../utils/sorters"

const INPUT_NAME = "input.txt"
const BOARD_SIZE = 5

function partOne() {
  const [drawnNumbers, boards] = parse()
  
  const [winningTurn, winningBoard] = boards
    .map<[number, number[][]]>(board =>
      [getTurnComplete(board, drawnNumbers), board])
    .sort(([turn1], [turn2]) => ascending(turn1, turn2))[0]
 
  console.log("(P1) Winning score: " + scoreBoard(winningBoard, winningTurn, drawnNumbers))
}

function partTwo() {
  const [drawnNumbers, boards] = parse()
  
  const [winningTurn, winningBoard] = boards
    .map<[number, number[][]]>(board =>
      [getTurnComplete(board, drawnNumbers), board])
    .sort(([turn1], [turn2]) => descending(turn1, turn2))[0]
 
  console.log("(P2) Winning score: " + scoreBoard(winningBoard, winningTurn, drawnNumbers))
}

function parse(): [number[], number[][][]] {
  const paragraphs = readParagraphs(__dirname, INPUT_NAME)
  const drawnNumbers = paragraphs[0][0].split(",").map(value => parseInt(value))
  const boards = paragraphs.slice(1)
    .map(paragraph => 
      paragraph
      .map(line => 
        line.trim()
          .replaceAll("  ", " ")
          .split(" ")
          .map(entry => parseInt(entry))))
  
  return [drawnNumbers, boards]
}

const getLines = (board: number[][]): number[][] =>
  [
    ...board, //rows
    ...range(BOARD_SIZE).map(index => board.map(row => row[index])), //cols
  ]

const getTurnComplete = (board: number[][], drawnNumbers: number[]): number =>
  getLines(board)
    .map(line => 
      line
        .map(entry => drawnNumbers.indexOf(entry))
        .reduce(max))
    .reduce(min)

function scoreBoard(board: number[][], winningTurn: number, drawnNumbers: number[]): number {
  const finalNumber = drawnNumbers[winningTurn]
  const calledNumbers = drawnNumbers.slice(0, winningTurn + 1)
  const sumOfUnmarked = board
    .map(row =>
      row
        .filter(entry => !calledNumbers.includes(entry))
        .reduce(sum, 0))
    .reduce(sum, 0)
  return finalNumber * sumOfUnmarked
}

partOne()
partTwo()