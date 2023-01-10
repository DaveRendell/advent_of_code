import HashMap from "../../utils/hashmap"
import HashSet from "../../utils/hashset"
import Queue from "../../utils/queue"
import Vector2 from "../../utils/vector2"

const favouriteNumber = process.argv[2] === "sample" ? 10 : 1352
const destination = process.argv[2] === "sample"
  ? new Vector2(7, 4) : new Vector2(31, 39)

const memos = new HashMap<Vector2, boolean>(v => v.toString(), [])

const isOpenSpace = (position: Vector2): boolean => {
  if (memos.has(position)) { return memos.get(position) }
  const { x, y } = position
  const expression = x*x + 3*x + 2*x*y + y + y*y + favouriteNumber
  const isOpen = expression
    .toString(2)
    .split("")
    .filter(d => d === "1")
    .length % 2 === 0
  memos.set(position, isOpen)
  return isOpen
}

const findShortestPathBetween = (start: Vector2, end: Vector2): number => {
  const quickest = new HashMap<Vector2, number>(v => v.toString(), [[start, 0]])
  let currentBest = Infinity
  let todo = new Queue<Vector2>()
  todo.add(start)

  while (todo.hasNext()) {
    const position = todo.receive()
    const steps = quickest.get(position)
    if (steps >= currentBest) { continue }
    if (position.equals(end)) { currentBest = steps }
    position.neighbours4(0, Infinity, 0, Infinity)
      .filter(isOpenSpace)
      .filter(next => !quickest.has(next) || quickest.get(next) > steps + 1)
      .forEach(next => {
        todo.add(next)
        quickest.set(next, steps + 1)
      })
  }

  return currentBest
}

console.log("(P1): " + findShortestPathBetween(new Vector2(1, 1), destination))

const countLocationsWithin = (range: number, start: Vector2): number => {
  const visited = new HashSet<Vector2>(v => v.toString(), [start])

  for (let step = 0; step < range; step++) {
    visited.entries()
      .flatMap(position => position.neighbours4(0, Infinity, 0, Infinity))
      .filter(isOpenSpace)
      .forEach(position => visited.add(position))
  }

  return visited.size
}

console.log("(P2): " + countLocationsWithin(50, new Vector2(1, 1)))