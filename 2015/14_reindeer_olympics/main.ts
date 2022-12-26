import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max } from "../../utils/reducers"
import { range } from "../../utils/numbers"

interface Reindeer {
  speed: number, duration: number, rest: number
}

const parse = (line: string): Reindeer => {
  const values = line.split(" ").map(v => parseInt(v))
  const [,,, speed,,, duration,,,,,,, rest] = values
  return { speed, duration, rest }
}

const reindeer = readLines(__dirname, inputFile()).map(parse)

const distanceAfter = (time: number) =>
  ({speed, duration, rest}: Reindeer) => {
    const cycles = Math.floor(time / (duration + rest))
    const cycleDistance = speed * duration
    const remainder = Math.min(time % (duration + rest), duration)
    return cycles * cycleDistance + remainder * speed
  }

console.log("(P1): " + reindeer.map(distanceAfter(2503)).reduce(max))

const scores = range(0, reindeer.length).map(() => 0)
const distances = range(0, reindeer.length).map(() => 0)

for (let t = 0; t < 2503; t++) {
  reindeer.forEach(({speed, duration, rest}, i) => {
    if ((t % (duration + rest) < duration)) {
      distances[i] += speed
    }
  })
  const lead = distances.reduce(max)
  distances.forEach((d, i) => {
    if (d === lead) {
      scores[i]++
    }
  })
}

console.log("(P2): " + scores.reduce(max))