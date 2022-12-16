import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max, sum } from "../utils/reducers"

function partOne() {
  const valves = readLines(__dirname, inputFile()).reduce(parseValve, {})

  const distances = Object.fromEntries(
    Object.keys(valves)
      .filter(name => valves[name].flowRate > 0 || name === "AA")
      .map(name => [name, movementCosts(valves)(name)])
  )
  console.log("Distance map between non zero valves (and start) calculated")
  const paths = getPaths(distances)("AA", 30, ["AA"])
  console.log(paths.length + " possible paths between valves found")
  
  const maxPressure = paths.map(evalutatePath(valves)).reduce(max)
  console.log("(P1) Answer: " + maxPressure)
}

function partTwo() {}

interface Valve {
  flowRate: number,
  tunnels: string[],
}

type ValveMap = Record<string, Valve>
type DistanceMap = Record<string, number>
type Path = [string, number][]


const parseValve = (map: ValveMap, line: string): ValveMap => {
  const [,name,,,rateString,,,,,...tunnelStrings] = line.split(" ")
  const flowRate = parseInt(rateString.slice(5, -1))
  const tunnels = tunnelStrings.join("").split(",")
  return { ...map, [name]: {flowRate, tunnels } }
}

const movementCosts = (valves: ValveMap) => (from: string): DistanceMap=> {
  let costs = { [from]: 0 }
  let updates = [from]

  while (updates.length > 0) {
    let newUpdates = []
    for (const name of updates) {
      const uCost = costs[name]
      for (const tunnel of valves[name].tunnels) {
        if (costs[tunnel] === undefined || costs[tunnel] > uCost + 1) {
          costs[tunnel] = uCost + 1
          newUpdates.push(tunnel)
        }
      }
    }
    updates = newUpdates
  }

  return Object.fromEntries(Object.entries(costs)
    .filter(([key]) => valves[key].flowRate > 0)
    .filter(([key]) => key !== from))
}

const getPaths = (distances: {[k: string]: DistanceMap}) =>
  (from: string, minutesLeft: number, visited: string[]): Path[] => {
    
    const options = Object.keys(distances[from])
      .filter(next => !visited.includes(next))
      .filter(next => distances[from][next] <= minutesLeft)
    
    if (options.length === 0) { return [[[from, Math.max(minutesLeft, 0)]]] }

    return options
      .flatMap(next =>
        getPaths(distances)(next, minutesLeft - distances[from][next] - 1, [...visited, next])
          .map(path => [[from, minutesLeft] as [string, number], ...path]))
  }

const evalutatePath = (valves: ValveMap) => (path: Path): number =>
  path.map(([name, minutesLeft]) => valves[name].flowRate * minutesLeft)
  .reduce(sum)

partOne()
partTwo()