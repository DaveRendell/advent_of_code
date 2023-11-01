import { range } from "../../utils/numbers"

const sample = ".^^.^.^^^^"
const input = "...^^^^^..^...^...^^^^^^...^.^^^.^.^.^^.^^^.....^.^^^...^^^^^^.....^.^^...^^^^^...^.^^^.^^......^^^^"

const generateNextRow = (row: string): string =>
  [...row].map(tile => tile === "^").map((_, i, isTrap) =>
    (isTrap[i - 1] && isTrap[i] && !isTrap[i + 1]) ||
    (!isTrap[i - 1] && isTrap[i] && isTrap[i + 1]) ||
    (isTrap[i - 1] && !isTrap[i] && !isTrap[i + 1]) ||
    (!isTrap[i - 1] && !isTrap[i] && isTrap[i + 1]))
    .map(isTrap => isTrap ? "^" : ".").join("")

function blankSpacesAfterRows(firstRow: string, numberOfRows: number): number {
  let rows = [firstRow]
  while (rows.length < numberOfRows) {
    rows.push(generateNextRow(rows.at(-1)))
  }
  return [...rows.join("")].filter(tile => tile === ".").length
}

console.log("(P1): " + blankSpacesAfterRows(sample, 10))
console.log("(P1): " + blankSpacesAfterRows(input, 40))

console.log("(P2): " + blankSpacesAfterRows(input, 400000))