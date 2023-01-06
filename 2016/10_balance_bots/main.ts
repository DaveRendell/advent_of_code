import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { descending } from "../../utils/sorters"
import { product } from "../../utils/reducers"

interface Input { value: number, bot: number }
interface BotInstruction {
  index: number
  lowType: string, lowIndex: number,
  highType: string, highIndex: number,
}

const input = readLines(__dirname, inputFile())

const inputs: Input[] = input
  .filter(l => l.startsWith("value"))
  .map(l => l.split(" ").map(v => parseInt(v)))
  .map(v => ({ value: v[1], bot: v[5] }))

const botInstructions: BotInstruction[] = input
  .filter(l => l.startsWith("bot"))
  .map(l => l.split(" "))
  .map(v => ({
    index: parseInt(v[1]),
    lowType: v[5], lowIndex: parseInt(v[6]),
    highType: v[10], highIndex: parseInt(v[11]),
  }))

const testValues = [61, 17]
let result: number

const bots: number[][] = []
const outputs = []

const addToBot = (bot: number, value: number) =>
  bots[bot] = bots[bot] ? [...bots[bot], value] : [value]

inputs.forEach(({ value, bot }) => addToBot(bot, value))

while (bots.some(bot => bot && bot.length == 2)) {
  const i = bots.findIndex(bot => bot && bot.length == 2)
  if (testValues.every(x => bots[i].includes(x))) { result = i }
  const [high, low] = bots[i].sort(descending)
  const { highType, highIndex, lowType, lowIndex } = botInstructions
    .find(({ index }) => index === i)
  
  if (highType === "output") { outputs[highIndex] = high } else { addToBot(highIndex, high) }
  if (lowType === "output") { outputs[lowIndex] = low } else { addToBot(lowIndex, low) }
  bots[i] = []
}

console.log("(P1): " + result)
console.log("(P2): " + outputs.slice(0, 3).reduce(product))