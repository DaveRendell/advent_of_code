import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

interface Marker { start: number, end: number, length: number, repeats: number }

const input = readLines(__dirname, inputFile())[0]

const decompressedLength =
  (file: string, length: (string) => number): number => {
    if (!file) { return 0 }
    if (file.startsWith("(")) {
      const marker = getFirstMarker(file)
      const [start, end] = [marker.end, marker.end + marker.length]
      return marker.repeats * length(file.slice(start, end)) + decompressedLength(file.slice(end), length)
    }
    return 1 + decompressedLength(file.slice(1), length)
  }

const getFirstMarker = (file: string): Marker => {
  const start = file.indexOf("(")
  const end = file.indexOf(")") + 1
  const [length, repeats] = file.slice(start + 1, end)
    .split("x").map(v => parseInt(v))
  return { start, end, length, repeats }
}

console.log("(P1): " + decompressedLength(input, s => s.length))

const recursiveLength = (file: string): number =>
  decompressedLength(file, recursiveLength)

console.log("(P2): " + decompressedLength(input, recursiveLength))