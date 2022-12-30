import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { product, sum } from "../../utils/reducers"
import { ascendingBy } from "../../utils/sorters"

const presents = readLines(__dirname, inputFile()).map(v => parseInt(v))

const getGroups = (weights: number[], targetWeight: number) => {
  if (targetWeight === 0) { return [[]] }
  return weights
    .filter(weight => weight <= targetWeight)
    .flatMap((weight, i) =>
      getGroups(
        weights.slice(i)
          .filter(x => x !== weight),
          targetWeight - weight)
        .map(g => [weight, ...g]))}

const distinctFrom = (group1: number[]) => (group2: number[]): boolean =>
  group1.every(x => !group2.includes(x))

const canSplitInto =
  (groups: number[][], numberOfGroups: number): boolean => {
    if (groups.length === 0) { return false }
    if (numberOfGroups === 1) { return true }
    return groups.some((group, i) => canSplitInto(
      groups.slice(i + 1).filter(distinctFrom(group)),
      numberOfGroups - 1
    ))
  }

const getBestSplit = (compartments: number): number => {
  const groupWeight = presents.reduce(sum) / compartments
  const groups = getGroups(presents, groupWeight)
    .sort(ascendingBy(g => g.length))
  let bestGroupSize: number = Infinity
  let bestGroupQE: number = Infinity

  groups.forEach((group, i) => {
    if (group.length > bestGroupSize) { return }
    const quantumEntanglement = group.reduce(product)
    if (quantumEntanglement >= bestGroupQE) { return }
    const remaining = groups.slice(i + 1)
      .filter(distinctFrom(group))
    if (canSplitInto(remaining, compartments - 1)) {
      bestGroupSize = group.length
      bestGroupQE = quantumEntanglement
    }
  })

  return bestGroupQE
}

console.log("(P1): " + getBestSplit(3))
console.log("(P2): " + getBestSplit(4))