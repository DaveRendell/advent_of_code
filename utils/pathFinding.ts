import PriorityQueue from "./priorityQueue"
import Queue from "./queue"
import Vector2, { VectorMap } from "./vector2"

type Coordinate = [number, number]

export function findLowestCosts<T>(
  grid: T[][],
  start: Coordinate,
  cost: (from: Coordinate, to: Coordinate) => number
): number[][] {
  const width = grid[0].length
  const height = grid.length
  var costs = grid.map(row => row.map(() => Infinity))
  costs[start[1]][start[0]] = 0
  var updates = [start]

  while(updates.length > 0) {
    var newUpdates: Coordinate[] = []
    for (const [uX, uY] of updates) {
      const uCost = costs[uY][uX]
      const adjacentCells = [[uX - 1, uY], [uX + 1, uY], [uX, uY - 1], [uX, uY + 1]]
        .filter(([i, j]) => i >= 0 && i < width && j >= 0 && j < height)
      for (const [aX, aY] of adjacentCells) {
        const aCost = uCost + cost([uX, uY], [aX, aY])
        if (aCost < costs[aY][aX]) {
          costs[aY][aX] = aCost
          newUpdates.push([aX, aY])
        }
      }
    }
    updates = newUpdates
  }
  return costs
}

export function findLowestCostsVMap<T>(
  start: Vector2,
  cost: (from: Vector2, to: Vector2, fromCost: number) => number,
  neighbours: (position: Vector2) => Vector2[] = (position) => position.neighbours4(),
): VectorMap<number> {
  const costs = new VectorMap<number>([[start, 0]], Infinity)
  const updates = new Queue<Vector2>() //(heuristic)
  updates.add(start)

  while (updates.hasNext()) {
    const update = updates.receive()
    const updateCost = costs.get(update)
    neighbours(update).forEach(neighbour => {
      const newCost = cost(update, neighbour, updateCost)
      const existingCost = costs.get(neighbour)
      if (newCost < existingCost) {
        costs.set(neighbour, newCost)
        updates.add(neighbour)
      }
    })
  }

  return costs
}