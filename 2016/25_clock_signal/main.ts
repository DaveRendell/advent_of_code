
function decompiled(i: number): void {
  let a = i
  let d = a + 2550
  
  while (true) {
    a = d
    while (a) {
      console.log(a % 2)
      a = Math.floor(a / 2)
    }
  }
}

// Need number with 101010... binary rep, larger than 2550

// 10 = 2
// 1010 = 10
// 101010 = 42

//n_i+1 = 4 * n_i + 2

let i = 2

while (i < 2550) {
  i = 4 * i + 2
}
console.log("i: " + i)
console.log("bin: " + i.toString(2))
console.log("a: " + (i - 2550))

decompiled(180)