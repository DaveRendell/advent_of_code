import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import readParagraphs from "../utils/readParagraphs"
import { chunks, max } from "../utils/reducers"
import { positiveMod, range } from "../utils/numbers"

const [mapLines, [instructionsString]] = readParagraphs(__dirname, inputFile())

const instructions = instructionsString
  .replaceAll("R", "$R$")
  .replaceAll("L", "$L$")
  .split("$")

const tileCount = mapLines
  .map(x => x.split(""))
  .flat()
  .filter(x => x !== " ")
  .length
const faceLength = Math.sqrt(tileCount / 6)

const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]

const net = mapLines
  .map(line => line.padEnd(mapLines.map(l=> l.length).reduce(max)))
  .reduce(chunks(faceLength), [[]])
  .map(lines =>
    range(0, lines[0].length / faceLength)
      .map(i => lines.map(line => line.slice(i * faceLength, (i + 1) * faceLength).split(""))))
const netWidth = net[0].length
const netHeight = net.length


const vis = net.map(row => range(0, 4).map(k => row.map(grid => grid[k].join("")).join("  ")).join("\n")).join("\n\n")

interface Face {
  netPosition: number[]
  grid: string[][]
}

const faces: Face[] = net.map((row, rowId) => row
  .map((grid, colId) =>
    ({ netPosition: [rowId, colId], grid })))
  .flat()
  .filter(({ grid }) => grid[0][0] !== " ")

interface Transitions {
  east: [number, number]
  south: [number, number]
  west: [number, number]
  north: [number, number]
}

const wrapAroundTransitions: Transitions[] =
  faces.map(({ netPosition: [y, x]}) => {
    const getNextFaceInDirection = ([dx, dy]: number[]): number => {
      let newX = x
      let newY = y
      do {
        newY = positiveMod(newY + dy, net.length)
        newX = positiveMod(newX + dx, net[newY].length)
      } while (net[newY][newX][0][0] === " ")
      return faces.findIndex(({netPosition: [y2, x2]}) =>
        x2 === newX && y2 === newY)
    }

    return {
      east: [getNextFaceInDirection([1, 0]), 0],
      south: [getNextFaceInDirection([0, 1]), 0],
      west: [getNextFaceInDirection([-1, 0]), 0],
      north: [getNextFaceInDirection([0, -1]), 0],
    }
  })

interface Position {
  face: number
  x: number
  y: number
  direction: number
}

const step = (transitions: Transitions[]) => ({ face, x, y, direction }: Position): Position => {
  const [dx, dy] = directions[direction]
  const inDirection = (dir: number, fromLeft: number): {x: number, y: number} => {
    if (dir == 0) { return { x: 0, y: fromLeft} } //R
    if (dir == 1) { return { x: faceLength - fromLeft - 1, y: 0} } //D
    if (dir == 2) { return { x: faceLength - 1, y: faceLength - fromLeft - 1} } //L
    if (dir == 3) { return { x: fromLeft, y: faceLength - 1} } //U
  }
  if (x + dx >= faceLength) {
    const newDirection = positiveMod(direction + transitions[face].east[1], 4)
    return {
      face: transitions[face].east[0],
      direction: newDirection,
      ...inDirection(newDirection, y)
    }
  }
  if (x + dx < 0) {
    const newDirection = positiveMod(direction + transitions[face].west[1], 4)
    return {
      face: transitions[face].west[0],
      direction: newDirection,
      ...inDirection(newDirection, faceLength - y - 1)
    }
  }
  if (y + dy >= faceLength) {
    const newDirection = positiveMod(direction + transitions[face].south[1], 4)
    return {
      face: transitions[face].south[0],
      direction: newDirection,
      ...inDirection(newDirection, faceLength - x - 1)
    }
  }
  if (y + dy < 0) {
    const newDirection = positiveMod(direction + transitions[face].north[1], 4)
    return {
      face: transitions[face].north[0],
      direction: newDirection,
      ...inDirection(newDirection, x)
    }
  }
  return {
    x: x + dx,
    y: y + dy,
    face, direction
  }
}

const turn = (position: Position, direction: 1 | -1): Position => ({
  ...position,
  direction: positiveMod(position.direction + direction, 4)
})

const start: Position = { x: 0, y: 0, face: 0, direction: 0}

const traverse = (transitions: Transitions[]): Position => {
  let position = start
  for (const instruction of instructions) {
    if (instruction === "R") { position = turn(position, 1) }
    else if (instruction === "L") { position = turn(position, -1) }
    const steps = parseInt(instruction)
    stepLoop:
    for (let i = 0; i < steps; i++) {
      const next = step(transitions)(position)
      const nextTerrain = faces[next.face].grid[next.y][next.x]
      if (nextTerrain === "#") { break stepLoop }
      else {
        console.log(`${position.face} - [${position.x}, ${position.y}] (${position.direction})`)
        position = next
      }
    }
  }
  return position
}

const scoreForPosition = (position: Position): number => {
  const face = faces[position.face]
  const row = face.netPosition[0] * faceLength + position.y + 1
  const col = face.netPosition[1] * faceLength + position.x + 1
  return 1000 * row + 4 * col + position.direction
}

// TODO: calculate the edges...
const sampleCubeTransitions: Transitions[] = [
  { east: [5, 2], south: [3, 0], west: [2, 3], north: [1, 2] },
  { east: [2, 0], south: [4, 2], west: [5, 1], north: [0, 2] },
  { east: [3, 0], south: [4, 3], west: [1, 0], north: [0, 1] },
  { east: [5, 1], south: [4, 0], west: [2, 0], north: [0, 0] },
  { east: [5, 0], south: [1, 2], west: [2, 1], north: [3, 0] },
  { east: [0, 2], south: [1, 3], west: [4, 0], north: [3, 3] },
]


/**
 * _01
 * _2_
 * 34_
 * 5__
 */
const realCubeTransitions: Transitions[] = [
  { east: [1, 0], south: [2, 0], west: [3, 2], north: [5, 1] }, //0
  { east: [4, 2], south: [2, 1], west: [0, 0], north: [5, 0] }, //1
  { east: [1, 3], south: [4, 0], west: [3, 3], north: [0, 0] }, //2
  { east: [4, 0], south: [5, 0], west: [0, 2], north: [2, 1] }, //3
  { east: [1, 2], south: [5, 1], west: [3, 0], north: [2, 0] }, //4
  { east: [4, 3], south: [1, 0], west: [0, 3], north: [3, 0] }, //5
]

const test: Position = { face: 4, x: 0, y: 0, direction: 2 }

console.log(step(sampleCubeTransitions)(test))

console.log("(P1): " + scoreForPosition(traverse(wrapAroundTransitions)))

console.log("(P2): " + scoreForPosition(traverse(realCubeTransitions)))