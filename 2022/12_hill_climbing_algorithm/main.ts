import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { findLowestCosts } from "../../utils/pathFinding"
import { range } from "../../utils/numbers"
import { ascending } from "../../utils/sorters"

function partOne() {
  const input = readLines(__dirname, inputFile())
  const startY = input.findIndex(row => row.includes("S"))
  const startX = [...input[startY]].findIndex(char => char === "S")
  const endY = input.findIndex(row => row.includes("E"))
  const endX = [...input[endY]].findIndex(char => char === "E")

  const grid = input.map(line =>
    [...line.replaceAll("S", "a").replaceAll("E", "z")])
  
  const costs = findLowestCosts(
    grid,
    [startX, startY],
    ([fromX, fromY], [toX, toY]) => {
      const from = grid[fromY][fromX].charCodeAt(0)
      const to = grid[toY][toX].charCodeAt(0)
      return to <= (from + 1) ? 1 : Infinity
    })

  console.log("(P1) Answer: " + costs[endY][endX])
}

function partTwo() {
  const input = readLines(__dirname, inputFile())
  const startY = input.findIndex(row => row.includes("E"))
  const startX = [...input[startY]].findIndex(char => char === "E")
  const endY = input.findIndex(row => row.includes("S"))
  const endX = [...input[endY]].findIndex(char => char === "S")

  const grid = input.map(line =>
    [...line.replaceAll("S", "a").replaceAll("E", "z")])
  
  const costs = findLowestCosts(
    grid,
    [startX, startY],
    ([fromX, fromY], [toX, toY]) => {
      const from = grid[fromY][fromX].charCodeAt(0)
      const to = grid[toY][toX].charCodeAt(0)
      return from <= (to + 1) ? 1 : Infinity
    })
  
  const candidates = range(0, grid[0].length)
    .flatMap(x => range(0, grid.length)
    .map(y => [x, y]))
    .filter(([x, y]) => grid[y][x] === "a")
  const shortestHike = candidates
    .map(([x, y]) => costs[y][x])
    .sort(ascending)[0]
  console.log("(P2) Answer: " + shortestHike)
}

partOne()
partTwo()
