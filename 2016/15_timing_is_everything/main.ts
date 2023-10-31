import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { lcm } from "../../utils/numbers"

const input = readLines(__dirname, inputFile())

interface Disc { size: number, position: number }

const parseDisc = (line: string): Disc => {
  const words = line.split(" ")
  return { size: parseInt(words[3]), position: parseInt(words[11].slice(0, -1)) }
}

const positionOnceReached = (startTime: number, disc: Disc, discNumber: number): number => {
  return (disc.position + startTime + discNumber) % disc.size
}

function getEarliestDropTime(discs: Disc[]): number {
  const period = discs.map(disc => disc.size).reduce(lcm, 1)
  let answer = -1;
  searchLoop:
  for (let startTime = 0; startTime < period; startTime++) {
    const positions = discs.map((disc, index) =>
      positionOnceReached(startTime, disc, index + 1))
    if (positions.every(position => position === 0)) {
      answer = startTime
      break searchLoop
    }
  }
  return answer
}

console.log("(P1): " + getEarliestDropTime(input.map(parseDisc)))

console.log("(P2): " + getEarliestDropTime([
  ...input.map(parseDisc),
  { position: 0, size: 11 }
]))