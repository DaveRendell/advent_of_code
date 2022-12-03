import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

const INPUT_NAME = "input.txt"

function partOne() {
  const lines = readLines(__dirname, INPUT_NAME)
    .map(line => parseInt(line))
  
  const answer = lines
    .filter((value, i, lines) => i > 0 && value > lines[i - 1])
    .length
  
  console.log("(P1) Number of increases: " + answer)
}

function partTwo() {
  const lines = readLines(__dirname, INPUT_NAME)
    .map(line => parseInt(line))
  
    const windows = lines
      .slice(2)
      .map((_value, i) => lines.slice(i, i + 3).reduce(sum))
      
    const answer = windows
      .filter((value, i, lines) => i > 0 && value > lines[i - 1])
      .length
    
    console.log("(P2) Number of increases: " + answer)
}

partOne()
partTwo()
