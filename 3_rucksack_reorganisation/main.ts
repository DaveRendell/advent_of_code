import readLines from '../utils/readLines'
import { chunks, sum } from '../utils/reducers'

const INPUT_NAME = "input.txt"

const LOWERCASE_CODE_START = "a".charCodeAt(0) - 1
const UPPERCASE_CODE_START = "A".charCodeAt(0) - 1

const splitLine = (line: string) =>
  [line.slice(0, line.length / 2), line.slice(line.length / 2)]

const getCommonLetter = ([pack1, ...packs]: string[]) => 
  [...pack1].find(letter => packs.every(pack => pack.includes(letter))) || ""

const getCharCode = (letter: string) =>
  letter.charCodeAt(0)

const getPriority = (charCode: number) =>
  charCode > LOWERCASE_CODE_START 
    ? charCode - LOWERCASE_CODE_START
    : 26 + charCode - UPPERCASE_CODE_START

function partOne() {
  const answer = readLines(__dirname, INPUT_NAME)
    .filter(line => line)
    .map(splitLine)
    .map(getCommonLetter)
    .map(getCharCode)
    .map(getPriority)
    .reduce(sum)

  console.log("(P1) Total priority: " + answer)
}

function partTwo() {
  const answer = readLines(__dirname, INPUT_NAME)
    .filter(line => line)
    .reduce(chunks(3), [[]])
    .map(getCommonLetter)
    .map(getCharCode)
    .map(getPriority)
    .reduce(sum)
  
    console.log("(P2) Total priority: " + answer)
}

partOne()
partTwo()