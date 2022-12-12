import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, min, sum } from "../../utils/reducers"
import { range } from "../../utils/numbers"
import { formatDiagnosticsWithColorAndContext } from "../../node_modules/typescript/lib/typescript"

function partOne() {
  const playerStartPositions = readLines(__dirname, inputFile())
    .map(line => parseInt(line.at(-1)))

  const initialState: StateP1 = {
    player: 0,
    positions: playerStartPositions,
    scores: [0, 0],
    dice: 0
  }

  let state = initialState
  while (state.scores.reduce(max) < 1000) {
    state = processP1(state)
  }

  const answer = state.scores.reduce(min) * state.dice

  console.log("(P1) Answer: " + answer)
}

interface StateP1 {
  player: number
  positions: number[]
  scores: number[]
  dice: number
}

const wrapDice = (number: number) => (number - 1) % 100 + 1
const wrapPosition = (number: number) => (number - 1) % 10 + 1

const processP1 = ({ player, positions, scores, dice }: StateP1): StateP1 => {
  const rolls = [wrapDice(dice + 1), wrapDice(dice + 2), wrapDice(dice + 3)]
  const newPosition = wrapPosition(positions[player] + rolls.reduce(sum))
  const newScore = scores[player] + newPosition
  //console.log(`Player ${player + 1} rolls ${rolls.join("+")} and moves to space ${newPosition} for a total score of ${newScore}.`)
  return {
    player: (player + 1) % 2,
    positions: positions.map((p, i) => i === player ? newPosition : p),
    scores: scores.map((s, i) => i === player ? newScore : s),
    dice: dice + 3
  }
}

const rollCombos = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
}

type UniverseCount = number[][][][]

function partTwo() {
  const playerStartPositions = readLines(__dirname, inputFile())
    .map(line => parseInt(line.at(-1)))
  
  const initialState: StateP2 = {
    player: 0,
    positions: playerStartPositions,
    scores: [0, 0],
    universes: 1
  }

  let universes: UniverseCount = range(0, 21).map(() => range(0, 21).map(() => range(0, 10).map(() => range(0, 10).map(() => 0))))
  universes[0][0][playerStartPositions[0]][playerStartPositions[1]] = 1
  let player = 0
  let stillPlaying = false
  let wins = [0, 0]
  let winsByTurn = []
  let universesByTurn = []
  let turn = 1
  do {
    console.log("Turn " + turn++)
    stillPlaying = false
    let universesStillInPlay = range(0, 21).map(() => range(0, 21).map(() => range(0, 10).map(() => range(0, 10).map(() => 0))))
    let turnWins = 0
    let turnUniverses = 0
    universes.forEach((a, p1Score) =>
      a.forEach((b, p2Score) =>
        b.forEach((c, p1Position) =>
          c.forEach((universeCount, p2Position) => {
            if (universeCount > 0) {
              turnUniverses += universeCount
              Object.keys(rollCombos).forEach(rollResult => {
                const newUniverses = rollCombos[rollResult]
                const position = (player === 0 ? p1Position : p2Position) + 1 // 1 to 10
                const score = player === 0 ? p1Score : p2Score
                const newPosition = wrapPosition(position + parseInt(rollResult))
                const newScore = score + newPosition
                if (newScore >= 21) {
                  wins[player] += universeCount * newUniverses
                  turnWins += universeCount * newUniverses
                } else {
                  stillPlaying = true
                  const newP1Position = player === 0 ? (newPosition - 1) : p1Position
                  const newP2Position = player === 0 ? p2Position : (newPosition - 1)
                  const newP1Score = player === 0 ? newScore : p1Score
                  const newP2Score = player === 0 ? p2Score : newScore
                  universesStillInPlay[newP1Score][newP2Score][newP1Position][newP2Position] = universeCount * newUniverses
                }
              })
            }            
          }))))
    player = (player + 1) % 2
    universes = universesStillInPlay
    winsByTurn.push(turnWins)
    universesByTurn.push(turnUniverses)
  } while (stillPlaying)
  console.log("(P1) Answer: " + wins.reduce(max))
  console.log(winsByTurn)
  console.log(universesByTurn)
}

interface StateP2 {
  universes: number
  player: number
  positions: number[]
  scores: number[]
}

const processP2 = ({ player, positions, scores, universes }: StateP2): StateP2[] => {
  return Object.keys(rollCombos).map(rollResult => {
    const newUniverses = rollCombos[rollResult]
    const newPosition = wrapPosition(positions[player] + parseInt(rollResult))
    const newScore = scores[player] + newPosition
    return {
      player: (player + 1) % 2,
      positions: positions.map((p, i) => i === player ? newPosition : p),
      scores: scores.map((s, i) => i === player ? newScore : s),
      universes: universes * newUniverses
    }
  })
}

partOne()
partTwo()