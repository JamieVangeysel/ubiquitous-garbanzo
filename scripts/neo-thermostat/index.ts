import fs from 'node:fs'
import readline from 'node:readline'

console.debug = () => {
}

const csv_header = 'date,state,target-state,temperature,target-temperature,outside-temperature,heat-index'
const skip_lines = new Set([
  csv_header
  // '2025-08-05 20:07:33,0,0,0,20,0,-2.638888888888887'
])
const max_lines: number = 4
let lines_read: number = 0

const rd = readline.createInterface({
  input: fs.createReadStream('./data-log.csv'),
  output: process.stdout,
  terminal: false
})

let header_found: boolean = false
let first_line: boolean = true
const start = performance.now()
console.log('----------------------------------------')
console.log('Starting neo-thermostat data analytics')
console.log('----------------------------------------')

rd.on('line', onLine)

rd.on('close', () => {
  console.debug('done reading file after ' + (performance.now() - start) + 'ms.')
})

function onLine(line: string) {
  try {
    if (line === csv_header) {
      console.debug('header found!')
      header_found = true
    } else if (!skip_lines.has(line)) {
      lines_read++
      if (max_lines === lines_read) { // header_found
        rd.removeListener('line', onLine)
        setTimeout(() => rd.close(), 1000)
      }
      try {
        const row = parseLine(line)
        if (row) {
          console.debug('----------------------------------------')
          console.debug('line: ' + line)
          console.debug('----------------------------------------')
          console.debug(row)
          console.debug('----------------------------------------')
          // rd.close()

          auditRow(row)
        }
      } catch (e: any) {
        if (e instanceof Error) {
          console.error('--------------  ERROR  -----------------')
          console.error('----------------------------------------')
          console.error('Error: ' + e.message)
          console.error('----------------------------------------')
        }
      }
    }
  } catch (e) {
    rd.removeListener('line', onLine)
    console.error('error in line: ', line, 'error: ', e)
    rd.close()
  }
}

function parseLine(line: string): ICsvRow | undefined {
  let parsed: ICsvRow | undefined

  try {
    const [date, state, target_state, temperature, target_temperature, outside_temperature, heat_index] = line.split(',')
    parsed = {
      date: date === undefined ? new Date(1950, 0, 1) : new Date(date),
      state: state === '0' ? 'off' : 'on',
      target_state: target_state === '0' ? 'off' : 'on',
      temperature: temperature === undefined ? 0 : Number.parseFloat(temperature),
      target_temperature: target_temperature === undefined ? 0 : Number.parseFloat(target_temperature),
      outside_temperature: outside_temperature === undefined ? 0 : Number.parseFloat(outside_temperature),
      heat_index: heat_index === undefined ? 0 : Number.parseFloat(heat_index)
    }
  } catch (e) {
    console.error('error parsing csv line: ', line, 'error: ', e)
  }

  return parsed
}

let last_date: Date
let last_state: TState
let last_target_state: TState
let last_temperature: number
let last_target_temperature: number
let last_outside_temperature: number
let last_heat_index: number
let last_c_state: CState
let last_c_direction: CDirection

function auditRow(row: ICsvRow) {
  console.debug('Running auditRow')
  console.debug('----------------------------------------')

  if (row.date === undefined) {
    throw new Error('date is undefined')
  }

  if (row.temperature === 0) {
    throw new Error('temperature is 0')
  }

  if (!first_line) {
    // compare values with the previous line
    const delta_temperature: number = row.temperature - last_temperature
    const delta_target_temperature: number = row.target_temperature - last_target_temperature
    const delta_outside_temperature: number = row.outside_temperature - last_outside_temperature
    const delta_heat_index: number = row.heat_index - last_heat_index
    last_c_state = delta_temperature > 0 && row.state === 'on' ? 'heating' : 'drifting'
    last_c_direction = delta_temperature > 0 ? 'up' : 'down'


    console.debug('delta_temperature: ' + delta_temperature)
    console.debug('delta_target_temperature: ' + delta_target_temperature)
    console.debug('delta_outside_temperature: ' + delta_outside_temperature)
    console.debug('delta_heat_index: ' + delta_heat_index)

    console.debug('----------------------------------------')

    console.info('State & direction: ' + last_c_state + ' ' + last_c_direction)
    console.info('----------------------------------------')
  }

  // Always set first line to false as we are done running the function and update last values
  first_line = false
  updateLastValues(row)
}

function updateLastValues(row: ICsvRow) {
  last_date = row.date
  last_state = row.state
  last_target_state = row.target_state
  last_temperature = row.temperature
  last_target_temperature = row.target_temperature
  last_outside_temperature = row.outside_temperature
  last_heat_index = row.heat_index
}

interface ICsvRow {
  date: Date
  state: TState
  target_state: TState
  temperature: number
  target_temperature: number
  outside_temperature: number
  heat_index: number
}

type TState = 'on' | 'off'

type CState = 'heating' | 'drifting'
type CDirection = 'up' | 'down'
