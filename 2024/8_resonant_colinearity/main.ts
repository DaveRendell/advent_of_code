import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorSet } from "../../utils/vector2"

const input = readCharArray(__dirname, inputFile())

const antennae: Record<string, Vector2[]> = {}

input.forEach((row, y) =>
  row.forEach((char, x) => {
    if (char !== ".") {
      antennae[char]
        ? antennae[char].push(new Vector2(x, y))
        : antennae[char] = [new Vector2(x, y)]
    }}))

const antinodesP1 = new VectorSet()
const antinodesP2 = new VectorSet()

Object.values(antennae).forEach(antennaSet =>
  antennaSet.forEach((antenna1, i1) =>
    antennaSet.slice(i1 + 1).forEach(antenna2 => {
      const diff = antenna1.subtract(antenna2); // a1 - a2
      [antenna1.add(diff), antenna2.subtract(diff)]
        .filter(antinode => antinode.inGrid(input[0].length, input.length))
        .forEach(antinode => antinodesP1.add(antinode))

      let cursor = antenna1.copy()
      while (cursor.inGrid(input[0].length, input.length)) {
        antinodesP2.add(cursor)
        cursor = cursor.add(diff)
      }
      cursor = antenna2.copy()
      while (cursor.inGrid(input[0].length, input.length)) {
        antinodesP2.add(cursor)
        cursor = cursor.subtract(diff)
      }
    })
  )
)

console.log("(P1): ", antinodesP1.size)
console.log("(P2): ", antinodesP2.size)