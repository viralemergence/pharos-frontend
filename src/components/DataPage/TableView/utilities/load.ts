import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { Filter } from 'pages/data'
import debounce from 'lodash/debounce'
import type { LoadingState } from '../TableView'
import type {
  Row,
  SummaryOfRecords,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
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
  setRecords,
  setSummaryOfRecords,
}: {
  records: Row[]
  replaceRecords?: boolean
  filters?: Filter[]
  setLoading: Dispatch<SetStateAction<LoadingState>>
  setFilters: Dispatch<SetStateAction<Filter[]>>
  latestRecordsRequestIdRef: MutableRefObject<number>
  setRecords: Dispatch<SetStateAction<Row[]>>
  setSummaryOfRecords: Dispatch<SetStateAction<SummaryOfRecords>>
}) => {
  setLoading(replaceRecords ? 'replacing' : 'appending')

  const queryStringParameters = new URLSearchParams()

  const idsOfAppliedFilters: string[] = []
  for (const filter of filters) {
    if (!filter.addedToPanel) continue
    if (!filter.valid) continue
    const validValues = filter.values.filter((value: string) => value)
    for (const value of validValues) {
      queryStringParameters.append(filter.id, value)
    }
    if (validValues.length > 0) idsOfAppliedFilters.push(filter.id)
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
    setSummaryOfRecords,
  })

  if (success) {
    setFilters(prev => {
      return prev.map(filter => ({
        ...filter,
        applied: idsOfAppliedFilters.includes(filter.id),
      }))
    })
  } else {
    setLoading('done')
  }
}

export const loadDebounced = debounce(load, loadDebounceDelay, {
  leading: true,
  trailing: true,
})

export const countPages = (records: Row[]) =>
  Math.floor(records.length / PAGE_SIZE)
