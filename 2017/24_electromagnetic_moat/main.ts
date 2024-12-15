import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { max } from "../../utils/reducers"

const components = readNumbersFromLines(__dirname, inputFile())

const getStrongestBridge = (start: number, remaining: number[][]): number => {
  if (remaining.length === 0) { return 0 }
  return remaining
    .map(([a, b], i) => [a, b, i])
    .filter(([a, b, i]) => a === start || b === start)
    .map(([a, b, i]) => {
      if (a === start) { return a + b + getStrongestBridge(b, remaining.filter((_, j) => i !== j)) }
      if (b === start) { return a + b + getStrongestBridge(a, remaining.filter((_, j) => i !== j)) }
    })
    .reduce(max, 0)
}

const getLongestStrongestBridge = (start: number, remaining: number[][]): number[] => { // [length, strength]
  if (remaining.length === 0) { return [0, 0] }
  return remaining
    .map(([a, b], i) => [a, b, i])
    .filter(([a, b, i]) => a === start || b === start)
    .map(([a, b, i]) => {
      const [l, s] = getLongestStrongestBridge(a === start ? b : a, remaining.filter((_, j) => i !== j))
      return [1 + l, a + b + s]
    })
    .reduce(([bestLength, bestStrength], [newLength, newStrength]) => {
      if (
        newLength > bestLength
        || (newLength === bestLength && newStrength > bestStrength)
      ) { return [newLength, newStrength] }
      return [bestLength, bestStrength]
    }, [0, 0])
}

console.log("(P1): ", getStrongestBridge(0, components))
console.log("(P2): ", getLongestStrongestBridge(0, components)[1])