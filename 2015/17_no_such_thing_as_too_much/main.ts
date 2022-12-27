import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { max, sum } from "../../utils/reducers"
import Queue from "../../utils/queue"
import { ascending, ascendingBy, descending } from "../../utils/sorters"

const containers = readLines(__dirname, inputFile())
  .map(v => parseInt(v))

const eggnog = 150

let combinations: Set<string> = new Set()
let todo = new Queue<number[]>()
todo.add([])

while(todo.hasNext()) {
  const next = todo.receive()
  const capacity = next.map(i => containers[i]).reduce(sum, 0)

  if (capacity === eggnog) {
    combinations.add(next.length.toString() + "~" + next.sort(ascending).join("-")
      + " -> " + next.map(i => containers[i])
        .sort(descending).join(", "))
    continue
  }

  const remainingContainers = containers
    .map((x, i) => [x, i])
    .filter(([_, i]) => !next.includes(i))
    .filter(([x]) => capacity + x <= eggnog)
    .map(([_, i]) => i)
  remainingContainers.forEach(i =>
    todo.add([...next, i]))
}

console.log("(P1): " + combinations.size)

const sortedCombos = [...combinations].sort(ascendingBy(l => parseInt(l.split("~")[0])))
const minimumComboCount = sortedCombos.filter(l => l.startsWith(sortedCombos[0].split("~")[0] + "~")).length

console.log("(P2): " + minimumComboCount)