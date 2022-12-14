
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