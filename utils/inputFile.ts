export default function inputFile(): string {
  if ( process.argv[2] ) { return `${process.argv[2]}.txt` }
  return "input.txt"
}
