import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = JSON.parse(readLines(__dirname, inputFile())[0])

const sumNumbers = (filteredKey?: string) => (tree: any): number => {
  if (typeof tree === "string") { return 0 }
  if (typeof tree === "number") { return tree }
  if (typeof tree === "object") {
    if (
      filteredKey && !Array.isArray(tree)
      && Object.values(tree).includes(filteredKey)
    ) { return 0 }

    return Object.values(tree)
      .map(sumNumbers(filteredKey))
      .reduce(sum)
  }
  throw new Error("Unknown tree node")
}

console.log("(P1): " + sumNumbers()(input))
console.log("(P2): " + sumNumbers("red")(input))
