import * as crypto from "crypto"

const salt = "ihaygndm"

const md5Memos: string[] = []

const md5Hash = (input: number): string => {
  if (md5Memos[input]) { return md5Memos[input] }
  const hash = crypto.createHash("md5").update(salt + input).digest("hex")
  md5Memos[input] = hash
  return hash
}

const stretchedMemos: string[] = []

const stretchedHash = (input: number): string => {
  if (stretchedMemos[input]) { return stretchedMemos[input] }
  let hash = md5Hash(input)
  for (let i = 0; i < 2016; i++) {
    hash = crypto.createHash("md5").update(hash).digest("hex")
  }
  stretchedMemos[input] = hash
  return hash
}

const tripledCharacter = (char: string, index: number, input: string[]) =>
  input[index + 1] === char && input[index + 2] === char

const searchWithHash = (hash: (number) => string): number => {
  let i = 0
  let keys = 0
  while (keys < 64) {
    console.log("Searching for key #" + (keys + 1))

    let character: string
    do {
      i++
      character = hash(i).split("").find(tripledCharacter)
    } while (character === undefined)

    console.log(`Triple ${character} found at index ${i}`)

    fiveRepeatSearch:
    for (let j = 1; j <= 1000; j++) {
      if (hash(i + j).includes(character.repeat(5))) {
        keys++
        console.log(`Key ${keys} found at index ${i} (quintuple at index ${i + j})`)
        break fiveRepeatSearch
      }
    }
    
  }
  return i
}

console.log("(P1): " + searchWithHash(md5Hash))
console.log("(P2): " + searchWithHash(stretchedHash))