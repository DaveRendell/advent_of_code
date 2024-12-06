import HashSet from "../../utils/hashset"
import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const input = readCharArray(__dirname, inputFile())

const grid = new VectorMap<string>(input.flatMap((row, y) =>
  row.map((value, x) => [new Vector2(x, y), value] as [Vector2, string])))

const initialRow = input.findIndex(row => row.includes("^"))
const initialPosition = new Vector2(
  input[initialRow].findIndex(x => x === "^"), initialRow)
let guardPosition = initialPosition
let guardDirection = Vector2.UP

const visitedLocations = new VectorSet()

while (guardPosition.inGrid(input[0].length, input.length)) {
  visitedLocations.add(guardPosition)
  if (grid.get(guardPosition.add(guardDirection)) === "#") {
    guardDirection = guardDirection.rotateRight()
  } else {
    guardPosition = guardPosition.add(guardDirection)
  }
}

console.log("(P1): ", visitedLocations.size)

const loopLocations = new VectorSet(visitedLocations.entries()
  .filter((location, i, a) => {
    console.log(`${i} / ${a.length}`)
    const obstructedGrid = new VectorMap(grid.entries())
    obstructedGrid.set(location, "#")

    let guardPosition = initialPosition
    let guardDirection = Vector2.UP

    const loopCheck = new Set<string>()
    let isLoop = false

    testLoop:
    while (guardPosition.inGrid(input[0].length, input.length)) {
      if (loopCheck.has(guardPosition.toString() + guardDirection.toString())) {
        isLoop = true
        break testLoop
      }
      loopCheck.add(guardPosition.toString() + guardDirection.toString())
      if (obstructedGrid.get(guardPosition.add(guardDirection)) === "#") {
        guardDirection = guardDirection.rotateRight()
      } else {
        guardPosition = guardPosition.add(guardDirection)
      }
    }

    return isLoop
  }))

console.log("(P2): ", loopLocations.size) // 1354 too high