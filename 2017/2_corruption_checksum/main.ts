import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, min, sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())
  .map(row => row.split("\t").map(x => parseInt(x)))

const rowDiff = (row: number[]) => row.reduce(max) - row.reduce(min)
const checksum = (sheet: number[][]) => sheet.map(rowDiff).reduce(sum)

console.log("(P1): " + checksum(input))

const getEvenDivide = (row: number[]) => row
  .flatMap(a => row.filter(b => a !== b).map(b => a / b))
  .find(d => Math.floor(d) === d)

const sumDivides = (sheet: number[][]) => sheet.map(getEvenDivide).reduce(sum)

console.log("(P2): " + sumDivides(input))
