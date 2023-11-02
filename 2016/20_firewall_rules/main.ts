import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { ascending } from "../../utils/sorters"

const rules = readLines(__dirname, inputFile())
  .map(line => line.split("-").map(x => parseInt(x)))
  .sort(([l1], [l2]) => ascending(l1, l2))

function findLowestAllowed(): number {
  let i = 0
  let rule = rules[0]
  while (rule) {
    i = rule[1] + 1
    rule = rules.find(([l, h]) => l <= i && i <= h)
  }
  return i
}

function countAllowedIps(): number {
  let i = 0
  let disallowed = 0
  let rule = rules[0]

  while (rule) {
    let [l, h] = rule
    if (l <= i) {
      disallowed += (h + 1) - i
      i = h + 1
      rule = rules.find(([_, h]) => i <= h)
    } else { i = l }
  }

  return 4294967296 - disallowed
}

console.log("(P1): " + findLowestAllowed())

console.log("(P2): " + countAllowedIps())