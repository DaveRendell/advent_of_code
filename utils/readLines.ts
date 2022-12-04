import { readFileSync } from 'fs'
import { join } from 'path'

export default function readLines(directory: string, fileName: string): string[] {
  const path = join(directory, fileName)
  const contents = readFileSync(path, "utf8")
  return contents.split("\n")
}
