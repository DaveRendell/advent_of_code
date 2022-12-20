import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const instructions = [...readLines(__dirname, inputFile())[0]]

const DIRECTIONS = { ">": [1, 0], "<": [-1, 0], "^": [0, -1], "v": [0, 1] }

interface SantaState { x: number, y: number, visited: Set<string> }
const takeDirection = ({ x, y, visited }: SantaState, instruction: string): SantaState => {
  const newX = x + DIRECTIONS[instruction][0]
  const newY = y + DIRECTIONS[instruction][1]
  return { x: newX, y: newY, visited: visited.add(JSON.stringify([newX, newY]))}
}

const getVisited = (instructionList: string[]): Set<string> => instructionList
  .reduce(takeDirection, { x: 0, y: 0, visited: new Set([JSON.stringify([0, 0])])})
  .visited

console.log("(P1): " + getVisited(instructions).size)

const santaInstructions = instructions.filter((_, i) => i % 2 === 0)
const roboInstructions = instructions.filter((_, i) => i % 2 === 1)

const santaVisited = getVisited(santaInstructions)
const roboVisited = getVisited(roboInstructions)
const allVisited = new Set([...santaVisited, ...roboVisited])

console.log("(P2): " + allVisited.size)
