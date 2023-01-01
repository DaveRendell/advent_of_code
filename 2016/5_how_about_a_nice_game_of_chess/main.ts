import * as crypto from "crypto"
import { range } from "../../utils/numbers"

const doorCode = "ffykfhsq"
let i = 0

const password = range(0, 8).map(() => {
  let hash: string
  do {
    i++
    hash = crypto.createHash("md5").update(doorCode + i).digest("hex")
  } while (!hash.startsWith("00000"))
  console.log(hash)
  return hash[5]
}).join("")

console.log("(P1): " + password)
console.log("\n\n")

i = 0
let second: string[] = new Array(8).fill(undefined)

while (second.some(c => c === undefined)) {
  let hash: string
  do {
    i++
    hash = crypto.createHash("md5").update(doorCode + i).digest("hex")
  } while (!hash.startsWith("00000"))
  const position = parseInt(hash[5], 16)
  const value = hash[6]
  console.log(`${hash.slice(0, 10)} - position: ${position}, value: ${value}`)
  if (position >= 0 && position < 8 && second[position] === undefined) {
    second[position] = value
    console.log(second.map(x => x === undefined ? "_" : x).join(""))
  }
}


console.log("(P2): " + second.join(""))