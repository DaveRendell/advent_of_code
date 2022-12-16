import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { groupBy, sum } from "../utils/reducers"
import { descending } from "../utils/sorters"

function partOne() {
  const valves = readLines(__dirname, inputFile()).reduce(parseValve, {})
  const initialState: State = { position: "AA", openValves: {}, }

  let states: State[] = [initialState]
  for (let minute = 1; minute <= 30; minute++) {
    console.log("Minute " + minute)
    const possibleStates = states.flatMap(state => getMoves(valves)(state, minute))
    const equivalentStates = possibleStates.reduce(groupBy(stateCharacteristic), {})
    const sorter = pressureReleased(valves, minute)
    const byPressureReleasedDesc = (a, b) => descending(sorter(a), sorter(b))
    states = Object.values(equivalentStates)
      .map(group => group.sort(byPressureReleasedDesc)[0])
  }

  const mostPressure = states
    .map(state => pressureReleased(valves, 30)(state))
    .sort(descending)[0]

  console.log("(P1) Answer: " + mostPressure)
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

partOne()
partTwo()
