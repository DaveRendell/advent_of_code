import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { lcm } from "../../utils/numbers"

interface Module { type: string, outputs: string[] }

const modules: { [name: string]: Module } =
    Object.fromEntries(
        readLines(__dirname, inputFile())
            .map(line => {
                const type = line[0]
                const [name, list] = line.slice(1).split(" -> ")
                const outputs = list.split(", ")
                
                return [name, { type, outputs }]
            }))

const inputs: { [name: string]: string[] } =
    Object.fromEntries([...new Set(Object.values(modules).flatMap(({ outputs }) => outputs))]
        .map((name) => [name, Object.entries(modules)
            .filter(([_, { outputs }]) => outputs.includes(name))
            .map(([name]) => name)]))



interface Signal { source: string, destination: string, pulse: boolean }

const dispatchQueue = []

const pushButton = (times: number): number => {
    let lows = 0
    let highs = 0

    const flipFlops: { [name: string]: boolean } =
        Object.fromEntries(Object.entries(modules)
            .filter(([_, { type }]) => type == "%")
            .map(([name]) => [name, false]))

    const conjunctions: { [name: string]: { [output: string]: boolean } } =
        Object.fromEntries(Object.entries(modules)
            .filter(([_, { type }]) => type == "&")
            .map(([name]) => [name, Object.fromEntries(Object.entries(modules)
                .filter(([_, { outputs }]) => outputs.includes(name))
                .map(([name]) => [name, false]))]))

    const dispatchQueue: Signal[] = []
    let dtPulses: boolean[] = []
    let hhPulses: boolean[] = []
    let tnPulses: boolean[] = []
    let stPulses: boolean[] = []

    const processSignal = () => {
        const { source, destination, pulse } = dispatchQueue.shift()
        // console.log(`${source} -${pulse ? "high" : "low"}-> ${destination}`)
        if (pulse) { highs++ } else { lows++ }
    
        if (modules[destination] === undefined) { return }

        if (destination == "dt") { dtPulses.push(pulse) }
        if (destination == "hh") { hhPulses.push(pulse) }
        if (destination == "tn") { tnPulses.push(pulse) }
        if (destination == "st") { stPulses.push(pulse) }

        switch (modules[destination].type) {
            case "b":
                modules[destination].outputs
                    .forEach(out => dispatchQueue.push({
                        source: destination, destination: out, pulse
                    }))
                break
            case "%":
                if (!pulse) {
                    flipFlops[destination] = !flipFlops[destination]
                    modules[destination].outputs
                        .forEach(out => dispatchQueue.push({
                            source: destination, destination: out, pulse: flipFlops[destination]
                        }))
                }
                break
            case "&":
                conjunctions[destination][source] = pulse
                modules[destination].outputs
                        .forEach(out => dispatchQueue.push({
                            source: destination, destination: out, pulse: !Object.values(conjunctions[destination]).every(Boolean)
                        }))
                break
            default: console.log("unknown type", modules[destination].type)
        }
    }

    for (let i = 0; i < times; i++) {
        if (i % 100_000 == 0) { console.log("Button press", i)}
        dispatchQueue.push({ source: "button", destination: "roadcaster", pulse: false })
        dtPulses = []
        hhPulses = []
        tnPulses = []
        stPulses = []

        while (dispatchQueue.length > 0) { processSignal() }
        // console.log(i, rxPulses)
        // console.log(dtPulses)

        if (!dtPulses.every(Boolean)) { console.log("dt machine started after button press", i + 1) }
        if (!hhPulses.every(Boolean)) { console.log("hh machine started after button press", i + 1)} 
        if (!tnPulses.every(Boolean)) { console.log("tn machine started after button press", i + 1)} 
        if (!stPulses.every(Boolean)) { console.log("st machine started after button press", i + 1)} 
    }

    return lows * highs
}

console.log("(P1): ", pushButton(1000))

/*
rx fed by &lv
so need all the folloing high:
    &st
        so need &gr low
            %sg, %qq
    &tn
        so need &vc low
    &hh
        so need &db low
    &dt
        so need &lz low
*/

pushButton(10000)
console.log("(P2): ", [3769, 3863, 3929, 4079].reduce(lcm))

const printTree = (node: string, depth: number = 0) => {
    if (depth > 8) { return }
    let line = ""
    for (let i = 0; i < depth; i++) { line += "|  " }
    line += node
    if (modules[node] !== undefined) {
        line += " " + modules[node].type
    }
    console.log(line);
    (inputs[node] || []).forEach(input => printTree(input, depth + 1))
}
// console.log(inputs)
// printTree("rx")

// console.log(
//     Object.entries(modules)
//         .flatMap(([name, module]) => module.outputs.map(out => `${modules[name].type + name} ${(modules[out] ? modules[out].type : "") + out}`)).join("\n"))