import inputFile from "../../utils/inputFile"
import { Range } from "../../utils/range"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"

const [rangeInput, ingredientInputs] = readParagraphs(__dirname, inputFile())
let ranges: Range[] = rangeInput
    .map(line => line.split("-").map(Number))
    .map(([start, end]) => new Range(start, end + 1))
const ingredients = ingredientInputs.map(Number)

console.log("(P1): ", ingredients.filter(ingredient => ranges.some(range => range.contains(ingredient))).length)

const hasOverlap = (ranges: Range[]): boolean =>
    ranges.some((range, idx) => ranges.slice(idx + 1).some(other => range.overlaps(other)))

while (hasOverlap(ranges)) {
    const range = ranges.find((range, idx) => ranges.slice(idx + 1).some(other => range.overlaps(other)))
    const other = ranges.slice(ranges.indexOf(range) + 1).find(other => range.overlaps(other))

    console.log(`Merging ranges [${range.start}-${range.end - 1}] and [${other.start}-${other.end - 1}]`)

    ranges = [
        ...ranges.filter(r => r != range && r != other),
        ...range.merge(other)
    ]
}

console.log("(P2): ", ranges.map(range => range.length).reduce(sum))