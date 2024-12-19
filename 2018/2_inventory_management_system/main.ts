import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())

const containsNOfALetter = (n: number) => (test: string): boolean =>
  [...test].some(c => [...test].filter(v => v === c).length === n)

const checksum = input.filter(containsNOfALetter(2)).length
  * input.filter(containsNOfALetter(3)).length

console.log("(P1): ", checksum)

const nearMatch = (a: string, b: string): boolean =>
  [...a].filter((_, i) => a[i] !== b[i]).length === 1

const a = input.find((a, i) => input.slice(i).some(b => nearMatch(a, b)))
const b = input.find(b => a !== b && nearMatch(a, b))

const matchingChars = [...a].filter((_, i) => a[i] === b[i]).join("")

console.log("(P2): ", matchingChars)