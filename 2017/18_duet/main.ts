import readLines from "../../utils/readLines"
import inputFile from "../../utils/inputFile"

const input = readLines(__dirname, inputFile())

class Program {
    registers: { [r: string]: BigInt } = {
        a: BigInt(0),
        b: BigInt(0),
        p: BigInt(0),
        i: BigInt(0),
        f: BigInt(0),
    }

    pc = 0

    inbox: BigInt[]
    outbox: BigInt[]

    stalled = false

    constructor(p: number, inbox: BigInt[], outbox: BigInt[]) {
        this.registers[p] = BigInt(p)
        this.inbox = inbox
        this.outbox = outbox
    }

    runNextP1() {
        const instruction = input[this.pc]
        const [command, param1, param2] = instruction.split(" ")
        switch(command) {
            case "snd": this.outbox.push(this.parse(param1)); break
            case "set": this.registers[param1] = this.parse(param2); break
            case "add": this.registers[param1] += this.parse(param2); break
            case "mul": break
            case "mod": break
            case "rcv": break
            case "jgz": break
        }

    }

    parse(param: string): BigInt {
        if (this.registers[param] !== undefined) {
            return this.registers[param]
        }
        return BigInt(parseInt(param))
    }
}