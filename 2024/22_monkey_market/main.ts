import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, sum } from "../../utils/reducers"

const secrets = readLines(__dirname, inputFile()).map(Number)

const pruner = (1 << 24) - 1
const update = (input: number): number => {
  input = ((input << 6) ^ input) & pruner
  input = ((input >> 5) ^ input) & pruner
  input = ((input << 11) ^ input) & pruner
  return input
}

const updateTimes = (times: number) => (input: number) => {
  for (let i = 0; i < times; i++) {
    input = update(input)
  }
  return input
}

console.log("(P1): ", secrets.map(updateTimes(2000)).reduce(sum))

const data = new Map<string, Uint8Array>()

// Initialise monster data set
for (let i = -9; i < 10; i++) {
  for (let j = -9; j < 10; j++) {
    for (let k = -9; k < 10; k++) {
      for (let l = -9; l < 10; l++) {
        const key = [i, j, k, l].map(String).join(",")
        data.set(key, new Uint8Array(secrets.length).fill(0))
      }
    }
  }
}

secrets.forEach((secret, secretId) => {
  const seen = new Set<string>()
  const last5 = []
  for (let i = 0; i < 2000; i++) {
    secret = update(secret)
    last5[0] = last5[1]
    last5[1] = last5[2]
    last5[2] = last5[3]
    last5[3] = last5[4]
    last5[4] = secret % 10
    if (i > 3) {
      const diffs = [
        last5[1] - last5[0],
        last5[2] - last5[1],
        last5[3] - last5[2],
        last5[4] - last5[3],
      ]
      const key = diffs.map(String).join(",")
      if (!seen.has(key)) {
        seen.add(key)
        data.get(key)[secretId] = secret % 10
      }
    }
  }
})

const mostBananas = [...data.entries()]
  .map(([_, prices]) => prices.reduce(sum))
  .reduce(max)

console.log("(P2): ", mostBananas)
