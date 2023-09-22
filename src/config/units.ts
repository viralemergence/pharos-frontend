import convert from 'convert'

// general Units interface, making programmatic
// access easier with typescript... there's got to
// be a better way to do this with the as const obj
export interface Units {
  readonly [key: string]: {
    readonly [key: string]: {
      readonly label: string
      readonly shortLabel: string
      readonly toSIUnits: (val: number) => number
      readonly fromSIUnits: (val: number) => number
    }
  }
}

const units = {
  age: {
    seconds: {
      label: 'Seconds',
      shortLabel: 'sec',
      toSIUnits: (val: number) => val,
      fromSIUnits: (val: number) => val,
    },
    hours: {
      label: 'Hours',
      shortLabel: 'h',
      toSIUnits: (val: number) => convert(val, 'hours').to('seconds'),
      fromSIUnits: (val: number) => convert(val, 'seconds').to('hours'),
    },
    days: {
      label: 'Days',
      shortLabel: 'd',
      toSIUnits: (val: number) => convert(val, 'days').to('seconds'),
      fromSIUnits: (val: number) => convert(val, 'seconds').to('days'),
    },
    months: {
      label: 'Months',
      shortLabel: 'm',
      toSIUnits: (val: number) => convert(val, 'months').to('seconds'),
      fromSIUnits: (val: number) => convert(val, 'seconds').to('months'),
    },
    years: {
      label: 'Years',
      shortLabel: 'y',
      toSIUnits: (val: number) => convert(val, 'years').to('seconds'),
      fromSIUnits: (val: number) => convert(val, 'seconds').to('years'),
    },
  },
  mass: {
    kilograms: {
      label: 'Kilograms',
      shortLabel: 'kg',
      toSIUnits: (val: number) => val,
      fromSIUnits: (val: number) => val,
    },
    grams: {
      label: 'Grams',
      shortLabel: 'g',
      toSIUnits: (val: number) => convert(val, 'grams').to('kilograms'),
      fromSIUnits: (val: number) => convert(val, 'kilograms').to('grams'),
    },
    ounces: {
      label: 'Ounces',
      shortLabel: 'oz',
      toSIUnits: (val: number) => convert(val, 'ounces').to('kilograms'),
      fromSIUnits: (val: number) => convert(val, 'kilograms').to('ounces'),
    },
    pounds: {
      label: 'Pounds',
      shortLabel: 'lbs',
      toSIUnits: (val: number) => convert(val, 'pounds').to('kilograms'),
      fromSIUnits: (val: number) => convert(val, 'kilograms').to('pounds'),
    },
  },
  length: {
    meters: {
      label: 'Meters',
      shortLabel: 'm',
      toSIUnits: (val: number) => val,
      fromSIUnits: (val: number) => val,
    },
    centimeters: {
      label: 'Centimeters',
      shortLabel: 'cm',
      toSIUnits: (val: number) => convert(val, 'centimeters').to('meters'),
      fromSIUnits: (val: number) => convert(val, 'meters').to('centimeters'),
    },
    inches: {
      label: 'Inches',
      shortLabel: 'in',
      toSIUnits: (val: number) => convert(val, 'inches').to('meters'),
      fromSIUnits: (val: number) => convert(val, 'meters').to('inches'),
    },
    feet: {
      label: 'Feet',
      shortLabel: 'ft',
      toSIUnits: (val: number) => convert(val, 'feet').to('meters'),
      fromSIUnits: (val: number) => convert(val, 'meters').to('feet'),
    },
  },
} as const

export default units
