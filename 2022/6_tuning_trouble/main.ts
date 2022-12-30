import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const previousChunkIsUnique = (chunkSize: number) => (_value, i, array) =>
  i >= (chunkSize - 1) 
    && new Set(array.slice(i - chunkSize + 1, i + 1)).size === chunkSize

function partOne() {
  const input = [...readLines(__dirname, inputFile())[0]]

  const firstNonRepeatedIndex = input.findIndex(previousChunkIsUnique(4)) + 1

  console.log("(P1) Answer: " + firstNonRepeatedIndex)
}

function partTwo() {
  const input = [...readLines(__dirname, inputFile())[0]]

  const firstNonRepeatedIndex = input.findIndex(previousChunkIsUnique(14)) + 1

  console.log("(P2) Answer: " + firstNonRepeatedIndex)
}


partOne()
partTwo()
