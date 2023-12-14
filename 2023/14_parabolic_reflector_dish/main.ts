import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const transpose = (map: string[]): string[] =>
  Array.from({ length: map[0].length })
    .map((_, i) => map.map(x => x[i]).join(""))

const countChar = (line: string, char: string): number =>
  line.split("").filter(c => c === char).length

const rollH = (map: string[], direction: "E" | "W"): string[] =>
  map.map(row => row.split("#").map(section => {
    const rocks = countChar(section, "O")
    const dots = section.length - rocks
    return direction == "W"
      ? "O".repeat(rocks) + ".".repeat(dots)
      : ".".repeat(dots) + "O".repeat(rocks)
  }).join("#"))


const rollNorth = (map: string[]): string[] =>
  transpose(rollH(transpose(map), "W"))

const rollWest = (map: string[]): string[] =>
  rollH(map, "W")

const rollSouth = (map: string[]): string[] =>
  transpose(rollH(transpose(map), "E"))

const rollEast = (map: string[]): string[] =>
  rollH(map, "E")

console.log("(P1): " + rollNorth(input)
  .map(row => countChar(row, "O"))
  .map((rocks, i) => rocks * (input.length - i))
  .reduce(sum))

const cycle = (map: string[]): string[] =>
  rollEast(rollSouth(rollWest(rollNorth(map))))

let map = input
let memory: Map<string, number> = new Map()

let cyclesToRun = 1000000000

while (cyclesToRun-- > 0) {
  map = cycle(map)
  if (memory.has(map.join("\n"))) {
    let cycleStart = memory.get(map.join("\n"))
    let cycleLength = cycleStart - cyclesToRun
    cyclesToRun %= cycleLength
  }
  memory.set(map.join("\n"), cyclesToRun)
}

console.log("(P2): " + map
  .map(row => countChar(row, "O"))
  .map((rocks, i) => rocks * (input.length - i))
  .reduce(sum))