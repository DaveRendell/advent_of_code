import inputFile from "../utils/inputFile"
import { range } from "../utils/numbers"
import readParagraphs from "../utils/readParagraphs"
import { product } from "../utils/reducers"
import { descending } from "../utils/sorters"

function partTwo() {
  const tests = readParagraphs(__dirname, inputFile()).map(getTest)
  const startMonkeys = readParagraphs(__dirname, inputFile()).map(parseMonkey(tests))

  const endMonkeys = range(0, 10000).reduce((monkeys, _, i) => {
    const result = round(monkeys)
    if ([1, 20].includes(i + 1) || (i + 1) % 1000 === 0) {
      console.log(`\n\n== After round ${i + 1} ==`)
      console.log(printInspections(result))
    }
    return result
  }, startMonkeys)


  console.log("(P2) Answer: " + getMonkeyBusiness(endMonkeys))
}

type Item = { [factor: number]: number }

interface Monkey {
  items: Item[]
  operation: (a: Item, b: Item) => Item,
  operand: Item | "old"
  test: number
  trueTarget: number
  falseTarget: number
  inspections: number
}
const add = (a: Item, b: Item): Item => mergeNumberMaps((x, y) => (x + y))(a, b)
const multiply = (a: Item, b: Item): Item => mergeNumberMaps((x, y) => (x * y))(a, b)

const parseMonkey = (tests: number[]) => (paragraph: string[]): Monkey => ({
  items: paragraph[1].slice(18).split(", ").map(v => generateModMap(tests, parseInt(v))),
  operation: paragraph[2].trimStart().split(" ")[4] === "*" ? multiply : add,
  operand: ((str) => str === "old"? "old" : generateModMap(tests, parseInt(str)))
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
  const testPassItems = worriedItems.filter(item => isDivisibleBy(item, monkey.test))
  const testFailItems = worriedItems.filter(item => !isDivisibleBy(item, monkey.test))

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

const isDivisibleBy = (item: Item, number: number): boolean =>
  item[number] === 0

const printInspections = (monkeys: Monkey[]): string => monkeys
  .map(({inspections}, i) => `Monkey ${i} inspected items ${inspections} times`)
  .join("\n")

const getMonkeyBusiness = (monkeys: Monkey[]): number => monkeys
  .map(monkey => monkey.inspections)
  .sort(descending)
  .slice(0, 2)
  .reduce(product)

const generateModMap = (tests: number[], number: number): Item =>
  Object.fromEntries(tests.map(test => [test, number % test]))

const mergeNumberMaps = (operation: (x: number, y: number) => number) =>
  (a: Item, b: Item) => ({
    ...a,
    ...Object.fromEntries(Object.keys(b).map(key => Object.keys(a).includes(key) ? [key, operation(a[key], b[key]) % parseInt(key)] : [key, b[key]]))
  })

const getTest = (paragraph: string[]): number =>
  paragraph
    .filter(line => line.trimStart().startsWith("Test:"))
    .map(line => parseInt(line.trimStart().split(" ")[3]))[0]
  
partTwo()
