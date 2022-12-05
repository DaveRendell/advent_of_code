export function range(num1: number, num2: number): number[] {
  const start = Math.min(num1, num2)
  const end = Math.max(num1, num2)
  return [...Array(end).keys()].slice(start)
}

export function inclusiveRange(num1: number, num2: number): number[] {
  const start = Math.min(num1, num2)
  const end = Math.max(num1, num2)
  return [...Array(end + 1).keys()].slice(start)
}