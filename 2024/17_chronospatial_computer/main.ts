import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { range } from "../../utils/numbers"

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

let possibleAs = [BigInt(0)];
([...program]).reverse().forEach((_, j, reversed) => {
  possibleAs = possibleAs.flatMap(a =>
    range(0, 8)
      .map(i => (a << BigInt(3)) | BigInt(i)))
      .filter(possibleA => {
        const actual = run(program, { a: possibleA, b: BigInt(0), c: BigInt(0) })
        const expected = reversed.slice(0, j + 1).reverse().join(",")
        return actual === expected
      })
})

const a = possibleAs.reduce((a, b) => a < b ? a : b)

console.log("(P2): ", String(a))

// Verify
console.log("expected\t", program.join(","))
console.log("actual\t\t", run(program, {a, b: BigInt(0), c: BigInt(0)}))