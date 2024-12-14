import { readFileSync } from 'fs'
import { join } from 'path'

export default function readNumbersFromLines(directory: string, fileName: string): number[][] {
  const path = join(directory, fileName)
  const contents = readFileSync(path, "utf8")
  const findNumber = /-?\d+/g
  return contents.split("\n").map(line =>
    [...line.matchAll(findNumber)].map(match => Number(match)))
}
