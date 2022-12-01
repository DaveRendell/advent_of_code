import readLines from '../utils/readLines'
import { sum } from '../utils/reducers'
import { ascending } from '../utils/sorters'

const INPUT_NAME = "input.txt"

function partOne() {
  const highestTotal = [...readLines(__dirname, INPUT_NAME), ""]
    .reduce(findHighestTotal, { highestTotal: 0, runningTotal: 0 })
    .highestTotal
  
  console.log("(P1) Highest total: " + highestTotal)
}

function partTwo() {
  const highestTotal = [...readLines(__dirname, INPUT_NAME), ""]
    .reduce(findTopThree, { topThree: [0, 0, 0], runningTotal: 0 })
    .topThree.reduce(sum)
  
  console.log("(P2) Total of top three: " + highestTotal)
}

interface HighestTotalAccumulator {
  highestTotal: number
  runningTotal: number
}

const findHighestTotal = (
  { highestTotal, runningTotal }: HighestTotalAccumulator,
  line: string
): HighestTotalAccumulator => 
  line
    ? { highestTotal, runningTotal: runningTotal + parseInt(line) }
    : { highestTotal: Math.max(highestTotal, runningTotal), runningTotal: 0 }

interface TopThreeAccumulator {
  topThree: number[]
  runningTotal: number
}

const findTopThree = (
  { topThree, runningTotal }: TopThreeAccumulator,
  line: string
): TopThreeAccumulator => 
  line
    ? { topThree, runningTotal: runningTotal + parseInt(line) }
    : { topThree: [...topThree, runningTotal].sort(ascending).slice(1), runningTotal: 0 }

partOne()
partTwo()