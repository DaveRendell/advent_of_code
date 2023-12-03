import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import { sum } from "../../utils/reducers"

const input = readCharArray(__dirname, inputFile())

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
    for (let x = Math.max(j - 1, 0); x < Math.min(j + numberLength + 1, row.length); x++) {
      for (let y = Math.max(i - 1, 0); y < Math.min(i + 2, input.length); y++) {
        if (!("1234567890.".includes(input[y][x]))) {
          symbols.push({ x, y, symbol: input[y][x] })
        }
      }
    }
    numbers.push({ number, symbols })
  }))

console.log(numbers
  .filter(({ symbols }) => symbols.length > 0)
  .filter(({number}) => number === 603).map(n => JSON.stringify(n)))

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