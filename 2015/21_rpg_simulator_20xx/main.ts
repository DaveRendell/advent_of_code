import { range } from "../../utils/numbers"
import { sum } from "../../utils/reducers"

interface Item { cost: number, damage: number, armour: number }
const WEAPONS: Item[] = [
  { cost: 8, damage: 4, armour: 0 },
  { cost: 10, damage: 5, armour: 0 },
  { cost: 25, damage: 6, armour: 0 },
  { cost: 40, damage: 7, armour: 0 },
  { cost: 74, damage: 8, armour: 0 },
]
const ARMOUR: Item[] = [
  { cost: 0, damage: 0, armour: 0 },
  { cost: 13, damage: 0, armour: 1 },
  { cost: 31, damage: 0, armour: 2 },
  { cost: 53, damage: 0, armour: 3 },
  { cost: 75, damage: 0, armour: 4 },
  { cost: 102, damage: 0, armour: 5 },
]
const RINGS: Item[] = [
  { cost: 0, damage: 0, armour: 0 },
  { cost: 0, damage: 0, armour: 0 },
  { cost: 25, damage: 1, armour: 0 },
  { cost: 50, damage: 2, armour: 0 },
  { cost: 100, damage: 3, armour: 0 },
  { cost: 20, damage: 0, armour: 1 },
  { cost: 40, damage: 0, armour: 2 },
  { cost: 80, damage: 0, armour: 3 },
]

const winsBattle = (damage: number, armour: number): boolean => {
  const bossDps = Math.max(1, 8 - armour)
  const playerDps = Math.max(1, damage - 2)
  return playerDps >= bossDps
}

let cheapestWinner = Infinity
let spenniestLoser = 0
range(0, WEAPONS.length).map(weaponId =>
  range(0, ARMOUR.length).map(armourId =>
    range(0, RINGS.length).map(leftRingId =>
      range(0, RINGS.length)
        .filter(i => i !== leftRingId)
        .map(rightRingId => {
          const items = [
            WEAPONS[weaponId],
            ARMOUR[armourId],
            RINGS[leftRingId],
            RINGS[rightRingId],
          ]
          const cost = items.map(({cost}) => cost).reduce(sum)
          const damage = items.map(({damage}) => damage).reduce(sum)
          const armour = items.map(({armour}) => armour).reduce(sum)
          if (winsBattle(damage, armour)) {
            cheapestWinner = Math.min(cost, cheapestWinner)
          } else {
            spenniestLoser = Math.max(cost, spenniestLoser)
          }
        }))))

console.log("(P1): " + cheapestWinner)
console.log("(P2): " + spenniestLoser)