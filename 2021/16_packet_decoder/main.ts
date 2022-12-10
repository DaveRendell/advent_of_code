import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"
import { range } from "../../utils/numbers"
import { max, min, product, sum } from "../../utils/reducers"

function partOne() {
  const input = parseToBits()
  
  let packets: Packet[] = []
  let cursor = 0
  while (input.slice(cursor).includes("1")) {
    const state = readPacket(input, cursor)
    packets.push(state.packet)
    cursor = state.cursor
  }

  const answer = packets.map(sumVersion).reduce(sum)

  console.log("(P1) Answer: " + answer)
}

function partTwo() {
  const input = parseToBits()
  const {packet} = readPacket(input, 0)
  console.log("(P2) Answer: " + evaluatePacket(packet))
}

function parseToBits(): string[] {
  return readLines(__dirname, inputFile())
    .flatMap(lines => [...lines])
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, "0"))
    .flatMap(bin => [...bin])
}

interface PacketBase { _type: string, version: number, type: number }
interface Literal extends PacketBase { _type: "literal", value: number }
interface Operator extends PacketBase { _type: "operator", subPackets: Packet[] }
type Packet = Literal | Operator

interface State {
  cursor: number,
  packet: Packet
}

function readPacket(bits: string[], startCursor: number): State {
  let cursor = startCursor
  const readBits = (count: number): string[] => {
    const rawBits = bits.slice(cursor, cursor + count)
    cursor += count
    return rawBits
  }
  const readBit = () => readBits(1)[0]
  const readBitsAsNumber = (count: number): number =>
    parseInt(readBits(count).join(""), 2)

  const version = readBitsAsNumber(3)
  const type = readBitsAsNumber(3)
  
  if (type === 4) {
    let valueBits = []
    while (readBit() === "1") { valueBits.push(...readBits(4)) }
    valueBits.push(...readBits(4))
    const value = parseInt(valueBits.join(""), 2)
    return { cursor, packet: { _type: "literal", version, type, value }}
  }

  const lengthType = readBit()

  if (lengthType === "0") {
    const length = readBitsAsNumber(15)
    const endPoint = cursor + length
    let subPackets: Packet[] = []
    while (cursor < endPoint) {
      const state = readPacket(bits, cursor)
      cursor = state.cursor
      subPackets.push(state.packet)
    }
    return { cursor, packet: { _type: "operator", version, type, subPackets }}
  }

  const numberOfPackets = readBitsAsNumber(11)
  let subPackets = []
  for (let i = 0; i < numberOfPackets; i++) {
    const state = readPacket(bits, cursor)
    cursor = state.cursor
    subPackets.push(state.packet)
  }
  return { cursor, packet: { _type: "operator", version, type, subPackets }}
}

function sumVersion(packet: Packet): number {
  if (packet._type === "literal") { return packet.version }
  return packet.version + packet.subPackets.map(sumVersion).reduce(sum)
}

function evaluatePacket(packet: Packet): number {
  if (packet._type === "literal") { return packet.value }
  if (packet.type === 0) { // Sum
    return packet.subPackets.map(evaluatePacket).reduce(sum)
  }
  if (packet.type === 1) { // Product
    return packet.subPackets.map(evaluatePacket).reduce(product)
  }
  if (packet.type === 2) { // Product
    return packet.subPackets.map(evaluatePacket).reduce(min)
  }
  if (packet.type === 3) { // Product
    return packet.subPackets.map(evaluatePacket).reduce(max)
  }
  if (packet.type === 5) { // Greater Than
    return evaluatePacket(packet.subPackets[0]) > evaluatePacket(packet.subPackets[1]) ? 1 : 0
  }
  if (packet.type === 6) { // Less Than
    return evaluatePacket(packet.subPackets[0]) < evaluatePacket(packet.subPackets[1])  ? 1 : 0
  }
  if (packet.type === 7) { // Equal to
    return evaluatePacket(packet.subPackets[0]) == evaluatePacket(packet.subPackets[1])  ? 1 : 0
  }
}

partOne()
partTwo()
