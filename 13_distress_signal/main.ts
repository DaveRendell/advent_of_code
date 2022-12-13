import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import readParagraphs from "../utils/readParagraphs"
import { sum } from "../utils/reducers"

function partOne() {
  const packetPairs = parse()
  const comparisonResults = packetPairs.map(([p1, p2]) => compare(p1, p2))
  const answer = comparisonResults
    .map((result, index) => result === 1 ? index + 1 : 0)
    .reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const packets = [[[2]], [[6]], ...parse().flat()]
  const sorted = packets.sort(compare).reverse()

  const divider1Index = sorted.findIndex(packet =>
    JSON.stringify(packet) === JSON.stringify([[2]])) + 1
  const divider2Index = sorted.findIndex(packet =>
    JSON.stringify(packet) === JSON.stringify([[6]])) + 1
  
  console.log("(P2) Answer: " + divider1Index * divider2Index)
}

type Packet = number | Packet[]

const parse = () => readParagraphs(__dirname, inputFile())
  .map(paragraph => paragraph.map(line =>
    JSON.parse(line) as Packet))

// 1: correct order, 0 the same, -1 incorrect order
const compare = (left: Packet, right: Packet): number => {
  if (typeof left === "number" && typeof right === "number") {
    return Math.sign(right - left)
  }
  const leftList = typeof left === "number" ? [left] : left
  const rightList = typeof right === "number" ? [right] : right
  const maxLength = Math.max(leftList.length, rightList.length)

  for (let i = 0; i < maxLength; i++) {
    const leftValue = leftList[i]
    const rightValue = rightList[i]
    if (leftValue === undefined) { return 1 }
    if (rightValue === undefined) { return -1 }
    const comparison = compare(leftValue, rightValue)
    if (comparison !== 0) { return comparison }
  }

  return 0
}

partOne()
partTwo()
