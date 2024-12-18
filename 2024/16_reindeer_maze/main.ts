import HashMap from "../../utils/hashmap"
import inputFile from "../../utils/inputFile"
import { findLowestCosts } from "../../utils/pathFinding"
import Queue from "../../utils/queue"
import readCharArray from "../../utils/readCharArray"
import { min } from "../../utils/reducers"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const maze = VectorMap.fromGrid(readCharArray(__dirname, inputFile()))
const startPosition = maze.entries().find(([_, value]) => value === "S")[0]
const endPosition = maze.entries().find(([_, value]) => value === "E")[0]

interface State {
  position: Vector2,
  direction: Vector2
}

const findLowestScore = (costs: HashMap<State, number>): number => costs.entries()
  .filter(([{ position }]) => position.equals(endPosition))
  .map(([_, cost]) => cost)
  .reduce(min)

const findSpacesOnBestPath = (costs: HashMap<State, number>): number => {
  const goodSeats = new VectorSet([endPosition])

  const lowestScore = findLowestScore(costs)
  const endStates = costs.entries()
    .filter(([{ position }, score]) =>
      position.equals(endPosition) && score === lowestScore)
    .map(([state]) => state)
  
  const updates = new Queue<State>()
  endStates.forEach(endState => updates.add(endState))

  while (updates.hasNext()) {
    const { position, direction } = updates.receive()
    const score = costs.get({ position, direction })

    const previousStates: { state: State, delta: number }[] = [
      { state: { position, direction: direction.rotateLeft() }, delta: 1000 },
      { state: { position, direction: direction.rotateRight() }, delta: 1000 },
      ...(maze.get(position.subtract(direction)) !== "#"
        ? [{ state: { position: position.subtract(direction), direction }, delta: 1 }]
        : []
      )
    ]

    previousStates.forEach(({ state, delta }) => {
      if (costs.get(state) === score - delta) {
        updates.add(state)
        goodSeats.add(state.position)
      }
    })
  }    

  return goodSeats.size
}

const costs = findLowestCosts<State>(
  (state: State) => JSON.stringify(state),
  { position: startPosition, direction: Vector2.RIGHT },
  (from: State, to: State) => from.direction.equals(to.direction) ? 1 : 1000,
  ({ position, direction }: State) => [
    { position, direction: direction.rotateRight() },
    { position, direction: direction.rotateLeft() },
    ...(maze.get(position.add(direction)) !== "#"
      ? [{ position: position.add(direction), direction }]
      : []
    )
  ]
)
console.log("(P1): ", findLowestScore(costs))
console.log("(P2): ", findSpacesOnBestPath(costs))
