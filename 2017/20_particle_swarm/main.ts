import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { min, sum } from "../../utils/reducers"

interface Particle {
  position: number[],
  velocity: number[],
  acceleration: number[],
}

const particles: Particle[] = readLines(__dirname, inputFile())
  .map(line => {
    const [position, velocity, acceleration] = line.split(", ")
      .map(str => str.slice(3).slice(0, -1).split(",").map(str => Number(str)))
    return { position, velocity, acceleration }
  })

const manhattenDistance = (numbers: number[]) =>
  numbers.map(num => Math.abs(num)).reduce(sum)

const longTermDistanceSortAsc = (a: Particle, b: Particle): number => {
  const accDistance = manhattenDistance(a.acceleration) - manhattenDistance(b.acceleration)
  const velDistance = manhattenDistance(a.velocity) - manhattenDistance(b.velocity)
  const posDistance = manhattenDistance(a.position) - manhattenDistance(b.position)

  return (Math.sign(accDistance) << 2)
   + (Math.sign(velDistance) << 1)
   + Math.sign(posDistance)
}

let bestParticleId = 0
particles.forEach((particle, i) => {
  if (longTermDistanceSortAsc(particle, particles[bestParticleId]) < 0) {
    bestParticleId = i
  }
})
/**
 * a_n = a
 * v_n = v + n * a
 * p_n = p + v_1 + ... + v_n
 *     = p + [v + a] + [v + 2a] + ... [v + na]
 *     = p + nv + n(n+1)a / 2
 */

console.log("(P1): ", bestParticleId)

console.log("(P2): ", 0)