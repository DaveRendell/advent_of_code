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

function partTwo() {}

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
