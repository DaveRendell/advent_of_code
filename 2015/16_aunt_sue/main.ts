import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

type Aunt = Record<string, number>

const parse = (line: string): Aunt => {
  return Object.fromEntries(
    line.split(" ").slice(2).join(" ")
      .split(", ").map(value => value.split(": "))
      .map(([k, v]) => [k, parseInt(v)]))
}

const aunts = readLines(__dirname, inputFile()).map(parse)
const reference: Aunt = Object.fromEntries(`children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`.split("\n").map(l => l.split(": "))
  .map(([k, v]) => [k, parseInt(v)]))

const gifterId = aunts.findIndex(aunt =>
  Object.entries(aunt).every(([key, value]) =>
    reference[key] === value)) + 1

console.log("(P1): " + gifterId)

const greaterThan = Object.fromEntries(Object.entries(reference)
  .filter(([key]) => ["cats", "trees"].includes(key)))
const lessThan = Object.fromEntries(Object.entries(reference)
  .filter(([key]) => ["pomeranians", "goldfish"].includes(key)))
const equalTo = Object.fromEntries(Object.entries(reference)
  .filter(([key]) => ["children", "samoyeds", "akitas", "vizslas", "cars", "perfumes"].includes(key)))

const realGifterId = aunts.findIndex(aunt =>
  Object.entries(aunt)
    .every(([key, value]) =>
      (greaterThan[key] === undefined || greaterThan[key] < value)
      && (lessThan[key] === undefined || lessThan[key] > value)
      && (equalTo[key] === undefined || equalTo[key] === value))
  ) + 1

console.log("(P2): " + realGifterId)