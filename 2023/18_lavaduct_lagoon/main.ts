import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"
import HashMap from "../../utils/hashmap"
import { max, min } from "../../utils/reducers"
import Queue from "../../utils/queue"
import { ascending } from "../../utils/sorters"

interface Instruction { direction: Vector2, length: number }

interface Line { start: Vector2, end: Vector2 }

const instructionsP1: Instruction[] = readLines(__dirname, inputFile())
  .map(line => {
    const [directionString, lengthString] = line.split(" ")
    const direction = {
      "R": Vector2.RIGHT, "L": Vector2.LEFT,
      "U": Vector2.UP, "D": Vector2.DOWN
    }[directionString]
    const length = parseInt(lengthString)
    return { direction, length}
  })

const instructionsP2: Instruction[]  = readLines(__dirname, inputFile())
  .map(line => {
    const instructionString = line.split("#")[1].slice(0, -1)
    const instructionHex = parseInt("0x" + instructionString)
    const direction = [
      Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT, Vector2.UP
    ][instructionHex & 0xF]
    const length = instructionHex >> 4
    return { direction, length }
  })

function getBoundary(instructions: Instruction[]): VectorSet {
  const boundary = new VectorSet()
  let position = Vector2.ORIGIN

  instructions.forEach(({direction, length}) => {
    for (let i = 0; i < length; i++) {
      position = position.add(direction)
      boundary.add(position)
    }
  })

  console.log("Got boundary")
  return boundary
}

function getDimensions(boundary: VectorSet): number[] {
  const boundaryPoints = boundary.entries()
  const xPoints = boundaryPoints.map(({x}) => x)
  const yPoints = boundaryPoints.map(({y}) => y)
  return [
    xPoints.reduce(min),
    xPoints.reduce(max),
    yPoints.reduce(min),
    yPoints.reduce(max),
  ]
}


function drawMap(boundary: VectorSet) {
  const [minX, maxX, minY, maxY] = getDimensions(boundary)
  for (let y = minY; y <= maxY; y++) {
    let row = ""
    for (let x = minX; x <= maxX; x++) {
      const position = new Vector2(x, y)
      row += boundary.has(position) ? "#" : "."
    }
    console.log(row)
  }
}

function getLavaSize(boundary: VectorSet): number {
  const [minX, maxX, minY, maxY] = getDimensions(boundary)
  const start = new Vector2(minX - 1, minY - 1)
  const exterior = new VectorSet([start])
  const updates = new Queue<Vector2>()
  updates.add(start)

  while (updates.hasNext()) {
    const update = updates.receive()
    update
      .neighbours4(minX - 1, maxX + 1, minY - 1, maxY + 1)
      .filter(point => !boundary.has(point))
      .filter(point => !exterior.has(point))
      .forEach(point => {
        exterior.add(point)
        updates.add(point)
      })
  }

  const boxSize = ((maxX - minX) + 3) * ((maxY - minY) + 3)
  return boxSize - exterior.size
}


function getBoundaryPoints(instructions: Instruction[]): Vector2[] {
  let position = Vector2.ORIGIN
  const points: Vector2[] = []
  instructions.forEach(({ direction, length }) => {
    position = position.add(direction.scale(length))
    points.push(position)
  })
  return points
}

function getPolygonArea(points: Vector2[]): number {
  // let sum = 0
  // let clockwiseSum = 0
  // for (let i = 0; i < points.length; i++) {
  //   const p1 = points[i]
  //   const p2 = points[i == points.length - 1 ? 0 : i + 1]
  //   sum += p1.x * p2.y - p1.y * p2.x
  //   if (p1.y == p2.y) {
  //     clockwiseSum += (0.5 + p1.y) * (p1.x - p2.x)
  //   }
  // }
  // return sum / 2
  const xPoints = points.map(({x}) => x).sort(ascending)
  const yPoints = points.map(({y}) => y).sort(ascending)
  const yMin = yPoints.at(0) - 1
  const yMax = yPoints.at(-1) + 1

  let area = 0

  for (let xI = 0; xI < xPoints.length - 1; xI++) {
    const x1 = xPoints[xI]
    const x2 = xPoints[xI + 1]
    if (x1 == x2) { continue }
    const xLength = 1 + x2 - x1

    const crossingPoints: number[] = []
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      const p2 = points[i == points.length - 1 ? 0 : i + 1]
      if (p1.y == p2.y && (p1.x <= x1 && p2.x >= x2) || (p2.x <= x1 && p1.x >= x2)) { // This bit wrong?
        crossingPoints.push(p1.y)
      }
    }
    crossingPoints.sort(ascending)
    console.log(crossingPoints)
    let segmentArea = 0    
    let y = crossingPoints.at(0) - 1
    let inside = false
    for (let i = 0; i < crossingPoints.length; i++) {
      let nextY = crossingPoints[i]
      if (inside) { segmentArea += (1 + nextY - y) * xLength }
      y = nextY
      inside = !inside
    }
    console.log(segmentArea)
    area += segmentArea
  }
  return area
}

drawMap(getBoundary(instructionsP1))
console.log(getBoundaryPoints(instructionsP1))

console.log("(P1): " + getPolygonArea(getBoundaryPoints(instructionsP1)))

// console.log("(P2): " + getLavaSize(getBoundary(instructionsP2)))