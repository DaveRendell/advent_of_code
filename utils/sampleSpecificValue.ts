export default function sampleSpecificValue<T>(sampleValue: T, mainValue: T): T {
  if ( process.argv[2] === "sample" ) { return sampleValue }
  return mainValue
}