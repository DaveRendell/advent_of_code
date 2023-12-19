import inputFile from "../../utils/inputFile"
import { Range } from "../../utils/range"
import readParagraphs from "../../utils/readParagraphs"
import { product, sum } from "../../utils/reducers"

type Part = { [category: string]: number }
interface Rule {
  passRange: Range,
  failRange: Range,
  destination: string,
  category: string,
}
type Workflow = Rule[]

const input = readParagraphs(__dirname, inputFile())

const parseRule = (ruleString: string): Rule => {
  if (ruleString.includes(">")) {
    const discriminant = parseInt(ruleString.split(">")[1]) + 1
    return {
      destination: ruleString.split(":")[1],
      category: ruleString[0],
      passRange: new Range(discriminant, Infinity),
      failRange: new Range(-Infinity, discriminant),
    }
  }
  if (ruleString.includes("<")) {
    const discriminant = parseInt(ruleString.split("<")[1])
    return {
      destination: ruleString.split(":")[1],
      category: ruleString[0],
      passRange: new Range(-Infinity, discriminant),
      failRange: new Range(discriminant, Infinity),
    }
  }
  return {
    destination: ruleString,
    category: "x",
    passRange: new Range(-Infinity, Infinity),
    failRange: new Range(Infinity, Infinity),
  }
}

const workflows: { [name: string]: Workflow } = Object.fromEntries(
  input[0].map(line => {
    const [name, ruleList] = line.slice(0, -1).split("{")
    const rules = ruleList.split(",").map(parseRule)
    return [name, rules]
  })
)

const parts: Part[] = input[1].map(line =>
  Object.fromEntries(line.slice(1, -1)
    .split(",")
    .map(categoryString => {
      const name = categoryString.split("=")[0]
      const value = parseInt(categoryString.split("=")[1])
      return [name, value]
    })))

type Possibility = {
  [category: string]: Range
}

const start: Possibility = {
  "x": new Range(1, 4001),
  "m": new Range(1, 4001),
  "a": new Range(1, 4001),
  "s": new Range(1, 4001),
}

const intersectPossibility = (
  possibility: Possibility, intersectCategory: string, intersectRange: Range
): Possibility => Object.fromEntries(Object.entries(possibility)
  .map(([category, range]) =>
    category == intersectCategory
      ? [category, range.intersect(intersectRange)]
      : [category, range.copy()]
  ))

const apply = (workflowName: string, possibility: Possibility): Possibility[] => {
  let remainder = possibility
  const successes: Possibility[] = []
  for (let rule of workflows[workflowName]) {
    const passedPossibility = intersectPossibility(remainder, rule.category, rule.passRange)

    if (rule.destination == "A") {
      successes.push(passedPossibility)
    } else if (rule.destination != "R") {
      apply(rule.destination, passedPossibility).forEach(p => successes.push(p))
    }
    
    remainder = intersectPossibility(remainder, rule.category, rule.failRange)
  }
  return successes
}

const size = (possibility: Possibility): number =>
  Object.values(possibility).map(range => range.length).reduce(product)

const allowsPart = (part: Part) => (possibility: Possibility): boolean =>
  Object.entries(possibility)
    .every(([category, range]) => range.contains(part[category]))

const allowedPossibilities = apply("in", start)

console.log("(P1): ", parts
  .filter(part => allowedPossibilities.some(allowsPart(part)))
  .flatMap(part => Object.values(part))
  .reduce(sum, 0))

console.log("(P2): ", allowedPossibilities.map(size).reduce(sum))