import readLines from "../../utils/readLines"

const INPUT_NAME = "input.txt"

function partOne() {
  const position = readLines(__dirname, INPUT_NAME)
    .reduce(updatePositionP1, { distance: 0, depth: 0 })
  
  const answer = position.depth * position.distance
  console.log("(P1) depth * distance = " + answer)
}

function partTwo() {
  const position = readLines(__dirname, INPUT_NAME)
    .reduce(updatePositionP2, { distance: 0, depth: 0, aim: 0 })
  
  const answer = position.depth * position.distance
  console.log("(P2) depth * distance = " + answer)
}

partOne()
partTwo()

interface PositionP1 {
  distance: number
  depth: number
}

function updatePositionP1({ distance, depth }: PositionP1, line: string): PositionP1 {
  const [command, amount] = line.split(" ")
  const scale = parseInt(amount)
  switch(command) {
    case "forward":
      return { distance: distance + scale, depth }
    case "up":
      return { distance, depth: depth - scale }
    case "down":
      return { distance, depth: depth + scale }
    default:
      return { distance, depth }
  }
}

interface PositionP2 {
  distance: number
  depth: number
  aim: number
}

function updatePositionP2({ distance, depth, aim }: PositionP2, line: string): PositionP2 {
  const [command, amount] = line.split(" ")
  const scale = parseInt(amount)
  switch(command) {
    case "forward":
      return { distance: distance + scale, depth: depth + aim * scale, aim }
    case "up":
      return { distance, depth, aim: aim - scale }
    case "down":
      return { distance, depth, aim: aim + scale }
    default:
      return { distance, depth, aim }
  }
}
