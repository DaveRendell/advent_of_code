import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

interface Wire { dependencies: string[], action: (values: WireValues) => number }
type WireValues = Record<string, number>
type Circuit = Record<string, Wire>

const parseWire = (wireDef: string): Wire => {
  const words = wireDef.split(" ")
  const getArg = (values: WireValues) => (id: number): number =>
    isNaN(parseInt(words[id])) ? values[words[id]] : parseInt(words[id])
  const dependencyList = (...ids: number[]) =>
    ids.filter(id => isNaN(parseInt(words[id]))).map(id => words[id])
  if (words.length === 1) { // Constant
    return {
      action: (values) => getArg(values)(0) & 0xFFFF,
      dependencies: dependencyList(0),
    }
  }
  if (words.length === 2) { // NOT x
    return {
      action: (values) => ~getArg(values)(1) & 0xFFFF,
      dependencies: dependencyList(1),
    }
  }
  if (words[1] === "AND") {
    return {
      action: (values) => getArg(values)(0) & getArg(values)(2),
      dependencies: dependencyList(0, 2),
    }
  }
  if (words[1] === "OR") {
    return {
      action: (values) => getArg(values)(0) | getArg(values)(2),
      dependencies: dependencyList(0, 2),
    }
  }
  if (words[1] === "LSHIFT") {
    return {
      action: (values) => getArg(values)(0) << getArg(values)(2),
      dependencies: dependencyList(0, 2),
    }
  }
  if (words[1] === "RSHIFT") {
    return {
      action: (values) => getArg(values)(0) >> getArg(values)(2),
      dependencies: dependencyList(0, 2),
    }
  }
}

const bobbysCircuit = Object.fromEntries(
  readLines(__dirname, inputFile())
    .map(line => line.split(" -> "))
    .map(([wireDef, name]) => [name, parseWire(wireDef)]))

const getWireAValue = (circuit: Circuit, startValues: WireValues): number => {
  const values = { ...startValues }
  while (values["a"] === undefined) {
    Object.keys(circuit)
      .filter(key => values[key] === undefined)
      .filter(key => circuit[key].dependencies.every(name => values[name] !== undefined))
      .forEach(key => values[key] = circuit[key].action(values))
  }
  return values["a"]
}

const p1Answer = getWireAValue(bobbysCircuit, {})
console.log("(P1): " + p1Answer)

console.log("(P2): " + getWireAValue(bobbysCircuit, { "b": p1Answer }))