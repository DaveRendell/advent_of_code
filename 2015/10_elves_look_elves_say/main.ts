type Repeat = [number, string]

const memos: Map<string, Repeat[]> = new Map()

const calculatePairs = (input: string): Repeat[] => {
  const save = (output: Repeat[]) => {
    memos.set(input, output)
    return output
  }
  if (memos.has(input)) { return memos.get(input) }
  if (input.length === 0) { return save([]) }
  if (input.length === 1) { return save([[1, input[0]]]) }

  const split = Math.floor(input.length / 2)
  const left = input.slice(0, split)
  const right = input.slice(split)
  const leftPairs = calculatePairs(left)
  const rightPairs = calculatePairs(right)

  const leftEnd = leftPairs.at(-1)
  const rightEnd = rightPairs.at(0)
  
  if (leftEnd[1] === rightEnd[1]) {
    return save([
      ...leftPairs.slice(0, -1),
      [leftEnd[0] + rightEnd[0], leftEnd[1]],
      ...rightPairs.slice(1),
    ])
  }
  return save([...leftPairs, ...rightPairs])
}

let output = "1113222113"
for (let i = 0; i < 40; i++) {
  output = calculatePairs(output).flat().join("")
}

console.log("(P1): " + output.length)

for (let i = 40; i < 50; i++) {
  output = calculatePairs(output).flat().join("")
}

console.log("(P2): " + output.length)