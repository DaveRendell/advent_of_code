import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile()).map(x => parseInt(x))

const stepsUntilEscape = (
  inputJumps: number[],
  decreaseLargeJumps: boolean = false
): number => {
  const jumps = inputJumps.slice()
  let steps = 0
  let position = 0
  while (position >= 0 && position < inputJumps.length) {
    const jump = jumps[position]
    if (decreaseLargeJumps) {
      jumps[position] >= 3 ? jumps[position]-- : jumps[position]++
    }
    else { jumps[position]++ }
    position += jump
    steps++
  }
  return steps
}

console.log("(P1): " + stepsUntilEscape(input))

console.log("(P2): " + stepsUntilEscape(input, true))