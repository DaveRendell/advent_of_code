import HashSet from "../../utils/hashset";
import { range } from "../../utils/numbers";
import Vector2 from "../../utils/vector2";

function knotHash(input: string): number[] { // taken from reddit
  let lengths = [...input].map(x => x.charCodeAt(0));
  let numbers = [...Array(256).keys()];
  let pos = 0, skip = 0;
  let denseHash: number[] = [];
  
  lengths.push(17, 31, 73, 47, 23);
  
  for (let i = 0; i < 64; i++) {
      for (const len of lengths) {
          if (len > 1) {
              numbers = [...numbers.slice(pos), ...numbers.slice(0, pos)];
              numbers = [...numbers.slice(0, len).reverse(), ...numbers.slice(len)];
              numbers = [...numbers.slice(-pos), ...numbers.slice(0, -pos)];
          }
          pos = (pos + len + skip++) % 256;
      }
  }
  
  for (let i = 0; i < 16; i++) {
      const o = numbers.slice(i * 16, i * 16 + 16).reduce((a, b) => a ^ b);
      denseHash.push(o);
  }

  return denseHash
}

const input = "wenycdww"

const map = range(0, 128)
  .map(i => `${input}-${i}`)
  .map(key => knotHash(key).map(x =>
    x.toString(2).padStart(8, "0")).join("").split(""))

const squareCount = map.join("\n").split("")
  .filter(c => c === "1")
  .length

console.log("(P1): " + squareCount)

const grouped = new HashSet<Vector2>(v => v.toString(), [])
let groups = 0

for (let x = 0; x < 128; x++) {
  for (let y = 0; y < 128; y++) {
    const v = new Vector2(x, y)
    if (!grouped.has(v) && map[v.y][v.x] === "1") {
      grouped.add(v)
      let edges = [v]
      while (edges.length > 0) {
        let newEdges = edges
          .flatMap(e => e.neighbours4(0, 127, 0, 127))
          .filter(e => map[e.y][e.x] === "1")
          .filter(e => !grouped.has(e))
        newEdges.forEach(e => grouped.add(e))
        edges = newEdges
      }
      groups++
    }
  }
}

console.log("(P2): " + groups)
