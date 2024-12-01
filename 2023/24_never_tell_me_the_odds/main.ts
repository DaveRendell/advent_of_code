import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { multiply, scale } from "../../utils/matrices"
import sampleSpecificValue from "../../utils/sampleSpecificValue"
import { sum } from "../../utils/reducers"

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
    return [px1 + t1 * vx1, py1 + t1 * vy1, t1, t2]
}

const willHit2dPoint = (
  [px1, py1, pz1, vx1, vy1, vz1]: number[],
  [x, y]: number[],
): boolean => {
  // px1 + t vx1 === x => t = (x - px1) / vx1
  // py1 + t vy1 === y => t = (y - py1) / vy1
  if (vx1 === 0) { return px1 === x && Math.sign(y - py1) === Math.sign(vy1) }
  if (vy1 === 0) { return py1 === y && Math.sign(x - px1) === Math.sign(vx1) }
  return (x - px1) / vx1 === (y - py1) / vy1 && (x - px1) / vx1 > 0
}


// Hailstone A: 18, 19, 22 @ -1, -1, -2
// Hailstone B: 12, 31, 28 @ -1, -2, -1
console.log(get2dOverlapPoint(
    [18, 19, 22, -1, -1, -2],
    [12, 31, 28, -1, -2, -1],
))

const regionMin = sampleSpecificValue(7, 200000000000000)
const regionMax = sampleSpecificValue(27, 400000000000000)

const overlapCount = hailstones
    .flatMap((stone1, i) => hailstones.slice(i + 1)
        .map(stone2 => get2dOverlapPoint(stone1, stone2)))
    .filter(([x, y]) => x >= regionMin && x <= regionMax)
    .filter(([x, y]) => y >= regionMin && y <= regionMax)
    .length
    

console.log("(P1): ", overlapCount)

const velocityLimit = 200

outerLoop:
for (let xDirection = 1; xDirection > -2; xDirection -= 2) {
  for (let yDirection = 1; yDirection > -2; yDirection -= 2) {
    for (let i = 0; i < velocityLimit; i++) {
      for (let j = 0; j < velocityLimit; j++) {
        const rvx = i * xDirection
        const rvy = j * yDirection
        // console.log("test xDirection,y velocities:", rvx, rvy)

        const adjustedHailstones = hailstones.map(([px, py, pz, vx, vy, vz]) =>
          [px, py, pz, vx - rvx, vy - rvy, vz])

        // const overlaps = adjustedHailstones
        //   .flatMap((stone1, i) => adjustedHailstones.slice(i + 1)
        //       .map(stone2 => get2dOverlapPoint(stone1, stone2)))
        //   // .filter(([x, y]) => x >= regionMin && x <= regionMax)
        //   // .filter(([x, y]) => y >= regionMin && y <= regionMax) // QQ region bounds?
        
        const initialXyOverlap = get2dOverlapPoint(adjustedHailstones[0], adjustedHailstones[1])

        // console.log(initialXyOverlap)
        const allHit = adjustedHailstones.slice(0, 5).every(h => willHit2dPoint(h, initialXyOverlap))
        // console.log("All hit?", allHit)

        if (allHit) {
          console.log("Potential hit found")
          const actuallyAllHit = adjustedHailstones.every(h => willHit2dPoint(h, initialXyOverlap))
          console.log(actuallyAllHit)
          console.log("Hit with x / y velocity", [rvx, rvy])
          console.log()
          console.log("Overlap x, ypoint:", initialXyOverlap)
          
          const stone1InterceptTime = initialXyOverlap[2]
          console.log("Stone 1 intercept time", stone1InterceptTime)
          const stone1ZAtIntercept = hailstones[0][2] + stone1InterceptTime * hailstones[0][5]
          console.log("Stone 1 interceptZ", stone1ZAtIntercept)

          const stone2InterceptTime = initialXyOverlap[3]
          console.log("Stone 2 intercept time", stone2InterceptTime)
          const stone2ZAtIntercept = hailstones[1][2] + stone2InterceptTime * hailstones[1][5]
          console.log("Stone 2 interceptZ", stone2ZAtIntercept)

          const rockZspeed = (stone1ZAtIntercept - stone2ZAtIntercept) / (stone1InterceptTime - stone2InterceptTime)

          console.log("Rock Z speed", rockZspeed)
          const rockOriginalZPosition = stone1ZAtIntercept - stone1InterceptTime * rockZspeed
          console.log("Original Rock Z position", rockOriginalZPosition)

          console.log(initialXyOverlap.slice(0, 2).reduce(sum) + rockOriginalZPosition)
          break outerLoop
        }
        
        // console.log("Not hit", adjustedHailstones.filter(h => !willHit2dPoint(h, initialXyOverlap)))


        // const allXyOverlap = adjustedHailstones.slice(2).every(hailstone => {
        //   get2dOverlapPoint(adjustedHailstones[0]))

        // console.log(get2dOverlapPoint(adjustedHailstones[0], adjustedHailstones[1]))
        // console.log(adjustedHailstones)
        // console.log(overlaps)
      }
    }
  }
}

console.log("(P2): ", "Figure out z with a calculator...") // 674933840481529 too high