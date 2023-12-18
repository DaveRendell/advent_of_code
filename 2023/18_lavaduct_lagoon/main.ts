import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import Vector2, {  } from "../../utils/vector2"

interface Instruction { direction: Vector2, length: number }

const instructionsP1: Instruction[] = readLines(__dirname, inputFile())
  .map(line => {
    const [directionString, lengthString] = line.split(" ")
    const direction = {
      "R": Vector2.RIGHT, "L": Vector2.LEFT,
      "U": Vector2.UP, "D": Vector2.DOWN
    }[directionString]
    const length = parseInt(lengthString)
    return { direction, length}
  })

const instructionsP2: Instruction[]  = readLines(__dirname, inputFile())
  .map(line => {
    const instructionString = line.split("#")[1].slice(0, -1)
    const instructionHex = parseInt("0x" + instructionString)
    const direction = [
      Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT, Vector2.UP
    ][instructionHex & 0xF]
    const length = instructionHex >> 4
    return { direction, length }
  })

function getLavaSize(instructions: Instruction[]) {
  let shoeLaceArea = 0
  let boundaryArea = 0
  let position = Vector2.ORIGIN

  instructions.forEach(({ direction, length }) => {
    const next = position.add(direction.scale(length))
    shoeLaceArea += (position.x * next.y - position.y * next.x) / 2
    boundaryArea += length / 2
    position = next
  })
  return shoeLaceArea + boundaryArea + 1
}

console.log("(P1): " + getLavaSize(instructionsP1))
console.log("(P2): " + getLavaSize(instructionsP2))
