import fs from 'node:fs'
import readline from 'node:readline'

console.debug = () => {
}
console.log = () => {
}

const csv_header = 'date,state,target-state,temperature,target-temperature,outside-temperature,heat-index'
const skip_lines = new Set([
  csv_header
  // '2025-08-05 20:07:33,0,0,0,20,0,-2.638888888888887'
])
const max_lines: number = -1
let lines_read: number = 0

const five_min_agg: { [key: number]: any[] } = {}
const quarter_hour_agg: { [key: number]: any[] } = {}
const hour_agg: { [key: number]: any[] } = {}

const rd = readline.createInterface({
  input: fs.createReadStream('./data-log-default.csv'),
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

  console.info('----------------------------------------')
  console.info('Finished neo-thermostat data analytics')
  console.info('----------------------------------------')
  console.debug('five_min_agg: ', five_min_agg)
  console.debug('quarter_hour_agg: ', quarter_hour_agg)
  console.debug('hour_agg: ', hour_agg)
  console.debug('----------------------------------------')

  console.debug('Writing to files...')
  fs.writeFileSync('./five_min_agg.json', JSON.stringify(five_min_agg))
  fs.writeFileSync('./quarter_hour_agg.json', JSON.stringify(quarter_hour_agg))
  fs.writeFileSync('./hour_agg.json', JSON.stringify(hour_agg))
  console.info('Done writing to files after ' + (performance.now() - start) + 'ms.')

  function analyze(agg: { [key: number]: any[] }, log: string) {
    fs.writeFileSync(`./${log}.log`, '')
    for (const key in agg) {
      let min_temp: number = agg[key]?.reduce((prev: number, cur: ICsvRow) => {
          return Math.min(prev, cur.temperature)
        },
        999999
      )
      let max_temp: number = agg[key]?.reduce((prev: number, cur: ICsvRow) => {
          return Math.max(prev, cur.temperature)
        },
        -999999
      )
      let delta_state = mode(agg[key]?.reduce((prev, curr) => {
        prev.push(curr.state)
        return prev
      }, []))
      let delta_c_direction = mode(agg[key]?.reduce((prev, curr) => {
        prev.push(curr.last_c_direction)
        return prev
      }, []))
      let delta_temperature: number = delta_c_direction === 'up' ? max_temp - min_temp : min_temp - max_temp

      console.debug('date: ' + new Date(+key))
      console.debug('min_temp: ' + min_temp)
      console.debug('max_temp: ' + max_temp)
      console.debug('delta_state: ' + delta_c_direction)
      console.debug('delta_temperature: ' + delta_temperature)

      let last_c_state = 'drifting'
      if (delta_state === 'on') {
        last_c_state = delta_temperature > 0 ? 'heating' : 'heating but drifting'
      }
      const last_c_direction = delta_temperature > 0 ? 'up' : 'down'

      fs.writeFileSync(`./${log}.log`, `${new Date(+key)}: ${last_c_state} ${last_c_direction} min(${min_temp}), max(${max_temp}) ${delta_temperature}\n`, { flag: 'a' })
    }
  }

  analyze(five_min_agg, 'five-min')
  analyze(quarter_hour_agg, 'quarter')
  analyze(hour_agg, 'hour')
})

