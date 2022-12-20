import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const strings = readLines(__dirname, inputFile())

const nice = strings
  .filter(string => [...string].filter(c => "aeiou".includes(c)).length >= 3)
  .filter(string => [...string].some((x, i) => x === string[i - 1]))
  .filter(string => ["ab", "cd", "pq", "xy"].every(substring => !string.includes(substring)))

console.log("(P1): " + nice.length)

const nice2 = strings
  .filter(string => [...string].some((_, i) => string.slice(i + 2).includes(string.substring(i, i + 2))))
  .filter(string => [...string].some((x, i) => x === string[i - 2]))

console.log("(P2): " + nice2.length)
