import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { groupBy, sum } from "../../utils/reducers"
import { descending } from "../../utils/sorters"

const hands = readLines(__dirname, inputFile())
  .map(line => ({hand: line.slice(0, 5), bid: parseInt(line.slice(6))}))

const scoreKey = (hand: string) =>
  Object.values(hand.split("").reduce(groupBy(c => c), {}))
    .map(group => group.length)
    .sort(descending)
    .map(x => x.toString())
    .join("")
    .padEnd(5, "0")
  + hand
    .replaceAll("A", "E")
    .replaceAll("K", "D")
    .replaceAll("Q", "C")
    .replaceAll("J", "B")
    .replaceAll("T", "A")


const winnings = hands
  .sort((a, b) => scoreKey(a.hand).localeCompare(scoreKey(b.hand)))
  .map(({bid}, i) => bid * (i + 1))
  .reduce(sum)

console.log("(P1): " + winnings)

const wildCardScordKey = (hand: string) => {
  const groups = hand.split("").reduce(groupBy(c => c), {})
  const jokerLength = groups["J"] ? groups["J"].length : 0
  delete groups["J"]

  const groupLengths = Object.values(groups)
    .map(group => group.length)
    .sort(descending)

  if (groupLengths.length === 0) { groupLengths.push(0) } // cover JJJJJ
  groupLengths[0] += jokerLength

  return groupLengths
    .map(x => x.toString())
    .join("")
    .padEnd(5, "0")
  + hand
    .replaceAll("A", "E")
    .replaceAll("K", "D")
    .replaceAll("Q", "C")
    .replaceAll("J", "1")
    .replaceAll("T", "A")
}

const wildcardWinnings = hands
  .sort((a, b) => wildCardScordKey(a.hand).localeCompare(wildCardScordKey(b.hand)))
  .map(({bid}, i) => bid * (i + 1))
  .reduce(sum)

console.log(wildCardScordKey("JJJJJ"))

console.log("(P2): " + wildcardWinnings)