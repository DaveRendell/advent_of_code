import inputFile from "../utils/inputFile"
import { range } from "../utils/numbers"
import readParagraphs from "../utils/readParagraphs"
import { product } from "../utils/reducers"
import { descending } from "../utils/sorters"

function partOne() {
  const startMonkeys = readParagraphs(__dirname, inputFile()).map(parseMonkey)

  const endMonkeys = range(0, 20).reduce((monkeys) => round(monkeys), startMonkeys)
  console.log(printItemLists(endMonkeys))

  console.log("(P1) Answer: " + getMonkeyBusiness(endMonkeys))
}

function partTwo() {}

interface Monkey {
  items: number[]
  operation: (a: number, b: number) => number,
  operand: number | "old"
  test: number
  trueTarget: number
  falseTarget: number
  inspections: number
}
const add = (a: number, b: number): number => a + b
const multiply = (a: number, b: number): number => a * b

const parseMonkey = (paragraph: string[]): Monkey => ({
  items: paragraph[1].slice(18).split(", ").map(v => parseInt(v)),
  operation: paragraph[2].trimStart().split(" ")[4] === "*" ? multiply : add,
  operand: ((str) => str === "old"? "old" : parseInt(str))
    (paragraph[2].trimStart().split(" ")[5]),
  test: parseInt(paragraph[3].trimStart().split(" ")[3]),
  trueTarget: parseInt(paragraph[4].trimStart().split(" ")[5]),
  falseTarget: parseInt(paragraph[5].trimStart().split(" ")[5]),
  inspections: 0
})

const round = (start: Monkey[]): Monkey[] =>
  start.reduce((monkeys, _, i) => turn(monkeys, i), start)

const turn = (monkeys: Monkey[], monkeyId: number): Monkey[] => {
  const monkey = monkeys[monkeyId]
  const worriedItems = monkey.items.map(item => monkey.operand === "old"
    ? monkey.operation(item, item)
    : monkey.operation(item, monkey.operand))
  const relievedItems = worriedItems.map(item => Math.floor(item / 3))
  const testPassItems = relievedItems.filter(item => item % monkey.test === 0)
  const testFailItems = relievedItems.filter(item => item % monkey.test !== 0)

  return monkeys.map((mon, id) => {
    if (id === monkeyId) {
      return {
        ...monkey,
        items: [],
        inspections: monkey.inspections + monkey.items.length
      }
    }
    if (id === monkey.trueTarget) {
      return {
        ...mon,
        items: [...mon.items, ...testPassItems]
      }
    }
    if (id === monkey.falseTarget) {
      return {
        ...mon,
        items: [...mon.items, ...testFailItems]
      }
    }
    return mon
  })
}

const printItemLists = (monkeys: Monkey[]): string => {
  return monkeys.map((monkey, i) => `Monkey ${i}: ${monkey.items.join(", ")}`).join("\n")
}

const getMonkeyBusiness = (monkeys: Monkey[]): number => monkeys
  .map(monkey => monkey.inspections)
  .sort(descending)
  .slice(0, 2)
  .reduce(product)


partOne()
partTwo()

