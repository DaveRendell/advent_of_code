import {createReadStream} from 'fs'
import {join} from 'path'

const INPUT_NAME = "input.txt"

function partOne() {
  const path = join(__dirname, INPUT_NAME)
  const fileStream = createReadStream(path, 'utf-8')

  fileStream.on('error', (error) => console.error('ERROR: ' + error.message))
  var highestTotal = 0
  var runningTotal = 0
  fileStream.on('data', (chunk) => {
    const input = chunk.toString()
    input.split('\n').forEach(line => {
      if (line.length == 0) {
        highestTotal = runningTotal >= highestTotal ? runningTotal : highestTotal
        runningTotal = 0
        return
      }
      var calorieValue = parseInt(line)
      runningTotal += calorieValue
    })
  })
  fileStream.on('end', () => console.log("Highest total: " + highestTotal))
}

function partTwo() {
  const path = join(__dirname, INPUT_NAME)
  const fileStream = createReadStream(path, 'utf-8')

  fileStream.on('error', (error) => console.error('ERROR: ' + error.message))
  var topThree = [0, 0, 0]
  var lowestTopThree = 0
  var runningTotal = 0

  fileStream.on('data', (chunk) => {
    const input = chunk.toString()
    input.split('\n').forEach(line => {
      if (line.length == 0) {
        if (runningTotal > lowestTopThree) {
          topThree.push(runningTotal)
          topThree.sort()
          topThree.splice(0, 1)
          lowestTopThree = topThree[0]
        }
        runningTotal = 0
        return
      }
      var calorieValue = parseInt(line)
      runningTotal += calorieValue
    })
  })
  fileStream.on('end', () => {
    const total = topThree.reduce((a, b) => a + b)
    console.log("TOTAL: " + total)
  })
}

// partOne()
partTwo()