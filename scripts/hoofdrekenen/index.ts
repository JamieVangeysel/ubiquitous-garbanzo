import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import * as fs from 'node:fs'
import fontkit from '@pdf-lib/fontkit'

type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

const rows = 5
const cols = 4
const blocks = 5

interface Exercise {
  a: number
  b: number
  operation: Operation
  result: number
  requiresRegrouping: boolean
}

const fontBytes = fs.readFileSync('./fonts/Courier New.ttf')

if (!fs.existsSync('./exercises')) {
  fs.mkdirSync('./exercises')
}

function requiresRegrouping(a: number, b: number, operation: Operation): boolean {
  switch (operation) {
    case 'add':
      return (a % 10) + (b % 10) >= 10
    case 'subtract':
      return (a % 10) < (b % 10)
    default:
      return false // not relevant for * and /
  }
}

function assertRegroupingAllowed(maxResult: number): void {
  if (maxResult >= 1000) {
    throw new Error('Regrouping / borrowing only supported for maxResult < 1000')
  }
}

function countAdditionWithRegrouping(maxResult: number): number {
  return (maxResult * (maxResult - 1)) / 2
}

function countAdditionWithoutRegrouping(maxResult: number): number {
  assertRegroupingAllowed(maxResult)

  let count = 0
  for (let a = 1; a <= maxResult; a++) {
    for (let b = 1; b <= maxResult; b++) {
      if (a + b > maxResult) continue
      if ((a % 10) + (b % 10) >= 10) continue
      count++
    }
  }
  return count
}

function countSubtractionWithBorrowing(maxResult: number): number {
  return (maxResult * (maxResult + 1)) / 2
}

function countSubtractionWithoutBorrowing(maxResult: number): number {
  assertRegroupingAllowed(maxResult)

  let count = 0
  for (let a = 1; a <= maxResult; a++) {
    for (let b = 1; b <= a; b++) {
      if ((a % 10) < (b % 10)) continue
      count++
    }
  }
  return count
}

function countMultiplication(maxResult: number): number {
  let count = 0
  for (let a = 1; a <= maxResult; a++) {
    count += Math.floor(maxResult / a)
  }
  return count
}

function countDivision(maxResult: number): number {
  let count = 0
  for (let result = 1; result <= maxResult; result++) {
    count += Math.floor(maxResult / result)
  }
  return count
}

function maxUniqueCombinations(
  maxResult: number,
  operation: Operation,
  allowRegrouping: boolean
): number {
  switch (operation) {
    case 'add':
      return allowRegrouping
        ? countAdditionWithRegrouping(maxResult)
        : countAdditionWithoutRegrouping(maxResult)

    case 'subtract':
      return allowRegrouping
        ? countSubtractionWithBorrowing(maxResult)
        : countSubtractionWithoutBorrowing(maxResult)

    case 'multiply':
      return countMultiplication(maxResult)

    case 'divide':
      return countDivision(maxResult)
  }
}


