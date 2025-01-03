import Counter from "../../utils/counter"
import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { max, min, sum } from "../../utils/reducers"
import sampleSpecificValue from "../../utils/sampleSpecificValue"
import Vector2, { VectorSet } from "../../utils/vector2"

const input = readNumbersFromLines(__dirname, inputFile())
  .map(([x, y]) => new Vector2(x, y))

const maxX = input.map(({ x }) => x).reduce(max)
const maxY = input.map(({ y }) => y).reduce(max)

const closestPoint = (point: Vector2): number => {
  const closestDistance = input
    .map(v => v.subtract(point).taxiMagnitude())
    .reduce(min)
  const closestPoints = input
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v.subtract(point).taxiMagnitude() === closestDistance)
    .map(({ i }) => i)

  if (closestPoints.length > 1) { return undefined }
  return closestPoints[0]
}
  

const areaSizes = new Counter<number>()
for (let x = 0; x <= maxX; x++) {
  for (let y = 0; y <= maxY; y++) {
    const closest = closestPoint(new Vector2(x, y))
    if (closest !== undefined) { areaSizes.increment(closest) }
  }
}

const borderAreas = new Set<number>()
for (let x = 0; x <= maxX; x++) {
  const topEdge = closestPoint(new Vector2(x, 0))
  const bottomEdge = closestPoint(new Vector2(x, maxY))
  if (topEdge !== undefined) { borderAreas.add(topEdge) }
  if (bottomEdge !== undefined) { borderAreas.add(bottomEdge) }
}
for (let y = 0; y <= maxY; y++) {
  const leftEdge = closestPoint(new Vector2(0, y))
  const rightEdge = closestPoint(new Vector2(maxX, y))
  if (leftEdge !== undefined) { borderAreas.add(leftEdge) }
  if (rightEdge !== undefined) { borderAreas.add(rightEdge) }
}

const finiteAreas = areaSizes.keys().filter(key => !borderAreas.has(key))
const largestFiniteArea = finiteAreas.map(area => areaSizes.get(area)).reduce(max)

console.log("(P1): ", largestFiniteArea)

const totalDistance = sampleSpecificValue(32, 10000)

let count = 0
for (let x = 0; x <= maxX; x++) {
  for (let y = 0; y <= maxY; y++) {
    const point = new Vector2(x, y)
    const distanceSum = input.map(v => point.subtract(v).taxiMagnitude()).reduce(sum)
    if (distanceSum < totalDistance) { count++ }
  }
}
console.log("(P2): ", count)