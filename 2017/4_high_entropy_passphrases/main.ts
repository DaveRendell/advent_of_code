import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())

const uniqueWords = (line: string) =>
  line.split(" ").length === new Set(line.split(" ")).size

const alphabetiseWords = (line: string) =>
  line.split(" ").map(word => [...word].sort().join("")).join(" ")

console.log("(P1): " + input.filter(uniqueWords).length)

console.log("(P2): " + input.map(alphabetiseWords).filter(uniqueWords).length)