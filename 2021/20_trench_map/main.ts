import inputFile from "../../utils/inputFile"
import readParagraphs from "../../utils/readParagraphs"
import { ascending } from "../../utils/sorters"
import { inclusiveRange, range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

function partOne() {
  const [algorithm, originalImage] = parse()

  console.log(printAlgorithm(algorithm))
  console.log(printImage(originalImage))
  console.log(" === ")
  const processed = range(0, 50).reduce(process(algorithm), originalImage)
  console.log(printImage(processed))
  console.log(countLightPixels(processed)) // 5705 too high -_-
  console.log("(P1) Answer: ")
}

function partTwo() {}

type Algorithm = boolean[]
type Row = { [colId: number]: boolean }
type Image = { [rowId: number]: Row, infinite: boolean }

const parse = (): [Algorithm, Image] => {
  const [algorithmParagraph, imageParagraph] = readParagraphs(__dirname, inputFile())
  return [parseAlgorithm(algorithmParagraph), parseImage(imageParagraph)]
}

const process = (algorithm: Algorithm) => (image: Image, step: number): Image => {
  console.log(`Step ${step}\r\r`)
  const [minRow, maxRow, minCol, maxCol] = getDimensions(image)
  return {
    ...Object.fromEntries(
    inclusiveRange(minRow - 1, maxRow + 1).map(rowIndex => {
      const row: Row = Object.fromEntries(inclusiveRange(minCol - 1, maxCol + 1).map(colIndex => {
        const lookupReference = getLookupReference(image, [rowIndex, colIndex])
        return [colIndex, algorithm[lookupReference]]
      }).filter(([_, value]) => value))
      return [rowIndex, row]
    })),
    infinite: image.infinite ? algorithm.at(-1) : algorithm.at(0)
  }
}

const parseAlgorithm = (paragraph: string[]): Algorithm =>
  [...paragraph.join("")].map(char => char === "#")

const parseImage = (paragraph: string[]): Image =>
  ({ ...paragraph.map(parseRow), infinite: false })
  
const parseRow = (line: string): Row =>
  Object.fromEntries([...line]
    .map((char, i) => ([i, char]))
    .filter(([_, char]) => char === "#"))

const getLookupReference = (image: Image, [row, col]: [number, number]): number => {
  const [minRow, maxRow, minCol, maxCol] = getDimensions(image)
  const neighbours = [
    [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
    [row, col - 1], [row, col], [row, col + 1],
    [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]]
  return parseInt(neighbours.map(([rowIndex, colIndex]) => {
    const outOfFiniteArea = rowIndex < minRow || rowIndex > maxRow || colIndex < minCol || colIndex > maxCol
    const neighbourValue = outOfFiniteArea ? image.infinite : image[rowIndex] && image[rowIndex][colIndex]
    return neighbourValue ? "1": "0"
  }).join(""), 2)  
}

const getDimensions = (image: Image): [number, number, number, number] => {
  const rowIndicies = Object.keys(image).filter(row => row !== "infinite")
  const colIndicies = rowIndicies.flatMap(rowIndex => Object.keys(image[rowIndex]))
  const sortedRows = rowIndicies.map(v => parseInt(v)).sort(ascending)
  const sortedCols = colIndicies.map(v => parseInt(v)).sort(ascending)

  return [sortedRows.at(0), sortedRows.at(-1), sortedCols.at(0), sortedCols.at(-1)]
}

const countLightPixels = (image: Image): number =>
  Object.keys(image).map(rowIndex =>
    Object.keys(image[rowIndex]).filter(colIndex =>
      !!image[rowIndex][colIndex]).length)
    .reduce(sum)

const printAlgorithm = (algorithm: Algorithm): string =>
    algorithm.map(value => value ? "#" : ".").join("")

const printImage = (image: Image): string => {
  const [minRow, maxRow, minCol, maxCol] = getDimensions(image)

  return inclusiveRange(minRow, maxRow).map(rowIndex =>
    inclusiveRange(minCol, maxCol).map(colIndex =>
      image[rowIndex][colIndex] ? "██": "  "
    ).join("")).join("\n")
}


partOne()
partTwo()
