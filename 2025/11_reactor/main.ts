import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

const input = readLines(__dirname, inputFile())
    .map(line => line.split(": "))
const outputs: Record<string, string[]> = {}
input.forEach(([node, outputsString]) => {
    outputs[node] = outputsString.split(" ")
})

const cache: Map<string, number> = new Map()

const pathsBetween = (start: string, end: string): number => {
    const key = `${start}->${end}`
    if (cache.has(key)) {
        return cache.get(key)
    }
    if (start === end) {
        cache.set(key, 1)
        return 1
    }
    if (outputs[start] === undefined) {
        cache.set(key, 0)
        return 0
    }
    const result = outputs[start].map(output => pathsBetween(output, end)).reduce(sum)
    cache.set(key, result)
    return result
}

console.log("(P1): ", pathsBetween("you", "out"))
const svrToFft = pathsBetween("svr", "fft")
const fftToDac = pathsBetween("fft", "dac")
const dacToOut = pathsBetween("dac", "out")
console.log("(P2): ", svrToFft * fftToDac * dacToOut)