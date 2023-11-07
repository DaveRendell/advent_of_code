import { range } from "./numbers"

export default function permutator(size: number): number[][] {
  let results: number[][] = []

  function permute(arr: number[], memo: number[] = []) {
    if (arr.length === 0) { results.push(memo) }
    else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice()
        let next = curr.splice(i, 1)
        permute(curr.slice(), memo.concat(next))
      }
    }
  }
  permute(range(0, size))
  return results
}
