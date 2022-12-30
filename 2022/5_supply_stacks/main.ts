import readParagraphs from "../../utils/readParagraphs"

const INPUT_NAME = "input.txt"

function partOne() {
  const [startState, commands] = parse()

  const endState = commands.reduce(applyCommand, startState)
  const answer = endState.map(column => column[0]).join("")

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const [startState, commands] = parse()

  const endState = commands.reduce(applyCommand9001, startState)
  const answer = endState.map(column => column[0]).join("")

  console.log("(P2) Answer: " + answer)
}

type Command = { amount: number, from: number, to: number }
type Stack =  string[][] // 0 index = top of stack

function parse(): [Stack, Command[]] {
  const [startStateStrings, commandStrings] = readParagraphs(__dirname, INPUT_NAME)
  const startState = parseStack(startStateStrings)
  const commands = commandStrings.map(parseCommand)
  return [startState, commands]
}

const parseStack = (lines: string[]): Stack => {
  const numberOfStacks = (lines[0].length + 1) / 4
  var stack: Stack = []
  for (var i = 0; i < numberOfStacks; i++) {
    var index = 4 * i + 1
    stack[i] = lines
      .slice(0, lines.length - 1)
      .map(line => line[index])
      .filter(entry => entry.trim())
  }
  return stack
}

const parseCommand = (line: string): Command => {
  const [/*move*/ , amount, /*from*/ , from, /*to*/ , to] = line.split(" ")
  return { amount: parseInt(amount), from: parseInt(from) - 1, to: parseInt(to) - 1 }
}

const applyCommand = (stack: Stack, { amount, from, to }: Command): Stack => {
  stack[to] = [...stack[from].slice(0, amount).reverse(), ...stack[to]]
  stack[from] = stack[from].slice(amount)
  
  return stack
}

const applyCommand9001 = (stack: Stack, { amount, from, to }: Command): Stack => {
  stack[to] = [...stack[from].slice(0, amount), ...stack[to]]
  stack[from] = stack[from].slice(amount)
  
  return stack
}

partOne()
partTwo()
