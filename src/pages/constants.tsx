import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { Filter } from '../components/DataPage/FilterPanel/constants'

export interface LoadPublishedRecordsOptions {
  replaceResults?: boolean
  filters: Filter[]
  setLoading: Dispatch<SetStateAction<boolean>>
  setPublishedRecords: Dispatch<SetStateAction<Row[]>>
  setAppliedFilters: Dispatch<SetStateAction<Filter[]>>
  setReachedLastPage: Dispatch<SetStateAction<boolean>>
  debouncing: MutableRefObject<Debouncing>
}

export interface Debouncing {
  on: boolean
  timeout: ReturnType<typeof setTimeout> | null
}

export interface Row {
  [key: string]: string | number
}

export default {}
