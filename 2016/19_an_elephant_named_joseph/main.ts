import Cycle from "../../utils/cycle"
import { range } from "../../utils/numbers"

interface Elf { id: number, presents: number }

function calculateLuckyElfAdj(numberOfElves: number): number {
  let elfCircle: Cycle<Elf> = Cycle.fromValues(range(0, numberOfElves)
    .map(i => ({ id: i + 1, presents: 1 })))

  while (elfCircle.next != elfCircle) {
    if (elfCircle.value.presents == 0) {
      elfCircle = elfCircle.next
      elfCircle.removePrevious()
    } else {
      elfCircle.value = {
        ...elfCircle.value,
        presents: elfCircle.value.presents + elfCircle.next.value.presents
      }
      elfCircle.next.value = {
        ...elfCircle.next.value,
        presents: 0
      }
      elfCircle = elfCircle.next
    }
  }
  return elfCircle.value.id
}

function calculateLuckyElfOpposite(numberOfElves: number): number {
  let elves = range(1, numberOfElves + 1)
  let elfCount = numberOfElves
  let currentElfIndex = 0

  while (elfCount > 1) {
    let numberToSearch = Math.floor(elfCount / 2)
    let searchIndex = currentElfIndex
    while (numberToSearch > 0) {
      if (elves[++searchIndex]) { numberToSearch-- }
    }
    elves[searchIndex] = 0
    elfCount--
    while(elves[++currentElfIndex]) {}
  }
  return elves.find(elf => elf)
}

const testCycle = Cycle.fromValues(["a", "b", "c", "d", "e"])

testCycle.removeAtPositionAhead(2)
console.log(testCycle.getNext(8))

console.log("(P1): " + calculateLuckyElfAdj(5))

console.log("(P2): " + calculateLuckyElfOpposite(5))