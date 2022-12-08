import { readFileSync } from 'fs'
import { join } from 'path'

export default function readDigitGrid(directory: string, fileName: string): number[][] {
  const path = join(directory, fileName)
  const contents = readFileSync(path, "utf8")
  return contents.split("\n").map(line => [...line].map(v => parseInt(v)))
}
