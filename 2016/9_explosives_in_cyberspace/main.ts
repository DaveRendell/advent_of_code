import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())[0]

const getBrackets = (line: string): [number, number][] => {
  let brackets = []
  let unclosed = []

  line.split("").forEach((c, i) => {
    if (c === "(") { unclosed.push(i) }
    if (c === ")") { brackets.push([unclosed.pop(), i]) }
  })

  return brackets
}

let processed = input
let cursor = 0

while (getBrackets(processed.slice(cursor)).length > 0) {
  const [start, end] = getBrackets(processed.slice(cursor))[0].map(x => x + cursor)
  const [length, repeats] = processed.slice(start + 1, end).split("x").map(v => parseInt(v))
  const insert = processed.slice(end + 1, end + length + 1).repeat(repeats)
  const updated = processed.split("")
  updated.splice(start, end - start + 1 + length, ...insert.split(""))
  processed = updated.join("")
  cursor = start + repeats * length
}

console.log("(P1): " + processed.length)



console.log("(P2): " + 0)