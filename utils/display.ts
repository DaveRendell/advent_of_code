export default class Display {
  lines = 0

  print(line: string) {
    console.log(line)
    this.lines += 1 + [...line].filter(c => c === "\n").length
  }

  clear() {
    process.stdout.moveCursor(0, -this.lines, () => {
      process.stdout.clearScreenDown()
    })
    this.lines = 0
  }
}
