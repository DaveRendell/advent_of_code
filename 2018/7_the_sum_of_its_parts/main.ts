import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import ArrayMap from "../../utils/arrayMap"
import sampleSpecificValue from "../../utils/sampleSpecificValue"

const dependencies = new ArrayMap<string, string>()
const tasks = new Set<string>()
readLines(__dirname, inputFile())
  .forEach(line => {
    const words = line.split(" ")
    const dependency = words[1]
    const dependent = words[7]
    dependencies.get(dependent).push(dependency)
    tasks.add(dependency)
    tasks.add(dependent)
  })

const todo = new Set([...tasks])
let order = ""
while (todo.size > 0) {
  const nextTask = [...todo]
    .filter(task =>
      dependencies.get(task)
        .every(dependency => !todo.has(dependency)))
    .sort()
    .at(0)
  order += nextTask
  todo.delete(nextTask)
}

console.log("(P1): ", order)
const todo2 = new Set([...tasks])

const workers = sampleSpecificValue(2, 5)
const baseTime = sampleSpecificValue(0, 60)

const workingOn: string[] = new Array(workers).fill(undefined)
const timeLeft: number[] = new Array(workers).fill(0)

let seconds = 0

while (todo2.size > 0) {
  for (let worker = 0; worker < workers; worker++) {
    if (timeLeft[worker] === 0) {
      if (workingOn[worker]) { todo2.delete(workingOn[worker]) }
      workingOn[worker] = [...todo2]
        .filter(task =>
          dependencies.get(task)
            .every(dependency => !todo2.has(dependency)))
        .filter(task => !workingOn.includes(task))
        .sort()
        .at(0)
      if (workingOn[worker]) {
        timeLeft[worker] = baseTime + workingOn[worker].charCodeAt(0) - 64
      }
    }
    if (timeLeft[worker] > 0) { timeLeft[worker]-- }
  }
  // console.log(seconds, workingOn)
  seconds++
}

console.log("(P2): ", seconds - 1)