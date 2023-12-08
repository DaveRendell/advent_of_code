import inputFile from "../../utils/inputFile"
import { lcm } from "../../utils/numbers"
import readParagraphs from "../../utils/readParagraphs"

const [[directions], input] = readParagraphs(__dirname, inputFile())

interface Node { L: string, R: string }

const network: { [name: string]: Node } = Object.fromEntries(input.map(line => 
  [line.slice(0, 3), { L: line.slice(7, 10), R: line.slice(12, 15) }]
))

const solveForStart = (part: number) => (start: string) => {
  let position = start
  let steps = 0
  while (part === 1 ? position !== "ZZZ" : !position.endsWith("Z")) {
    const direction = directions[steps++ % directions.length]
    position = network[position][direction]
  }
  return steps
}

const p2 = Object.keys(network)
  .filter(node => node.endsWith("A"))
  .reduce((multiple, startNode) =>
    lcm(multiple, solveForStart(2)(startNode)), 1)

console.log("(P1): " + solveForStart(1)("AAA"))
console.log("(P2): " + p2)