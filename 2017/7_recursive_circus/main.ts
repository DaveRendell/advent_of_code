import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

interface Tower {
  name: string
  weight: number
  children: string[]
} 

const parseLine = (line: string): Tower => {
  const name = line.split(" (")[0]
  const weight = parseInt(line.split("(")[1].split(")")[0])
  const children = line.includes("->")
   ? line.split(" -> ")[1].split(", ")
   : []
  return { name, weight, children }
}

const towers = readLines(__dirname, inputFile())
  .map(parseLine)
  .reduce((acc: Record<string, Tower>, next: Tower) => ({
    ...acc,
    [next.name]: next
  }), {})

const root = Object.keys(towers)
  .find(name => !Object.values(towers).flatMap(t => t.children).includes(name))
  

console.log("(P1): " + root)

const totalWeight = (name: string): number =>
  towers[name].children.map(totalWeight).reduce(sum, towers[name].weight)





console.log("(P2): " + totalWeight("ugml"))