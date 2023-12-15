function knotHash(input: string): number[] { // taken from reddit
  let lengths = [...input].map(x => x.charCodeAt(0));
  let numbers = [...Array(256).keys()];
  let pos = 0, skip = 0;
  let denseHash: number[] = [];
  
  lengths.push(17, 31, 73, 47, 23);
  
  for (let i = 0; i < 64; i++) {
      for (const len of lengths) {
          if (len > 1) {
              numbers = [...numbers.slice(pos), ...numbers.slice(0, pos)];
              numbers = [...numbers.slice(0, len).reverse(), ...numbers.slice(len)];
              numbers = [...numbers.slice(-pos), ...numbers.slice(0, -pos)];
          }
          pos = (pos + len + skip++) % 256;
      }
  }
  
  for (let i = 0; i < 16; i++) {
      const o = numbers.slice(i * 16, i * 16 + 16).reduce((a, b) => a ^ b);
      denseHash.push(o);
  }

  return denseHash
}

console.log(knotHash("187,254,0,81,169,219,1,190,19,102,255,56,46,32,2,216"))