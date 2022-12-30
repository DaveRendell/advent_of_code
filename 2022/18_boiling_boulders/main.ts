import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, min, sum } from "../../utils/reducers"

type Cube = number[] // [x, y, z]

function partOne() {
  const cubes = readLines(__dirname, inputFile())
    .map(parseCube)
  
  const surfaceArea = getSurfaceArea(cubes)

  console.log("(P1) Answer: " + surfaceArea)
}

function partTwo() {
  const cubes = readLines(__dirname, inputFile())
    .map(parseCube)
  
  const mould = createMould(cubes)
  const surfaceArea = getSurfaceArea(mould) - exteriorMouldSurfaceArea(cubes)

  console.log("(P2) Answer: " + surfaceArea)
}

const getSurfaceArea = (cubes: Cube[]): number => {
  const adjacencies = cubes
    .map((cube, i) =>
      cubes.slice(i)
        .filter(adjacentTo(cube))
        .length)
    .reduce(sum)
  
  return 6 * cubes.length - 2 * adjacencies
}

const getMouldDimensions = (cubes: Cube[]): number[][] => {
  const minX = cubes.map(([x, _y, _z]) => x).reduce(min) - 1
  const minY = cubes.map(([_x, y, _z]) => y).reduce(min) - 1
  const minZ = cubes.map(([_x, _y, z]) => z).reduce(min) - 1
  const maxX = cubes.map(([x, _y, _z]) => x).reduce(max) + 1
  const maxY = cubes.map(([_x, y, _z]) => y).reduce(max) + 1
  const maxZ = cubes.map(([_x, _y, z]) => z).reduce(max) + 1

  return [[minX, maxX], [minY, maxY], [minZ, maxZ]]
}

const createMould = (cubes: Cube[]): Cube[] => {
  const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = getMouldDimensions(cubes)

  let mould: Cube[] = [[minX, minY, minZ]]
  let updates: Cube[] = [...mould]

  while (updates.length > 0) {
    let newUpdates: Cube[] = []
    for (const [x, y, z] of updates) {
      [[x - 1, y, z], [x + 1, y, z],
       [x, y - 1, z], [x, y + 1, z],
       [x, y, z - 1], [x, y, z + 1]]
        .filter(inRange([[minX, maxX], [minY, maxY], [minZ, maxZ]]))
        .filter(cube => !cubes.some(equals(cube)))
        .forEach(cube => {
          if (!mould.some(equals(cube))) {
            mould.push(cube)
            newUpdates.push(cube)
          }
        })
    }
    updates = newUpdates
  }

  return mould
}

const exteriorMouldSurfaceArea = (cubes: Cube[]): number => {
  const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = getMouldDimensions(cubes)
  const edgeX = (maxX - minX + 1)
  const edgeY = (maxY - minY + 1)
  const edgeZ = (maxZ - minZ + 1)
  return 2 * (edgeX * edgeY + edgeX * edgeZ + edgeY * edgeZ)
}

const parseCube = (line: string): Cube =>
  line.split(",").map(v => parseInt(v))

const adjacentTo = ([aX, aY, aZ]: Cube) => ([bX, bY, bZ]: Cube): boolean =>
  Math.abs(bX - aX) + Math.abs(bY - aY) + Math.abs(bZ - aZ) === 1

const equals = ([aX, aY, aZ]: Cube) => ([bX, bY, bZ]: Cube): boolean =>
  Math.abs(bX - aX) + Math.abs(bY - aY) + Math.abs(bZ - aZ) === 0

const inRange = ([[minX, maxX], [minY, maxY], [minZ, maxZ]]: number[][]) =>
  ([x, y, z]: Cube): boolean =>
    x >= minX && x <= maxX
    && y >= minY && y <= maxY
    && z >= minZ && z <= maxZ

partOne()
partTwo()