function onLine(line: string) {
  try {
    if (line === csv_header) {
      console.debug('header found!')
      header_found = true
    } else if (!skip_lines.has(line)) {
      lines_read++
      if (max_lines > 0 && max_lines === lines_read) { // header_found
        rd.removeListener('line', onLine)
        setTimeout(() => rd.close(), 100)
      }
      try {
        const row = parseLine(line)
        if (row) {
          console.debug('----------------------------------------')
          console.debug('line: ' + line)
          console.debug('----------------------------------------')
          console.debug(row)
          console.debug('----------------------------------------')

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

  logStateChange(row)

  if (!first_line) {
    // compare values with the previous line
    const delta_temperature: number = row.temperature - last_temperature
    const delta_target_temperature: number = row.target_temperature - last_target_temperature
    const delta_outside_temperature: number = row.outside_temperature - last_outside_temperature
    const delta_heat_index: number = row.heat_index - last_heat_index
    if (row.state === 'on') {
      last_c_state = delta_temperature > 0 ? 'heating' : 'heating but drifting'
    } else {
      last_c_state = 'drifting'
    }
    last_c_direction = delta_temperature > 0 ? 'up' : 'down'

    // Aggregate data into 5 min 15 min and 1h
    let five_min_date = roundDownToAmountOfMinutes(5, row.date)
    let quarter_hour_date = roundDownToAmountOfMinutes(15, row.date)
    let hourly_date = roundDownToAmountOfMinutes(60, row.date)

    const five_min_key: number = five_min_date.getTime()
    five_min_agg[five_min_key] ??= []
    five_min_agg[five_min_key].push({
      ...row,
      delta_temperature,
      delta_target_temperature,
      delta_outside_temperature,
      delta_heat_index,
      last_c_state,
      last_c_direction
    })
    const quarter_hour_key: number = quarter_hour_date.getTime()
    quarter_hour_agg[quarter_hour_key] ??= []
    quarter_hour_agg[quarter_hour_key].push({
      ...row,
      delta_temperature,
      delta_target_temperature,
      delta_outside_temperature,
      delta_heat_index,
      last_c_state,
      last_c_direction
    })
    const hour_key: number = quarter_hour_date.getTime()
    hour_agg[hour_key] ??= []
    hour_agg[hour_key].push({
      ...row,
      delta_temperature,
      delta_target_temperature,
      delta_outside_temperature,
      delta_heat_index,
      last_c_state,
      last_c_direction
    })

    console.debug('----------------------------------------')
    console.debug('current date: ' + row.date)
    console.debug('five_min_date: ' + five_min_date)
    console.debug('quarter_hour_date: ' + quarter_hour_date)
    console.debug('hourly_date: ' + hourly_date)
    console.debug('----------------------------------------')

    console.debug('delta_temperature: ' + delta_temperature)
    console.debug('delta_target_temperature: ' + delta_target_temperature)
    console.debug('delta_outside_temperature: ' + delta_outside_temperature)
    console.debug('delta_heat_index: ' + delta_heat_index)

    console.debug('----------------------------------------')

    console.log('State & direction: ' + last_c_state + ' ' + last_c_direction)
    console.log('----------------------------------------')
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

let last_state_change: Date
let _last_state: string
let _last_target_temperature: number

fs.writeFileSync('./state.log', '')

function logStateChange(row: ICsvRow) {
  let message: string = `${row.date.toUTCString()}: `
  message += row.state === 'on' ? 'heating has started' : 'heating is off'

  if (!_last_state) {
    fs.writeFileSync('./state.log', message + '\n', { flag: 'a' })
    _last_state = row.state
    last_state_change = row.date
  } else if (_last_state !== row.state) {
    if (_last_state === 'on') {
      message = `${row.date.toUTCString()}: heating has stopped`
    }
    message += ' after ' + ((row.date.getTime() - last_state_change.getTime()) / 1000) + 's'
    fs.writeFileSync('./state.log', message + '\n', { flag: 'a' })
    _last_state = row.state
    last_state_change = row.date
  }
}

function roundDownToAmountOfMinutes(amount_of_minutes: number, date: Date): Date {
  let coff: number = 1000 * 60 * amount_of_minutes // milliseconds
  return new Date(Math.floor(date.getTime() / coff) * coff)
}

function mode(array: any[]) {
  if (array.length == 0) {
    return null
  }

  let modeMap: any = {}
  let maxEl = array[0], maxCount = 1
  for (const element of array) {
    const el = element
    if (modeMap[el] == null) {
      modeMap[el] = 1
    } else {
      modeMap[el]++
    }
    if (modeMap[el] > maxCount) {
      maxEl = el
      maxCount = modeMap[el]
    }
  }
  return maxEl
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

type CState = 'heating' | 'drifting' | 'heating but drifting'
type CDirection = 'up' | 'down'
