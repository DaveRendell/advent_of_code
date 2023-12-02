import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, product, sum } from "../../utils/reducers"

type Pull = [number, string]
type Round = Pull[]
type Game = Round[]

const parse = (line: string): Game => {
  const [, gameInfo] = line.split(": ")
  return gameInfo
    .split("; ")
    .map(roundInfo => roundInfo
      .split(", ")
      .map(pullInfo => pullInfo
        .split(" "))
    .map(([amount, colour]) => [parseInt(amount), colour]))
}

const games = readLines(__dirname, inputFile()).map(parse)

const limits = { "red": 12, "green": 13, "blue": 14 }
let idSum = 0

games.forEach((game, i) => {
  if (game.flat().every(([amount, colour]) => amount <= limits[colour])) {
    idSum += (i + 1)
  }
})

console.log("(P1): " + idSum)

const colours = ["red", "green", "blue"]

const minimumCubes = (game: Game, colour: string): number =>
  game.flat()
    .filter(([_, cubeColour]) => cubeColour === colour)
    .map(([amount]) => amount).reduce(max)

const power = (game: Game): number =>
  colours
    .map(colour => minimumCubes(game, colour))
    .reduce(product)

const powerSum = games.map(power).reduce(sum)

console.log("(P2): " + powerSum)