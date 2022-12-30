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
  { mana: 53, damage: 4 },
  { mana: 73, damage: 2, heal: 2 },
  { mana: 113, effect: { name: "shield", turns: 6, armour: 7 } },
  { mana: 173, effect: { name: "poison", turns: 6, damage: 3 } },
  { mana: 229, effect: { name: "rechge", turns: 5, mana: 101 } },
]

const simulate = (chipDamage: number): number => {
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
    let state = inProgress.receive()
    
    if (state.manaSpent >= leastMana) { continue bfs }
    const playerStartHp = state.turn === "player" 
      ? state.playerHP - chipDamage
      : state.playerHP
    if (playerStartHp <= 0) { continue bfs }   
  
    const armour =
      state.effects.map(({armour}) => armour ?? 0).reduce(sum, 0)
    const bossStartHp = state.bossHP
      - state.effects.map(({damage}) => damage ?? 0).reduce(sum, 0)
    const mana = state.mana
      + state.effects.map(({mana}) => mana ?? 0).reduce(sum, 0)
    const effects = state.effects
      .map(effect => ({ ...effect, turns: effect.turns - 1 }))
      .filter(effect => effect.turns > 0)
  
    if (bossStartHp <= 0) {
      leastMana = Math.min(leastMana, state.manaSpent)
      continue bfs
    }
  
    if (state.turn === "player") {
      SPELLS
        .filter(spell => spell.mana <= mana)
        .filter(spell => spell.effect === undefined
          || !effects.some(({name}) => name === spell.effect.name))
        .forEach(spell => inProgress.add({
          turn: "boss",
          playerHP: playerStartHp + (spell.heal ?? 0),
          bossHP: bossStartHp - (spell.damage ?? 0),
          mana: mana - spell.mana,
          effects: spell.effect ? [...effects, spell.effect] : effects,
          manaSpent: state.manaSpent + spell.mana,
          log: state.log
        }))
    } else {
      const playerHP = playerStartHp - Math.max(1, 9 - armour)
      if (playerHP <= 0) {
        continue bfs
      }
      inProgress.add({
        turn: "player",
        playerHP,
        bossHP: bossStartHp,
        mana,
        effects,
        manaSpent: state.manaSpent,
        log: state.log
      })
    }
  }
  return leastMana
}

console.log("(P1): " + simulate(0))
console.log("(P2): " + simulate(1))