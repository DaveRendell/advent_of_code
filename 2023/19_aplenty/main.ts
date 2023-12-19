import inputFile from "../../utils/inputFile"
import { Range } from "../../utils/range"
import readParagraphs from "../../utils/readParagraphs"
import { product, sum } from "../../utils/reducers"

type Part = { [category: string]: number }
interface Rule {
    test(part: Part): boolean,
    passRange: Range,
    failRange: Range,
    destination: string,
    category: string,
}
type Workflow = Rule[]

const input = readParagraphs(__dirname, inputFile())

const parseRule = (ruleString: string): Rule => {
    if (ruleString.includes(">")) {
        const discriminant = parseInt(ruleString.split(">")[1]) + 1
        return {
            test: (part) =>
                part[ruleString[0]] > parseInt(ruleString.split(">")[1]),
            destination: ruleString.split(":")[1],
            category: ruleString[0],
            passRange: new Range(discriminant, Infinity),
            failRange: new Range(-Infinity, discriminant),
        }
    }
    if (ruleString.includes("<")) {
        const discriminant = parseInt(ruleString.split("<")[1])
        return {
            test: (part) =>
                part[ruleString[0]] < parseInt(ruleString.split("<")[1]),
            destination: ruleString.split(":")[1],
            category: ruleString[0],
            passRange: new Range(-Infinity, discriminant),
            failRange: new Range(discriminant, Infinity),
        }
    }
    return {
        test: () => true,
        destination: ruleString,
        category: "x",
        passRange: new Range(-Infinity, Infinity),
        failRange: new Range(Infinity, Infinity),
    }
}

const workflows: { [name: string]: Workflow } = Object.fromEntries(
    input[0].map(line => {
        const [name, ruleList] = line.slice(0, -1).split("{")
        const rules = ruleList.split(",").map(parseRule)
        return [name, rules]
    })
)

const parts: Part[] = input[1].map(line =>
    Object.fromEntries(line.slice(1, -1)
        .split(",")
        .map(categoryString => {
            const name = categoryString.split("=")[0]
            const value = parseInt(categoryString.split("=")[1])
            return [name, value]
        })))

const apply = (workflowName: string) => (part: Part): boolean => {
    for (let rule of workflows[workflowName]) {
        if (rule.test(part)) {
            switch (rule.destination) {
                case "A": return true
                case "R": return false
                default: return apply(rule.destination)(part)
            }
        }
    }
}

console.log("(P1): " + parts
    .filter(apply("in"))
    .flatMap(part => Object.values(part))
    .reduce(sum))

type Possibility = {
    [category: string]: Range
}

const start: Possibility = {
    "x": new Range(1, 4001),
    "m": new Range(1, 4001),
    "a": new Range(1, 4001),
    "s": new Range(1, 4001),
}

const apply2 = (workflowName: string) => (possibility: Possibility): Possibility[] => {
    let remainder = possibility
    const successes: Possibility[] = []
    for (let rule of workflows[workflowName]) {
        const passedPossibility = Object.fromEntries(
            Object.entries(remainder)
                .map(([category, range]) =>
                    category == rule.category
                        ? [category, range.intersect(rule.passRange)]
                        : [category, range.copy()]
                ))
        if (rule.destination == "A") {
            successes.push(passedPossibility)
        }else if (rule.destination != "R") {
           apply2(rule.destination)(passedPossibility).forEach(p => successes.push(p))
        }
        remainder = Object.fromEntries(
            Object.entries(remainder)
                .map(([category, range]) =>
                    category == rule.category
                        ? [category, range.intersect(rule.failRange)]
                        : [category, range.copy()]
                ))
        
    }
    return successes
}

const size = (possibility: Possibility): number =>
    Object.values(possibility).map(range => range.length).reduce(product)

console.log(apply2("in")(start).map(size).reduce(sum))

console.log("(P2): " + 0)