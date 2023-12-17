const runSpinlock = (step: number, values: number): number => {
  const buffer = [0]
  let position = 0

  for (let i = 1; i <= values; i++) {
    if (i % 10000 == 0) { console.log(Math.floor(100 * i / values).toString() + "%") }
    position += step + 1
    position %= buffer.length
    buffer.splice(position, 0, i)
  }

  return buffer[(position + 1) % buffer.length]
}

console.log("(P1): " + runSpinlock(359, 2017)[0])

let position = 0
let value = 0
for (let i = 1; i <= 50_000_000; i++) {
  position = ((359 + position) % i) + 1
  if (position == 1) {
    value = i
  }
}


console.log("(P2): " + value)