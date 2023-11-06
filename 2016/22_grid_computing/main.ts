import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { chunks } from "../../utils/reducers"
import HashSet from "../../utils/hashset"

const input = readLines(__dirname, inputFile())

interface Node { x: number, y: number, size: number, used: number }

const parse = (line: string): Node => ({
  x: parseInt(line.split(" ")[0].split("-")[1].slice(1)),
  y: parseInt(line.split(" ")[0].split("-")[2].slice(1)),
  size: parseInt(line.slice(23, 28)),
  used: parseInt(line.slice(29, 34)),
})

const nodes = input.map(parse)

let pairs: [Node, Node][] = []
for (let i = 0; i < nodes.length; i++) {
  let nodeA = nodes[i]
  for (let j = 0; j < nodes.length; j++) {
    let nodeB = nodes[j]
    if (i !== j) {
      if (nodeA.used !== 0 && (nodeB.size - nodeB.used) > nodeA.used ) { pairs.push([nodeA, nodeB]) }
    }
  }
}

console.log("(P1): " + pairs.length)

// Take lead from sample and simplfy to sliding block puzzle with fixed nodes
let slidingPuzzle: string[][] = nodes.reduce(chunks(25), [[]])
  .map(row => row.map(node => node.used === 0 ? "_" : node.used > 150 ? "#" : "."))

slidingPuzzle[36][0] = "G"

const hash = (puzzle: string[][]) => puzzle.map((row, i) =>  `${i}: ` + row.join(" ")).join("\n")

console.log(hash(slidingPuzzle))

// Wall at y = 7, from x > 13
// _ starts at x = 35 y = 18

// Get _ to above G
const moveToPosition = (35 - 13) + 18 + (35 - 13)
// Takes 5 moves to shuffle G up one. First move up only takes 1 though as we're
// already in position.
const shuffleUp = 1 + 35 * 5

console.log("(P2): " + (moveToPosition + shuffleUp))