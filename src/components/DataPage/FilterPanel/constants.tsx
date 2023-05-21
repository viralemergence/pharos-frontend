// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
export const FILTER_DELAY = 300

type Timeout = ReturnType<typeof setTimeout> | null
export type TimeoutsType = Record<string, Timeout>

export type Field = {
  label: string
  dataGridKey?: string
  type?: 'text' | 'date'
}
export type FilterValue = string | string[]
export type Filter = { fieldId: string; value: FilterValue }

export const fields: Record<string, Field> = {
  projectName: { label: 'Project name', dataGridKey: 'Project name' },
  researcher: { label: 'Researcher', dataGridKey: 'Researcher' },
  hostSpecies: { label: 'Host species', dataGridKey: 'Host species' },
  detectionTarget: {
    label: 'Detection target',
    dataGridKey: 'Detection target',
  },
  detectionOutcome: {
    label: 'Detection outcome',
    dataGridKey: 'Detection outcome',
  },
  pathogen: { label: 'Pathogen', dataGridKey: 'Pathogen' },
  collectionStartDate: {
    label: 'Collection start date',
    dataGridKey: 'Collection start date',
    type: 'date',
  },
  collectionEndDate: {
    label: 'Collection end date',
    dataGridKey: 'Collection end date',
    type: 'date',
  },
}
