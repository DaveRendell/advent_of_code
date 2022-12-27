import Display from "../../utils/display"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import readCharArray from "../../utils/readCharArray"
import Vector2 from "../../utils/vector2"

let input = readCharArray(__dirname, inputFile())
const size = input.length
const bounds = [0, size - 1, 0, size - 1]
const display = new Display()



const step = (grid: string[][], deadPixels: Vector2[]) => {
  const gridValue = ({ x, y }: Vector2): boolean =>
    grid[y][x] === "#"
  
  return range(0, size).map(y =>
    range(0, size).map(x => {
      const position = new Vector2(x, y)
      if (deadPixels.some(v => position.equals(v))) { return "#" }
      const neighboursOn = position.neighbours8(...bounds).filter(gridValue).length
      if (gridValue(position)) {
        return [2, 3].includes(neighboursOn) ? "#" : "."
      } else {
        return neighboursOn === 3 ? "#" : "."
      }
    }))
}

const draw = (grid: string[][]): string =>
  grid.map(row => row.join(" ")).join("\n")
  
let grid = input
//display.print("Step 0")
//display.print(draw(grid))
for (let i = 1; i <= 100; i++) {
  //display.clear()
  //display.print("Step " + i)
  grid = step(grid, [])
  //display.print(draw(grid))
}

console.log("(P1): " + grid.flat().filter(x => x === "#").length)

grid = input
grid[0][0] = "#"
grid[0][size - 1] = "#"
grid[size - 1][0] = "#"
grid[size - 1][size - 1] = "#"
display.print("Step 0")
display.print(draw(grid))
for (let i = 1; i <= 100; i++) {
  //display.clear()
  //display.print("Step " + i)
  grid = step(grid, [
    new Vector2(0, 0), new Vector2(0, size - 1),
    new Vector2(size - 1, 0), new Vector2(size - 1, size - 1)])
  //display.print(draw(grid))
}

console.log("(P2): " + grid.flat().filter(x => x === "#").length)