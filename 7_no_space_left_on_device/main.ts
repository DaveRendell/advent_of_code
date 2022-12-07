import readLines from "../utils/readLines"
import inputFile from "../utils/inputFile"
import { max, sum } from "../utils/reducers"
import { ascending } from "../utils/sorters"

function partOne() {
  const input = readLines(__dirname, inputFile())

  const tree = input.reduce(parseCommand, INITIAL_STATE).tree
  const directorySizes = getDirectorySizes(tree)
  const answer = directorySizes.filter(size => size <= 100000).reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const input = readLines(__dirname, inputFile())

  const tree = input.reduce(parseCommand, INITIAL_STATE).tree
  const directorySizes = getDirectorySizes(tree)
  const totalUsedSpace = directorySizes.reduce(max)
  const freeSpace = 70000000 - totalUsedSpace
  const threshold = 30000000 - freeSpace
  const answer = directorySizes.filter(size => size >= threshold).sort(ascending)[0]

  console.log("(P2) Answer: " + answer)
}

interface Tree {
  [name: string]: Tree | number
}

interface TreeParseState {
  tree: Tree
  workingDirectory: string[]
}

const INITIAL_STATE: TreeParseState = {
  tree: {},
  workingDirectory: []
}

const parseCommand = (
  { tree, workingDirectory }: TreeParseState,
  commandString: string
): TreeParseState => {
  if (commandString.startsWith("$")) {
    const [/*$*/, command, arg] = commandString.split(" ")
    if (command === "ls") { return { tree, workingDirectory }}
    // cd is other option
    if (arg === "/") { return { tree, workingDirectory: [] } }
    if (arg === "..") { return { tree, workingDirectory: workingDirectory.slice(0, workingDirectory.length - 1) } }
    return { tree, workingDirectory: [...workingDirectory, arg] }
  }
  // Reading output of ls
  if (commandString.startsWith("dir")) {
    const directoryName = commandString.split(" ")[1]
    return {
      tree: set(tree, workingDirectory, directoryName, {}),
      workingDirectory
    }
  }
  const [fileSize, fileName] = commandString.split(" ")
  return {
    tree: set(tree, workingDirectory, fileName, parseInt(fileSize)),
    workingDirectory
  }
}

function getDirectory(tree: Tree, path: string[]): Tree {
  return path.reduce(
    (location: Tree, nextDirectory: string) => location[nextDirectory] as Tree, tree)
}

function set(tree: Tree, path: string[], name: string, value: Tree | number): Tree {
  const directory = getDirectory(tree, path)
  directory[name] = value
  return tree
}

function getDirectorySizes(tree: Tree) : number[] {
  var sizes = []
  function dirSize(tree: Tree, path: string[]): number {
    const directory = getDirectory(tree, path)
    const size = Object.keys(directory)
      .map(member =>
        typeof directory[member] === "number"
          ? directory[member] as number
          : dirSize(tree, [...path, member]))
      .reduce(sum)
    sizes.push(size)
    return size
  }

  dirSize(tree, [])
  return sizes
}

partOne()
partTwo()
