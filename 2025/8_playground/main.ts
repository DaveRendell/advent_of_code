import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { product } from "../../utils/reducers"
import sampleSpecificValue from "../../utils/sampleSpecificValue"
import { descending } from "../../utils/sorters"

const junctions = readNumbersFromLines(__dirname, inputFile())

const connections: string[] = [] // "hash", node pair ordered by index in input
const groups: number[][] = junctions.map((_, i) => [i])// groups of indexes of nodes in group


const distance3 = ([x1, y1, z1]: number[], [x2, y2, z2]: number[]): number => {
  return Math.sqrt(
    (x1 - x2) * (x1 - x2) +
    (y1 - y2) * (y1 - y2) +
    (z1 - z2) * (z1 - z2)
  )
}

const distances = junctions.map(junction =>
  junctions.map(other => distance3(junction, other))
)

const mergeNodeGroups = (a: number, b: number) => {
  const aGroupIndex = groups.findIndex(group => group.includes(a))
  const bGroupIndex = groups.findIndex(group => group.includes(b))
  if (aGroupIndex === bGroupIndex) { return }
  groups[bGroupIndex].forEach(node => groups[aGroupIndex].push(node))
  groups.splice(bGroupIndex, 1)
}

const connectClosestJunctions = (ignoreSameGroup: boolean = false) => {
  let closetDistance = Infinity
  let closestIndexA = -1
  let closestIndexB = -1

  for (let i = 0; i < junctions.length; i++) {
    for (let j = i + 1; j < junctions.length; j++) {
      const distance = distances[i][j]
      if (distance >= closetDistance) { continue }
      if (connections.includes(`${i}-${j}`)) { continue }
      if (ignoreSameGroup) {
        const groupA = groups.findIndex(group => group.includes(i))
        const groupB = groups.findIndex(group => group.includes(j))
        if (groupA === groupB) { continue }
      }
      closetDistance = distance
      closestIndexA = i
      closestIndexB = j
    }
  }
  // console.log(closestIndexA, closestIndexB, junctions[closestIndexA], junctions[closestIndexB], closetDistance)
  connections.push(`${closestIndexA}-${closestIndexB}`)
  mergeNodeGroups(closestIndexA, closestIndexB)
  return [closestIndexA, closestIndexB]
}

for (let i = 0; i < sampleSpecificValue(10, 1000); i++) {
  console.log(i)
  connectClosestJunctions()
}
const p1Answer = groups
  .map(group => group.length)
  .sort(descending)
  .slice(0, 3)
  .reduce(product)

console.log("(P1): ", p1Answer)

let finalConnectionA = -1
let finalConnectionB = -1

while (groups.length > 1) {
  [finalConnectionA, finalConnectionB] = connectClosestJunctions(true)
  console.log(groups.length)
}
console.log(finalConnectionA, finalConnectionB)
const p2Answer = junctions[finalConnectionA][0] * junctions[finalConnectionB][0]

console.log("(P2): ", p2Answer)