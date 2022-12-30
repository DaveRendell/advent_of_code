import Queue from "../../utils/queue"
import { sum } from "../../utils/reducers"

interface Spell {
  mana: number,
  damage?: number,
  heal?: number,
  effect?: Effect,
}
interface Effect {
  name: string,
  turns: number,
  armour?: number,
  damage?: number,
  mana?: number,
}
interface State {
  turn: "player" | "boss"
  playerHP: number,
  bossHP: number,
  mana: number,
  effects: Effect[],
  manaSpent: number,
  log: string[],
}
const SPELLS: Spell[] = [
  { mana: 0 },
  { mana: 53, damage: 4 },
  { mana: 73, damage: 2, heal: 2 },
  { mana: 113, effect: { name: "shield", turns: 6, armour: 7 } },
  { mana: 173, effect: { name: "poison", turns: 6, damage: 3 } },
  { mana: 229, effect: { name: "rechge", turns: 5, mana: 101 } },
]

const start: State = {
  turn: "player",
  playerHP: 50,
  bossHP: 51,
  mana: 500,
  effects: [],
  manaSpent: 0,
  log: []
}

let inProgress: Queue<State> = new Queue()
let leastMana = Infinity

inProgress.add(start)

bfs:
while (inProgress.hasNext()) {
  // Apply effects
  // Decrement counters
  // Check for boss death
  
  let state = inProgress.receive()
  if (state.turn === "player") {
    // iterate over possible spells
  } else {
    // do damage, check for player death
  }
}

console.log("(P1): " + 0)

console.log("(P2): " + 0)