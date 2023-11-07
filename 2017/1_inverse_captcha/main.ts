import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { positiveMod } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0].split("")

const p1Answer = input
  .map((x, i) =>
    x === input.at(positiveMod(i + 1, input.length))
      ? parseInt(x)
      : 0)
  .reduce(sum, 0)

console.log("(P1): " + p1Answer)

const p2Answer = input
  .map((x, i) =>
    x === input.at(positiveMod(i + Math.floor(input.length / 2), input.length))
      ? parseInt(x)
      : 0)
  .reduce(sum, 0)

console.log("(P2): " + p2Answer)