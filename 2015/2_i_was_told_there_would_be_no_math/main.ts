import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { min, sum } from "../../utils/reducers"

const presents = readLines(__dirname, inputFile())
  .map(line => line.split("x").map(v => parseInt(v)))

const requiredPaper = presents.map(([w, h, d]) => {
  const sides = [w * h, w * d, h * d]
  return 2 * sides.reduce(sum) + sides.reduce(min)
}).reduce(sum)

console.log("(P1): " + requiredPaper)

const requiredRibbon = presents.map(([w, h, d]) => {
  const perimeters = [w + h, w + d, h + d]
  return 2 * perimeters.reduce(min) + w * h * d
}).reduce(sum)

console.log("(P2): " + requiredRibbon)