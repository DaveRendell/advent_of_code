import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile()).join("")

const mulRegex = /mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/g

const matches = [...input.matchAll(mulRegex)]

const uncorruptedSum = matches
  .map(({ groups: { a, b } }) => parseInt(a) * parseInt(b))
  .reduce(sum)

console.log("(P1): ", uncorruptedSum)

const conditionalRegex = /mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)|do\(\)|don't\(\)/g

let mulEnabled = true
let match: RegExpExecArray
let conditionalSum = 0

while ((match = conditionalRegex.exec(input)) !== null) {
  if (match[0] === "do()") { mulEnabled = true }
  else if (match[0] === "don't()") { mulEnabled = false }
  else if (mulEnabled) {
    const { a, b } = match.groups
    conditionalSum += parseInt(a) * parseInt(b)
  }
}


console.log("(P2): ", conditionalSum)