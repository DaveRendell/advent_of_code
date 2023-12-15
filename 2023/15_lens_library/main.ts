import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import HashMap from "../../utils/hashmap"

const input = readLines(__dirname, inputFile())[0].split(",")

const hash = (str: string): number => str.split("")
  .map(c => c.charCodeAt(0))
  .reduce((acc, next) => ((acc + next) * 17) & 0xFF, 0)

console.log("(P1): " + input.map(hash).reduce(sum))

interface Lens { label: string, focalLength: number }
const boxes = new HashMap<string, Lens[]>(hash, [])

input.forEach(instruction => {
  if (instruction.endsWith("-")) {
    const labelToDelete = instruction.slice(0, -1)
    if (boxes.has(labelToDelete)) {
      boxes.set(
        labelToDelete,
        boxes.get(labelToDelete).filter(({label}) => label !== labelToDelete))
      if (boxes.get(labelToDelete).length == 0) { boxes.remove(labelToDelete) }
    }
  } else {
    const [labelToAdd, length] = instruction.split("=")
    const newLens = { label: labelToAdd, focalLength: parseInt(length) }
    if (!boxes.has(labelToAdd)) {
      boxes.set(labelToAdd, [newLens])
    } else {
      const existingLensPosition = boxes.get(labelToAdd)
        .findIndex(({label}) => label == labelToAdd)
      if (existingLensPosition == -1) {
        boxes.set(
          labelToAdd,
          [...boxes.get(labelToAdd), newLens]
        )
      } else {
        boxes.get(labelToAdd).splice(existingLensPosition, 1, newLens)
      }
    }
  }
  // Uncomment to debug
  
  // for (let i = 0; i < 256; i++) {
  //   if (boxes.data.has(i)) {
  //     const box = boxes.data.get(i)
  //     const printLens = (l: Lens): string => `[${l.label} ${l.focalLength}]`
  //     console.log(`Box ${i}: ${box[1].map(printLens).join(" ")}`)
      
  //   }    
  // }
  // console.log("-----")
})

const focusingPower = Array.from(boxes.data.entries())
  .map(([boxId, lensList]) =>
    (1 + (boxId as number)) * lensList[1]
      .map((lens, i) => (i + 1) * lens.focalLength)
      .reduce(sum))
  .reduce(sum)

console.log("(P2): " + focusingPower)