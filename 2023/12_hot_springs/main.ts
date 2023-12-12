import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { sum } from "../../utils/reducers"
import HashMap from "../../utils/hashmap"

interface Row { springs: string, lengths: number[] }

const rows: Row[] = readLines(__dirname, inputFile())
  .map(line => {
    const [springs, numberList] = line.split(" ")
    return {
      springs,
      lengths: numberList.split(",").map(n => parseInt(n))
    }
  })

const memo: HashMap<Row, number> = new HashMap(
  row => (row.springs + " " + row.lengths.join(",")),
  [])

const memoisedGetCount = (row: Row): number => {
  if (memo.has(row)) { return memo.get(row) }
  const result = getCount(row)
  memo.set(row, result)
  return result
}

const getCount = ({ springs, lengths }: Row): number => {
  if (springs.length === 0) {
    // Empty spring row only has a valid solution if no lengths
    return lengths.length === 0 ? 1 : 0
  }

  if (lengths.length === 0) {
    // If no lengths, only valid solution if springs has no #s
    return springs.includes("#") ? 0 : 1
  }
  
  if (springs.length < lengths.reduce(sum) + lengths.length - 1) {
    // Too many lengths left
    return 0
  }

  if (springs.startsWith(".")) {
    return memoisedGetCount( { springs: springs.slice(1), lengths })
  }

  if (springs.startsWith("#")) {
    const length = lengths[0]
    // Must be able to fit entire first length in
    if (springs.slice(0, length).includes(".")) { return 0 }

    // But mustn't force first length to be too big
    if (springs[length] === "#") { return 0 }

    // Otherwise count for remaining lenths
    return memoisedGetCount({
      springs: springs.slice(length + 1),
      lengths: lengths.slice(1)
    })
  }

  // Otherwise starts with ?, try both options
  return memoisedGetCount({ springs: "#" + springs.slice(1), lengths })
   + memoisedGetCount({ springs: "." + springs.slice(1), lengths })
}

console.log("(P1): " + rows
  .map(row => memoisedGetCount(row))
  .reduce(sum))

const unfold = ({ springs, lengths: groups }: Row): Row => {
  return {
    springs: [springs, springs, springs, springs, springs].join("?"),
    lengths: [...groups, ...groups, ...groups, ...groups, ...groups]
  }
}

const unfoldedRows = rows.map(unfold)

console.log("(P2): " + unfoldedRows
  .map(row => memoisedGetCount(row))
  .reduce(sum))