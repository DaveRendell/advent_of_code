import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange } from "../../utils/numbers"
import { ascending } from "../../utils/sorters"

type Reactor = boolean[][][]

function partOne() {
  const instructions = readLines(__dirname, inputFile())
    .map(parseInstruction)
  
  const blankReactor: Reactor = inclusiveRange(-50, 50).map(() =>
    inclusiveRange(-50, 50).map(() =>
      inclusiveRange(-50, 50).map(() =>
        false)))
  
  const rebootedReactor = instructions.reduce(apply, blankReactor)

  const onCubes = rebootedReactor.flat(3).filter((cube => cube)).length

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

interface Instruction {
  state: boolean,
  ranges: number[][]
}

const parseInstruction = (line: string): Instruction => ({
  state: line.startsWith("on"),
  ranges: line.split(" ")[1].split(",").map(rangeString => 
    rangeString.slice(2).split("..").map(v => parseInt(v)).sort(ascending))
})

const apply = (
  reactor: Reactor,
  {
    state,
    ranges: [xRange, yRange, zRange]
  }: Instruction
): Reactor =>
  inclusiveRange(-50, 50).map(x =>
    inclusiveRange(-50, 50).map(y =>
      inclusiveRange(-50, 50).map(z =>
        (inRange(xRange)(x) && inRange(yRange)(y) && inRange(zRange)(z))
            ? state
            : reactor[x + 50][y + 50][z + 50])))

const inRange = ([lower, higher]: number[]) => (value: number): boolean =>
  value >= lower && value <= higher

partOne()
partTwo()
