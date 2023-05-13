
// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
export const FILTER_DELAY = 300

type Timeout = ReturnType<typeof setTimeout> | null
export type TimeoutsType = Record<string, Timeout>
type Filter = { description: string; dataGridKey: string; value: string }
export type FilterData = Map<string, Filter>

export const initialFilterData: FilterData = new Map([
  [
    'hostSpecies',
    {
      description: 'host species',
      dataGridKey: 'Host species',
      value: '',
    },
  ],
  [
    'pathogen',
    { description: 'pathogen', dataGridKey: 'Pathogen', value: '' },
  ],
  [
    'detectionTarget',
    {
      description: 'detection target',
      dataGridKey: 'Detection target',
      value: '',
    },
  ],
])
