import type { Operation } from './config.ts'

export class Exercise {
  public a: number
  public b: number
  public operation: Operation
  public result: number
  public requiresRegrouping: boolean

  constructor(a: number, b: number, operation: Operation, result: number, requiresRegrouping: boolean) {
    this.a = a
    this.b = b
    this.operation = operation
    this.result = result
    this.requiresRegrouping = requiresRegrouping
  }

  toString(hide_result: boolean = false): string {
    let max_string_length: number = (config.max - 1).toString().length

    if (config.operator.includes('subtract')) {
      max_string_length = config.max.toString().length
    }

    let a: string = e.a.toString().padStart(max_string_length, ' ')
    let b: string = e.b.toString().padStart(max_string_length, ' ')
    let result: string = hide_result ? ''.padStart(Math.min(config.max.toString().length, 3), '.') : e.result.toString().padStart(max_string_length, ' ')
    return `${a} ${getOperationSymbol(e.operation)} ${b} = ${result}`
  }

  static async generate(count: number,
                        maxResult: number,
                        operations: Operation[],
                        allowRegrouping: boolean): Promise<Exercise[]> {

  }
}
