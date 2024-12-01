import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { ascendingBy, descendingBy } from "../../utils/sorters"
import { sum } from "../../utils/reducers"

type NodeMap = Record<string, string[]> 

const input = readLines(__dirname, inputFile())

const nodeMap: NodeMap = {}
input.forEach(line => {
  const [name, connectionString] = line.split(": ")
  const connections = connectionString.split(" ")
  nodeMap[name] = nodeMap[name] === undefined ? connections : nodeMap[name].concat(connections)
  connections.forEach(connection =>
    nodeMap[connection] = nodeMap[connection] === undefined ? [name] : [...nodeMap[connection], name])
})

const left: Set<string> = new Set(Object.keys(nodeMap))
const nodeCount = left.size

const right = () => new Set(Object.keys(nodeMap).filter(name => !left.has(name)))

const externalConnections = (node: string): number =>
  nodeMap[node].filter(connection => !left.has(connection)).length

const mostExternalNode = (): string =>
  [...left].sort(descendingBy(externalConnections))[0]

const allExternalConnections = (): number =>
  [...left].map(externalConnections).reduce(sum)

while (allExternalConnections() !== 3) {
  left.delete(mostExternalNode())
}

console.log("(P1): ", [left.size, nodeCount - left.size, left.size * (nodeCount - left.size)])

console.log("(P2): ", 0)