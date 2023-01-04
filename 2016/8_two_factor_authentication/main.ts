import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import HashSet from "../../utils/hashset"
import { range } from "../../utils/numbers"

const instructions = readLines(__dirname, inputFile())

let pixels = new HashSet<[number, number]>(c => c.join(","))

const run = (instruction: string) => {
  if (instruction.startsWith("rect")) {
    const [wide, tall] = instruction.split(" ")[1].split("x").map(v => parseInt(v))
    for (let x = 0; x < wide; x++) {
      for (let y = 0; y < tall; y++) {
        pixels.add([x, y])
      }
    }
  }
  if (instruction.startsWith("rotate row")) {
    const row = parseInt(instruction.split(" ")[2].split("=")[1])
    const rotation = parseInt(instruction.split(" ")[4])
    const newPixels: [number, number][] = pixels.entries().map(([x, y]) =>
      y === row ? [(x + rotation) % 50, y] : [x, y])
    pixels = new HashSet(c => c.join(","), newPixels)
  }
  if (instruction.startsWith("rotate column")) {
    const col = parseInt(instruction.split(" ")[2].split("=")[1])
    const rotation = parseInt(instruction.split(" ")[4])
    const newPixels: [number, number][] = pixels.entries().map(([x, y]) =>
      x === col ? [x, (y + rotation) % 6] : [x, y])
    pixels = new HashSet(c => c.join(","), newPixels)
  }
}

instructions.forEach(run)

console.log("(P1): " + pixels.size)

const display = range(0, 6).map(y =>
    range(0, 50).map(x => 
        pixels.has([x, y]) ? "#" : " "
      ).join(" ")
  ).join("\n")

console.log(display)

console.log("(P2): " + 0)