import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange, range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const directions = inclusiveRange(-1, 1)
  .flatMap(dx =>
    inclusiveRange(-1, 1).map(dy => [dx, dy]))
  .filter(([dx, dy]) => dx !== 0 || dy !== 0)

const letterAt = (x: number, y: number) =>
  input[y] && input[y][x]

const xmasCount = input.map((row, y) =>
  [...row].map((_, x) => 
    directions.filter(([dx, dy]) =>
      range(0, 4).every(i => letterAt(x + i * dx, y + i * dy) === "XMAS"[i])
    ).length
  ).reduce(sum)
).reduce(sum)

console.log("(P1): ", xmasCount)

const crossMasCount = input.map((row, y) =>
  [...row].filter((char, x) => 
    char === "A"
      && (
        (letterAt(x - 1, y - 1) === "M" && letterAt(x + 1, y + 1) === "S") // MAS
        || (letterAt(x - 1, y - 1) === "S" && letterAt(x + 1, y + 1) === "M") // SAM
      ) // Backslash
      && (
        (letterAt(x - 1, y + 1) === "M" && letterAt(x + 1, y - 1) === "S") // MAS
        || (letterAt(x - 1, y + 1) === "S" && letterAt(x + 1, y - 1) === "M") // SAM
      ) // Forwardslash
  ).length
).reduce(sum)

console.log("(P2): ", crossMasCount)
