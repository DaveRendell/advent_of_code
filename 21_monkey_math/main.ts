import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"

interface Expression {
  dependencies: string[],
  result: (values: Values) => number
}

type Values = Map<string, number>
type BinOp = (a: number, b: number) => number
type Monkeys = Map<string, Expression[]>

const parseMonkey = (monkeys: Monkeys, line: string): Monkeys => {
  const expressions = parseExpressions(line)
  expressions.forEach(([name, expression]) => 
    monkeys.has(name)
      ? monkeys.get(name).push(expression)
      : monkeys.set(name, [expression]))
  return monkeys
}

const parseExpressions = (line: string): [string, Expression][] => {
  const [name, calc] = line.split(": ")
  const calcWords = calc.split(" ")
  if (calcWords.length === 1) {
    return [[name, { dependencies: [], result: () => parseInt(calc) }]]
  }
  const [left, right] = [calcWords[0], calcWords[2]]

  const binaryOpMonkey = (
    op: BinOp, reverseLeft: BinOp, reverseRight: BinOp
  ): [string, Expression][] => [
    [name, {
      dependencies: [left, right],
      result: (values) => op(values.get(left), values.get(right))
    }],
    [left,  {
      dependencies: [name, right],
      result: (values) => reverseLeft(values.get(name), values.get(right))}],
    [right, {
      dependencies: [name, left],
      result: (values) => reverseRight(values.get(name), values.get(left))}]]

  switch (calcWords[1]) {
    case "+": return binaryOpMonkey(
      (a, b) => a + b,
      (x, b) => x - b,
      (x, a) => x - a)
    case "-": return binaryOpMonkey(
      (a, b) => a - b,
      (x, b) => x + b,
      (x, a) => a - x)
    case "*": return binaryOpMonkey(
      (a, b) => a * b,
      (x, b) => Math.floor(x / b),
      (x, a) => Math.floor(x / a))
    case "/": return binaryOpMonkey(
      (a, b) => Math.floor(a / b),
      (x, b) => x * b,
      (x, a) => Math.floor(a / x))
  }
}

const lines = readLines(__dirname, inputFile())
const monkeys: Monkeys = [
  ...lines,
  lines.find(l => l.startsWith("root"))
    .replaceAll("root", "root2")
    .replaceAll(" + ", " - ")
].reduce(parseMonkey, new Map())

const getValueOf = (name: string, startingValues: Values): number => {
  const values: Values = new Map(startingValues)
  while (!values.has(name)) {
    [...monkeys.keys()]
      .filter(name => !values.has(name))
      .filter(name => monkeys.get(name)
        .some(({ dependencies }) => dependencies
          .every(dep => values.has(dep))))
      .map(name => [name, monkeys.get(name)
        .find(({ dependencies }) => dependencies
          .every(dep => values.has(dep)))] as [string, Expression])
      .filter(([_, monkey]) => monkey !== undefined)
      .forEach(([name, monkey]) => values.set(name, monkey.result(values)))
  }
  return values.get(name)
}

console.log("(P1): " + getValueOf("root", new Map()))

monkeys.set("humn", monkeys.get("humn")
  .filter(({dependencies}) => dependencies.length > 0))

console.log("(P2): " + getValueOf("humn", new Map([["root2", 0]])))
