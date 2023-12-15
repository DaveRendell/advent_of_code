import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const periods: number[] = []
readLines(__dirname, inputFile())
  .forEach(line => {
    const depth = parseInt(line.split(": ")[0])
    const range = parseInt(line.split(": ")[1])
    periods[depth] = range + (range - 2)
  })

const severity = periods
  .map((period, depth) => 
    depth % period == 0
      ? ((period + 2) / 2) * depth
      : 0)
  .reduce(sum)

console.log("(P1): " + severity)

let delay = 0
searchLoop:
while(true) {
  if (!periods.some((period, depth) => ((depth + delay) % period) == 0)) {
    break searchLoop
  }
  delay++
}

console.log("(P2): " + delay)