import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { product, sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())

const p1Input = input.map(line => line.split(" ").filter(chunk => chunk.length > 0))
const p1Values = p1Input.slice(0, -1).map(line => line.map(Number))
const operators = p1Input.slice(-1)[0]

const splitArrayOnEmptyString = (acc: string[][], next: string): string[][] => {
    if (next === "") { return [...acc, []] }
    acc.at(-1).push(next)
    return acc
}

const p2Values = input[0].split("").map((_, i) =>
        input.slice(0, -1).map((_, j) => input[j][i]).join("").trim())
    .reduce(splitArrayOnEmptyString, [[]])
    .map(line => line.map(Number))


let p1Sum = 0
let p2Sum = 0
for (let i = 0; i < operators.length; i++) {
    const operation: (a: number, b: number) => number = operators[i] === "+" ? sum : product
    const unit: number = operators[i] === "+" ? 0 : 1
    p1Sum += p1Values.map(line => line[i]).reduce(operation, unit)
    p2Sum += p2Values[i].reduce(operation, unit)
}


console.log("(P1): ", p1Sum)

console.log("(P2): ", p2Sum)