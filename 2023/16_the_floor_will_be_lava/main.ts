import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import Vector2 from "../../utils/vector2"
import HashSet from "../../utils/hashset"
import { sum } from "../../utils/reducers"
import HashMap from "../../utils/hashmap"

const mirrors = readLines(__dirname, inputFile())
const width = mirrors[0].length
const height = mirrors.length

const nextDirections = (position: Vector2, direction: Vector2): Vector2[] => {
  switch (mirrors[position.y][position.x]) {
    case ".": return [direction]
    case "\\": return [new Vector2(direction.y, direction.x)]
    case "/": return [new Vector2(-direction.y, -direction.x)]
    case "-": return direction.y == 0 ? [direction] : [Vector2.LEFT, Vector2.RIGHT]
    case "|": return direction.x == 0 ? [direction] : [Vector2.UP, Vector2.DOWN]
  }
}

type LightMap = HashMap<Vector2, HashSet<Vector2>>

const shineLightFrom = (startPosition: Vector2, startDirection: Vector2): LightMap => {
  const light: LightMap = new HashMap(v => v.toString(), [])
  range(0, height).forEach(y =>
    range(0, width).forEach(x =>
      light.set(new Vector2(x, y), new HashSet<Vector2>(v => v.toString()))))
  light.get(startPosition).add(startDirection)

  let edges: [Vector2, Vector2][] = [[startPosition, startDirection]]

  while (edges.length > 0) {
    const newEdges: [Vector2, Vector2][] = []
    edges.forEach(([edgePosition, edgeDirection]) => {
      nextDirections(edgePosition, edgeDirection).forEach(newDirection => {
        const newPosition = edgePosition.add(newDirection)
        if (light.get(newPosition) && !light.get(newPosition).has(newDirection)) {
          newEdges.push([newPosition, newDirection])
          light.get(newPosition).add(newDirection)
        }
      })
    })
    edges = newEdges
  }

  return light
}

const countEnergised = (light: LightMap): number =>
  light.values().map(lights => lights.size > 0 ? 1 : 0).reduce(sum, 0)

console.log("(P1): " + countEnergised(shineLightFrom(new Vector2(0, 0), Vector2.RIGHT)))

let best = 0

for (let x = 0; x < width; x++) {
  best = Math.max(best, countEnergised(shineLightFrom(new Vector2(x, 0), Vector2.DOWN)))
  best = Math.max(best, countEnergised(shineLightFrom(new Vector2(x, height - 1), Vector2.UP)))
}
for (let y = 0; y < height; y++) {
  best = Math.max(best, countEnergised(shineLightFrom(new Vector2(0, y), Vector2.RIGHT)))
  best = Math.max(best, countEnergised(shineLightFrom(new Vector2(width - 1, y), Vector2.LEFT)))
}

console.log("(P2): " + best)