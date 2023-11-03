import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())

const apply = (word: string, operation: string): string => {
  const parts = operation.split(" ")
  let output = [...word]
  if (operation.startsWith("swap position")) {
    const [x, y]: number[] = [parseInt(parts[2]), parseInt(parts[5])]
    output[x] = word[y]
    output[y] = word[x]
    return output.join("")
  }
  if (operation.startsWith("swap letter")) {
    const [a, b] = [parts[2], parts[5]]
    return output.map(x => x === a ? b : x === b ? a : x).join("")
  }
  if (operation.startsWith("rotate left")) {
    const r = parseInt(parts[2])
    return word.slice(r) + word.slice(0, r)
  }
  if (operation.startsWith("rotate right")) {
    const r = parseInt(parts[2])
    return word.slice(-r) + word.slice(0, -r)
  }
  if (operation.startsWith("rotate based on position of letter")) {
    const a = parts[6]
    const r = 1 + word.indexOf(a) + (word.indexOf(a) > 3 ? 1 : 0)
    for (let i = 0; i < r; i++) {
      output = [...output.slice(-1), ...output.slice(0, -1)]
    }
    return output.join("")
  }
  if (operation.startsWith("reverse positions")) {
    const [x, y]: number[] = [parseInt(parts[2]), parseInt(parts[4])]
    return word.slice(0, x)
      + word.slice(x, y + 1).split("").reverse().join("")
      + word.slice(y + 1)
  }
  if (operation.startsWith("move position")) {
    const [x, y]: number[] = [parseInt(parts[2]), parseInt(parts[5])]
    const [movedChar] = output.splice(x, 1)
    output.splice(y, 0, movedChar)
    return output.join("")
  }
  throw new Error("Unsupported operation: " + operation)
}

const scrambled = input.reduce(apply, "abcde")

console.log("(P1): " + scrambled)

function permutator(word: string): string[] {
  let results: string[] = []

  function permute(arr: string[], memo: string[] = []) {
    if (arr.length === 0 ) { results.push(memo.join("")) }
    else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice()
        let next = curr.splice(i, 1)
        permute(curr.slice(), memo.concat(next))
      }
    }
  }
  permute(word.split(""))
  return results
}

const possibilities = permutator("fbgdceah")
searchLoop:
for (const possibility of possibilities) {
  console.log(possibility)
  
  if (input.reduce(apply, possibility) === "fbgdceah") {
    break searchLoop
  }
}