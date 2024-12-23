import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import memoise from "../../utils/memoise"

const connections: Record<string, string[]> = readLines(__dirname, inputFile())
  .map(line => line.split("-"))
  .reduce((acc, [a, b]) => {
    if (!acc[a]) { acc[a] = [] }
    if (!acc[b]) { acc[b] = [] }
    acc[a].push(b)
    acc[b].push(a)
    return acc
  }, {})

const findGroupsOfSize = memoise((connectionMap: Record<string, string[]>, size: number): Set<string> => {
  if (size === 1) { return new Set(Object.keys(connectionMap)) }
  return new Set(Object.keys(connectionMap)
    .flatMap(pc1 => {
      const newConnectionMap = Object.fromEntries(Object.entries(connectionMap)
        .filter(([pc2]) => connectionMap[pc1].includes(pc2))
        .map(([pc2, pc2Connections]) => [pc2, pc2Connections.filter(pc => pc !== pc1)]))
      const subGroups = [...findGroupsOfSize(newConnectionMap, size - 1)].map(group => group.split(","))
      return subGroups.map(subGroup => [pc1, ...subGroup].sort().join(","))
    })
  )
}, new Map<string, Set<string>>)

const possibleParties = [...findGroupsOfSize(connections, 3)]
  .filter(party => party.split(",").some(pc => pc.startsWith("t")))

console.log("(P1): ", possibleParties.length)

// Every PC has 13 connections, so guessing the biggest group has 13 PCs in...
console.log("(P2): ", [...findGroupsOfSize(connections, 13)][0])
