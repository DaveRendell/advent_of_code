import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max, min, sum } from "../utils/reducers"

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
  const bestPath = paths.find(p => evalutatePath(valves)(p) === maxPressure)
  console.log(bestPath)
  console.log("(P1) Answer: " + maxPressure)
}

function partTwo() {
  const valves = readLines(__dirname, inputFile()).reduce(parseValve, {})

  const distances = Object.fromEntries(
    Object.keys(valves)
      .filter(name => valves[name].flowRate > 0 || name === "AA")
      .map(name => [name, movementCosts(valves)(name)])
  )
  console.log("Distance map between non zero valves (and start) calculated")
  const multiPaths = getMultiPaths(distances)({ 
    minutesLeft: 26, 
    actors: [{ target: "AA", travelTime: 0 }, { target: "AA", travelTime: 0 }], 
    openedValves: [] 
  }, [])
  console.log(multiPaths.length + " possible paths between valves found")

  const maxPressure = multiPaths
    .map(({openedValves}) =>
      evalutatePath(valves)(openedValves.map(({name, minutesOpen}) => [name , minutesOpen])))
    .reduce(max)
  
  const bestPath = multiPaths.find(({openedValves}) =>
    evalutatePath(valves)(openedValves.map(({name, minutesOpen}) => [name , minutesOpen])) === maxPressure)
  console.log(JSON.stringify(bestPath, null, 2))
  console.log("(P2) Answer: " + maxPressure)
  // 2650 too high
}

interface Valve {
  flowRate: number,
  tunnels: string[],
}

type ValveMap = Record<string, Valve>
type DistanceMap = Record<string, number>
type DistanceTable = Record<string, DistanceMap>
type Path = [string, number][]
type Position = { target: string, travelTime: number }
type OpenedValve = { name: string, minutesOpen: number, openedBy: number }
type MultiPath = { minutesLeft: number, actors: Position[], openedValves: OpenedValve[] }


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

const getMultiPaths = (distances: DistanceTable) =>
  ({ minutesLeft, actors, openedValves }: MultiPath, visited: string[]): MultiPath[] => {
    const firstActorAtDest = actors.findIndex(({travelTime: minutesLeft}) => minutesLeft === 0)
    if (firstActorAtDest === -1) {
      throw new Error("Panic!")
    }
    
    const target = actors[firstActorAtDest].target
    const options = Object.keys(distances[target])
      .filter(next => !visited.includes(next))
      .filter(next => distances[target][next] + 1 <= minutesLeft)
      .map(next => ({ target: next, travelTime: distances[target][next] + 1 }))
    
    if (options.length === 0) { return [{ minutesLeft , actors, openedValves: [...openedValves, { name: target, minutesOpen: minutesLeft, openedBy: firstActorAtDest }] }] }

    return options.flatMap(option => {
      const newActors = actors
        .map((actor, i) => i === firstActorAtDest ? option : actor)
      const nextArrival = newActors.map(({travelTime}) => travelTime).reduce(min)
      const nextDestination = newActors.find(({travelTime}) => travelTime === nextArrival)
      
      return getMultiPaths(distances)({
        minutesLeft: minutesLeft - nextArrival,
        actors: newActors.map(a => ({ ...a, travelTime: a.travelTime - nextArrival})),
        openedValves: [...openedValves, { name: target, minutesOpen: minutesLeft, openedBy: firstActorAtDest }]
      }, [...visited, option.target])
    })
  }

const getPaths = (distances: DistanceTable) =>
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