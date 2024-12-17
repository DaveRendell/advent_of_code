import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import readNumbersFromLines from "../../utils/readNumbersFromLines"
import { chunks } from "../../utils/reducers"

const input = readNumbersFromLines(__dirname, inputFile())

const registers = {
  a: input[0][0],
  b: input[1][0],
  c: input[2][0],
}

const program = input[4]

const run = (
  program: number[],
  registers: Record<string, number>,
  matchProgram: boolean = false
): string => {
  let pointer = 0
  const output: number[] = []

  let matchPointer = 0

  const getCombo = (operand: number): number =>
    operand < 4
      ? operand
      : registers["abc"[operand - 4]]

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
        registers.b = registers.b ^ literal
        pointer += 2
        continue executionLoop
      case 2: //bst
        registers.b = getCombo(literal) & 0x7
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
        output.push(getCombo(literal) & 0x7)
        if (matchProgram) {
          if ((getCombo(literal) & 0x7) !== program[matchPointer++]) {
            return "NO MATCH"
          }
        }
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

console.log({ registers, program })

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

/*
take each 3 bit chunk of a, starting with lowest, [x y z]
b = [x ~y ~z]
c = a >> [x ~y ~z] (a >> [x ~y ~z])
b = [~x ~y z]
out (a >> [x ~y ~z]) ^ [~x ~y z]
*/

/*
2 => 010

*/


console.log("(P2): ", 0)