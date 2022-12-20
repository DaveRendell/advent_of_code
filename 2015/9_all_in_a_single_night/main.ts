import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import Queue from "../../utils/queue"

type DistanceRow = Record<string, number>
type DistanceTable = Record<string, DistanceRow>
type Route = { visited: string[], distance: number }

const distanceTable = readLines(__dirname, inputFile())
  .map(line => line.split(" = ").map(x => x.split(" to ")).flat())
  .reduce((distances: DistanceTable, [a, b, dist]) => ({
    ...distances,
    [a]: distances[a] ? { ...distances[a], [b]: parseInt(dist) } : { [b]: parseInt(dist) },
    [b]: distances[b] ? { ...distances[b], [a]: parseInt(dist) } : { [a]: parseInt(dist) },
  }), {})
const locations = Object.keys(distanceTable)

let shortestDistance = Infinity
let longestDistance = 0

let queue = new Queue<Route>()
locations.forEach(location =>
  queue.add({ visited: [location], distance: 0 }))

while (queue.hasNext()) {
  const { visited, distance } = queue.receive()
  const location = visited.at(-1)
  const yetToVisit = locations.filter(l => !visited.includes(l))

  if (yetToVisit.length === 0) {
    if (distance < shortestDistance) {
      shortestDistance = distance
    }
    if (distance > longestDistance) {
      longestDistance = distance
    }
  }

  yetToVisit.forEach(newLocation => queue.add({
    visited: [...visited, newLocation],
    distance: distance + distanceTable[location][newLocation]
  }))
}

console.log("(P1): " + shortestDistance)
console.log("(P2): " + longestDistance)
