import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

interface Instruction {
  xMin: number, yMin: number,
  xMax: number, yMax: number,
  action: (value: boolean) => boolean
  brightnessAction: (value: number) => number
}

const instructions: Instruction[] = readLines(__dirname, inputFile())
  .map(line => line.split(" "))
  .map(words => ({ ul: words.at(-3), br: words.at(-1), type: words.slice(0, -3).join(" ") }))
  .map(({ul, br, type}) => ({
    xMin: parseInt(ul.split(",")[0]),
    xMax: parseInt(br.split(",")[0]),
    yMin: parseInt(ul.split(",")[1]),
    yMax: parseInt(br.split(",")[1]),
    action: type === "toggle"
      ? (value) => !value
      : () => type === "turn on",
    brightnessAction: type === "toggle"
    ? (value) => value + 2
    : (value) => type === "turn on"
      ? value + 1
      : Math.max(value - 1, 0)
  }))

const startLights = range(0, 1000).map(() => range(0, 1000).map(() => false))

const runInstruction = (
  lights: boolean[][],
  { xMin, xMax, yMin, yMax, action }: Instruction): boolean[][] => {
    range(xMin, xMax + 1).forEach(col =>
      range(yMin, yMax + 1).forEach(row =>
        lights[row][col] = action(lights[row][col])))
    return lights
  }

const activatedLights = instructions.reduce(runInstruction, startLights)
const onLights = activatedLights.flat().filter(x => x).length

console.log("(P1): " + onLights)

const startBrightness = range(0, 1000).map(() => range(0, 1000).map(() => 0))

const runBrightnessInstruction = (
  lights: number[][],
  { xMin, xMax, yMin, yMax, brightnessAction }: Instruction): number[][] => {
    range(xMin, xMax + 1).forEach(col =>
      range(yMin, yMax + 1).forEach(row =>
        lights[row][col] = brightnessAction(lights[row][col])))
    return lights
  }

const brightnesses = instructions.reduce(runBrightnessInstruction, startBrightness)

console.log("(P2): " + brightnesses.flat().reduce(sum))
