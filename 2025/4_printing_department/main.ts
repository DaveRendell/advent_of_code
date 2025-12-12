import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorMap } from "../../utils/vector2"

const grid: VectorMap<string> = VectorMap.fromGrid(readCharArray(__dirname, inputFile()))

const getMovableRolls = (grid: VectorMap<string>): Vector2[] => grid.keys()
    .filter((coordinates) => grid.get(coordinates) === "@")
    .filter((coordinates) => {
        return coordinates.neighbours8()
            .filter(neighbour => grid.get(neighbour) === "@").length < 4
    })

console.log("(P1): ", getMovableRolls(grid).length)

const getAllMovableRollsCount = (grid: VectorMap<string>): number => {
    let movableRolls = getMovableRolls(grid)
    let removedRollCount = 0

    while (movableRolls.length > 0) {
        movableRolls.forEach(coordinate => grid.set(coordinate, "x"))
        removedRollCount += movableRolls.length
        movableRolls = getMovableRolls(grid)
    }

    return removedRollCount
}

console.log("(P2): ", getAllMovableRollsCount(grid))