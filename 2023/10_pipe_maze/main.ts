import { drawGrid } from "../../utils/drawGrid"
import HashSet from "../../utils/hashset"
import inputFile from "../../utils/inputFile"
import readCharArray from "../../utils/readCharArray"
import Vector2 from "../../utils/vector2"

const input = readCharArray(__dirname, inputFile())

const sY = input.findIndex(row => row.includes("S"))
const sX = input[sY].findIndex(x => x == "S")
const s = new Vector2(sX, sY)

const inputAt = (v: Vector2) =>
  v.inBounds(0, input[0].length, 0, input.length) ? input[v.y][v.x]: "."


const getPipe = (start: Vector2): [HashSet<Vector2>, string[]] => {
  const startPoints = [
    "|7F".includes(inputAt(start.up())) ? [start.up()] : [],
    "|JL".includes(inputAt(start.down())) ? [start.down()] : [],
    "-LF".includes(inputAt(start.left())) ? [start.left()] : [],
    "-J7".includes(inputAt(start.right())) ? [start.right()] : [],
  ].flat()

  const pipe = new HashSet(v => v.toString(), [...startPoints, start])
  let edges = new HashSet(v => v.toString(), startPoints)

  while (edges.size > 0) {
    const next = new HashSet<Vector2>(v => v.toString())
    edges.entries().forEach(edge => {
      [
        "|JL".includes(inputAt(edge)) ? [edge.up()] : [],
        "|7F".includes(inputAt(edge)) ? [edge.down()] : [],
        "-7J".includes(inputAt(edge)) ? [edge.left()] : [],
        "-FL".includes(inputAt(edge)) ? [edge.right()] : []
      ].flat()
        .filter(v => !pipe.has(v))
        .forEach(v => {
          pipe.add(v)
          next.add(v)
        })
    })
    edges = next
  }

  return [pipe, []]
}

const [pipe, directions] = getPipe(s)

// const right: { [tile: string]: (v: Vector2) => Vector2 } = {
//   "-"
// }

drawGrid(input, (v) => pipe.has(v), () => false, "").forEach(r => console.log(r))

console.log("(P1): " + Math.ceil(pipe.size / 2))

console.log("(P2): " + 0)