const row = 2981
const col = 3075

const coordsToSequenceNumber = (row: number, col: number): number =>
  col + ((col + row - 1) * (col + row - 2)) / 2

const codeAtSequenceNumber = (sequence: number): number => {
  let code = 20151125
  for (let n = 1; n < sequence; n++) {
    code = (code * 252533) % 33554393
  }
  return code
}

const sequenceNumber = coordsToSequenceNumber(row, col)
const code = codeAtSequenceNumber(sequenceNumber)

for (let i = 1; i <  5; i++) {
  console.log(codeAtSequenceNumber(i))
}

console.log("(P1): " + code)
console.log("(P2): " + 0)