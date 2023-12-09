import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())
  .map(line => line.split(" ").map(s => parseInt(s)))

const extrapolate = (sequence: number[]): number[] => {
  const layers = [sequence.slice()]
  while (!layers.at(-1).every(x => x == 0)) { // Create difference layers
    const last = layers.at(-1)
    const next = last.slice(0, -1).map((_, i) => last[i + 1] - last[i])
    layers.push(next)
  }
  for (let i = layers.length - 2; i >= 0; i--) { // Extrapolate ->
    const increment = layers[i + 1].at(-1)
    layers[i].push(layers[i].at(-1) + increment)
  }

  layers.forEach(layer => layer.unshift(0))
  for (let i = layers.length - 2; i >= 0; i--) { // Extrapolate <-
    const decrement = layers[i + 1].at(0)
    layers[i][0] = layers[i][1] - decrement
  }
  
  return layers[0]
}

const extrapolated = input.map(extrapolate)

console.log("(P1): " + extrapolated
  .map(sequence => sequence.at(-1))
  .reduce(sum))

console.log("(P2): " + extrapolated
  .map(sequence => sequence.at(0))
  .reduce(sum))