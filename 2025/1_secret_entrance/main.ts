import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { positiveMod } from "../../utils/numbers"

const input: number[] = readLines(__dirname, inputFile())
    .map(line => (line[0] === "R" ? 1 : -1) * Number(line.slice(1)))

const getP1Password = (instructions: number[]): number => {
    let dial = 50
    let count = 0
    const size = 100

    for (let instruction of instructions) {
        dial = positiveMod(dial + instruction, size)
        if (dial === 0) { count++ } 
    }

    return count
}

const getP2Password = (instructions: number[]): number => {
    let dial = 50
    let count = 0
    const size = 100

    for (let instruction of instructions) {
        let direction = Math.sign(instruction)
        let length = Math.abs(instruction)

        for (let _i = 0; _i < length; _i++) {
            dial = positiveMod(dial + direction, size)
            if (dial == 0) { count++ }
        }
    }

    return count
}

console.log("(P1): ", getP1Password(input))

console.log("(P2): ", getP2Password(input)) // 6520 too low
