import HashSet from "../../utils/hashset"

interface State {
  elevator: number,
  chips: number[],
  rtgs: number[],
}

const sample: State = {
  elevator: 1,
  chips: [1, 1],
  rtgs: [2, 3],
}

const input: State = {
  // promethium, cobalt, curium, rutherium, plutonium
  elevator: 1,
  chips: [1, 3, 3, 3, 3],
  rtgs: [1, 2, 2, 2, 2],
}

const start = input
const end: State = { ...start, chips: start.chips.map(() => 4), rtgs: start.rtgs.map(() => 4)}

const moves = (state: State): State[] =>
  [state.elevator - 1, state.elevator + 1]
    .filter(floor => floor >= 1 && floor <= 4)
    .flatMap(floor => {
      let moves: State[] = []
      moves.push({ ...state, elevator: floor }) // take nothing
      for (let i = -1; i < state.chips.length - 1; i++) {
        for (let j = i + 1; j < state.chips.length; j++) {
          if ((i === -1 || state.chips[i] === state.elevator) && state.chips[j] === state.elevator) {
            moves.push({
              ...state,
              elevator: floor,
              chips: state.chips.map((c, k) =>
                [i, j].includes(k) ? floor : c)
            }) // take chips
          }
          if ((i === -1 || state.rtgs[i] === state.elevator) && state.rtgs[j] === state.elevator) {
            moves.push({
              ...state,
              elevator: floor,
              rtgs: state.rtgs.map((r, k) =>
                [i, j].includes(k) ? floor : r)
            }) // take rtgs
          }
        }
      }
      for (let i = 0; i < state.chips.length; i++) {
        if (state.chips[i] === state.elevator && state.rtgs[i] === state.elevator) {
          moves.push({
            elevator: floor,
            chips: state.chips.map((c, j) => j === i ? floor : c),
            rtgs: state.rtgs.map((r, j) => j === i ? floor : r)
          }) // take chip and matching RTG
        }
      }
      return moves
        .filter(({chips, rtgs}) => chips
          .every((c, i) => rtgs[i] === c || rtgs.every(r => r !== c)))
    })

const states: HashSet<State> = new HashSet(JSON.stringify, [start])
let steps = -1

while (!states.has(end)) {
  steps++
  if (steps % 10 === 0) { console.log(states.size) }
  states.entries().forEach(state =>
    moves(state).forEach(next => states.add(next)))
}

console.log("(P1): " + steps) //not 19

console.log("(P2): " + 0)