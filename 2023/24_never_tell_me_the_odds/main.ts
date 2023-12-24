import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { multiply, scale } from "../../utils/matrices"

const hailstones: number[][] = readLines(__dirname, inputFile())
    .map(line => {
        const [position, velocity] = line.split(" @ ")
        const [px, py, pz] = position.split(",").map(s => parseInt(s))
        const [vx, vy, vz] = velocity.split(",").map(s => parseInt(s))
        return [px, py, pz, vx, vy, vz]
    })

/*
MATHS

h1 has positions P1 + t1 * V1
h1 has positions P2 + t2 * V2

overlap if t1V1 - t2V2 = P2 - P1
let M = matrix made up of [V1|-V2]
get the inverse and apply it to P2 - P1 and you get t1, t2?
*/

const get2dOverlapPoint = (
    [px1, py1, pz1, vx1, vy1, vz1]: number[],
    [px2, py2, pz2, vx2, vy2, vz2]: number[],
): number[] => {
    const M = [
        [vx1, -vx2],
        [vy1, -vy2],
    ]
    // determ: ad - bc
    // inverse: 1/det * [[d, -b], [-c, a]]
    const determinant = vx2 * vy1 - vx1 * vy2
    if (determinant == 0) { return [Infinity, Infinity] } // No overlap
    const I = scale(
        1 / determinant,
        [[-vy2, vx2], [-vy1, vx1]])
    const R = multiply(I, [[px2 - px1], [py2 - py1]])
    const [[t1, t2]] = R
    if (t1 < 0 || t2 < 0) { return [Infinity, Infinity] }
    return [px1 + t1 * vx1, py1 + t1 * vy1]
}


// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 12, 31, 28 @ -1, -2, -1
console.log(get2dOverlapPoint(
    [18, 19, 22, -1, -1, -2],
    [12, 31, 28, -1, -2, -1],
))

const regionMin = 200000000000000
const regionMax = 400000000000000

const overlapCount = hailstones
    .flatMap((stone1, i) => hailstones.slice(i + 1)
        .map(stone2 => get2dOverlapPoint(stone1, stone2)))
    .filter(([x, y]) => x >= regionMin && x <= regionMax)
    .filter(([x, y]) => y >= regionMin && y <= regionMax)
    .length
    

console.log("(P1): ", overlapCount)

console.log("(P2): ", 0)