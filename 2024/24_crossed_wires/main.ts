import { nodeModuleNameResolver } from "../../node_modules/typescript/lib/typescript"
import ArrayMap from "../../utils/arrayMap"
import inputFile from "../../utils/inputFile"
import Queue from "../../utils/queue"
import readParagraphs from "../../utils/readParagraphs"
import { descendingBy } from "../../utils/sorters"

const [initialValueLines, wireLines] = readParagraphs(__dirname, inputFile())

const x = initialValueLines.filter(line => line.startsWith("x"))
  .map(line => Number(line.split(": ")[1]))
  .reverse()
  .reduce((acc, a) => (2 * acc) + a)
const y = initialValueLines.filter(line => line.startsWith("y"))
  .map(line => Number(line.split(": ")[1]))
  .reverse()
  .reduce((acc, a) => (2 * acc) + a)

interface Wire { operands: string[], operation: string }
let wires = new Map<string, Wire>()

wireLines.forEach(line => {
  const [expression, result] = line.split(" -> ")
  const [operandA, operation, operandB] = expression.split(" ")
  wires.set(result, { operands: [operandA, operandB], operation })
})
  
const getOutput = (results: Map<string, number>): number =>
  [...results.entries()]
    .filter(([name]) => name.startsWith("z"))
    .sort(descendingBy(([name]) => Number(name.slice(1))))
    .map(([, value]) => value)
    .reduce((acc, a) => (2 * acc) + a)
  
const getDependentsMap = (wires: Map<string, Wire>): ArrayMap<string, string> => {
  const dependents = new ArrayMap<string, string>();
  [...wires.entries()].forEach(([node, { operands: [a, b] }]) => {
    dependents.get(a).push(node)
    dependents.get(b).push(node)
  })
  return dependents
}

const run = (wires: Map<string, Wire>) => (x: number, y: number): Map<string, number> => {
  const values = new Map<string, number>()
  const updates = new Queue<string>()

  const dependents = getDependentsMap(wires)

  for (let i = 0; i < 50; i++) {
    const xNode = "x" + String(i).padStart(2, "0")
    const yNode = "y" + String(i).padStart(2, "0")
    values.set(xNode, x & 1)
    values.set(yNode, y & 1)
    updates.add(xNode)
    updates.add(yNode)
    x /= 2
    y /= 2
  }

  while (updates.hasNext()) {
    const update = updates.receive()
    dependents.get(update).forEach(dependent => {
      const wire = wires.get(dependent)
      if (wire.operands.every(operand => values.has(operand))) {
        const [a, b] = wire.operands.map(operand => values.get(operand))
        let result: number
        switch (wire.operation) {
          case "AND": result = a & b; break
          case "OR": result = a | b; break
          case "XOR": result = a ^ b; break
        }
        values.set(dependent, result)
        updates.add(dependent)
      }
    })
  }
  
  return values
}


console.log("(P1): ", getOutput(run(wires)(x, y)))

/*
z0 just depends on x0 and y0?
z1 just depends on x0, x1, y0, y1?
zn just depends on x0 - xn, y0 - yn  
*/

const getDependencies = (wires: Map<string, Wire>, node: string): Set<string> => {
  const dependencies = new Set<string>([node])
  const updates = new Queue<string>()
  updates.add(node)
  while(updates.hasNext()) {
    const update = updates.receive()
    if (wires.has(update)) {
      const newDependencies = wires.get(update).operands
      newDependencies.forEach(newDependency => {
        if (!dependencies.has(newDependency)) {
          updates.add(newDependency)
          dependencies.add(newDependency)
        }
      }) 
    }
    
  }
  return dependencies
}

const getName = (prefix: string, index: number): string =>
  prefix + String(index).padStart(2, "0")

const swap = (wires: Map<string, Wire>, a: string, b: string): Map<string, Wire> =>
  new Map([...wires.entries()]
    .map(([key, value]) => [key === a ? b : key === b ? a : key, value])
  )

const validForBit = (wires: Map<string, Wire>, bit: number): boolean => {
  const powerOfTwo = Math.pow(2, bit) // I can't deal with JS bit shifts...
  return [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ].every(([a, b]) => {
    const result = getOutput(run(wires)(a * powerOfTwo, b * powerOfTwo))
    return (result / Math.pow(2, bit)) === a + b
  })
}

const resultForBit = (wires: Map<string, Wire>, bit: number): number[] => {
  // I can't deal with JS bit shifts...
  const powerOfTwo = Math.pow(2, bit)
  return [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ].map(([a, b]) => {
    const result = getOutput(run(wires)(a * powerOfTwo, b * powerOfTwo))
    return (result / Math.pow(2, bit))
  })
}

const seen = new Set<string>()
// wires = swap(wires, "njs", "pvb")

