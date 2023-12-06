import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { product } from "../../utils/reducers"

const [times, distances] = readLines(__dirname, inputFile())
  .map(line => line.split(": ")[1].split(" ").filter(Boolean).map(s => parseInt(s)))

const getNumberOfWins = (time: number, distance: number): number => {
  // let x be time waiting
  // distance travelled is x * (time - x) = time*x - x^2
  // Need tx - x^2 > d
  // x^2 - tx + d < 0 
  // Replace d with d + 1 to avoid a draw
  const root1 = Math.floor((time + Math.sqrt(time * time - 4 * (distance + 1))) / 2)
  const root2 = Math.ceil((time - Math.sqrt(time * time - 4 * (distance + 1))) / 2)
  return 1 + root1 - root2
}

const p1Answer = times
  .map((time, i) => getNumberOfWins(time, distances[i]))
  .reduce(product)

console.log("(P1): " + p1Answer)

const time = parseInt(times.map(t => t.toString()).join(""))
const distance = parseInt(distances.map(d => d.toString()).join(""))

console.log("(P2): " + getNumberOfWins(time, distance))