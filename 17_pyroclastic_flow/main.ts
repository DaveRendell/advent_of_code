import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max } from "../utils/reducers"
import { inclusiveRange, range } from "../utils/numbers"

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

  let caldera: Caldera = { rocks: [], jets, jetCursor: 0}

  for (let i = 0; i < 1000000000000; i++) {
    const shape = SHAPES[i % SHAPES.length]
    caldera = dropShape(caldera, shape)
    if (i % 10000 === 0) {
      console.log("Shape " + i)
    }
    //console.log(draw(caldera.rocks, [], [0, 0]))
  }

  const answer = maxHeight(caldera.rocks)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {}

const dropShape = (
  { rocks, jets, jetCursor}: Caldera,
  shape: Coordinate[]
): Caldera => {
  let cursor = jetCursor
  //console.log(jets[cursor] === 1 ? ">" : "<")
  let [x, y] = [
    2 + jets[cursor],
    maxHeight(rocks) + 3
  ]
  //console.log(draw(rocks, shape, [x, y]))
  cursor = (cursor + 1) % jets.length

  const isValid = isValidPosition(rocks, shape)
  while (isValid([x, y - 1])) {
    //console.log("V")
    y -= 1
    //console.log(draw(rocks, shape, [x, y]))
    const jetDirection = jets[cursor]
    //console.log(jetDirection === 1 ? ">" : "<")
    if (isValid([x + jetDirection, y])) {
      x += jetDirection
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
