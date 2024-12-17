import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { chunks, min } from "../../utils/reducers"

const input = readNumbersFromLines(__dirname, inputFile())

const registers: Record<string, bigint> = {
  a: BigInt(input[0][0]),
  b: BigInt(input[1][0]),
  c: BigInt(input[2][0]),
}

const program = input[4]

const run = (
  program: number[],
  registers: Record<string, bigint>
): string => {
  let pointer = 0
  const output: bigint[] = []

  const getCombo = (operand: number): bigint =>
    operand < 4
      ? BigInt(operand)
      : BigInt(registers["abc"[operand - 4]])

  executionLoop:
  while (pointer < program.length) {
    const opcode = program[pointer]
    const literal = program[pointer + 1]

    switch (opcode) {
      case 0: //adv
        registers.a = registers.a >> getCombo(literal)
        pointer += 2
        continue executionLoop
      case 1: //bxl
        registers.b = registers.b ^ BigInt(literal)
        pointer += 2
        continue executionLoop
      case 2: //bst
        registers.b = getCombo(literal) & BigInt(0x7)
        pointer += 2
        continue executionLoop
      case 3: //jnz
        if (registers.a) {
          pointer = literal
        } else {
          pointer += 2
        }
        continue executionLoop
      case 4: //bxc
        registers.b = registers.b ^ registers.c
        pointer += 2
        continue executionLoop
      case 5: //out
        output.push(getCombo(literal) & BigInt(0x7))
        pointer += 2
        continue executionLoop
      case 6: //bdv
        registers.b = registers.a >> getCombo(literal)
        pointer += 2
        continue executionLoop
      case 7: //cdv
        registers.c = registers.a >> getCombo(literal)
        pointer += 2
        continue executionLoop
    }
  }

  return output.join(",")
}

console.log("(P1): ", run(program, registers))

const assem = program.reduce(chunks(2), [[]])
  .map(([opCode, literal]) => {
    const combo = literal < 4
      ? literal
      : "abc"[literal - 4]
    switch (opCode) {
      case 0: return `adv ${combo}`
      case 1: return `bxl ${literal}`
      case 2: return `bst ${combo}`
      case 3: return `jnz ${literal}`
      case 4: return `bxc`
      case 5: return `out ${combo}`
      case 6: return `bdv ${combo}`
      case 7: return `cdv ${combo}`
    }
  })
console.log("Program assembly:")
console.log(assem.join("\n"))

/*
bst a
bxl 3
cdv b
bxl 5
adv 3
bxc
out b
jnz 0
*/

/*
b = a & 0x7
b = b ^ 0b11
c = a >> b
b = b ^ 0b101
a = a >> 3
b = b ^ c
out b
back to start
*/

let possibleAs = [BigInt(0)];
([...program]).reverse().forEach((chunk, j) => {
  let newPossibleAs = []
  for (const a of possibleAs) {
    for (let i = 0; i < 8; i++) {
      let possibleA = (a * BigInt(8)) | BigInt(i)
      let b = possibleA & BigInt(0x7)
      b ^= BigInt(3)
      let c = possibleA >> b
      b ^= BigInt(5)
      if (BigInt(chunk) === ((c ^ b) & BigInt(0x7))) {
        newPossibleAs.push(possibleA)
      }
    }
  }
  
  if (newPossibleAs.length === 0) { throw new Error("No new possible As found")}

  possibleAs = newPossibleAs
})

const a = possibleAs.reduce((a, b) => a < b ? a : b)

console.log("(P2): ", String(a))

// Verify
console.log("expected\t", program.join(","))
console.log("actual\t\t", run(program, {a, b: BigInt(0), c: BigInt(0)}))