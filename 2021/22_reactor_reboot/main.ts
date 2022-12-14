import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange } from "../../utils/numbers"
import { ascending } from "../../utils/sorters"
import { sum } from "../../utils/reducers"

type Range = number[] // [lower, higher]
type Cuboid = Range[] // [xRange, yRange, zRange]
type Reactor = Cuboid[] // Currently 'on' cubes

function partOne() {
  const instructions = readLines(__dirname, inputFile()).map(parseInstruction)
    .map(({cuboid, state}) => ({ state, cuboid: clamp([-50, 50])(cuboid) }))
  
  const rebootedReactor = instructions.reduce(apply, [])

  const onCubes = rebootedReactor.map(volume).reduce(sum)

  console.log("(P1) Answer: " + onCubes)
}

function partTwo() {
  const instructions = readLines(__dirname, inputFile()).map(parseInstruction)

  const rebootedReactor = instructions.reduce(apply, [])

  const onCubes = rebootedReactor.map(volume).reduce(sum)

  console.log("(P2) Answer: " + onCubes)
}

const length = ([lower, higher]: Range): number =>
  Math.max(higher + 1 - lower, 0)

const volume = ([xRange, yRange, zRange]: Cuboid): number =>
  length(xRange) * length(yRange) * length(zRange)

interface Instruction {
  state: boolean,
  cuboid: Cuboid
}

const parseInstruction = (line: string): Instruction => ({
  state: line.startsWith("on"),
  cuboid: line.split(" ")[1].split(",").map(rangeString => 
    rangeString.slice(2).split("..").map(v => parseInt(v)).sort(ascending))
})

// apply([[[1, 5], [1, 2], [1, 2]]], {state: true, cuboid: [[3, 4], [1, 2], [1, 2]]}) -> wrong answer
const apply = (
  reactor: Reactor,
  { state, cuboid }: Instruction,
  i: number
): Reactor => [
    ...reactor.flatMap(splitAndRemove(cuboid)),
    ...(state ? [cuboid] : [])
  ]

const splitAndRemove = (removedCuboid: Cuboid) => (cuboid: Cuboid): Cuboid[] => {
  const [[x0Min, x0Max], [y0Min, y0Max], [z0Min, z0Max]] = cuboid
  const [[x1Min, x1Max], [y1Min, y1Max], [z1Min, z1Max]] = removedCuboid
  if (!overlaps(removedCuboid, cuboid)) {
    return [cuboid]
  }
  return [
    [[x0Min, x0Max], [y0Min, y0Max], [z0Min, z1Min - 1]],
    [[x0Min, x0Max], [y0Min, y1Min - 1], [Math.max(z0Min, z1Min), Math.min(z0Max, z1Max)]],
    [[x0Min, x1Min - 1], [Math.max(y0Min, y1Min), Math.min(y0Max, y1Max)], [Math.max(z0Min, z1Min), Math.min(z0Max, z1Max)]],
    [[x1Max + 1, x0Max], [Math.max(y0Min, y1Min), Math.min(y0Max, y1Max)], [Math.max(z0Min, z1Min), Math.min(z0Max, z1Max)]],
    [[x0Min, x0Max], [y1Max + 1, y0Max], [Math.max(z0Min, z1Min), Math.min(z0Max, z1Max)]],
    [[x0Min, x0Max], [y0Min, y0Max], [z1Max + 1, z0Max]],
  ].filter(c => volume(c) > 0)
}

const overlaps = ([x1, y1, z1]: Cuboid, [x2, y2, z2]: Cuboid): boolean =>
  rangesOverlap(x1, x2) && rangesOverlap(y1, y2) && rangesOverlap(z1, z2)

const clamp = ([lowerClamp, higherClamp]: number[]) => (cuboid: Cuboid): Cuboid =>
  cuboid.map(([lower, higher]) => [Math.max(lower, lowerClamp), Math.min(higher, higherClamp)])

// May be useful?
const inRange = ([lower, higher]: number[]) => (value: number): boolean =>
  value >= lower && value <= higher

const rangesFullyOverlap = ([[l1, h1], [l2, h2]]: number[][]): boolean =>
  (l1 <= l2 && h1 >= h2) || (l2 <= l1 && h2 >= h1)

const rangesOverlap = ([l1, h1]: number[], [l2, h2]: number[]): boolean =>
  !(l1 > h2 || l2 > h1)

const getCoords = ([[xMin, xMax], [yMin, yMax], [zMin, zMax]]: Cuboid): number[][] =>
  inclusiveRange(xMin, xMax).map(x =>
    inclusiveRange(yMin, yMax).map(y =>
      inclusiveRange(zMin, zMax).map(z =>
        [x, y, z]))).flat(2)

partOne()
partTwo()
