import { factors, lcm, range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

const n = 29000000
let bound = n / 10
let houses = new Array(bound + 1).fill(0)

for (let elf = 1; elf <= bound; elf++) {
  for (let house = elf; house <= bound; house += elf) {
    houses[house] += 10 * elf
  }
}

const answerP1 = houses.findIndex(presents => presents >= n)

console.log("(P1): " + answerP1)

houses = new Array(bound + 1).fill(0)

for (let elf = 1; elf <= bound; elf++) {
  const end = Math.min(bound, 50 * elf)
  for (let house = elf; house <= end; house += elf) {
    houses[house] += 11 * elf
  }
}
const answerP2 = houses.findIndex(presents => presents >= n)

console.log("(P2): " + answerP2)