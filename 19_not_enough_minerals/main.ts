import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max, sum } from "../utils/reducers"


type Cost = [number, number, number]
type Blueprint = [Cost, Cost, Cost, Cost]

interface State {
  minute: number,
  resources: number[],
  robots: number[]
}

const START: State = { minute: 1, resources: [0, 0, 0, 0], robots: [1, 0, 0, 0] }

function partOne() {
  const blueprints = readLines(__dirname, inputFile()).map(parseBlueprint)
  console.log("(P1) Answer: " + blueprints.map((b, i) => (i + 1) * mostGeodes(b)(START)).reduce(sum))
}

function partTwo() {}


const parseBlueprint = (line: string): Blueprint => {
  const [
    oreString, clayString, obsidianString, geodeString
  ] = line.split(": ")[1].split(". ")

  const oreRobot: Cost = [parseInt(oreString.split(" ")[4]), 0, 0]
  const clayRobot: Cost = [parseInt(clayString.split(" ")[4]), 0, 0]
  const obsidianRobot: Cost = [parseInt(obsidianString.split(" ")[4]), parseInt(obsidianString.split(" ")[7]), 0]
  const geodeRobot: Cost = [parseInt(geodeString.split(" ")[4]), 0, parseInt(geodeString.split(" ")[7])]
  return [oreRobot, clayRobot, obsidianRobot, geodeRobot]
}

const mostGeodes = (blueprint: Blueprint) => ({ minute, resources, robots } : State): number => {
  if (minute === 25) { return resources[3] }
  const newResources = add(resources)(robots)
  const doNothingState = { minute: minute + 1, resources: newResources, robots }

  const turnsUntilCanBuild = blueprint.map(calcTurnsUntilCanBuild(newResources, robots))
  // Filter future states by if it's longer until they can build... something?

  const buyStates = blueprint
    .filter(cost => greaterEqualTo(newResources)(cost))
    .map((cost, i) => ({
      minute: minute + 1,
      resources: subtract(newResources)(cost),
      robots: robots.map((r, j) => j === i ? r + 1 : r)
    }))

  return [doNothingState, ...buyStates].map(mostGeodes(blueprint)).reduce(max)
}

const add = (v1: number[]) => (v2: number[]): number[] =>
  v1.map((_, i) => v1[i] + (v2[i] || 0))

const subtract = (v1: number[]) => (v2: number[]): number[] =>
  v1.map((_, i) => v1[i] - (v2[i] || 0))

const divide = (v1: number[]) => (v2: number[]): number[] =>
  v1.map((_, i) => Math.ceil(v1[i] / (v2[i] || 0)))

const calcTurnsUntilCanBuild = (resources: number[], robots: number[]) => (cost: Cost) =>
  divide(subtract(cost)(resources))(robots).filter(x => !isNaN(x)).reduce(max)

const greaterEqualTo = (v1: number[]) => (v2: number[]): boolean =>
  v1.every((_, i) => v1[i] >= (v2[i] || 0))

partOne()
partTwo()
