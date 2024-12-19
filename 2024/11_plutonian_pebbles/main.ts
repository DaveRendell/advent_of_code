import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import memoise from "../../utils/memoise"

const input = readLines(__dirname, inputFile())[0]
  .split(" ").map(Number)

const blink = (pebble: number): number[] => {
  if (pebble === 0) { return [1] }
  const pebbleString = String(pebble)
  if ((pebbleString.length % 2) === 0) {
    return [
      pebbleString.slice(0, pebbleString.length / 2),
      pebbleString.slice(pebbleString.length / 2)
    ].map(x => Number(x))
  }
  return [pebble * 2024]
}

const pebblesAfterBlinks = memoise(
  (pebble: number, blinks: number): number =>
    blinks === 0 ? 1 : blink(pebble).map(newPebble =>
      pebblesAfterBlinks(newPebble, blinks - 1)).reduce(sum),
  new Map<string, number>())

console.log("(P1): ", input.map(pebble => pebblesAfterBlinks(pebble, 25)).reduce(sum))
console.log("(P2): ", input.map(pebble => pebblesAfterBlinks(pebble, 75)).reduce(sum))
