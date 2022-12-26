import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max } from "../../utils/reducers"

type HappinessRow = Record<string, number>
type HappinessTable = Record<string, HappinessRow>

const parseHappiness = (table: HappinessTable, line: string): HappinessTable => {
  const [name1,,sign,amountString,,,,,,,name2] = line.split(" ")
  const amount = (sign === "gain" ? 1 : -1 ) * parseInt(amountString)
  if (table[name1] === undefined) { table[name1] = {} }
  table[name1][name2.slice(0, -1)] = amount
  return table
}

const input = readLines(__dirname, inputFile())
  .reduce(parseHappiness, {})

const names = Object.keys(input)

const maxHappiness = (
  table: HappinessTable,
  start: string,
  end: string,
  remaining: string[]
): number => {
  if (remaining.length === 0) {
    return table[start][end] + table[end][start]
  }
  return remaining
    .map(next =>
      table[end][next] + table[next][end]
        + maxHappiness(table, start, next, remaining.filter(x => x !== next)))
    .reduce(max)
}


console.log("(P1): " + maxHappiness(input, names[0], names[0], names.slice(1)))

names.forEach(name => input[name]["me"] = 0)
input["me"] = Object.fromEntries(names.map(name => [name, 0]))
console.log(JSON.stringify(input, null, 2))

console.log("(P2): " + maxHappiness(input, "me", "me", names))