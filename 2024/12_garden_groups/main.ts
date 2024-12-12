import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"
import Queue from "../../utils/queue"
import { sum } from "../../utils/reducers"
import HashSet from "../../utils/hashset"

const plots = VectorMap.fromGrid(readCharArray(__dirname, inputFile()))

const regions: VectorSet[] = []

plots.keys().forEach(plot => {
  if (regions.some(region => region.has(plot))) {
    return
  }

  const crop = plots.get(plot)
  const region = new VectorSet([plot])
  const newPlots = new Queue<Vector2>()
  newPlots.add(plot)

  while (newPlots.hasNext()) {
    const next = newPlots.receive()
    next.neighbours4()
      .filter(neighbour => plots.has(neighbour))
      .filter(neighbour => plots.get(neighbour) === crop)
      .filter(neighbour => !region.has(neighbour))
      .forEach(neighbour => {
        region.add(neighbour)
        newPlots.add(neighbour)
      })
  }

  regions.push(region)
})

const price = (region: VectorSet): number => {
  const area = region.size
  const perimeter = region.entries()
    .map(plot => 
      plot.neighbours4()
        .filter(neighbour => plots.get(neighbour) !== plots.get(plot))
        .length)
    .reduce(sum)
  return area * perimeter
}

console.log("(P1): ", regions.map(price).reduce(sum))

const discountPrice = (region: VectorSet): number => {
  const area = region.size
  const sides: Vector2[][][] = [] // [interior, exterior]

  region.entries()
    .map(plot =>
      plot.neighbours4()
        .filter(neighbour => plots.get(neighbour) !== plots.get(plot))
        .forEach(neighbour => {
          const isNewSide = sides.every(side =>
            side.every(([interior, exterior]) =>
              !interior.equals(plot) || !exterior.equals(neighbour)))
          if (isNewSide) {
            const crop = plots.get(plot)
            const side = [[plot, neighbour]]

            const walkInDirection = (direction) => {
              let interiorPosition = plot.add(direction)
              let exteriorPosition = neighbour.add(direction)
              while (
                plots.get(interiorPosition) === crop
                && plots.get(exteriorPosition) !== crop
              ) {
                side.push([interiorPosition, exteriorPosition])
                interiorPosition = interiorPosition.add(direction)
                exteriorPosition = exteriorPosition.add(direction)
              }
            }

            walkInDirection(neighbour.subtract(plot).rotateLeft())
            walkInDirection(neighbour.subtract(plot).rotateRight())
            sides.push(side)
          }
        })
    )
  return area * sides.length
}

console.log("(P2): ", regions.map(discountPrice).reduce(sum))
