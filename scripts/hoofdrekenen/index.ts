type Operation = 'add' | 'subtract' | '*' | '/'

interface Exercise {
  a: number
  b: number
  operation: Operation
  result: number
  requiresRegrouping: boolean
}

function requiresRegrouping(a: number, b: number, operation: Operation): boolean {
  if (operation === 'add') {
    return (a % 10) + (b % 10) >= 10
  }

  // subtraction
  return (a % 10) < (b % 10)
}

function maxUniqueCombinations(
  maxResult: number,
  operation: Operation
): number {
  if (operation === 'add') {
    // number of (a,b) pairs where a+b ≤ maxResult and a,b ≥1
    return (maxResult * (maxResult - 1)) / 2
  }

  // subtraction: a-b ≥0 and a ≤ maxResult
  return (maxResult * (maxResult + 1)) / 2
}

function generateExercises(
  count: number,
  maxResult: number,
  operation: Operation,
  allowRegrouping: boolean
): Exercise[] {
  const exercises: Exercise[] = []
  const used = new Set<string>()
  const maxUnique = maxUniqueCombinations(maxResult, operation)
  console.log(`maxUnique: ${maxUnique}`)

  while (exercises.length < count) {
    if (used.size >= maxUnique) {
      used.clear() // reset and keep going
    }

    let a: number
    let b: number
    let result: number

    if (operation === 'add') {
      result = randomInt(2, maxResult)
      a = randomInt(1, result - 1)
      b = result - a
    } else {
      result = randomInt(0, maxResult)
      b = randomInt(1, maxResult - result)
      a = result + b
    }

    const regroupingNeeded = requiresRegrouping(a, b, operation)
    if (!allowRegrouping && regroupingNeeded) continue

    const key =
      operation === 'add'
        ? `${a}+${b}`
        : `${a}-${b}`

    if (used.has(key)) continue
    used.add(key)

    exercises.push({
      a,
      b,
      operation,
      result,
      requiresRegrouping: regroupingNeeded
    })
  }

  return exercises
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let count: number = 60
const configs: { count: number, max: number, operator: Operation, allow_regrouping: boolean }[] = [
  { count, max: 10, operator: 'add', allow_regrouping: true },
  { count, max: 20, operator: 'add', allow_regrouping: false },
  { count, max: 100, operator: 'add', allow_regrouping: false },
  { count, max: 100, operator: 'add', allow_regrouping: true }
]

for (const { count, max, operator, allow_regrouping } of configs) {
  console.log(`\nRange ${1}-${max} ${allow_regrouping ? 'WITH' : 'WITHOUT'} regrouping`)
  for (let exercise of generateExercises(count, max, operator, allow_regrouping)) {
    console.log(`${exercise.a} ${exercise.operation} ${exercise.b} = ${exercise.result}`)
  }
}
