import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import Counter from "../../utils/counter"
import Vector2 from "../../utils/vector2"

const claims = readNumbersFromLines(__dirname, inputFile())

const squareCount = new Counter<string>()

claims.forEach(([_, x, y, width, height]) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = new Vector2(x + i, y + j).toString()
      squareCount.increment(key, 1)
    }
  }
})

console.log("(P1): ", squareCount.entries().filter(([_, count]) => count > 1).length)

const nonOverlappingId = claims.find(([_, x, y, width, height]) => {
  let hasOverlap = false
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = new Vector2(x + i, y + j).toString()
      if (squareCount.get(key) > 1) { hasOverlap = true }
    }
  }
  return !hasOverlap
})[0]

console.log("(P2): ", nonOverlappingId)