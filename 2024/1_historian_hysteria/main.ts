import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const list1 = input.map(line => Number(line.split("   ")[0]))
const list2 = input.map(line => Number(line.split("   ")[1]))

const sortedList1 = list1.sort()
const sortedList2 = list2.sort()

const diffs = sortedList1.map((x, i) => Math.abs(x - sortedList2[i]))

console.log("(P1): ", diffs.reduce(sum))

const counts = list1.map(x => x * list2.filter(y => y === x).length)

console.log("(P2): ", counts.reduce(sum))
