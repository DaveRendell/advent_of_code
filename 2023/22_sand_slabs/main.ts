import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { ascendingBy, descendingBy } from "../../utils/sorters"
import { range } from "../../utils/numbers"
import { max, min } from "../../utils/reducers"

interface Brick {
    xMin: number, xMax: number,
    yMin: number, yMax: number,
    zMin: number, zMax: number,
    label: number, supports: number[]
}

const bricks: Brick[] = readLines(__dirname, inputFile())
    .map(line => {
        const [end1, end2] = line.split("~")
        const [x1, y1, z1] = end1.split(",").map(s => parseInt(s))
        const [x2, y2, z2] = end2.split(",").map(s => parseInt(s))
        const [xMin, xMax] = [Math.min(x1, x2), Math.max(x1, x2)]
        const [yMin, yMax] = [Math.min(y1, y2), Math.max(y1, y2)]
        const [zMin, zMax] = [Math.min(z1, z2), Math.max(z1, z2)]
        return [xMin, xMax, yMin, yMax, zMin, zMax]
    })
    .sort(ascendingBy(([, , , , zMin, ]) => zMin))
    .reduce((settledBricks, [xMin, xMax, yMin, yMax, zMin, zMax], i) => {
        const overlapping = settledBricks.filter(brick =>
            xMin <= brick.xMax && brick.xMin <= xMax
            && yMin <= brick.yMax && brick.yMin <= yMax
            && brick.zMax < zMin
        )

        const newHeight = overlapping.length > 0
            ? overlapping.sort(descendingBy(brick => brick.zMax))[0].zMax + 1
            : 1
        const fallDistance = zMin - newHeight
        zMin -= fallDistance
        zMax -= fallDistance

        const supports = overlapping.filter(brick =>
            brick.zMax == newHeight - 1).map(({label}) => label)

        return [...settledBricks, { xMin, xMax, yMin, yMax, zMin, zMax, supports, label: i }]
    }, [] as Brick[])

const disintegratable = bricks
    .map(({label}) => label)
    .filter(label => bricks.every(brick =>
        brick.supports.length !== 1 || brick.supports[0] !== label))

console.log("(P1): ", disintegratable.length)

const intersection = (setA: Set<number>, setB: Set<number>): Set<number> =>
    new Set([...setA].filter(x => setB.has(x)))

const memo = new Map<number, Set<number>>()

const getSingleSupports = (label: number): Set<number> => {
    if (memo.has(label)) { return memo.get(label) }
    // Get all single blocks that removing it makes this block fall
    let output: Set<number>
    const brick = bricks.find(({ label: l }) => l == label)
    if (brick === undefined) { throw new Error("brick not found") }

    if (brick.supports.length == 0) {
        output = new Set()
    } else if (brick.supports.length == 1) {
        output = new Set([...getSingleSupports(brick.supports[0]), brick.supports[0]])
    } else {
        output = brick.supports
            .map(getSingleSupports)
            .reduce(intersection, new Set(range(0, bricks.length)))
    }

    memo.set(label, output)
    return output
}

const mostFalling = range(0, bricks.length)
    .map(label1 => range(0, bricks.length)
        .filter(label2 => getSingleSupports(label2).has(label1))
        .length)
    .reduce(max) + 1

// console.log(range(0, bricks.length).map(getSingleSupports))

// Check fallen bricks for weirdness?
const allXs = bricks.flatMap(brick => [brick.xMin, brick.xMax])
const allYs = bricks.flatMap(brick => [brick.yMin, brick.yMax])
const allZs = bricks.flatMap(brick => [brick.zMin, brick.zMax])

const minX = allXs.reduce(min)
const maxX = allXs.reduce(max)
const minY = allYs.reduce(min)
const maxY = allYs.reduce(max)
const minZ = allZs.reduce(min)
const maxZ = allZs.reduce(max)

console.log({ minX, maxX, minY, maxY, minZ, maxZ })
let blocks = 0
// check for overlapping bricks
range(0, 10).forEach(x =>
    range(0, 10).forEach(y =>
        range(0, 177).forEach(z => {
            const bs = bricks.filter(brick =>
                brick.xMin <= x && x <= brick.xMax
                && brick.yMin <= y && y <= brick.yMax
                && brick.zMin <= z && z <= brick.zMax)
            if (bs.length > 1) {
                console.log([x, y, z])
                console.log(bs)
                console.log("-------\n")
            }
            if (bs.length > 0) { blocks++ }
        })))
console.log(blocks)
// check for floating bricks
bricks
    .filter(brick => brick.supports.length == 0)
    .filter(brick => brick.zMin > 1)
    .forEach(console.log)
// check for bricks supported by bricks above them or level with them
bricks
    .filter(brick => brick.supports.map(l => bricks.find(b => b.label == l)).some(b => b.zMax >= brick.zMin))
    .forEach(console.log)

console.log("(P2): ", mostFalling) // 1294 too low