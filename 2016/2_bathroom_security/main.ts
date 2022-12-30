import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import Vector2 from "../../utils/vector2"

const input = readLines(__dirname, inputFile())
const directions = {
  U: Vector2.UP, R: Vector2.RIGHT, D: Vector2.DOWN, L: Vector2.LEFT
}

let position = new Vector2(2, 2)
let buttons: (number | string)[] = []

for (const line of input) {
  for (const char of line) {
    const move = position.add(directions[char])
    if (move.inBounds(1, 3, 1, 3)) { position = move }
  }
  buttons.push(position.x + 3 * (position.y - 1))
}

console.log("(P1): " + buttons.join(""))

const keypad = [
  [undefined, undefined, 1],
  [undefined, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [undefined, "A", "B", "C"],
  [undefined, undefined, "D"],
]

position = new Vector2(0, 2)
buttons = []

for (const line of input) {
  for (const char of line) {
    const move = position.add(directions[char])
    if (keypad[move.y] && keypad[move.y][move.x]) { position = move }
  }
  buttons.push(keypad[position.y][position.x])
}

console.log("(P2): " + buttons.join(""))