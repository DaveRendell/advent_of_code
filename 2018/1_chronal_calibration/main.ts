import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const values: number[] = readLines(__dirname, inputFile()).map(Number)

console.log("(P1): ", values.reduce(sum))

const frequencies = new Set<number>()
let cursor = 0
let frequency = 0
while (!frequencies.has(frequency)) {
  frequencies.add(frequency)
  frequency += values[cursor]
  cursor = (cursor + 1) % values.length
}

console.log("(P2): ", frequency)