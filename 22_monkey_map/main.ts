import inputFile from "../utils/inputFile"
import readParagraphs from "../utils/readParagraphs"
import { chunks, max } from "../utils/reducers"
import { positiveMod, range } from "../utils/numbers"
import Vector2 from "../utils/vector2"

interface Face {
  netPosition: Vector2
  grid: string[][]
}

interface Position {
  face: number
  faceCoordinates: Vector2
  directionId: number
}

interface Edge {
  faceId: number,
  rotation: number
}

type Edges = Edge[] // [east, south, west, north]

const directions = [Vector2.RIGHT, Vector2.DOWN, Vector2.LEFT, Vector2.UP]

const [mapLines, [instructionsString]] = readParagraphs(__dirname, inputFile())

const instructions = instructionsString
  .replaceAll("R", "$R$")
  .replaceAll("L", "$L$")
  .split("$")

const tileCount = mapLines
  .flatMap(x => x.split(""))
  .filter(x => x !== " ")
  .length

const faceLength = Math.sqrt(tileCount / 6)

const net = mapLines
  .map(line => line.padEnd(mapLines.map(l=> l.length).reduce(max)))
  .reduce(chunks(faceLength), [[]])
  .map(lines =>
    range(0, lines[0].length / faceLength)
      .map(i => lines.map(line => line.slice(i * faceLength, (i + 1) * faceLength).split(""))))

const faces: Face[] = net.map((row, rowId) => 
    row.map((grid, colId) =>
      ({ netPosition: new Vector2(colId, rowId), grid })))
  .flat()
  .filter(({ grid }) => grid[0][0] !== " ")

const positionOnEdge = (directionId: number, fromLeft: number): Vector2 => {
  if (directionId == 0) { return new Vector2(0, fromLeft) } // R
  if (directionId == 1) { return new Vector2(faceLength - fromLeft - 1, 0) } // D
  if (directionId == 2) { return new Vector2(faceLength - 1, faceLength - fromLeft - 1) } // L
  if (directionId == 3) { return new Vector2(fromLeft, faceLength - 1) } // U
}

const step = (edges: Edges[]) => ({ face, faceCoordinates, directionId }: Position): Position => {
  const newCoordinates = faceCoordinates.add(directions[directionId])
  const { x, y } = newCoordinates

  const crossEdge = (fromLeft: number): Position => {
    const edge = edges[face][directionId]
    const newDirection = positiveMod(directionId + edge.rotation, 4)
    return {
      face: edge.faceId,
      directionId: newDirection,
      faceCoordinates: positionOnEdge(newDirection, fromLeft)
    }
  }

  if (x >= faceLength) { return crossEdge(y) }
  if (x < 0) { return crossEdge(faceLength - y - 1) }
  if (y >= faceLength) { return crossEdge(faceLength - x - 1) }
  if (y < 0) { return crossEdge(x) }

  return {
    faceCoordinates: newCoordinates,
    face, directionId
  }
}

const turn = (position: Position, direction: 1 | -1): Position => ({
  ...position,
  directionId: positiveMod(position.directionId + direction, 4)
})

const start: Position = { faceCoordinates: Vector2.ORIGIN, face: 0, directionId: 0 }

const traverse = (transitions: Edges[]): Position => {
  let position = start
  for (const instruction of instructions) {
    if (instruction === "R") { position = turn(position, 1) }
    else if (instruction === "L") { position = turn(position, -1) }
    const steps = parseInt(instruction)
    stepLoop:
    for (let i = 0; i < steps; i++) {
      const next = step(transitions)(position)
      const { x, y } = next.faceCoordinates
      const nextTerrain = faces[next.face].grid[y][x]
      if (nextTerrain === "#") { break stepLoop }
      else { position = next }
    }
  }
  return position
}

const wrapAroundEdges: Edges[] =
  faces.map(({ netPosition}) => {
    const getNextFaceInDirection = (direction: Vector2): number => {
      let newFace = netPosition
      do { 
        newFace = newFace.add(direction)
        newFace.y = positiveMod(newFace.y, net.length)
        newFace.x = positiveMod(newFace.x, net[newFace.y].length)
      } while (net[newFace.y][newFace.x][0][0] === " ")
      return faces.findIndex(({netPosition}) => newFace.equals(netPosition))
    }
    return [
      { faceId: getNextFaceInDirection(Vector2.RIGHT), rotation: 0 },
      { faceId: getNextFaceInDirection(Vector2.DOWN), rotation: 0 },
      { faceId: getNextFaceInDirection(Vector2.LEFT), rotation: 0 },
      { faceId: getNextFaceInDirection(Vector2.UP), rotation: 0 },
    ]
  })

const getCubeEdge = (face: Face, directionId: number): Edge => {
  const candidate = face.netPosition.add(directions[directionId])
  const { x, y } = candidate

  if (net[y] && net[y][x] && net[y][x][0][0] !== " ") {
    const faceId = faces.findIndex(f => f.netPosition.equals(candidate))
    return { faceId, rotation: 0 }
  }

  const { faceId: nextFaceId, rotation } = getCubeEdge(face, (directionId + 1) % 4)
  const { faceId, rotation: additionalRotation } = getCubeEdge(faces[nextFaceId], positiveMod(directionId + rotation, 4))
  return { faceId, rotation: positiveMod(rotation + additionalRotation + 1, 4) }
}

const cubeEdges: Edges[] =
  range(0, 6).map(faceId =>
    range(0, 4).map(directionId =>
      getCubeEdge(faces[faceId], directionId)) as Edges)

const scoreForPosition = (position: Position): number => {
  const face = faces[position.face]
  const { x, y } = position.faceCoordinates
  const row = face.netPosition.y * faceLength + y + 1
  const col = face.netPosition.x * faceLength + x + 1
  return 1000 * row + 4 * col + position.directionId
}

console.log("(P1): " + scoreForPosition(traverse(wrapAroundEdges)))
console.log("(P2): " + scoreForPosition(traverse(cubeEdges)))
