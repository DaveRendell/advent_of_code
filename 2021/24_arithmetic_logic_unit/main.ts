
// https://www.juliabloggers.com/advent-of-code-2021-day-24/
const blocks = [
  { opType: 1, correction: 12, offset: 4 }, //AAAA 0
  { opType: 1, correction: 11, offset: 10 }, //BBBB 1

  { opType: 1, correction: 14, offset: 12 }, //CCCC 2
  { opType: 26, correction: -6, offset: 14 }, //CCCC 3

  { opType: 1, correction: 15, offset: 6 }, //DDDD 4
  { opType: 1, correction: 12, offset: 16 }, //EEEE 5

  { opType: 26, correction: -9, offset: 1 }, //EEEE 6
  { opType: 1, correction: 14, offset: 7 }, //FFFF 7

  { opType: 1, correction: 14, offset: 8 }, //GGGG 8
  { opType: 26, correction: -5, offset: 11 }, //GGGG 9

  { opType: 26, correction: -9, offset: 8 }, //FFFF 10
  { opType: 26, correction: -5, offset: 3 }, //DDDD 11

  { opType: 26, correction: -2, offset: 1 }, //BBBB 12
  { opType: 26, correction: -7, offset: 8 }, //AAAA 13
]

/*
0  9  4
1  1  1
2  3  1
3  9  7
4  8  1
5  2  1
6  9  8
7  9  3
8  6  1
9  9  4
10 7  1
11 9  2
12 9  9
13 6  1
*/

// AAA
// offset<0> + correction<13> == -3
// w<0> - 3 == w<13>

// BBB
// offset<1> + correction<12> == 8
// w<1> + 8 = w<12>

// CCC
// offset<2> + correction<3> === 6
// w<2> + 6 == w<3>

// DDD
// offset<4> + correction<11> === 1
// w<4> + 1 == w<11>

// EEE
// offset<5> + correction<6> === 7
// w<5> + 7 = w<6>

// FFF
// offset<7> + correction<10> === -2
// w<7> - 2 == w<10>

// GGG
// offset<8> + correction<9> === 3
// w<8> + 3 == w<9>
