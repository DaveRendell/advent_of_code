import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import HashMap from "../../utils/hashmap"
import Queue from "../../utils/queue"
import { findLowestCosts } from "../../utils/pathFinding"
import { max, min, sum } from "../../utils/reducers"
import { ascendingBy } from "../../utils/sorters"

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

const paritySetCache: boolean[][][] = []
const possibleParities = (length: number): boolean[][] => {
    if (paritySetCache[length]) { return paritySetCache[length] }
    const paritySet = length === 0 ? [[]] : possibleParities(length - 1).flatMap(parities => [[false, ...parities], [true, ...parities]]) 
    paritySetCache[length] = paritySet
    return paritySet
}
    

const isValidParities = (buttons: number[][], targetParities: boolean[], parities: boolean[]): boolean =>
    targetParities.every((value, i) => !!(buttons.filter((b, j) => b.includes(i) && parities[j]).length % 2) === value)

const getButtonPressesForParities = (buttons: number[][], targetParities: boolean[]): boolean[][] => {
    const parities = possibleParities(buttons.length)
    // console.log("all parities", parities)
    const validParities = parities.filter(p => isValidParities(buttons, targetParities, p))
    return validParities
}

const getMinimalButtonPressesForParity = (input: Input): number =>
    getButtonPressesForParities(input.buttons, input.targetLayout)
        .sort(ascendingBy(paritySet => paritySet.filter(Boolean).length))
        .at(0).filter(Boolean).length

console.log("(P1): ", inputs.map(getMinimalButtonPressesForParity).reduce(sum))

const cache: HashMap<{ buttons: number[][], targetJoltages: number[] }, number> = new HashMap(({ buttons, targetJoltages}) =>
    `[${buttons.map(b => b.join(",")).join("|")}] ${targetJoltages.join(",")}`, [])

const getButtonPressesForJoltages = (buttons: number[][], targetJoltages: number[]): number => {
    if (cache.has({ buttons, targetJoltages })) {
        return cache.get({ buttons, targetJoltages })
    }
    if (targetJoltages.every(joltage => joltage === 0)) {
        cache.set({buttons, targetJoltages}, 0)
        return 0
    }
    const possibleParities = getButtonPressesForParities(buttons, targetJoltages.map(j => Boolean(j & 1)))

    const result = possibleParities.map((paritySet) => {
        const lowestBitPresses = paritySet.filter(Boolean).length
        const higherBitJoltages = targetJoltages.map((joltage, j) =>
            (joltage - buttons.filter((b, i) => b.includes(j) && paritySet[i]).length) >> 1)
        if (higherBitJoltages.some(j => j < 0)) {
            cache.set({buttons, targetJoltages}, Infinity)
            return Infinity
        }
        return lowestBitPresses + 2 * getButtonPressesForJoltages(buttons, higherBitJoltages)
    }).reduce(min, Infinity)

    cache.set({ buttons, targetJoltages }, result)
    return result
}
const p2Presses = inputs.map(input => getButtonPressesForJoltages(input.buttons, input.joltages)).reduce(sum)
console.log("(P2): ", p2Presses)