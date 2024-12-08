import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { min, sum } from "../../utils/reducers"

interface Particle {
  position: number[],
  velocity: number[],
  acceleration: number[],
}

let particles: Particle[] = readLines(__dirname, inputFile())
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

let closestParticleId = 0
particles.forEach((particle, i) => {
  if (longTermDistanceSortAsc(particle, particles[closestParticleId]) < 0) {
    closestParticleId = i
  }
})
/**
 * a_n = a
 * v_n = v + n * a
 * p_n = p + v_1 + ... + v_n
 *     = p + [v + a] + [v + 2a] + ... [v + na]
 *     = p + nv + n(n+1)a / 2
 */

console.log("(P1): ", closestParticleId)

const increment = (particle: Particle): void => {
  for (let dimension = 0; dimension < 3; dimension++) {
    particle.velocity[dimension] += particle.acceleration[dimension]
    particle.position[dimension] += particle.velocity[dimension]
  }
}

const areEqual = (a: number[], b: number[]): boolean =>
  a.every((x, i) => x === b[i])

let step = 0

while (step++ < 1_000) {
  particles.forEach(particle => increment(particle))
  const collisionIds = new Set<number>()
  particles.forEach((particle1, i1) =>
    particles.slice(i1 + 1).forEach((particle2, i2) => {
      if (areEqual(particle1.position, particle2.position)) {
        collisionIds.add(i1)
        collisionIds.add(i2 + i1 + 1)
      }
    })
  )
  if (collisionIds.size > 0) {
    particles = particles.filter((_, i) => !collisionIds.has(i))
    console.log(`Step ${step} - ${collisionIds.size} colliding particles - ${particles.length} particles left`)
  }
}

console.log("(P2): ", particles.length)
