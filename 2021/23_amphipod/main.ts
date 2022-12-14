import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"

type Map = string[]

function partOne() {
  const initialMap = readLines(__dirname, inputFile())
  console.log("(P1) Answer: " + getEnergyToSort(initialMap))
}

function partTwo() {
  const initialMap = readLines(__dirname, inputFile())
  const unfoldedMap = [
    ...initialMap.slice(0, 3),
    "  #D#C#B#A#",
    "  #D#B#A#C#",
    ...initialMap.slice(3)
  ]
  console.log("(P2) Answer: " + getEnergyToSort(unfoldedMap))
}

const ROOMS = ["A", "B", "C", "D"]
const POSITIONS = [1, 2, 4, 6, 8, 10, 11]
const ROOMS_AND_POSITIONS = [1, 2, "A", 4, "B", 6, "C", 8, "D", 10, 11]

const getRoomColumn = (roomId: number) => 3 + 2 * roomId

const getRooms = (map: Map): string[][] =>
  range(0, 4).map(roomId =>
    map.slice(2, -1)
      .map(line => line[getRoomColumn(roomId)])
      .filter(s => s !== "."))

const getRoomSize = (map: Map): number =>
    map.length - 3

const canMoveIntoRoom = (map: Map) => (letter: string) =>
  getRooms(map)[ROOMS.indexOf(letter)].every(pod => pod === letter)

const moveToRoom = (position: number) => (map: Map): [Map, number] => {
  const pod = map[1][position]
  const roomId = ROOMS.indexOf(pod)
  const room = getRooms(map)[roomId]
  const roomSize = getRoomSize(map)
  const roomRow = 1 + (roomSize - room.length)
  return [
    map.map((row, i) => {
      if (i === 1) { return row.slice(0, position) + "." + row.slice(position + 1) }
      if (i === roomRow) {
        const roomColumn = getRoomColumn(roomId)
        return row.slice(0, roomColumn) + pod + row.slice(roomColumn + 1)
      }
      return row
    }),
    MOVEMENT_COST[pod] * (
      1 + (roomSize - room.length)
      + spacesBetweenRoomAndPosition(ROOMS[roomId], position).length)
  ]
}

const MOVEMENT_COST = { "A": 1, "B": 10, "C": 100, "D": 1000 }

const moveToPosition = (roomId: number, position: number) => (map: Map): [Map, number] => {
  const room = getRooms(map)[roomId]
  const pod = room[0]
  const roomSize = getRoomSize(map)
  const roomRow = 2 + (roomSize - room.length)
  return [
    map.map((row, i) => {
      if (i === 1) { return row.slice(0, position) + pod + row.slice(position + 1) }
      if (i === roomRow) {
        const roomColumn = getRoomColumn(roomId)
        return row.slice(0, roomColumn) + "." + row.slice(roomColumn + 1)
      }
      return row
    }),
    MOVEMENT_COST[pod] * (
      2 + (roomSize - room.length) 
      + spacesBetweenRoomAndPosition(ROOMS[roomId], position).length)
  ]
}

const getValidMoves = (map: Map): [Map, number][] => {
  // move hallway pods to their room?
  const toRoomMoves = POSITIONS
    .map(position => ({position, pod: map[1][position]}))
    .filter(({pod}) => pod !== ".")
    .filter(({pod}) => canMoveIntoRoom(map)(pod))
    .filter(({position, pod}) => positionsBetweenRoomAndPosition(pod, position)
      .every(interPosition => map[1][interPosition] === "."))
    .map(({position}) => moveToRoom(position)(map))

  // move pods in rooms to hallway?
  const toPositionMoves = range(0, 4)
    .filter(roomId => !getRooms(map)[roomId].every(pod => pod === ROOMS[roomId]))
    .flatMap(roomId =>
      POSITIONS
        .filter(position => map[1][position] === ".")
        .filter(position => positionsBetweenRoomAndPosition(ROOMS[roomId], position)
          .every(interPosition => map[1][interPosition] === "."))
        .map(position => moveToPosition(roomId, position)(map)))

  return [...toRoomMoves, ...toPositionMoves]
}

const spacesBetweenRoomAndPosition = (room: string, position: number): (number | string)[] => {
  const roomIndex = ROOMS_AND_POSITIONS.indexOf(room)
  const positionIndex = ROOMS_AND_POSITIONS.indexOf(position)
  const positions = roomIndex < positionIndex
    ? ROOMS_AND_POSITIONS.slice(roomIndex + 1, positionIndex)
    : ROOMS_AND_POSITIONS.slice(positionIndex + 1, roomIndex)
  return positions
}

const positionsBetweenRoomAndPosition = (room: string, position: number): number[] => {
  return spacesBetweenRoomAndPosition(room,position).filter(x => typeof x === "number") as number[]
}

const sortedMap = (map: Map): Map =>
  map.map((row, i) => {
    if (i === 0 || i === map.length - 1) { return row }
    if (i === 1) { return "#...........#"}
    if (i === 2) { return "###A#B#C#D###" }
    return "  #A#B#C#D#"
  })

const getEnergyToSort = (map: Map): number => {
  return getCostsFromMap(map)[sortedMap(map).join("\n")]
}

const getCostsFromMap = (map: Map): { [map: string]: number } => {
  let minimumCosts: { [map: string]: number } = {
    [map.join("\n")]: 0
  }
  let updates: Map[] = [map]

  while (updates.length > 0) {
    let newUpdates: Map[] = []
    for (const update of updates) {
      const uCost = minimumCosts[update.join("\n")]
      const options = getValidMoves(update)
      for (const [newMap, cost] of options) {
        const newCost = uCost + cost
        const oldCost = minimumCosts[newMap.join("\n")]
        if (oldCost === undefined || oldCost > newCost) {
          minimumCosts[newMap.join("\n")] = newCost
          newUpdates.push(newMap)
        }
      }
    }
    updates = newUpdates
  }

  return minimumCosts
}

// BREAK IN CASE OF EMERGENCY
// const steps = debugSort(initialMap)
// console.log(
//   steps.map(([step, cost], i) =>
//     [
//       `=== Step ${i} ===`,
//       ...step,
//       `Cost: ${cost}` + (i === 0 ? "" : ` (+${cost - steps[i - 1][1]})`)
//     ].join("\n")).join("\n\n"))
const debugSort = (map: Map): [Map, number][] => {
  const costs = getCostsFromMap(map)

  let sortProcess: Map[] = [sortedMap(map)]
  while (sortProcess[0].join("\n") !== map.join("\n")) {
    const cost = costs[sortProcess[0].join("\n")]
    const [previousMap] = Object.entries(costs)
      .filter(([candidate, candidateCost]) => candidateCost < cost)
      .filter(([candidate, candidateCost]) => getValidMoves(candidate.split("\n"))
        .map(([_, c]) => candidateCost + c === cost))
      .filter(([candidate, candidateCost]) => getValidMoves(candidate.split("\n"))
        .map(([x]) => x.join("\n"))
        .includes(sortProcess[0].join("\n")))[0]
    sortProcess = [previousMap.split("\n"), ...sortProcess]
  }

  return sortProcess.map(m => [m, costs[m.join("\n")]])
}

partOne()
partTwo()
