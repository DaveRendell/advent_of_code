import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readParagraphs from "../../utils/readParagraphs"
import { sum } from "../../utils/reducers"

const input = readParagraphs(__dirname, inputFile())

const reverse = (s: string): string => s.split("").reverse().join("")

const transpose = (map: string[]): string[] =>
  range(0, map[0].length).map(col => map.map(x => x[col]).join(""))

const getVerticalMirrors = (map: string[], smudges: number): number[] => {
  const n = map[0].length

  const reflectsPerRow = map.map(row => {
    return range(1, n).filter(i =>
      2*i < n
        ? row.slice(0, i) === reverse(row.slice(i, 2*i))
        : row.slice(i - (n - i), i) === reverse(row.slice(i)))
  })

  return range(1, n).filter(i =>
    reflectsPerRow
      .filter(reflects => !reflects.includes(i))
      .length == smudges)
}

const getScore = (smudges: number) => (map: string[]): number => {
  const verticalMirrors = getVerticalMirrors(map, smudges)
  const horizontalMirrors = getVerticalMirrors(transpose(map), smudges)
  return verticalMirrors.reduce(sum, 0) + 100 * horizontalMirrors.reduce(sum, 0)
}

console.log("(P1): " + input.map(getScore(0)).reduce(sum))
console.log("(P2): " + input.map(getScore(1)).reduce(sum))