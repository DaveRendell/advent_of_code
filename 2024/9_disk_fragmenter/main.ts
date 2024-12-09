import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { chunks, sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())[0]
  .split("").map(Number)

const disk: number[] = []

let isFile = true
let fileId = 0
let cursor = 0
for (let entry of input) {
  if (isFile) {
    for (let i = 0; i < entry; i++) {
      disk[cursor++] = fileId
    }
    fileId++
  } else {
    cursor += entry
  }
  isFile = !isFile
}

cursor = 0
let rearCursor = disk.length - 1

while (cursor < rearCursor) {
  if (disk[cursor] === undefined) {
    if (disk[rearCursor] === undefined) {
      rearCursor--
    } else {
      disk[cursor++] = disk[rearCursor--]
    }
  } else {
    cursor++
  }
}

disk.splice(rearCursor + 1, Infinity)

const checksum = disk.map((x, i) => x * i).reduce(sum)

console.log("(P1): ", checksum) // sample 1928

interface File { id: number, size: number, empty: number }

const files: File[] = input.reduce(chunks(2), [[]])
  .map(([size, empty], id) => ({ id, size, empty }))

cursor = 0
rearCursor = files.length - 1

while (rearCursor > 0) {
  cursor = 0
  const endFile = files[rearCursor]
  const fileIdWithEnoughEmptySpace = files
    .slice(0, rearCursor)
    .findIndex(file => file.empty >= files[rearCursor].size)

  if (fileIdWithEnoughEmptySpace === -1) {
    // console.log(`File ${endFile.id} - no space, not moving`)
    rearCursor--
  } else {
    const file = files[fileIdWithEnoughEmptySpace]
    // console.log(`File ${endFile.id} - moving to after file ${file.id}`)
    files.splice(rearCursor, 1)
    files.splice(
      fileIdWithEnoughEmptySpace + 1,
      0,
      {
        id: endFile.id,
        size: endFile.size,
        empty: file.empty - endFile.size
      })
    file.empty = 0

    // don't decrement rearCursor, inserting means it's already on
    // the next one

    files[rearCursor].empty += endFile.size + (endFile.empty || 0)
  }
}

let checksumP2 = 0
let i = 0

files.forEach(file => {
  for (let j = 0; j < file.size; j++) {
    checksumP2 += file.id * i++
  }
  i += file.empty
})

// console.log(files)

console.log("(P2): ", checksumP2)