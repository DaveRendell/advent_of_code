import inputFile from "../../utils/inputFile"
import { findLowestCosts } from "../../utils/pathFinding"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import sampleSpecificValue from "../../utils/sampleSpecificValue"
import Vector2 from "../../utils/vector2"

const bytes = readNumbersFromLines(__dirname, inputFile())
  .map(([x, y]) => new Vector2(x, y))

const size = sampleSpecificValue(6, 70)
const p1ByteSize = sampleSpecificValue(12, 1024)

const costs = (time: number) => (_: Vector2, to: Vector2, fromCost: number): number => {
  if (!to.inBounds(0, size, 0, size)) { return Infinity }
  if (bytes.slice(0, time).some(byte => byte.equals(to))) { return Infinity }
  return fromCost + 1
}

const minimumStepsP1 = findLowestCosts(
  new Vector2(0, 0),
  costs(p1ByteSize),
).at(size, size)

console.log("(P1): ", minimumStepsP1)

let lowerBound = p1ByteSize
let upperBound = bytes.length

while (lowerBound + 1 < upperBound) {
  const testValue = Math.floor((lowerBound + upperBound) / 2)
  const minimumSteps = findLowestCosts(
    new Vector2(0, 0),
    costs(testValue),
  ).at(size, size)
  if (minimumSteps === Infinity) {
    upperBound = testValue
  } else {
    lowerBound = testValue
  }
}

const finalByte = bytes[lowerBound]

console.log("(P2): ", `${finalByte.x},${finalByte.y}`)