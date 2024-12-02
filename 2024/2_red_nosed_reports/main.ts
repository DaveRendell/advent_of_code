import inputFile from "../../utils/inputFile"
import readDigitGrid from "../../utils/readDigitGrid"

const reports = readDigitGrid(__dirname, inputFile(), " ")

const isStrictlyDecreasing = (report: number[]): boolean =>
  report.slice(0, -1).every((element, index) => element > report[index + 1])

const isStrictlyIncreasing = (report: number[]): boolean =>
  report.slice(0, -1).every((element, index) => element < report[index + 1])

const hasAllJumpsAtMost3 = (report: number[]): boolean =>
  report.slice(0, -1).every((element, index) => Math.abs(element - report[index + 1]) <= 3)

const isSafe = (report: number[]): boolean =>
  (isStrictlyDecreasing(report) || isStrictlyIncreasing(report)) && hasAllJumpsAtMost3(report)
    
console.log("(P1): ", reports.filter(isSafe).length)

const removeElementAtIndex = (report: number[], index: number): number[] =>
  [...report.slice(0, index), ...report.slice(index + 1)]

const canBeDampened = (report: number[]): boolean =>
  isSafe(report)
    || report.map((_, index) =>
      removeElementAtIndex(report, index)
    ).some(isSafe)

console.log("(P2): ", reports.filter(canBeDampened).length)