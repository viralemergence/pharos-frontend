import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { Filter } from 'pages/data'
import debounce from 'lodash/debounce'
import type { LoadingState } from '../TableView'
import { Row } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import fetchRecords from 'components/DataPage/TableView/utilities/fetchRecords'

const PAGE_SIZE = 50

const loadDebounceDelay = 300

/** Load published records. This function prepares the query string and calls
 * fetchRecords() to retrieve records from the API. */
export const load = async ({
  records,
  replaceRecords = false,
  filters = [],
  setLoading,
  setFilters,
  latestRecordsRequestIdRef,
  setReachedLastPage,
  setRecords,
}: {
  records: Row[]
  replaceRecords?: boolean
  filters?: Filter[]
  setLoading: Dispatch<SetStateAction<LoadingState>>
  setFilters: Dispatch<SetStateAction<Filter[]>>
  latestRecordsRequestIdRef: MutableRefObject<number>
  setReachedLastPage: Dispatch<SetStateAction<boolean>>
  setRecords: Dispatch<SetStateAction<Row[]>>
}) => {
  setLoading(replaceRecords ? 'replacing' : 'appending')

  const queryStringParameters = new URLSearchParams()

  const fieldIdsOfAppliedFilters: string[] = []
  for (const filter of filters) {
    if (!filter.addedToPanel) continue
    if (!filter.values) continue
    let applyThisFilter = false
    if (filter.fieldId === 'collection_date') {
      const [startDate, endDate] = filter.values
      if (startDate && filter.validities?.[0] !== false) {
        queryStringParameters.append('collection_start_date', startDate)
        applyThisFilter = true
      }
      if (endDate && filter.validities?.[1] !== false) {
        queryStringParameters.append('collection_end_date', endDate)
        applyThisFilter = true
      }
    } else {
      const validValues = filter.values.filter(
        (value: string | undefined) =>
          value !== null && value !== undefined && value !== ''
      ) as string[]
      for (const value of validValues) {
        queryStringParameters.append(filter.fieldId, value)
        applyThisFilter = true
      }
    }
    if (applyThisFilter) fieldIdsOfAppliedFilters.push(filter.fieldId)
  }

  let pageToLoad
  if (replaceRecords) {
    pageToLoad = 1
  } else {
    // If we're not replacing the current set of records, load the next
    // page. For example, if there are 100 records, load page 3 (i.e., the
    // records numbered from 101 to 150)
    pageToLoad = countPages(records) + 1
  }
  queryStringParameters.append('page', pageToLoad.toString())
  queryStringParameters.append('pageSize', PAGE_SIZE.toString())

  const success = await fetchRecords({
    queryStringParameters,
    replaceRecords,
    latestRecordsRequestIdRef,
    setRecords,
    setReachedLastPage,
  })

  if (success) {
    setFilters(prev => {
      return prev.map(filter => ({
        ...filter,
        applied: fieldIdsOfAppliedFilters.includes(filter.fieldId),
      }))
    })
  } else {
    setLoading(false)
  }
}

export const loadDebounced = debounce(load, loadDebounceDelay, {
  leading: true,
  trailing: true,
})

export const countPages = (records: Row[]) =>
  Math.floor(records.length / PAGE_SIZE)
