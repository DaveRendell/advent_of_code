import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import HashMap from "../../utils/hashmap"
import { range } from "../../utils/numbers"
import { chunks, sum } from "../../utils/reducers"
import sampleSpecificValue from "../../utils/sampleSpecificValue"

const rules = new Map<string, string>(readLines(__dirname, inputFile())
  .map(line => line.split(" => ")).map(([key, value]) => [key, value]))

const start = ".#./..#/###"

interface State { layout: string, iterations: number }

const rotateRight = (grid: string[][]): string[][] => grid.map((row, i) =>
    row.map((_, j) => grid[grid.length - j - 1][i]))

const toLayout = (grid: string[][]): string => grid.map(row => row.join("")).join("/")

const getRotations = (layout: string): string[] => {
  const grid = layout.split("/").map(line => line.split(""))
  const flippedGrid = grid.map(row => [...row].reverse())
  return [
    layout,
    toLayout(rotateRight(grid)),
    toLayout(rotateRight(rotateRight(grid))),
    toLayout(rotateRight(rotateRight(rotateRight(grid)))),
    toLayout(flippedGrid),
    toLayout(rotateRight(flippedGrid)),
    toLayout(rotateRight(rotateRight(flippedGrid))),
    toLayout(rotateRight(rotateRight(rotateRight(flippedGrid)))),
  ]
}

const splitIntoNths = (layout: string, n: number): string[] => {
  const k = Math.floor(layout.split("/").length / n)
  const lines = layout.split("/")
  return range(0, k).flatMap(i =>
    range(0, k).map(j =>
      lines.slice(n * j, n * j + n).map(line => line.slice(n * i, n * i + n)).join("/")
    )
  )
}

const cache = new HashMap<State, number>(
  ({layout, iterations}) => `${layout},${iterations}`, [])

const setCache = (state: State, value: number): number => {
  cache.set(state, value)
  return value
}

const joinTogether = (splitLayouts: string[]): string => {
  const splitLines = splitLayouts.map(layout => layout.split("/"))
  const splits = Math.sqrt(splitLayouts.length)
  return splitLayouts.reduce(chunks(splits), [[]]).flatMap(row =>
    row[0].split("/").map((_, i) =>
      row
        .map(splitLayout => splitLayout.split("/")[i])
        .join("")).join("/")
  ).join("/")
}

const dumbMethod = (state: State) => {
  let layout = state.layout
  
  console.log(layout.split("/").map(c => c.split("").join(" ")).join("\n"))
  for (let t = 0; t < state.iterations; t++) {
    console.log(t)
    const lines = layout.split("/")

    const size = lines.length
    const splitSize = (size % 3 === 0)
      ? 3
      : (size % 4) === 0
        ? 2
        : 0
    if (splitSize === 0) {
      throw new Error(`Size ${size} not divisible by 3 or 4 - ${layout}`)
    }
    const splits = splitIntoNths(layout, splitSize)

    const expanded = splits.map(splitLayout => {
      const x = state
      for (const rotation of getRotations(splitLayout)) {
        if (rules.has(rotation)) { return rules.get(rotation) }
      }
      throw new Error(`No matching rule found for ${splitLayout}`)
    })
    layout = joinTogether(expanded)
    console.log(layout.split("/").map(c => c.split("").join(" ")).join("\n"))
  }

  return [...layout].filter(c => c === "#").length
}

const getLightsAfterIterations = (state: State) => {
  if (cache.has(state)) { return cache.get(state) }
  const { layout, iterations } = state

  // for (let rotation of getRotations(layout)) {
  //   if (cache.has({ layout: rotation, iterations })) {
  //     return setCache(state, cache.get({ layout: rotation, iterations }))
  //   }
  // }

  if (iterations === 0) {
    return setCache(state, [...layout].filter(c => c === "#").length)
  }

  const lines = layout.split("/")
  const size = lines.length
  const splitSize = (size % 3 === 0)
    ? 3
    : (size % 4) === 0
      ? 2
      : 0
  if (splitSize === 0) { throw new Error(`Size ${size} not divisible by 3 or 4 - ${layout}`) }
  const splits = splitIntoNths(layout, splitSize)

  const expanded = splits.map(splitLayout => {
    const x = state
    for (const rotation of getRotations(splitLayout)) {
      if (rules.has(rotation)) { return rules.get(rotation) }
    }
    throw new Error(`No matching rule found for ${splitLayout}`)
  })

  const result = expanded.map(expandedLayout => getLightsAfterIterations({layout: expandedLayout, iterations: iterations - 1})).reduce(sum)

  return setCache(state, result)
}

console.log(joinTogether([
  "#./..", ".#/..",
  "../#.", "../.#",
]))

console.log("(P1): ", dumbMethod({ layout: start, iterations: 5 })) // 123 too low, 245 too high

console.log("(P2): ", 0)