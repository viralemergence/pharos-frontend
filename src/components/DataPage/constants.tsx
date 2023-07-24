export type Field = {
  label: string
  dataGridKey?: string
  type?: 'text' | 'date'
  options?: string[]
  addedToPanel?: boolean
}
export type FilterValues = string[]
export type Filter = { fieldId: string; values: FilterValues }

export type UpdateFilterFunction = (
  filterIndex: number,
  newFilterValues: FilterValues
) => void
