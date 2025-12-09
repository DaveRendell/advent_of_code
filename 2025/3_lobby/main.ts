import inputFile from "../../utils/inputFile"
import readDigitGrid from "../../utils/readDigitGrid"
import { max, sum } from "../../utils/reducers"

const banks = readDigitGrid(__dirname, inputFile())

const findHighestJoltage = (length: number) => (bank: number[]): string => {
    if (length == 0) { return "" }
    const bestDigit = bank.slice(0, bank.length - (length - 1)).reduce(max)
    const earliestIndex = bank.indexOf(bestDigit)
    return String(bestDigit) + findHighestJoltage(length - 1)(bank.slice(earliestIndex + 1))
}

console.log("(P1): ", banks.map(findHighestJoltage(2)).map(Number).reduce(sum))

console.log("(P2): ", banks.map(findHighestJoltage(12)).map(Number).reduce(sum))