// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
export const FILTER_DELAY = 300

type Timeout = ReturnType<typeof setTimeout> | null
export type TimeoutsType = Record<string, Timeout>
export type FilterData = Record<string, FieldValue>
export type FieldValue = string | string[]

export type Field = {
  id: string
  label: string
  dataGridKey?: string
}

export const fields: Map<string, Field> = new Map([
  ['hostSpecies', { label: 'Host species', dataGridKey: 'Host species' }],
  ['pathogen', { label: 'Pathogen', dataGridKey: 'Pathogen' }],
  [
    'detectionTarget',
    {
      label: 'Detection target',
      dataGridKey: 'Detection target',
    },
  ],
])
