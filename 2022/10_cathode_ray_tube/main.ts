import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import { range } from "../../utils/numbers"

function partOne() {
  const instructions = readLines(__dirname, inputFile())
  const signals = instructions.reduce(runInstruction, [undefined, 1])
  const signalStrengths = signals
    .map((signal, i) => [i, signal])
    .filter(([i]) => (i - 20) % 40 === 0)
    .map(([i, signal]) => i * signal)
  
  console.log("(P1) Answer: " + signalStrengths.reduce(sum))
}

function partTwo() {
  const instructions = readLines(__dirname, inputFile())
  const signals = instructions.reduce(runInstruction, [undefined, 1])

  var screen = range(0, 6).map(rowIdx => range(0, 40).map(pixelIdx => {
    var signal = signals[(40 * rowIdx) + pixelIdx + 1]
    return Math.abs(pixelIdx - signal) <= 1 ? "██" : "  "
  })).map(row => row.join("")).join("\n")

  console.log("(P2) Answer: \n" + screen)
}

const runInstruction = (signals: number[], instruction: string): number[] => {
  const currentSignal = signals.at(-1)
  if (instruction === "noop") { return [...signals, currentSignal] }
  const addition = parseInt(instruction.split(" ")[1])
  return [...signals, currentSignal, currentSignal + addition]
}

partOne()
partTwo()
