import inputFile from "../../utils/inputFile"
import readLines from "../../utils/readLines"
import { sum } from "../../utils/reducers"

let input = readLines(__dirname, inputFile())
  .map(row => row
    .replaceAll("+", "#").replaceAll("-", "#") // Getting rid of these makes parsing numbers easier
    )
  .map(row => "." + row + ".") // Adding border to make life easier... 
  .map(row => row.split(""))
input = [
  new Array<string>(input[0].length).fill("."), 
  ...input,
  new Array(input[0].length).fill(".")
] // Top and bottom border too...


interface Symbol { symbol: string, x: number, y: number }
interface PartNumber { number: number, symbols: Symbol[] }

const numbers: PartNumber[] = []

input.forEach((row, i) =>
  row.forEach((_, j) => {
    // If previous was a digit, ignore as already counted
    if (!isNaN(parseInt(row[j - 1]))) { return }
    const number = parseInt(row.slice(j).join(""))

    if (isNaN(number)) { return }

    const numberLength = number.toString().length

    let symbols: Symbol[] = []
    for (let x = j - 1; x < j + numberLength + 1; x++) {
      for (let y = i - 1; y < i + 2; y++) {
        if (!("1234567890.".includes(input[y][x]))) {
          symbols.push({ x, y, symbol: input[y][x] })
        }
      }
    }
    numbers.push({ number, symbols })
  }))

const partNumberSum = numbers
  .filter(({ symbols }) => symbols.length > 0)
  .map(({ number }) => number)
  .reduce(sum)
console.log("(P1): " + partNumberSum)

const gears: PartNumber[][] = []

for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] === "*") {
      const adjacentNumbers = numbers
        .filter(({symbols}) => symbols.some(({x, y}) => x === j && y === i))
      if (adjacentNumbers.length === 2) {
        gears.push(adjacentNumbers)
      }
    }
  }
}

const gearRatioSum = gears
  .map(([n1, n2]) => n1.number * n2.number)
  .reduce(sum)

console.log("(P2): " + gearRatioSum)