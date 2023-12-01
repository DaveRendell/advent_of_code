import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const getValue = (line: string): number => {
  const digits = line.split("").filter(x => "0123456789".includes(x))
  console.log(digits.at(0) + digits.at(-1))
  return parseInt(digits.at(0) + digits.at(-1))
}

const values = input.map(getValue)
console.log(values)

console.log("(P1): " + values.reduce(sum))

const digitNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

const getValueP2 = (line: string): number => {
  const digits = line.split("").map((char, i) => {
    if ("123456789".includes(char)) {
      return parseInt(char)
    }
    const nameIndex = digitNames
      .findIndex(digitName => line.slice(i).startsWith(digitName))
    if (nameIndex !== -1) { return nameIndex + 1 }
    return null
  }).filter(digitValue => digitValue!== null)
  return 10 * digits.at(0) + (digits.at(-1))
}

const valuesP2 = input.map(getValueP2)

console.log("(P2): " + valuesP2.reduce(sum))