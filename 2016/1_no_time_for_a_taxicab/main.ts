import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import Vector2 from "../../utils/vector2"
import Cycle from "../../utils/cycle"

const input = readLines(__dirname, inputFile())[0].split(", ")

let position = Vector2.ORIGIN
let direction = Cycle.fromValues(
  [Vector2.UP, Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT])
const visited: Set<string> = new Set()
let firstDouble: Vector2

for (const instruction of input) {
  if (instruction.startsWith("R")) { direction = direction.next }
  else { direction = direction.previous }
  const steps = parseInt(instruction.slice(1))
  for (let i = 0; i < steps; i++) {
    position = position.add(direction.value)
    if (visited.has(position.toString()) && firstDouble === undefined) {
      firstDouble = position
    }
    visited.add(position.toString())
  }
}

console.log("(P1): " + position.taxiMagnitude())
console.log("(P2): " + firstDouble.taxiMagnitude())