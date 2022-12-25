let password = "vzbxkghb".split("")

const hasTriple = (password: string[]): boolean =>
  password.map(c => c.charCodeAt(0))
    .some((code, i, codes) =>
      codes[i + 1] === code + 1
      && codes[i + 2] === code + 2)
  
const noForbiddenLetters = (password: string[]): boolean =>
  "iol".split("").every(c => !password.includes(c))

const hasTwoPairs = (password: string[]): boolean => {
  const firstPairIndex = password.findIndex((c, i) => c === password[i + 1])
  if (firstPairIndex === -1) { return false }
  return [
    ...password.slice(0, firstPairIndex),
    ..."$£",
    ...password.slice(firstPairIndex + 2)
  ].some((c, i, sliced) => sliced[i + 1] === c)
}

const increment = (password: string[]): string[] => {
  const updated: string[] = []
  let carried = 1
  for (let i = 0; i < password.length; i++) {
    const code = password[password.length - i - 1].charCodeAt(0) + carried
    if (code > "z".charCodeAt(0)) {
      updated.push(String.fromCharCode(code - 26))
      carried = 1
    } else {
      updated.push(String.fromCharCode(code))
      carried = 0
    }
  }
  return updated.reverse()
}

while (!(hasTriple(password) && noForbiddenLetters(password) && hasTwoPairs(password))) {
  password = increment(password)
}

console.log()

console.log("(P1): " + password.join(""))

password = increment(password)
while (!(hasTriple(password) && noForbiddenLetters(password) && hasTwoPairs(password))) {
  password = increment(password)
}

console.log("(P2): " + password.join(""))