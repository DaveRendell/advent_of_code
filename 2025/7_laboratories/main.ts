import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import { ascendingBy } from "../../utils/sorters"
import Vector2, { VectorMap } from "../../utils/vector2"

const input = readCharArray(__dirname, inputFile())
const map = VectorMap.fromGrid(input)

const originalStart = new Vector2((input[0].length - 1) / 2, 0)

let splitCounter = 0
const cache = new VectorMap<number>()
let debugMap: VectorMap<number> = new VectorMap<number>()

const fireBeam = (startPoint: Vector2): number => {
  if (cache.has(startPoint)) {
    return cache.get(startPoint)
  }
  let pointer = startPoint.add(Vector2.DOWN)

  loop:
  while (map.has(pointer)) {
    const oldValue = map.get(pointer)
  
    switch (oldValue) {
      case "|": 
      case ".": {
        map.set(pointer, "|")
        pointer = pointer.add(Vector2.DOWN)
        if (!map.has(pointer)) {
          cache.set(startPoint, 1)
          return 1
        }
        continue
      }
      case "^": {
        splitCounter++
        if (map)
        map.set(pointer.add(Vector2.LEFT), "|")
        const leftTimelines = fireBeam(pointer.add(Vector2.LEFT))
        map.set(pointer.add(Vector2.RIGHT), "|")
        const rightTimelines = fireBeam(pointer.add(Vector2.RIGHT))
        
        debugMap.set(pointer, leftTimelines + rightTimelines)
        cache.set(startPoint, leftTimelines + rightTimelines)
        return leftTimelines + rightTimelines
      }
    }
  }
  throw new Error()
}

const timelineCounter = fireBeam(originalStart)
map.draw().forEach((line, y) => {
  console.log(line, debugMap.keys().filter(v => v.y === y).sort(ascendingBy(v => v.x)).map(k => debugMap.get(k)))
})
console.log(splitCounter)

console.log("(P1): ", splitCounter)
console.log("(P2): ", timelineCounter) //6, 8