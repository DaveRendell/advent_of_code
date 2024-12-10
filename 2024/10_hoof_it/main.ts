import inputFile from "../../utils/inputFile"
import readDigitGrid from "../../utils/readDigitGrid"
import { sum } from "../../utils/reducers"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const topographyMap = VectorMap.fromGrid(readDigitGrid(__dirname, inputFile()))

const trailheads = topographyMap.keys()
  .filter(position => topographyMap.get(position) === 0)

const evaluate = (trailhead: Vector2): { score: number, rating: number } => {
  let trails: Vector2[][] = [[trailhead]]
  let peaks = new VectorSet()
  let rating = 0

  while (trails.length > 0) {
    trails = trails.flatMap(trail => {
      const position = trail.at(-1)
      const altitude = topographyMap.get(position)

      if (altitude === 9) {
        peaks.add(position)
        rating++
        return []
      }

      return position.neighbours4()
        .filter(v => topographyMap.has(v))
        .filter(v => !trail.some(w => w.equals(v)))
        .filter(v => topographyMap.get(v) === altitude + 1)
        .map(v => [...trail, v])
    })
  }

  return { score: peaks.size, rating }
}

const trailheadEvaluations = trailheads.map(evaluate)

console.log("(P1): ", trailheadEvaluations.map(e => e.score).reduce(sum))
console.log("(P2): ", trailheadEvaluations.map(e => e.rating).reduce(sum))
