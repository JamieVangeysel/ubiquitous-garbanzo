export interface IConfig {
  name: string,
  count: number,
  max: number,
  operator: Operation[],
  allow_regrouping: boolean
}

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'

export const config: IConfig[] = [
  {
    name: 'Plus tot 10',
    count: 10,
    max: 10,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 20',
    count: 10,
    max: 20,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 100 (met brug)',
    count: 10,
    max: 100,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 100 (zonder brug)',
    count: 10,
    max: 100,
    operator: ['add'],
    allow_regrouping: false
  }, {
    name: 'Plus tot 1000',
    count: 10,
    max: 1000,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 10000',
    count: 10,
    max: 10000,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 100000',
    count: 10,
    max: 100000,
    operator: ['add'],
    allow_regrouping: true
  }, {
    name: 'Plus tot 1000000',
    count: 10,
    max: 1000000,
    operator: ['add'],
    allow_regrouping: true
  }
  //, {
  //   name: 'Min tot 10',
  //   count: 100,
  //   max: 10,
  //   operator: ['subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Min tot 20 (met brug)',
  //   count: 100,
  //   max: 20,
  //   operator: ['subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Min tot 20 (zonder brug)',
  //   count: 100,
  //   max: 20,
  //   operator: ['subtract'],
  //   allow_regrouping: false
  // }, {
  //   name: 'Min tot 100 (met brug)',
  //   count: 100,
  //   max: 100,
  //   operator: ['subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Min tot 100 (zonder brug)',
  //   count: 100,
  //   max: 100,
  //   operator: ['subtract'],
  //   allow_regrouping: false
  // }, {
  //   name: 'Min tot 1000',
  //   count: 100,
  //   max: 1000,
  //   operator: ['subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Plus en min tot 10',
  //   count: 100,
  //   max: 10,
  //   operator: ['add', 'subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Plus en min tot 20 (met brug)',
  //   count: 100,
  //   max: 20,
  //   operator: ['add', 'subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Plus en min tot 20 (zonder brug)',
  //   count: 100,
  //   max: 20,
  //   operator: ['add', 'subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Plus en min tot 100',
  //   count: 100,
  //   max: 100,
  //   operator: ['add', 'subtract'],
  //   allow_regrouping: true
  // }, {
  //   name: 'Plus en min tot 1000',
  //   count: 100,
  //   max: 1000,
  //   operator: ['add', 'subtract'],
  //   allow_regrouping: true
  // }
]
