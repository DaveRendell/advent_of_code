import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"

function partOne() {
  let map = readLines(__dirname, inputFile())
  let previousMap: string[]
  let step = 0

  do {
    previousMap = [...map]
    map = doStep(map)
    step++
  } while (map.join("\n") !== previousMap.join("\n"))

  console.log("(P1) Answer: " + step)
}

function partTwo() {}

const doStep = (map: string[]): string[] => {
  const moveEast = map.map(wrapReplace(">.", ".>"))
  const moveSouth = transpose(transpose(moveEast).map(wrapReplace("v.", ".v")))  
  return moveSouth
}

const transpose = (map: string[]): string[] =>
  range(0, map[0].length).map(col => map.map(x => x[col]).join(""))

const wrapReplace = (from: string, to: string) => (row: string) => {
  const wrapped = (row + row).replaceAll(from, to)
  return wrapped.slice(row.length, row.length + 1) + wrapped.slice(1, row.length)
}

partOne()
partTwo()
