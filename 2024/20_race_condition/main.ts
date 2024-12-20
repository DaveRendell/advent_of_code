import inputFile from "../../utils/inputFile"
import Vector2, { VectorMap } from "../../utils/vector2"
import readCharArray from "../../utils/readCharArray"
import { findLowestCostsGrid } from "../../utils/pathFinding"

const input = VectorMap.fromGrid(readCharArray(__dirname, inputFile()))
const end = input.entries().find(([_, value]) => value === "E")[0]

const isTrack = (position: Vector2): boolean =>
  input.has(position) && input.get(position) !== "#"

const distancesToEnd = findLowestCostsGrid(
  end, 
  (_, to) => isTrack(to) ? 1 : Infinity
)

const getCheatsThatSave100 = (cheatLength: number) => input.keys()
  .filter(position => isTrack(position))
  .flatMap((a, _, arr) => arr
    .filter(b => a.subtract(b).taxiMagnitude() <= cheatLength)
    .filter(b => distancesToEnd.get(b) - distancesToEnd.get(a) >= (100 + a.subtract(b).taxiMagnitude()))
    .map(b => [a, b]))
    .length

console.log("(P1): ", getCheatsThatSave100(2))
console.log("(P2): ", getCheatsThatSave100(20))
