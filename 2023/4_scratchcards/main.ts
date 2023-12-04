import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"

interface Card {
  id: number
  winners: number[]
  played: number[]
}

const cards: Card[] = readLines(__dirname, inputFile())
  .map((line, i) => {
    const [winnersString, playedString] = line.split(": ")[1].split(" | ")
    return {
      id: i + 1,
      winners: winnersString
        .split(" ").filter(x => x.length > 0).map(x => parseInt(x)),
      played: playedString
        .split(" ").filter(x => x.length > 0).map(x => parseInt(x)),
    }
  })

const winCount = (card: Card): number =>
card.played.filter(num => card.winners.includes(num)).length

const score = (card: Card): number =>
  winCount(card) === 0 ? 0 : 1 << (winCount(card) - 1)

console.log("(P1): " + cards.map(score).reduce(sum))

const cardCount = new Array(cards.length).fill(1)

for (let i = 0; i < cardCount.length; i++) {
  const wins = winCount(cards[i])
  for (let j = i + 1; j <= i + wins && j < cardCount.length; j++) {
    cardCount[j] += cardCount[i]
  }
}

console.log("(P2): " + cardCount.reduce(sum))