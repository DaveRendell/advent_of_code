import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { positiveMod, range } from "../../utils/numbers"

const LIST_SIZE = 5

const lengths = readLines(__dirname, inputFile())[0].split(", ").map(l => parseInt(l))

let list = range(0, LIST_SIZE).join("")
let position = 0
let skipSize = 0

lengths.forEach(length => {
  console.log("position", position)
  const doubleList = list + list
  const twistSegment = doubleList.slice(position, position + length)
  console.log("twist segment", twistSegment)
  const reversed = twistSegment.split("").reverse().join("")
  console.log("reversed", reversed)
  const inserted = doubleList.split("")
  inserted.splice(position, length, ...reversed.split(""))
  const doubleFinal = inserted.join("")
  console.log("spliced", doubleFinal)

  const deDupedA = doubleFinal.slice(list.length, list.length + Math.max(0, 1 + (position + length) - list.length))
  const deDupedB = doubleFinal.slice(position, list.length)
  console.log(deDupedA)
  console.log(deDupedB)
  list = deDupedA + deDupedB
  console.log("Final", list)
  console.log("----")
  position = positiveMod(position + length + skipSize++, list.length)
})

console.log("(P1): " + 0)

console.log("(P2): " + 0)