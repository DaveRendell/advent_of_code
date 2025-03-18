import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0].split(" ").map(Number)

interface Node {
  children: Node[]
  metadata: number[]
  dataLength: number
  value: number
}

let metadataSum = 0

const parseNode = (data: number[]): Node => {
  const childCount = data[0]
  const metadataCount = data[1]

  const remainingData = data.slice(2)
  const children: Node[] = []
  for (let i = 0; i < childCount; i++) {
    const child = parseNode(remainingData)
    children.push(child)
    remainingData.splice(0, child.dataLength)
  }

  const metadata = remainingData.slice(0, metadataCount)

  metadata.forEach(value => metadataSum += value)

  const childValues = children.map(node => node.value)
  const value = childCount === 0
    ? metadata.reduce(sum, 0)
    : metadata.map(index => childValues[index - 1] || 0).reduce(sum)

  const dataLength = 2 + children.map(child => child.dataLength).reduce(sum, 0) + metadataCount
  return { children, metadata, dataLength, value }
}

const root = parseNode(input)

console.log("(P1): ", metadataSum)

console.log("(P2): ", root.value)