import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorSet } from "../../utils/vector2"

const garden = readCharArray(__dirname, inputFile())
const width = garden[0].length
const height = garden.length
const sY = garden.findIndex(row => row.includes("S"))
const sX = garden[sY].findIndex(c => c === "S")
const start = new Vector2(sX, sY)

const getLocationsDistanceFrom = (startPosition: Vector2, steps: number): VectorSet => {
    let locations = new VectorSet([startPosition])

    for (let step = 0; step < steps; step++) {
        locations = new VectorSet(locations.entries()
            .flatMap(position => position
                .neighbours4()
                .filter(next => next.inGrid(width, height))
                .filter(({x, y}) => garden[y][x] !== "#")))
    }

    return locations
}

const innerOddCells = getLocationsDistanceFrom(start, 65).size
const allOddCells = getLocationsDistanceFrom(start, 165).size // overshoots but stays odd
const outerOddCells = allOddCells - innerOddCells

const innerEvenCells = getLocationsDistanceFrom(start, 64).size
const allEvenCells = getLocationsDistanceFrom(start, 164).size // overshoots but stays even
const outerEvenCells = allEvenCells - innerEvenCells

const steps = 26501365
const n = (steps - start.x) / width // Note, following only works for even n

const outers = n * (n + 1)
const innerOdds = (n + 1) * (n + 1)
const innerEvens = n * n

console.log("(P1): ", innerEvenCells)
console.log("(P2): ", outers * (outerEvenCells + outerOddCells) + innerOdds * innerOddCells + innerEvens * innerEvenCells)
