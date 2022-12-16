import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { groupBy, max, sum } from "../utils/reducers"
import { descending } from "../utils/sorters"

function partOne() {
  const valves = readLines(__dirname, inputFile()).reduce(parseValve, {})

  const distances = Object.fromEntries(
    Object.keys(valves).map(name => [name, movementCosts(valves)(name)])
  )
  const paths = getPaths(distances)("AA", 30, [])

  // const initialState: State = { position: "AA", openValves: {}, }

  // let states: State[] = [initialState]
  // for (let minute = 1; minute <= 30; minute++) {
  //   console.log("Minute " + minute)
  //   const possibleStates = states.flatMap(state => getMoves(valves)(state, minute))
  //   const equivalentStates = possibleStates.reduce(groupBy(stateCharacteristic), {})
  //   const sorter = pressureReleased(valves, minute)
  //   const byPressureReleasedDesc = (a, b) => descending(sorter(a), sorter(b))
  //   states = Object.values(equivalentStates)
  //     .map(group => group.sort(byPressureReleasedDesc)[0])
  // }

  // const mostPressure = states
  //   .map(state => pressureReleased(valves, 30)(state))
  //   .sort(descending)[0]

  // const mostPressure = depthFirstSearch(valves, "AA", [], 0)

  console.log("(P1) Answer: ")
}

function partTwo() {}

type TurnOpened = Record<string, number>

interface State {
  position: string,
  openValves: TurnOpened,
}

interface Valve {
  flowRate: number,
  tunnels: string[],
}

type ValveMap = Record<string, Valve>
type DistanceMap = Record<string, number>


const parseValve = (map: ValveMap, line: string): ValveMap => {
  const [,name,,,rateString,,,,,...tunnelStrings] = line.split(" ")
  const flowRate = parseInt(rateString.slice(5, -1))
  const tunnels = tunnelStrings.join("").split(",")
  return { ...map, [name]: {flowRate, tunnels } }
}

const getMoves = (valves: ValveMap) =>
  (state: State, turn: number): State[] => {
    const currentValve = valves[state.position]
    const tunnelMoves = currentValve.tunnels.map(tunnel => 
      ({ ...state, position: tunnel }))
    
    return state.openValves[state.position] || currentValve.flowRate === 0
      ? tunnelMoves
      : [
          ...tunnelMoves,
          {
            ...state,
            openValves: { ...state.openValves, [state.position]: turn } }
        ]
  }

const stateCharacteristic = ({ position, openValves }: State) =>
  `${position} - [${Object.keys(openValves).sort().join(",")}]`

const pressureReleased = (valves: ValveMap, minute: number) => 
  ({ openValves }: State): number =>
    Object.keys(openValves).map(name => {
      const minutesOpen = minute - openValves[name]
      return valves[name].flowRate * minutesOpen
    }).reduce(sum, 0)


const depthFirstSearch = (
  valves: ValveMap,
  position: string,
  open: string[],
  minute: number
): number => {
  if (minute > 30) { return 0 }

  const pressureReleased = open
    .map(name => valves[name].flowRate)
    .reduce(sum, 0)
  
  const openValve = open.includes(position)
    ? -1
    : depthFirstSearch(valves, position, [...open, position], minute + 1)
  
  const takeTunnels = valves[position].tunnels.map(name =>
    depthFirstSearch(valves, name, open, minute + 1))

  return pressureReleased + [openValve, ...takeTunnels].reduce(max)
}

const getPaths = (distances: {[k: string]: DistanceMap}) =>
  (from: string, minutesLeft: number, visited: string[]): string[][] => {
    if (minutesLeft === 0) { return [[from]] }
    return Object.keys(distances[from])
      .filter(next => !visited.includes(next))
      .flatMap(next =>
        getPaths(distances)(next, minutesLeft - 2, [...visited, from])
          .map(path => [from, ...path]))
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

  return costs
}

partOne()
partTwo()