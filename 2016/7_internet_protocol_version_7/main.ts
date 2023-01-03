import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const addresses = readLines(__dirname, inputFile())

const getBrackets = (line: string): [number, number][] => {
  let brackets = []
  let unclosed = []

  line.split("").forEach((c, i) => {
    if (c === "[") { unclosed.push(i) }
    if (c === "]") { brackets.push([unclosed.pop(), i]) }
  })

  return brackets
}

const getAbbas = (line: string): number[] =>
  line.split("")
    .map((_, i) => i)
    .filter(i => line[i] === line[i + 3])
    .filter(i => line[i + 1] === line [i + 2])
    .filter(i => line[i] !== line[i + 1])


const tlsSupporting = addresses
  .filter(address => getAbbas(address).length > 0)
  .filter(address =>
    getBrackets(address).every(([start, end]) =>
      getAbbas(address).every(index =>
        index < start || index > end)))

console.log("(P1): " + tlsSupporting.length)

const getAbas = (line: string): number[] =>
  line.split("")
    .map((_, i) => i)
    .filter(i => line[i] === line[i + 2])
    .filter(i => line[i] !== line[i + 1])

const sslSupporting = addresses
  .filter(address => 
    getAbas(address).some(abaIndex => {
      const brackets = getBrackets(address)
      if (!brackets.every(([start, end]) => abaIndex < start || abaIndex > end)) {
        return false
      }
      return getAbas(address)
        .filter(babIndex => 
          brackets.some(([start, end]) => 
            start < babIndex && end > babIndex))
        .filter(babIndex => address[abaIndex] === address[babIndex + 1])
        .filter(babIndex => address[babIndex] === address[abaIndex + 1])
        .length > 0
    }))

console.log("(P2): " + sslSupporting.length)