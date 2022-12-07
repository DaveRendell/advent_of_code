import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

function partOne() {
  const input = readLines(__dirname, inputFile()).map(line => line.split("-"))

  const connectionMap = input.reduce(addConnection, {})
  
  var paths = [["start"]]
  while(paths.some(path => path.at(-1) !== "end")) {
    paths = paths
      .flatMap(path => 
        path.at(-1) === "end" 
          ? [path]
          : connectionMap[path.at(-1)]
            .filter(cave => !(isLowerCase(cave) && path.includes(cave)))
            .map(cave => [...path, cave]))
  }

  console.log("(P1) Answer: " + paths.length)
}

function partTwo() {
  const input = readLines(__dirname, inputFile()).map(line => line.split("-"))

  const connectionMap = input.reduce(addConnection, {})
  
  var paths = [["start"]]
  while(paths.some(path => path.at(-1) !== "end")) {
    paths = paths
      .flatMap(path => 
        path.at(-1) === "end" 
          ? [path]
          : connectionMap[path.at(-1)]
            .filter(cave => cave !== "start")
            .filter(cave => !(
              pathHasRepeatedSmallCave(path)
              && isLowerCase(cave)
              && path.includes(cave)))
            .map(cave => [...path, cave]))
  }

  console.log("(P2) Answer: " + paths.length)
}

const pathHasRepeatedSmallCave = (path: string[]): boolean =>
  path
    .filter(cave => cave !== "start")
    .filter(cave => cave !== "end")
    .filter(isLowerCase)
    .reduce((acc, value, i, array) =>
      acc || array.slice(0, i).includes(value), false)

type ConnectionMap = { [caveName: string]: string[] } 

const addConnection = (
  connectionMap: ConnectionMap,
  [cave1, cave2]: string[]
): ConnectionMap => ({
  ...connectionMap,
  [cave1]: connectionMap[cave1] ? [...connectionMap[cave1], cave2] : [cave2],
  [cave2]: connectionMap[cave2] ? [...connectionMap[cave2], cave1] : [cave1]
})

const isLowerCase = (str: string): boolean => str === str.toLowerCase()

partOne()
partTwo()
