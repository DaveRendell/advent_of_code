import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { inclusiveRange, range } from "../../utils/numbers"
import { max, product, sum } from "../../utils/reducers"
import { isDefined, isUndefined } from "../../utils/filters"
import { descendingBy } from "../../utils/sorters"

type Ingredient = number[]
type Constraints = number[]

const parse = (line: string): Ingredient => {
  const [,,capacity,,durability,, flavor,, texture,, calories]
    = line.split(" ").map(v => parseInt(v))
  return [capacity, durability, flavor, texture, calories]
}

const ingredients = readLines(__dirname, inputFile()).map(parse)

const findBest = (
  ingredients: Ingredient[],
  constraints: Constraints,
  caloriesTarget?: number
): number => {
  if (constraints.length === ingredients.length) {
    if (caloriesTarget !== undefined) {
      const calories = range(0, ingredients.length).map(k =>
        constraints[k] * ingredients[k][4]).reduce(sum)
      if (calories !== caloriesTarget) { return 0 }
    }
    return range(0, 4)
      .map(i => range(0, ingredients.length)
        .map(k => constraints[k] * ingredients[k][i])
        .reduce(sum))
      .map(x => x < 0 ? 0 : x)
      .reduce(product)
  }
  const remaining = 100 - constraints.reduce(sum, 0)
  if (ingredients.length - constraints.length === 1) {
    return findBest(ingredients, [...constraints, remaining], caloriesTarget)
  }
  return inclusiveRange(0, remaining)
    .map(i =>
      findBest(ingredients, [...constraints, i], caloriesTarget))
    .reduce(max)
}

console.log("(P1): " + findBest(ingredients, []))
console.log("(P2): " + findBest(ingredients, [], 500))