function generateExercises(
  count: number,
  maxResult: number,
  operation: Operation,
  allowRegrouping: boolean
): Exercise[] {
  const exercises: Exercise[] = []
  const used = new Set<string>()
  const maxUnique = maxUniqueCombinations(maxResult, operation, allowRegrouping)
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
    if (!allowRegrouping && regroupingNeeded)
      continue

    const key =
      operation === 'add'
        ? `${a}+${b}`
        : `${a}-${b}`

    if (used.has(key)) {
      // console.log(`skipping ${key} because it was already used`, used.size, maxUnique)
      continue
    }
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

interface iConfig {
  name: string,
  count: number,
  max: number,
  operator: Operation,
  allow_regrouping: boolean
}

const configs: iConfig[] = [
  { name: 'Plus tot 10', count: 100, max: 10, operator: 'add', allow_regrouping: true }
  , { name: 'Min tot 10', count: 100, max: 10, operator: 'subtract', allow_regrouping: true }
  , { name: 'Plus tot 20', count: 200, max: 20, operator: 'add', allow_regrouping: false }
  , {
    name: 'Plus tot 100 (zonder brug)',
    count: 100,
    max: 100,
    operator: 'add',
    allow_regrouping: false
  }
  , {
    name: 'Plus tot 100 met (brug)',
    count: 100,
    max: 100,
    operator: 'add',
    allow_regrouping: true
  }
  , {
    name: 'Plus tot 1.000',
    count: 100,
    max: 1000,
    operator: 'add',
    allow_regrouping: true
  }
  , {
    name: 'Plus tot 10.000',
    count: 100,
    max: 10000,
    operator: 'add',
    allow_regrouping: true
  }
  , {
    name: 'Plus tot 1.000.000',
    count: 100,
    max: 1000000,
    operator: 'add',
    allow_regrouping: true
  }
]

const start = performance.now()
for (const config of configs) {
  const start_ex = performance.now()
  createExercisesPdf(config, true)
  console.log(`created exercises pdf for ${config.name} in ${performance.now() - start_ex}ms`)
}
console.log(`created all exercises pdf's in ${performance.now() - start}ms`)

async function createExercisesPdf(config: iConfig, with_solution: boolean = false) {
  const exercises: Exercise[] = generateExercises(config.count, config.max, config.operator, config.allow_regrouping)

  await generatePdf(exercises, config, false)
  if (with_solution) {
    await generatePdf(exercises, config, true)
  }
}

async function generatePdf(exercises: Exercise[], config: iConfig, with_solution: boolean = false) {
  // Create a new PDFDocument
  let pdfDoc: PDFDocument | undefined = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  pdfDoc.setCreator('Ubiquitous Garbanzo')
  pdfDoc.setProducer('Ubiquitous Garbanzo')
  pdfDoc.setAuthor('Jamie Vangeysel')
  pdfDoc.setLanguage('nl-BE')
  pdfDoc.setTitle(config.name + with_solution ? ' OPLOSSING' : '', { showInWindowTitleBar: true })
  pdfDoc.setSubject('Hoofdrekenen')

  //
  const courierFont = await pdfDoc.embedFont(fontBytes)
  // const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
  const courierFontBold = await pdfDoc.embedFont(StandardFonts.CourierBold)

  // Add a blank page to the document
  let page = pdfDoc.addPage()

  // Get the width and height of the page
  const { width, height } = page.getSize()
  // console.log(`width: ${width}, height: ${height}`)
  const margins: number[3] = [56.69, 35.43, 56.69, 35.43]

  // Draw a string of text toward the top of the page
  const fontSizeTitle = 24
  const fontSize = 13
  const textWidth = courierFontBold.widthOfTextAtSize(config.name, fontSizeTitle)
  page.drawText(config.name, {
    x: (width - textWidth) / 2,
    y: height - fontSizeTitle - margins[0],
    size: fontSizeTitle,
    font: courierFontBold,
    color: rgb(0, 0, 0)
  })

  const max_exercise_text_length = getLongestExercise(exercises, config)
  const max_exercise_width = courierFont.widthOfTextAtSize(''.padStart(max_exercise_text_length, '0'), fontSize)

  const max_cols = Math.min(cols, Math.floor((width - margins[1] - margins[3]) / (max_exercise_width + 8)))

  const cols_start: number[] = []
  // generate storting positions for the columns
  const spacing_for_exercise = (width - margins[1] - margins[3] - max_exercise_width) / (max_cols - 1)
  for (let i = 0; i < max_cols; i++) {
    if (i === 0) {
      cols_start.push(margins[1])
    } else {
      let prev = cols_start[i - 1] ?? 0
      cols_start.push(prev + spacing_for_exercise)
    }
  }

  let i = 0
  let page_index = 1
  const start_y = height - fontSizeTitle - margins[0] - (margins[2] * .66)
  const exercise_height = courierFont.heightAtSize(fontSize)
  let spacing_block = (start_y - (Math.min(exercises.length / max_cols, rows * blocks) * (exercise_height * 2))) / blocks
  for (let exercise of exercises) {
    let pos = getGridPosition(i, max_cols)
    const exercise_text = writeExerciseText(config, exercise, !with_solution)
    let y: number = start_y - (pos.row * (exercise_height * 2)) - (pos.block * spacing_block)
    if (y > margins[2]) {
      page.drawText(exercise_text, {
        x: cols_start[pos.col] ?? 0,
        y,
        size: fontSize,
        font: courierFont,
        color: rgb(0, 0, 0)
      })
      i++
    } else {
      page_index++
      i = 0
      pos = getGridPosition(i, max_cols)
      y = start_y - (pos.row * (exercise_height * 2)) - (pos.block * spacing_block)
      spacing_block = (start_y - (Math.min(exercises.length / max_cols, rows * blocks) * (exercise_height * 2))) / blocks
      page = pdfDoc.addPage()
      page.drawText(config.name, {
        x: (width - textWidth) / 2,
        y: height - fontSizeTitle - margins[0],
        size: fontSizeTitle,
        font: courierFontBold,
        color: rgb(0, 0, 0)
      })
      page.drawText(exercise_text, {
        x: cols_start[pos.col] ?? 0,
        y,
        size: fontSize,
        font: courierFont,
        color: rgb(0, 0, 0)
      })
      i++
    }
  }

  // write page numbers on all pages
  let pages = pdfDoc.getPages()
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (page) {
      const pageText = `Pagina ${i + 1} van ${pages.length}`

      page.drawText(pageText, {
        x: width - margins[1] - courierFont.widthOfTextAtSize(pageText, 10),
        y: margins[2] / 2,
        size: 10,
        font: courierFont,
        color: rgb(0, 0, 0)
      })
    }
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  let pdfBytes = await pdfDoc.save()
  pdfDoc = undefined
  fs.writeFileSync(`./exercises/${config.name}${with_solution ? ' OPLOSSING' : ''}.pdf`, pdfBytes)
  pdfBytes = Uint8Array.from([])
}

function getGridPosition(
  index: number,
  columnsPerRow = 5,
  blocksPerPage = 5
): { row: number; block: number; col: number } {
  let row = Math.floor(index / columnsPerRow)
  return {
    row,
    block: Math.floor(row / blocksPerPage),
    col: index % columnsPerRow
  }
}

function getLongestExercise(exercises: Exercise[], config: iConfig) {
  return exercises.reduce((prev: number, curr: Exercise): number => {
    if (prev < writeExerciseText(config, curr).length) {
      return writeExerciseText(config, curr).length
    }
    return prev
  }, 0)
}

function writeExerciseText(config: iConfig, e: Exercise, hide_result: boolean = false) {
  const max_string_length: number = (config.max - 1).toString().length

  let a: string = e.a.toString().padStart(max_string_length, ' ')
  let b: string = e.b.toString().padStart(max_string_length, ' ')
  let result: string = hide_result ? ''.padStart(Math.min(config.max.toString().length, 3), '.') : e.result.toString().padStart(max_string_length, ' ')
  return `${a} ${getOperationSymbol(e.operation)} ${b} = ${result}`
}

function getOperationSymbol(operation: Operation) {
  switch (operation) {
    case 'add':
      return '+'
    case 'subtract':
      return '-'
  }
}
