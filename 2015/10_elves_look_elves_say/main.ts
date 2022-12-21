const input = [..."1113222113"]

const getRepeats = (repeats: [number, string][], next: string): [number, string][] =>
  repeats.at(-1) && repeats.at(-1)[1] === next
    ? [...repeats.slice(0, -1), [repeats.at(-1)[0] + 1, next]]
    : [...repeats, [1, next]]

let output = input
for (let i = 0; i < 40; i++) {
  console.log(i)
  output = [...output.reduce(getRepeats, []).flat().join("")]
}

console.log("(P1): " + output.length)

console.log("(P2): " + 0)