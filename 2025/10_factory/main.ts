import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import HashMap from "../../utils/hashmap"
import Queue from "../../utils/queue"
import { findLowestCosts } from "../../utils/pathFinding"
import { sum } from "../../utils/reducers"

interface Input {
    targetLayout: boolean[]
    buttons: number[][]
    joltages: number[]
}

const inputs: Input[] = readLines(__dirname, inputFile())
    .map(line => {
        const words = line.split(" ")
        const targetLayout = words[0].slice(1, -1).split("").map(c => c === "#")
        const buttons = words.slice(1, -1).map(s => s.slice(1, -1).split(",").map(Number))
        const joltages = words.at(-1).slice(1, -1).split(",").map(Number)
        return { targetLayout, buttons, joltages }
    })

const buttonPressesP1 = inputs.map(input => {
    const costs = findLowestCosts(
        (state: boolean[]) => state.map(v => v ? "#" : ".").join(""),
        input.targetLayout.map(_ => false),
        () => 1,
        (state: boolean[]) => input.buttons.map(button => state.map((v, i) => button.includes(i) ? !v : v))
    )

    return costs.get(input.targetLayout)
})

console.log("(P1): ", buttonPressesP1.reduce(sum))

const buttonPressesP2 = inputs.map((input, i, arr) => {
    console.log(`${i} / ${arr.length}`)
    const costs = findLowestCosts(
        (state: number[]) => `{${state.join(",")}}`,
        input.joltages.map(_ => 0),
        () => 1,
        (state: number[]) => input.buttons.map(button =>
            state
                .map((v, i) => button.includes(i) ? v + 1 : v))
                .filter(state => state.every((v, i) => v <= input.joltages[i]))
    )

    return costs.get(input.joltages)
})
console.log(buttonPressesP2)
console.log("(P2): ", buttonPressesP2.reduce(sum))