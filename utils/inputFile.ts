export default function inputFile(): string {
  if (process.argv[1]) { return `${process.argv[1]}`}
  return "input.txt"
}