import { drawGrid } from "../../utils/drawGrid"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import Queue from "../../utils/queue"
import readCharArray from "../../utils/readCharArray"
import { max } from "../../utils/reducers"
import { descendingBy } from "../../utils/sorters"
import Vector2, { VectorMap, VectorSet } from "../../utils/vector2"

const grid = readCharArray(__dirname, inputFile())
const startX = grid[0].indexOf(".")
const endX = grid.at(-1).indexOf(".")
const height = grid.length
const width = grid[0].length

const directions = {
    ">": Vector2.RIGHT,
    "<": Vector2.LEFT,
    "^": Vector2.UP,
    "v": Vector2.DOWN,
}

type Distances = VectorMap<VectorMap<number>>

const buildTree = (slippery: boolean): Distances => {
    const tree = new VectorMap<VectorMap<number>>()

    range(0, width).forEach(x =>
        range(0, height).forEach(y => {
            if (grid[y][x] != "#") {
                const position = new Vector2(x, y)
                const neighbourDistances = new VectorMap<number>()
                if (!slippery || grid[y][x] == ".") {
                    position.neighbours4()
                        .filter(v => v.inGrid(width, height))
                        .filter(v => grid[v.y][v.x] != "#")
                        .filter(v => !slippery
                            || grid[v.y][v.x] == "."
                            || !v.add(directions[grid[v.y][v.x]]).equals(position))
                        .forEach(v => neighbourDistances.set(v, 1))
                } else {
                    neighbourDistances.set(position.add(directions[grid[position.y][position.x]]), 1)
                }
                tree.set(position, neighbourDistances)                
            }
        }))

        let toRemove = tree.entries()
        .find(([_, neighbourDistances]) =>
            neighbourDistances.size == 2)
    while (toRemove !== undefined) {
        const [node, neighbourDistances] = toRemove
        const [n1, n2] = neighbourDistances.keys()
        if (tree.get(n1).has(node)) {
            tree.get(n1).set(n2, tree.get(n1).has(n2) ? Math.max(tree.get(n1).get(n2), tree.get(n1).get(node) + neighbourDistances.get(n2)) : tree.get(n1).get(node) + neighbourDistances.get(n2))
            tree.get(n1).remove(node)
        }
        if (tree.get(n2).has(node)) {
            tree.get(n2).set(n1,  tree.get(n2).has(n1) ? Math.max(tree.get(n2).get(n1), tree.get(n2).get(node) + neighbourDistances.get(n1)) : tree.get(n2).get(node) + neighbourDistances.get(n1))
            tree.get(n2).remove(node)
        }
        tree.remove(node)

        toRemove = tree.entries()
            .find(([_, neighbourDistances]) =>
                neighbourDistances.size == 2)
    }
    
    return tree
}

const getLongestWalk = (tree: Distances, position: Vector2, path: VectorSet = new VectorSet(), distance: number = 0): number => {
    if (position.equals(new Vector2(endX, height - 1))) { return distance }
    
    return tree.get(position).keys()
        .filter(next => !path.has(next))
        .map(next => getLongestWalk(
            tree,
            next,
            new VectorSet([...path.entries(), position]), distance + tree.get(position).get(next)))
        .reduce(max, 0)
}

const start = new Vector2(startX, 0)

// console.log("(P1): ", getLongestWalk(buildTree(true), start))
console.log("(P2): ", getLongestWalk(buildTree(false), start))