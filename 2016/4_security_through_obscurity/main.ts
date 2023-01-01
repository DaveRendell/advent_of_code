import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { groupBy, sum } from "../../utils/reducers"
import { ascendingBy, descendingBy } from "../../utils/sorters"

interface Room { name: string, sectorId: number, checksum: string }

const parse = (line: string): Room => ({
  name: line.split("-").slice(0, -1).join(""),
  sectorId: parseInt(line.split("-").at(-1).split("[").at(0)),
  checksum: line.slice(-6, -1)
})

const rooms = readLines(__dirname, inputFile()).map(parse)

const isValid = ({ name, checksum }: Room): boolean =>
  [...new Set(name.split(""))]
    .sort()
    .map(c => ({
      c, count: [...name]
        .filter(char => char === c).length
      }))
    .sort(descendingBy(({ count }) => count))
    .slice(0, 5).map(({c}) => c)
    .join("") === checksum

const realSectorSum = rooms
  .filter(isValid)
  .map(({ sectorId }) => sectorId)
  .reduce(sum)

console.log("(P1): " + realSectorSum)

const rotateChar = (rotation: number) => (letter: string): string =>
  String.fromCharCode(97 + ((letter.charCodeAt(0) - 97 + rotation) % 26))

const rotate = (rotation: number) => (line: string): string =>
  line.split("").map(rotateChar(rotation)).join("")

const candidates = rooms
  .filter(isValid)
  .map(({name, sectorId}) => ({ id: sectorId, name: rotate(sectorId)(name) }))
  .filter(({ name }) => name.includes("north") || name.includes("presents") || name.includes("christmas"))
  .map(({ name, id }) => `${id} - ${name}`)
console.log("(P2): " + candidates.join("\n"))