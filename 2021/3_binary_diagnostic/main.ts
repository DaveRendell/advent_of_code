import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

const INPUT_NAME = "input.txt"

function partOne() {
  const lines = readLines(__dirname, INPUT_NAME)
  const columnCount = lines[0].length
  const columns = [...Array(columnCount).keys()]
    .map(i => lines.map(line => parseInt(line[i])))
    .map(column => column.reduce(sum))
    .map(columnTotal => columnTotal > lines.length / 2)
  
  const gammaRate = parseInt(columns.map(column => column ? "1" : "0").join(""), 2)
  const epsilonRate = parseInt(columns.map(column => column ? "0" : "1").join(""), 2)

  const answer = gammaRate * epsilonRate
  console.log("(P1) power consumption: " + answer)
}

function partTwo() {
  const lines = readLines(__dirname, INPUT_NAME)
  const columnCount = lines[0].length

  const keys = [...Array(columnCount).keys()]

  const oxygenRating = keys.reduce((remainingLines: string[], index: number) => {
    const mostCommonBit = remainingLines
      .map(line => parseInt(line[index]))
      .reduce(sum) >= remainingLines.length / 2 ? "1" : "0"
    return remainingLines.filter(line => line[index] === mostCommonBit)
  }, lines)[0]

  const carbonRating = keys.reduce((remainingLines: string[], index: number) => {
    if (remainingLines.length === 1) { return remainingLines }
    const mostCommonBit = remainingLines
      .map(line => parseInt(line[index]))
      .reduce(sum) >= remainingLines.length / 2 ? "1" : "0"
    return remainingLines.filter(line => line[index] !== mostCommonBit)
  }, lines)[0]

  const answer = parseInt(oxygenRating, 2) * parseInt(carbonRating, 2)
  console.log("(P2) Life support rating: " + answer)
}

partOne()
partTwo()
