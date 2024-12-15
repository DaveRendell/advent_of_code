import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const input = readParagraphs(__dirname, inputFile())

const warehouse1 = VectorMap.fromGrid(input[0].map(line => line.split("")))
const directions = input[1].flatMap(line =>
  line.split("").map(c => {
    switch (c) {
      case "^": return Vector2.UP
      case ">": return Vector2.RIGHT
      case "<": return Vector2.LEFT
      case "v": return Vector2.DOWN
    }
  })
)

let robotPosition = warehouse1.keys()
  .find(position => warehouse1.get(position) === "@")

directions.forEach(direction => {
  let boxCount = 0
  while (
    warehouse1.get(
      robotPosition.add(direction.scale(boxCount + 1))
    ) === "O"
  ) { boxCount++ }

  if (warehouse1.get(
    robotPosition.add(direction.scale(boxCount + 1))
  ) !== "#") {
    warehouse1.set(
      robotPosition.add(direction.scale(boxCount + 1)), "O"
    ) // overriden by below if boxCount == 0
    warehouse1.set(
      robotPosition.add(direction), "@"
    )
    warehouse1.set(robotPosition, ".")
    robotPosition = robotPosition.add(direction)
  }
})

// warehouse.draw().forEach(l => console.log(l))

const gpsSum1 = warehouse1.entries()
  .filter(([_, value]) => value === "O")
  .map(([{ x, y }]) => 100 * y + x)
  .reduce(sum)

console.log("(P1): ", gpsSum1)

const warehouse2 = VectorMap.fromGrid(input[0].map(line =>
  line.replaceAll("#", "##")
      .replaceAll("O", "[]")
      .replaceAll(".", "..")
      .replaceAll("@", "@.").split("")))

robotPosition = warehouse2.keys()
  .find(position => warehouse2.get(position) === "@")

directions.forEach((direction, i) => {
  if (direction.y === 0) { // Similar logic as p1
    let boxCount = 0
    while (
      "[]".includes(warehouse2.get(
        robotPosition.add(direction.scale(boxCount + 1))
      ))
    ) { boxCount++ }
  
    if (warehouse2.get(
      robotPosition.add(direction.scale(boxCount + 1))
    ) !== "#") {
      for (let i = boxCount; i > 0; i--) {
        const boxPosition = robotPosition.add(direction.scale(i))
        warehouse2.set(boxPosition.add(direction), warehouse2.get(boxPosition))
      }
      warehouse2.set(
        robotPosition.add(direction), "@"
      )
      warehouse2.set(robotPosition, ".")
      robotPosition = robotPosition.add(direction)
    } 
  } else { // scary new logic
    const positionsToMove: Vector2[] = [robotPosition] //order matters! Move in reverse order
    let frontEdge = new VectorSet([robotPosition])
    while (frontEdge.entries().some(position =>
      "[]".includes(warehouse2.get(position.add(direction)))
    )) {
      const newFrontEdge = new VectorSet
      frontEdge.entries()
        .filter(position => warehouse2.get(position.add(direction)) === "[")
        .forEach(position => {
          newFrontEdge.add(position.add(direction))
          newFrontEdge.add(position.add(direction).add(Vector2.RIGHT))
        })
      frontEdge.entries()
        .filter(position => warehouse2.get(position.add(direction)) === "]")
        .forEach(position => {
          newFrontEdge.add(position.add(direction))
          newFrontEdge.add(position.add(direction).add(Vector2.LEFT))
        })
      newFrontEdge.entries().forEach(position => positionsToMove.push(position))
      frontEdge = newFrontEdge
    }

    if (positionsToMove.every(position =>
      warehouse2.get(position.add(direction)) !== "#"
    )) {
      positionsToMove.reverse().forEach(position => {
        warehouse2.set(position.add(direction), warehouse2.get(position))
        warehouse2.set(position, ".")
      })
      warehouse2.set(robotPosition, ".")
      robotPosition = robotPosition.add(direction)
    }
  }
})

const gpsSum2 = warehouse2.entries()
  .filter(([_, value]) => value === "[")
  .map(([{ x, y }]) => 100 * y + x)
  .reduce(sum)

console.log("(P2): ", gpsSum2)
