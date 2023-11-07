import HashMap from "../../utils/hashmap"
import HashSet from "../../utils/hashset"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import permutator from "../../utils/permutator"
import readCharArray from "../../utils/readCharArray"
import { min, sum, windows } from "../../utils/reducers"
import Vector2 from "../../utils/vector2"

const airDuctMap = readCharArray(__dirname, inputFile())

// Get nodes
const nodes: Vector2[] = range(0, 10)
  .map(i => airDuctMap.findIndex(row => row.includes(i.toString())))
  .filter(row => row !== -1)
  .map((row, i) =>
    new Vector2(airDuctMap[row].findIndex(x => x === i.toString()), row))

// Get distances between nodes

const getDistancesToNodesFrom = (startPosition: Vector2): number[] => {
  let distances: HashMap<Vector2, number> = new HashMap(
    v => v.toString(),
    [[startPosition, 0]])
  let edges: HashSet<Vector2> = new HashSet(v => v.toString(), [startPosition])

  let steps = 1
  while (edges.size > 0) {
    let newEdges: HashSet<Vector2> = new HashSet(v => v.toString(), [])
    for (let edge of edges.entries()) {
      edge.neighbours4()
        .filter(({x, y}) => airDuctMap[y][x] !== "#")
        .filter(v => !distances.has(v))
        .forEach(newEdge => {
          newEdges.add(newEdge)
          distances.set(newEdge, steps)
        })
    }
    edges = newEdges
    steps++
  }
  return nodes.map(node => distances.get(node))
}

const distanceTable = nodes.map(getDistancesToNodesFrom)

// BFS as only 7! possibilities

const nodeOrders = permutator(nodes.length - 1).map(p => [0, ...p.map(x => x + 1)])

function calculateTotalDistance(nodeOrder: number[]): number {
  return nodeOrder.reduce(windows(2), []).map(([a, b]) => distanceTable[a][b]).reduce(sum)
}

const answerP1 = nodeOrders.map(calculateTotalDistance).reduce(min)

console.log("(P1): " + answerP1)

const answerP2 = nodeOrders.map(nodeOrder => [...nodeOrder, 0]).map(calculateTotalDistance).reduce(min)

console.log("(P2): " + answerP2)