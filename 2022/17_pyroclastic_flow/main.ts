import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, min } from "../../utils/reducers"
import { inclusiveRange, range } from "../../utils/numbers"

type Coordinate = number[]
interface Caldera { rocks: Coordinate[], jets: number[], jetCursor: number }

const WIDTH = 7
const SHAPES = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [0, 1], [1, 1]]
]

function partOne() {
  const jets = [...readLines(__dirname, inputFile())[0]]
    .map(jet => jet === ">" ? 1 : -1)

  let caldera: Caldera = { rocks: [], jets, jetCursor: 0 }

  for (let i = 0; i < 2022; i++) {
    const shape = SHAPES[i % SHAPES.length]
    caldera = dropShape(caldera, shape)
  }

  const answer = maxHeight(caldera.rocks)
  console.log("(P1) Answer: " + answer)
}

interface PeriodictyMarker { round: number, jetCursor: number, mould: string, height: number }

function partTwo() {
  const jets = [...readLines(__dirname, inputFile())[0]]
    .map(jet => jet === ">" ? 1 : -1)
  
  const iterations = 1000000000000

  let caldera: Caldera = { rocks: [], jets, jetCursor: 0 }
  let round = 0
  let markers: PeriodictyMarker[] = [{
    round,
    jetCursor: 0,
    mould: generateMould(caldera),
    height: 0
  }]

  loopFinder:
  while (round <= iterations / SHAPES.length) {
    round++
    for (let i = 0; i < SHAPES.length; i++) {
      caldera = dropShape(caldera, SHAPES[i])
    }
    const newMould = generateMould(caldera)
    const newHeight = maxHeight(caldera.rocks)
    const match = markers
      .filter(({jetCursor}) => jetCursor === caldera.jetCursor)
      .find(({mould}) => mould === newMould)
    
    if (match) {
      console.log(`Loop found between shapes ${match.round * SHAPES.length + 1} and ${round * SHAPES.length + 1}`)
      const period = SHAPES.length * (round - match.round)
      const loopStarted = match.round * SHAPES.length
      const loops = Math.floor((iterations - loopStarted) / period) - 1
      const loopHeight = newHeight - match.height
      const remainder = (iterations - loopStarted) % period
      for (let i = 0; i < remainder; i++) {
        caldera = dropShape(caldera, SHAPES[i % SHAPES.length])
      }
      const remainderHeight = maxHeight(caldera.rocks)

      const finalHeight = loops * loopHeight + remainderHeight
      console.log("(P2) Answer: " + finalHeight)

      break loopFinder
    }
        
    markers.push({
      round,
      jetCursor: caldera.jetCursor,
      mould: newMould,
      height: newHeight
    })
  }
}

const generateMould = (caldera: Caldera): string => {
  const maxRow = maxHeight(caldera.rocks)
  let mould: Set<Coordinate> = new Set(range(0, 7).map(col => [col, maxRow]))
  let updates: Set<Coordinate> = new Set([...mould])
  const mouldHas = ([x, y]: Coordinate): boolean =>
    [...mould].some(([u, w]) => u === x && w === y)

  while (updates.size > 0) {
    let newUpdates: Set<Coordinate> = new Set()
    for (const [x, y] of updates) {
      [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
        .filter(([i, _]) => i >= 0 && i < WIDTH)
        .filter(([_, j]) => j >= 0 && j <= maxRow)
        .filter(([i, j]) => !caldera.rocks.some(([rI, rJ]) => rI === i && rJ === j))
        .forEach(cell => {
          if (!mouldHas(cell)) {
            mould.add(cell)
            newUpdates.add(cell)
          }
        })
    }
    updates = newUpdates
  }
  const minRow = [...mould].map(([_, y]) => y).reduce(min)
  return inclusiveRange(minRow, maxRow)
    .map(row =>
      range(0, WIDTH).map(col => mouldHas([col, row]) ? "." : "#").join(""))
    .reverse()
    .join("\n")  
}

const dropShape = (
  { rocks, jets, jetCursor}: Caldera,
  shape: Coordinate[]
): Caldera => {
  let cursor = jetCursor
  let [x, y] = [
    2 + jets[cursor],
    maxHeight(rocks) + 3
  ]
  cursor = (cursor + 1) % jets.length

  const isValid = isValidPosition(rocks, shape)
  while (isValid([x, y - 1])) {
    y--
    if (isValid([x + jets[cursor], y])) {
      x += jets[cursor]
    }
    cursor = (cursor + 1) % jets.length        
  }
  return {
    rocks: [...rocks, ...shape.map(([i, j]) => [i + x, j + y])],
    jets,
    jetCursor: cursor
  }  
}

const isValidPosition = (rocks: Coordinate[], shape: Coordinate[]) =>
  ([x, y]: Coordinate): boolean => shape
    .map(([i, j]) => [x + i, y + j])
    .every(([i, j]) => i >= 0 && i < WIDTH 
                       && j >= 0 
                       && !rocks.some(([rX, rY]) => rX === i && rY === j))

const maxHeight = (rocks: Coordinate[]): number =>
  rocks.map(([_, y]) => y).reduce(max, -1) + 1

const draw = (rocks: Coordinate[], shape: Coordinate[], position: Coordinate): string =>
  inclusiveRange(0, maxHeight([...rocks, ...shape.map(([x, y]) => [x + position[0], y + position[1]])]))
    .map(row =>
      `|${row.toString().padStart(2)}|` + range(0, 7)
        .map(col =>
          rocks.some(([x, y]) => x === col && y === row)
            ? "██"
            : shape.some(([x, y]) => x + position[0] === col && y + position[1] === row) ? "##" : ". ")
        .join("") + "||||")
    .reverse()
    .join("\n") + "\n++++==============++++"

partOne()
partTwo()
