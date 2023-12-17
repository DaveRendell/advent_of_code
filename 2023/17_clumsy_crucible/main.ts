import HashMap from "../../utils/hashmap"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import Queue from "../../utils/queue"
import readDigitGrid from "../../utils/readDigitGrid"
import Vector2 from "../../utils/vector2"

const costMap = readDigitGrid(__dirname, inputFile())
const width = costMap[0].length
const height = costMap.length
const directions = [Vector2.RIGHT, Vector2.DOWN, Vector2.UP, Vector2.LEFT]

interface State { position: Vector2, lastDirection: Vector2 }

const startState = {position: new Vector2(0, 0), lastDirection: undefined }
const end = new Vector2(width - 1, height - 1)

const serialise = (state: State) =>
  `{${state.position.toString()},${state.lastDirection?.toString()}`

function findLowestCost(minMomentum: number, maxMomentum: number): number {
  const updates: Queue<State> = new Queue()
  
  updates.add(startState)
  const costs = new HashMap<State, number>(serialise, [[startState, 0]])
  while (updates.hasNext()) {
    const update = updates.receive()
    directionLoop:
    for (let direction of directions) {
      if (update.lastDirection && direction.equals(update.lastDirection)) { continue }

      if (update.lastDirection && direction.equals(update.lastDirection.scale(-1))) { continue }

      let nextCost = costs.get(update)
      for (let length of range(1, maxMomentum + 1)) {
        const next = update.position.add(direction.scale(length))
        if (!next.inBounds(0, width - 1, 0, height - 1)) { continue directionLoop }
        nextCost += costMap[next.y][next.x]

        if (length < minMomentum) { continue }

        const nextState: State = { position: next, lastDirection: direction }
        
        if (nextCost < (costs.get(nextState) || Infinity)) {
          costs.set(nextState, nextCost)
          updates.add(nextState)
        }
      }
    }
  }
  return Math.min(
    costs.get({ position: end, lastDirection: Vector2.DOWN }),
    costs.get({ position: end, lastDirection: Vector2.RIGHT })
  )
}

console.log("(P1): " + findLowestCost(0, 3))
console.log("(P1): " + findLowestCost(4, 10))