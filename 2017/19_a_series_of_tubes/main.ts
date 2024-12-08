import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorMap } from "../../utils/vector2"

const grid = readCharArray(__dirname, inputFile())
const input = VectorMap.fromGrid(grid)

let position = new Vector2(grid[0].findIndex(c => c === "|"), 0)
let direction = Vector2.DOWN
let letters: string[] = []
let stepCount = 1

while (input.get(position.add(direction)) !== " " && position.add(direction).inGrid(grid[0].length, grid.length)) {
  position = position.add(direction)
  const char = input.get(position)
  if (char === "+") {
    const testChar = input.get(position.add(direction.rotateRight()))
    if (testChar && testChar !== " ") {
      direction = direction.rotateRight()
    } else {
      direction = direction.rotateLeft()
    }
  } else if (char !== "|" && char !== "-") {
    letters.push(char)
  }
  stepCount++
}


console.log("(P1): ", letters.join(""))

console.log("(P2): ", stepCount)