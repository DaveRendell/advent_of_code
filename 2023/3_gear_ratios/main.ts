import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import { sum } from "../../utils/reducers"

const input = readCharArray(__dirname, inputFile())

const numbers = []

input.forEach((row, i) =>
  row.forEach((_, j) => {
    // If previous was a digit, ignore as already counted
    if (!isNaN(parseInt(row[j - 1]))) { return }
    const number = parseInt(row.slice(j).join(""))

    if (isNaN(number)) { return }

    const numberLength = number.toString().length
    const border =
      (i > 0 ? input[i - 1].slice(Math.max(j - 1, 0), j + numberLength + 1).join("") : "")
      + (row[j - 1] || "") + (row[j + numberLength] || "")
      + (i < (input.length - 1) ? input[i + 1].slice(Math.max(j - 1, 0), j + numberLength + 1).join("") : "")

    const hasSymbol = border.split("").filter(c => !("1234567890.".includes(c))).length > 0

    if (hasSymbol) { numbers.push(number) }    
  }))

console.log("(P1): " + numbers.reduce(sum))

console.log("(P2): " + 0)