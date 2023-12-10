import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const scoreGroup = (line: string, depth: number = 1): number => {
  const stack: number[] = []
  let subGroups: string[] = []
  let inGarbage = false
  for (let i = 1; i < line.length - 1; i++) {
    if (!inGarbage) {
      if (line[i] == "{") {
        stack.push(i)
      } else if (line[i] == "}") {
        const groupStart = stack.pop()
        if (stack.length == 0) {
          subGroups.push(line.slice(groupStart, i + 1))
        }
      } else if (line[i] == "<") {
        inGarbage = true
      }
    } else {
      if (line[i] == "<") {
        inGarbage = true
      } else if (line[i] == ">") {
        inGarbage = false
      } else if (line[i] == "!") {
        i++
      }
    }
  }
  const score = depth + subGroups.map(subGroup => scoreGroup(subGroup, depth + 1)).reduce(sum, 0)
  return score
}

console.log("(P1): " + scoreGroup(input[0]))

const countGarbage = (line: string): number => {
  let inGarbage = false
  let garbageCount = 0
  for (let i = 0; i < line.length; i++) {
    if (inGarbage) {
      if (line[i] == ">") { inGarbage = false }
      else if (line[i] == "!") { i++ }
      else { garbageCount++ }
    } else {
      if (line[i] == "<") { inGarbage = true }
    }
  }
  return garbageCount
}


console.log("(P2): " + countGarbage(input[0]))