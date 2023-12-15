import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const connections: number[][] = readLines(__dirname, inputFile())
  .map(line => line.split(" <-> ")[1].split(", ").map(s => parseInt(s)))

const floodFill = (start: number): number[] => {
  const area = new Set([start])
  let edges = [start]

  while (edges.length > 0) {
    const newEdges = []
    edges.flatMap(edge => connections[edge]).forEach(newEdge => {
      if (!area.has(newEdge)) {
        newEdges.push(newEdge)
        area.add(newEdge)
      }
    })
    edges = newEdges
  }

  return [...area]
}

console.log("(P1): " + floodFill(0).length)

let groups = 0
let grouped: Set<number> = new Set()

for (let i = 0; i < connections.length; i++) {
  if (!grouped.has(i)) {
    floodFill(i).forEach(x => grouped.add(x))
    groups++
  }
}

console.log("(P2): " + groups)