import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"

const [ruleInput, updatesInput] = readParagraphs(__dirname, inputFile())

const rules = ruleInput.map(line => line.split("|").map(page => Number(page)))
const updates = updatesInput.map(line => line.split(",").map(page => Number(page)))

const validateRule = ([left, right]: number[], update: number[]): boolean => {
  const leftIndex = update.findIndex(x => x === left)
  if (leftIndex === -1) { return true }
  const rightIndex = update.findIndex(x => x === right)
  if (rightIndex === -1) { return true }
  return leftIndex < rightIndex
}

const validUpdateSum = updates
  .filter(update => rules.every(rule => validateRule(rule, update)))
  .map(update => update.at((update.length - 1) / 2))
  .reduce(sum)

console.log("(P1): ", validUpdateSum)

const sort = (update: number[], prefix: number[] = []): number[] => {
  if (update.length === 0) { return prefix }
  const updateRules = rules
    .filter(([a, b]) => update.includes(a) && update.includes(b)) 
  const firstElement = update
    .find(page => updateRules.every(([_, b]) => b !== page))

  return sort(update.filter(x => x !== firstElement), [...prefix, firstElement])
}

const invalidUpdateSum = updates
  .filter(update => rules.some(rule => !validateRule(rule, update)))
  .map(update => sort(update))
  .map(update => update.at((update.length - 1) / 2))
  .reduce(sum)

console.log("(P2): ", invalidUpdateSum)