/*
for (let i = 0; i < 12; i++) {
  const bigitDependencies = getDependencies(wires, getName("z", i))
  const newDependencies = [...bigitDependencies].filter(d => !seen.has(d))

  const powerOfTwo = Math.pow(2, i) // I can't deal with JS bit shifts...
  const nodeValuesAtCarry = run(wires)(powerOfTwo, powerOfTwo)

  // Find node that has a positive value, isn't a dependency, but all it's dependencies are
  const carryOut = [...nodeValuesAtCarry.keys()]
    .filter(n => nodeValuesAtCarry.get(n))
    .filter(n => !bigitDependencies.has(n))
    .filter(n => wires.get(n).operands.every(m => bigitDependencies.has(m)))

  bigitDependencies.forEach(b => seen.add(b))
  console.log(i, newDependencies, carryOut, validForBit(wires, i))
  if (!validForBit(wires, i) || !validForBit(wires, i + 1)) {
    console.log(newDependencies.map(d => [d, wires.get(d)]))
    const possibleSwaps =
      newDependencies
        .filter(name => !"xy".includes(name[0]))
        .flatMap((name, i, arr) => arr.slice(i + 1).map(b => [name, b]))
    console.log("\t", i, resultForBit(wires, i))
    console.log("\t", "possible swaps:", possibleSwaps.map(([a, b]) =>
      resultForBit(swap(wires, a, b), i)))
    console.log("\t", "possible swaps (+1):", possibleSwaps.map(([a, b]) =>
      resultForBit(swap(wires, a, b), i + 1)))
  }
}
*/

const getAllDependents = (wires: Map<string, Wire>, ...nodes: string[]): string[] => {
  const dependents = new Set<string>()
  const dependentsMap = getDependentsMap(wires)
  const updates = new Queue<string>()
  nodes.forEach(node => updates.add(node))
  while (updates.hasNext()) {
    dependentsMap.get(updates.receive())
      .filter(d => !dependents.has(d))
      .forEach(d => {
        updates.add(d)
        dependents.add(d)
      })
  }
  return [...dependents]
}

// Get which bits affect each bit
const done = new Set<string>()
const dependentsByBit: string[][] = []
const confirmedSwaps: string[][] = []
for (let bit = 44; bit >= 0; bit--) {
  const xName = getName("x", bit)
  const yName = getName("y", bit)

  const dependents = getAllDependents(wires, xName, yName)
    .filter(d => !done.has(d))

  dependents.forEach(dependent => done.add(dependent))
  dependentsByBit[bit] = dependents
}

dependentsByBit.forEach((dm, i) => console.log(i, dm.map(d => `${d}: ${wires.get(d).operands[0]} ${wires.get(d).operation} ${wires.get(d).operands[1]}`)))

// for (let bit = 44; bit >= 0; bit--) {
//   if (!validForBit(wires, bit)) {
//     console.log("Bit", bit, "is bad")
//     const nearbyDependencies = [
//       dependentsByBit[bit - 1],
//       dependentsByBit[bit],
//       dependentsByBit[bit + 1],
//     ].flat()
//     const swaps = nearbyDependencies
//       .flatMap((d, i, arr) => arr.slice(i + 1).map(e => [d, e]))
//     const workingSwaps = swaps
//       .filter(([a, b]) => validForBit(swap(wires, a, b), bit))
//     console.log(workingSwaps.length, "/", swaps.length)
//     console.log(workingSwaps)
//     // if (workingSwaps.length > 0) { throw new Error("nah") }
//     wires = swap(wires, workingSwaps[0][0], workingSwaps[0][1])
//   }
// }

// let wrong = []
// wires.entries()
//   .filter(([node, wire]) => {
//     if (node.startsWith("z") && wire.operation === "XOR" && node !== "z45") {
//       wrong.push(node)
//     } else if (
//       wire.operation === "AND"
//       && !node.startsWith("z")
//       && !"xy".includes(wire.operandA[0])
//       && !"xy".includes(wire.operandA[1])
//     ) {
//       wrong.push(node)
//     } else if () {

//     }
//   })


// const test = (a: number, b: number): void => {
//   const c = getOutput(run(wires)(a, b))
//   console.log(a, b, c, c === a + b)
// }

// test(5634456456, 83434563465365)
wires = swap(wires, "qnw", "qff")
wires = swap(wires, "z16", "pbv")
wires = swap(wires, "z23", "qqp")
wires = swap(wires, "z36", "fbq")

console.log(21, dependentsByBit[21].map(d => `${d}: ${wires.get(d).operands[0]} ${wires.get(d).operation} ${wires.get(d).operands[1]}`))
for (let i = 0; i < 45; i++) {
  if (!validForBit(wires, i)) {
    console.log("Wrong at bit", i)
    console.log(i, dependentsByBit[i].map(d => `${d}: ${wires.get(d).operands[0]} ${wires.get(d).operation} ${wires.get(d).operands[1]}`))
  }
}

//fbq,pbv,qff,qnw,qqp,wdr,z16,z36
console.log("(P2): ", ["qnw", "qff", "z16", "pbv", "z23", "qqp", "z36", "fbq"].sort().join(",")) // 11, 15/16, 22/23, 35/36


/*

*/