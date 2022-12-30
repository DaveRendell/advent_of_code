import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { positiveMod } from "../../utils/numbers"

const snafuToDec: Record<string, number>  = {
  "=": -2, "-": -1, "0": 0, "1": 1, "2": 2
}
const decToSnafu: Record<number, string>  = {
  [-2]: "=", [-1]: "-", 0: "0", 1: "1", 2: "2"
}

const snafuSum = (a: string, b: string): string => {
  const aDigits = a.split("").reverse()
  const bDigits = b.split("").reverse()
  const maxDigits = Math.max(aDigits.length, bDigits.length) + 1
  let out: string[] = []
  let carried = 0

  for (let i = 0; i < maxDigits; i++) {
    const aValue = snafuToDec[aDigits[i] || "0"]
    const bValue = snafuToDec[bDigits[i] || "0"]

    const sum = aValue + bValue + carried
    const digit = positiveMod(sum + 2, 5) - 2 
    carried = Math.sign(sum - digit)
    out.push(decToSnafu[digit])
  }

  if (out.at(-1) === "0") { out.pop() }
  return out.reverse().join("")
}

const input = readLines(__dirname, inputFile())

console.log("(P1): " + input.reduce(snafuSum))
