import * as crypto from "crypto"
import HashSet from "../../utils/hashset"
import { max } from "../../utils/reducers"

const inputs = [
  "ihgpwlah",
  "kglvqrro",
  "ulqzkmiv",
  "yjjvjgan"
]

interface State {
  x: number,
  y: number,
  path: string[],
}

const hashState = ({ x, y, path }: State) => `${x}_${y}_${path.join("")}`
const isAtVault = ({ x, y }: State) => x === 3 && y === 3
const inBounds = ({ x, y }: State) => x >= 0 && x <= 3 && y >= 0 && y <= 3
const nextStates = (password: string) => ({ x, y, path }: State): State[] => [
  { x, y: y - 1, path: [...path, "U"] },
  { x, y: y + 1, path: [...path, "D"] },
  { x: x - 1, y, path: [...path, "L"] },
  { x: x + 1, y, path: [...path, "R"] }
].filter((_state, index) => getDoorStates(password, path)[index]).filter(inBounds)

function getDoorStates(passcode: string, path: string[]) {
  return [...crypto.createHash('md5')
    .update(passcode + path.join(""))
    .digest("hex")
    .slice(0, 4)]
    .map(char => "bcdef".includes(char))
}

function getShortestPath(passcode: string): string {
  let possibleStates: HashSet<State> = new HashSet(hashState, [{ x: 0, y: 0, path: [] }])

  while (!possibleStates.entries().some(isAtVault)) {
    const updates = possibleStates.entries().flatMap(nextStates(passcode))
    updates.forEach(state => possibleStates.add(state))
  }
  return possibleStates.entries().find(isAtVault).path.join("")
}

function getLongestPath(passcode: string): number {
  let possibleStates: HashSet<State> = new HashSet(hashState, [{ x: 0, y: 0, path: [] }])
  let newStates: HashSet<State> = new HashSet(hashState, [{ x: 0, y: 0, path: [] }])

  while (newStates.size > 0) {
    const updates = newStates.entries().filter(state => !isAtVault(state)).flatMap(nextStates(passcode))
    newStates.clear()
    updates.forEach(state => possibleStates.add(state))
    updates.forEach(state => newStates.add(state))
  }
  return possibleStates.entries().filter(isAtVault).map(({ path }) => path.length).reduce(max)
}

inputs.forEach(input => console.log(getShortestPath(input)))
inputs.forEach(input => console.log(getLongestPath(input)))