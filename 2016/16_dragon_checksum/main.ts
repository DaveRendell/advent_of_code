import { chunks } from "../../utils/reducers"

const input = "10111100110001111"

function dragonCurve(a: string): string {
  const b = [...a]
    .reverse()
    .map(char => ["1", "0"][char])
    .join("")
  return `${a}0${b}`
}

function expand(data: string, requiredLength: number): string {
  if (data.length >= requiredLength) { return data.slice(0, requiredLength) }
  return expand(dragonCurve(data), requiredLength)
}

function checksum(data: string): string {
  let reduced = ""
  for (let i = 0; i < data.length; i += 2) { reduced += data[i] === data[i + 1] ? "1" : "0" }
  if (reduced.length % 2 === 0) { return checksum(reduced) }
  return reduced
}

function expandedChecksum(data: string, requiredLength: number): string {
  const expanded = expand(data, requiredLength)
  return checksum(expanded)
}

console.log("(P1): " + expandedChecksum(input, 272))

console.log("(P2): " + expandedChecksum(input, 35651584))