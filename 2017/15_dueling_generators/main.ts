const gen = (start: number, multiplier: number, test: number) => function* () {
  let x = start
  while(true) {
    x *= multiplier
    x %= 2147483647
    if (x % test == 0) { yield x }
  }
}

const aGenP1 = gen(722, 16807, 1)()
const bGenP1 = gen(354, 48271, 1)()
let matchCount = 0
for (let i = 0; i < 40_000_000; i++) {
  let a = aGenP1.next().value
  let b = bGenP1.next().value
  if ((a & 0xFFFF) == (b & 0xFFFF)) { matchCount++ }
}
console.log("(P1): " + matchCount)

const aGenP2 = gen(722, 16807, 4)()
const bGenP2 = gen(354, 48271, 8)()
matchCount = 0
for (let i = 0; i < 5_000_000; i++) {
  let a = aGenP2.next().value
  let b = bGenP2.next().value
  if ((a & 0xFFFF) == (b & 0xFFFF)) { matchCount++ }
}
console.log("(P2): " + matchCount)