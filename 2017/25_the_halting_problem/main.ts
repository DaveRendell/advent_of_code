const states = {
  A: [
    { write: 1, move: 1, next: "B" },
    { write: 0, move: -1, next: "E" },
  ],
  B: [
    { write: 1, move: -1, next: "C" },
    { write: 0, move: 1, next: "A" },
  ],
  C: [
    { write: 1, move: -1, next: "D" },
    { write: 0, move: 1, next: "C" },
  ],
  D: [
    { write: 1, move: -1, next: "E" },
    { write: 0, move: -1, next: "F" },
  ],
  E: [
    { write: 1, move: -1, next: "A" },
    { write: 1, move: -1, next: "C" },
  ],
  F: [
    { write: 1, move: -1, next: "E" },
    { write: 1, move: 1, next: "A" },
  ]
}

let tape = []
let state: string = "A"
let position = 0
let diagnosticCount = 0

for (let i = 0; i < 12386363; i++) {
  const current = tape[position] || 0
  const { write, move, next } = states[state][current]
  tape[position] = write
  if (!current && write) { diagnosticCount++ }
  if (current && !write) { diagnosticCount-- }
  position += move
  state = next
}


console.log("(P1): ", diagnosticCount)

console.log("(P2): ", 0)

export {}