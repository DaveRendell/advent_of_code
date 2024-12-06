import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const input = readCharArray(__dirname, inputFile())

const grid = new VectorMap<string>(input.flatMap((row, y) =>
  row.map((value, x) => [new Vector2(x, y), value] as [Vector2, string])))

const initialRow = input.findIndex(row => row.includes("^"))
let guardPosition = new Vector2(
  input[initialRow].findIndex(x => x === "^"), initialRow)
let guardDirection = Vector2.UP

const visitedLocations = new VectorSet()
const loopLocations = new VectorSet()

while (guardPosition.inGrid(input[0].length, input.length)) {
  visitedLocations.add(guardPosition)
  console.log(visitedLocations.size, "loops found:", loopLocations.size)
  if (grid.get(guardPosition.add(guardDirection)) === "#") {
    guardDirection = guardDirection.rotateRight()
  } else {
    // Try placing obstacle ahead
    const obstructedGrid = new VectorMap(grid.entries())
    obstructedGrid.set(guardPosition.add(guardDirection), "#")
    let projectedGuardPosition = guardPosition.add(Vector2.ORIGIN)
    let projectedGuardDirection = guardDirection.add(Vector2.ORIGIN)

    let loopCheck = new Set<string>()

    projectionLoop:
    while (projectedGuardPosition.inGrid(input[0].length, input.length)) {
      if (loopCheck.has(projectedGuardPosition.toString() + projectedGuardDirection.toString())) {
        loopLocations.add(guardPosition.add(guardDirection))
        break projectionLoop
      }

      loopCheck.add(projectedGuardPosition.toString() + projectedGuardDirection.toString())

      if (obstructedGrid.get(projectedGuardPosition.add(projectedGuardDirection)) === "#") {
        projectedGuardDirection = projectedGuardDirection.rotateRight()
      } else {
        projectedGuardPosition = projectedGuardPosition.add(projectedGuardDirection)
      }
    }


    guardPosition = guardPosition.add(guardDirection)
  }
}

console.log("(P1): ", visitedLocations.size) 

console.log("(P2): ", loopLocations.size) // 1354 too high

console.log(loopLocations.entries())