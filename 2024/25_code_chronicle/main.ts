import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"

const input = readParagraphs(__dirname, inputFile())

const keys = input.filter(paragraph => paragraph.at(-1)
  .split("").every(c => c === "#"))

const locks = input.filter(paragraph => paragraph.at(0)
  .split("").every(c => c === "#"))

const match = (key: string[], lock: string[]) =>
  key.every((line, i) =>
    line.split("").every((c, j) => c === "." || lock[i][j] === "."))

const matches = keys.map(key => locks
  .filter(lock => match(key, lock))
  .length
).reduce(sum)

console.log("(P1): ", matches)

console.log("(P2): ", "Merry Christmas 2024!")