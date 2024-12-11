import inputFile from "../../utils/inputFile"
import Vector2, { VectorMap } from "../../utils/vector2"
import readCharArray from "../../utils/readCharArray"

const input = readCharArray(__dirname, inputFile())

function p1(): number {
  const grid = VectorMap.fromGrid(input)

  let position = new Vector2((input[0].length - 1) / 2, (input.length - 1) / 2)
  let direction = Vector2.UP
  let infectCount = 0
  
  for (let i = 0; i < 10000; i++) {
    if (grid.get(position) === "#") {
      direction = direction.rotateRight()
      grid.set(position, ".")
    }
    else {
      direction = direction.rotateLeft()
      grid.set(position, "#")
      infectCount++
    }
  
    position = position.add(direction)
  }

  return infectCount
}

function p2(): number {
  const grid = VectorMap.fromGrid(input)

  let position = new Vector2((input[0].length - 1) / 2, (input.length - 1) / 2)
  let direction = Vector2.UP
  let infectCount = 0
  
  for (let i = 0; i < 10000000; i++) {
    const current = grid.get(position)
    if (current === "#") {
      direction = direction.rotateRight()
      grid.set(position, "F")
    } else if (current === "F") {
      direction = direction.reverse()
      grid.set(position, ".")
    } else if (current === "W") {
      grid.set(position, "#")
      infectCount++
    }
    else {
      direction = direction.rotateLeft()
      grid.set(position, "W")
    }
  
    position = position.add(direction)
  }

  return infectCount
}


console.log("(P1): ", p1())

console.log("(P2): ", p2())