import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { factors, range } from "../../utils/numbers"

const ranges: number[][] = readLines(__dirname, inputFile())[0]
    .split(",")
    .map(range => range.split("-").map(Number))

const isInvalidIdP1 = (input: number): boolean => {
    const asString = String(input)
    if (asString.length % 2 == 1) { return false }
    return asString.slice(0, asString.length / 2) == asString.slice(asString.length / 2)
}

const repeatString = (input: string, times: number): string =>
    range(0, times).map(_ => input).join("")

const isInvalidIdP2 = (input: number): boolean => {
    const asString = String(input)
    const possibleSubLengths = factors(asString.length)
        .filter(factor => factor != asString.length)
    return possibleSubLengths.some(subLength => {
        const subString = asString.slice(0, subLength)
        return repeatString(subString, asString.length / subLength) === asString
    })
}

let invalidIdSumP1 = 0
let invalidIdSumP2 = 0
ranges.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
        if (isInvalidIdP1(i)) { invalidIdSumP1 += i }
        if (isInvalidIdP2(i)) { invalidIdSumP2 += i }
    }
})

console.log("(P1): ", invalidIdSumP1)

console.log("(P2): ", invalidIdSumP2)