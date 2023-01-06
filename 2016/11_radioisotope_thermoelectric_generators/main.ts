import HashMap from "../../utils/hashmap"
import Queue from "../../utils/queue"
import { sum } from "../../utils/reducers"
import { descending, descendingBy } from "../../utils/sorters"

interface State {
  elevator: number,
  elements: Element[]
}

interface Element { chip: number, gen: number }

const input: State = {
  elevator: 1,
  elements: [
    { chip: 1, gen: 1 },
    { chip: 3, gen: 2 },
    { chip: 3, gen: 2 },
    { chip: 3, gen: 2 },
    { chip: 3, gen: 2 },
  ]
}

const getEnd = ({ elements }: State): State => ({
  elevator: 4,
  elements: elements.map(() => ({ chip: 4, gen: 4 }))
})

const hash = ({ elevator, elements }: State): string =>
  [elevator, ...elements.map(({ chip, gen }) =>
    5 * chip + gen).sort(descending)
  ].join("-")

const p1Start = input

const moves = ({ elevator, elements }: State): State[] =>
  [elevator - 1, elevator + 1]
    .filter(floor => floor >= 1 && floor <= 4)
    .flatMap(floor => {
      let moves: State[] = []
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].chip === elevator && elements[i].gen === elevator) {
          moves.push({
            elevator: floor,
            elements: elements.map((e, k) => k === i ? { chip: floor, gen: floor } : e)
          }) // take chip and matching RTG
        }
        if (elements[i].chip === elevator) {
          moves.push({
            elevator: floor,
            elements: elements.map((e, k) => k === i ? { chip: floor, gen: e.gen } : e)
          }) // take just this chip
          for (let j = i + 1; j < elements.length; j++) {
            if (elements[j].chip === elevator) {
              moves.push({
                elevator: floor,
                elements: elements
                  .map((e, k) => k === i ? { chip: floor, gen: e.gen } : e)
                  .map((e, k) => k === j ? { chip: floor, gen: e.gen } : e)
              }) // take two chips
            }
          }
        }
        if (elements[i].gen === elevator) {
          moves.push({
            elevator: floor,
            elements: elements.map((e, k) => k === i ? { chip: e.chip, gen: floor } : e)
          }) // take just this rtg
          for (let j = i + 1; j < elements.length; j++) {
            if (elements[j].gen === elevator) {
              moves.push({
                elevator: floor,
                elements: elements
                  .map((e, k) => k === i ? { chip: e.chip, gen: floor } : e)
                  .map((e, k) => k === j ? { chip: e.chip, gen: floor } : e)
              }) // take two chips
            }
          }
        }
      }
      return moves
        .filter(({elements}) => elements.every(({ chip, gen }) =>
          chip === gen || elements.every(e => e.gen !== chip)))
    })

const minimumSteps = (state: State): number => {
  const end: State = getEnd(state)
  const quickest: HashMap<State, number> = new HashMap(hash, [[state, 0]])
  const todo: Queue<State> = new Queue()
  let currentBest = Infinity
  todo.add(state)

  while (todo.hasNext()) {
    const next = todo.receive()
    const steps = quickest.get(next)

    if (next.elements.every(({ chip, gen }) => chip === 4 && gen === 4)) {
      if (steps < currentBest) {
        currentBest = steps
        console.log("New current best: " + currentBest)
      }
    }

    // ignore this branch if already exists faster solution
    if (currentBest <= steps + 1) { continue }

    moves(next)
      .filter(s => !quickest.has(s) || quickest.get(s) > steps + 1)
      .forEach(s => {
        quickest.set(s, steps + 1)
        todo.add(s)
      })
  }
  return quickest.get(end)
}

console.log("(P1): " + minimumSteps(p1Start))

const p2Start: State = {
  elevator: 1,
  elements: [...p1Start.elements, { chip: 1, gen: 1 }, { chip: 1, gen: 1 }]
}

console.log("(P2): " + minimumSteps(p2Start))