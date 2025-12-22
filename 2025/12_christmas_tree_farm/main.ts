import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"
import Vector2, { VectorSet } from "../../utils/vector2"

const paragraphs = readParagraphs(__dirname, inputFile())
const shapes: Vector2[][] = paragraphs.slice(0, -1).map(lines => 
    lines.slice(1)
        .flatMap((line, y) =>
            line.split("").map((c, x) => new Vector2(x, y)))
        .filter(v => lines[v.y + 1][v.x] === "#")
)

interface Area { width: number, height: number, shapeCounts: number[] }

const areas: Area[] = paragraphs.at(-1).map(line => {
    const [sizeString, ...countStrings] = line.split(" ")
    const [width, height] = sizeString.slice(0, -1).split("x").map(Number)
    const shapeCounts = countStrings.map(Number)
    return { width, height, shapeCounts }
})

const definitlyCan = ({ width, height, shapeCounts }: Area): boolean => {
    const threeByThreeBlocks = Math.floor(width / 3) * Math.floor(height / 3)
    return threeByThreeBlocks >= shapeCounts.reduce(sum)
}

const definitelyCant = ({ width, height, shapeCounts }: Area): boolean => {
    const area = width * height
    const shapeArea = shapeCounts.map((count, i) => count * shapes[i].length).reduce(sum)
    return shapeArea > area
}

const lowerBound = areas.filter(definitlyCan).length
const upperBound = areas.length - areas.filter(definitelyCant).length

if (lowerBound != upperBound) { throw new Error("Oh no, have to do something tricky :sob:")}

console.log("(P1): ", lowerBound)

console.log("(P2): ", "Merry Christmas!")