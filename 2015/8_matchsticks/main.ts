import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

const lines = readLines(__dirname, inputFile())

const unescape = (line: string): string => {
  const unbracketed = line.slice(1, -1)
  let out = ""
  for (let i = 0; i < unbracketed.length; i++) {
    if (unbracketed[i] !== "\\") {
      out += unbracketed[i]
    } else {
      if (unbracketed[i + 1] === "x") {
        const codeString = unbracketed.substring(i + 2, i + 4)
        const hexCode = parseInt(codeString, 16)
        if (!isNaN(hexCode)) {
          out += String.fromCharCode(hexCode)
          i += 3
        }
      } else if (["\\", "\""].includes(unbracketed[i + 1])) {
        out += unbracketed[i + 1]
        i += 1
      }
    }
  }
  return out
}

const unescaped = lines.map(unescape)
const codeLength = lines.map(l => l.length).reduce(sum)
const stringLength = unescaped.map(l => l.length).reduce(sum)
console.log("(P1): " + (codeLength - stringLength))

const escape = (line: string): string =>
  "\"" + line
    .replaceAll("\\", "\\\\")
    .replaceAll("\"", "\\\"") + "\""

const escaped = lines.map(escape)
const escapedLength = escaped.map(l => l.length).reduce(sum)

console.log("(P2): " + (escapedLength - codeLength))