import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { sum } from "../utils/reducers"

function partOne() {
  const input = readLines(__dirname, inputFile()).map(x => parseInt(x))
  
  let sequence = mix(input, input)

  const zeroIndex = sequence.findIndex(x => x === 0)
  const answer = [
    sequence[(zeroIndex + 1000) % sequence.length],
    sequence[(zeroIndex + 2000) % sequence.length],
    sequence[(zeroIndex + 3000) % sequence.length],
  ].reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const input = readLines(__dirname, inputFile())
    .map(x => 811589153 * parseInt(x))

  let sequence = input
  console.log(sequence.join(", "))
  for (let i = 0; i < 10; i++) {
    sequence = mix(sequence, input)
    console.log(sequence.join(", "))
  }
  const zeroIndex = sequence.findIndex(x => x === 0)
  const answer = [
    sequence[(zeroIndex + 1000) % sequence.length],
    sequence[(zeroIndex + 2000) % sequence.length],
    sequence[(zeroIndex + 3000) % sequence.length],
  ]//.reduce(sum)
  console.log("(P2) Answer: " + answer)
}

const mix = (input: number[], original: number[]): number[] => {
  let sequence = input
    .map(x => [x, false])
  let cursor = 0

  //console.log(sequence.map(([x]) => x).join(", "))

  while (cursor < input.length) {
    if (!sequence[cursor][1]) {
      const [value] = sequence[cursor] as [number, boolean]
      sequence[cursor][1] = true
      const newIndex = positiveMod(cursor + value - 1, input.length - 1) + 1
      sequence.splice(newIndex, 0, sequence.splice(cursor, 1)[0])
      //console.log(sequence.map(([x]) => x).join(", "))
    } else { cursor++ }
  }
  return sequence.map(([x]) => x as number)
}

const positiveMod = (n: number, m: number): number =>
  ((n % m) + m) % m

partOne()
partTwo()
