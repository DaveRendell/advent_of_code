import * as crypto from "crypto"

const secret = "bgvyzdsv"

let i = 0  
let hash: string
do {
  i++
  hash = crypto.createHash("md5").update(secret + i).digest("hex")
} while (!hash.startsWith("00000"))

console.log("(P1): " + i)

i = 0
do {
  i++
  hash = crypto.createHash("md5").update(secret + i).digest("hex")
} while (!hash.startsWith("000000"))

console.log("(P2): " + i)