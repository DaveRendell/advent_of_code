import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange } from "../../utils/numbers"
import { ascending } from "../../utils/sorters"
import { sum } from "../../utils/reducers"

type Range = number[] // [lower, higher]
type Cuboid = Range[] // [xRange, yRange, zRange]
type Reactor = Cuboid[] // Currently 'on' cubes

function partOne() {
  const instructions = readLines(__dirname, inputFile())
    .map(parseInstruction)
  // QQ trim instruction ranges to be in +-50 for p1, currently just
  // manually removing the ones outside that range...
  
  const rebootedReactor = instructions.reduce(apply, [])

  const onCubes = rebootedReactor.map(volume).reduce(sum)

  console.log("(P1) Answer: " + onCubes)
}

function partTwo() {
  /*
  OK so how to do...
  Think about 2d to make it easier to reason

  -x--
  -x--
  -x--
  ----

  ----
  xxx-
  xxx-
  ----

  ----
  ----
  -o--
  ----

  want =>

  oxoo
  xxxo
  xoxo
  oooo

  (1, 1)x(0, 2) =>
    (1, 1)x(0, 2) [5]
    [5]
  (0, 2)x(1, 2) =>
    (1, 1)x(0, 0) [1]
    (0, 2)x(1, 2) [6]
    [7]
  (1, 1)o(2, 2) =>
    (1, 1)x(1, 2) ->
    (1, 1)x(0, 0) [1]
    (0, 0)x(1, 2) [2]
    (1, 1)x(1, 1) [1]
    (2, 2)x(1, 2) [2]
    [7]
    Figure out nice algorithms for splitting up cubes
    One for adding, one for removing

    (x0_min, x0_max) x (y0_min, y0_max)
    (x1_min, x1_max) x (y1_min, y1_max)
    if old fully contains new:
      < filter out this case first>
    if new fully contains old:
      new
    if overlaps(x0, x1) and overlaps(y0, y1):
      (x0_min, x1_min - 1) x (y0_min, y0_max)
      (max(x0_min, x1_min), min(x0_max, x1_max))     x (y0_min, y1_min - 1)
      (max(x0_min, x1_min), min(x0_max, x1_max))     x (y1_max + 1, y0max)
      (x1_max+1, x0max)    x (y0_min, y0_max)
      filter out non existant rectangles
    else
      (x1_min, x1_max) x (y1_min, y1_max)
    
    add new to end
    Oh! Neat part about this is for `off` commands you can do the exact same
    algorithm, just don't add `new` at the end!

    make a helper function for measuring cuboids that deals with reverse ranges and
    measures them as 0

  */
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

const apply = (
  reactor: Reactor,
  { state, cuboid }: Instruction,
  i: number
): Reactor => {
  console.log(i)
  return[
    ...reactor.flatMap(splitAndRemove(cuboid)),
    ...(state ? [cuboid] : [])
  ]
}

const splitAndRemove = (removedCuboid: Cuboid) => (cuboid: Cuboid): Cuboid[] => {
  const [[x0Min, x0Max], [y0Min, y0Max], [z0Min, z0Max]] = cuboid
  const [[x1Min, x1Max], [y1Min, y1Max], [z1Min, z1Max]] = removedCuboid
  if (!overlaps(removedCuboid, cuboid)) {
    return [cuboid]
  }
  return [
    [[x0Min, x0Max], [y0Min, y0Max], [z0Min, z1Min - 1]],
    [[x0Min, x0Max], [y0Min, y1Min - 1], [z1Min, z1Max]],
    [[x0Min, x1Min - 1], [y1Min, y1Max], [z1Min, z1Max]],
    [[x1Max + 1, x0Min], [y1Min, y1Max], [z1Min, z1Max]],
    [[x0Min, x0Max], [y1Max + 1, y0Max], [z1Min, z1Max]],
    [[x0Min, x0Max], [y0Min, y0Max], [z1Max + 1, z0Max]],
  ].filter(c => volume(c) > 0)
}

const overlaps = ([x1, y1, z1]: Cuboid, [x2, y2, z2]: Cuboid): boolean =>
  rangesOverlap(x1, x2) && rangesOverlap(y1, y2) && rangesOverlap(z1, z2)

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
