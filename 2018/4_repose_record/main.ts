import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { descendingBy } from "../../utils/sorters"
import { max, sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile()).sort()

const data: number[][] = []

let currentGuard: number
let startMinute: number
input.forEach(line => {
  if (line.includes("begins shift")) {
    currentGuard = Number(line.split(" ")[3].slice(1))
    if (!data[currentGuard]) { data[currentGuard] = [] }
  } else if (line.includes("falls asleep")) {
    startMinute = Number(line.split(" ")[1].split(":")[1].slice(0, -1))

  } else if (line.includes("wakes up")) {
    const endMinute = Number(line.split(" ")[1].split(":")[1].slice(0, -1))
    for (let i = startMinute; i < endMinute; i++) {
      data[currentGuard][i]
        ? data[currentGuard][i]++
        : data[currentGuard][i] = 1
    }
  }
})

const sleepiestGuardId = data.map((_, i) => i)
  .sort(descendingBy(i => data[i].reduce(sum, 0)))
  .at(0)

const sleepiestMinute = data[sleepiestGuardId].map((_, i) => i)
  .sort(descendingBy(i => data[sleepiestGuardId][i]))
  .at(0)

console.log("(P1): ", sleepiestGuardId * sleepiestMinute)

const sleepiestGuardMinute = data.flat().reduce(max)
const bestGuard = data.findIndex(log => log && log.includes(sleepiestGuardMinute))
const bestMinute = data[bestGuard].findIndex(m => m === sleepiestGuardMinute)

console.log("(P2): ", bestGuard * bestMinute)