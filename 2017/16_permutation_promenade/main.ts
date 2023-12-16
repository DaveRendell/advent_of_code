import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())[0]
  .split(",")

const applyMove = (dancers: string, instruction: string): string => {
  if (instruction[0] == "s") {
    const x = parseInt(instruction.slice(1))
    return dancers.slice(-x) + dancers.slice(0, -x)
  } else if (instruction[0] == "x") {
    const [a, b] = instruction.slice(1).split("/").map(x => parseInt(x))
    const out = dancers.split("")
    out[a] = dancers[b]
    out[b] = dancers[a]
    return out.join("")
  } else if (instruction[0] == "p") {
    const [a, b] = instruction.slice(1).split("/")
    return dancers.split("").map(x => x == a ? b : x == b ? a : x).join("")
  }
  throw new Error("oopsie woopsie")
}

console.log("(P1): " + input.reduce(applyMove, "abcdefghijklmnop"))

let dancesToDo = 1_000_000_000

let memory = new Map<string, number>()
let dancers = "abcdefghijklmnop"

while (dancesToDo-- > 0) {
  dancers = input.reduce(applyMove, dancers)
  if (memory.has(dancers)) {
    dancesToDo %= memory.get(dancers) - dancesToDo
  }
  memory.set(dancers, dancesToDo)
}

console.log("(P2): " + dancers)