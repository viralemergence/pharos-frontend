import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { Filter } from 'pages/data'
import debounce from 'lodash/debounce'
import type { LoadingState, Sort } from '../TableView'
import type { Row } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'
import fetchRecords from 'components/DataPage/TableView/utilities/fetchRecords'
import { SortStatus } from 'components/PublicViews/PublishedRecordsDataGrid/SortIcon'

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
  sorts,
}: {
  records: Row[]
  replaceRecords?: boolean
  filters?: Filter[]
  setLoading: Dispatch<SetStateAction<LoadingState>>
  setFilters: Dispatch<SetStateAction<Filter[]>>
  latestRecordsRequestIdRef: MutableRefObject<number>
  setReachedLastPage: Dispatch<SetStateAction<boolean>>
  setRecords: Dispatch<SetStateAction<Row[]>>
  sorts: Sort[]
}) => {
  setLoading(replaceRecords ? 'replacing' : 'appending')

  const filtersToApply = filters.filter(
    f =>
      f.addedToPanel &&
      f.valid &&
      f.values.filter((value: string) => value).length > 0
  )

  const queryStringParameters = getQueryStringParameters(
    filtersToApply,
    sorts,
    records,
    replaceRecords
  )

  const success = await fetchRecords({
    queryStringParameters,
    replaceRecords,
    latestRecordsRequestIdRef,
    setRecords,
    setReachedLastPage,
  })

  const idsOfAppliedFilters = filtersToApply.map(f => f.id)

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

export const getQueryStringParameters = (
  filters: Filter[],
  sorts: Sort[],
  records: Row[],
  replaceRecords: boolean
) => {
  const params = new URLSearchParams()

  // Add filters to the query string
  for (const filter of filters) {
    const validValues = filter.values.filter((value: string) => value)
    for (const value of validValues) {
      params.append(filter.id, value)
    }
  }

  // Add sorts to the query string
  for (const sort of sorts) {
    params.append('sort', (sort[1] === SortStatus.reverse ? '-' : '') + sort[0])
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
  params.append('page', pageToLoad.toString())
  params.append('pageSize', PAGE_SIZE.toString())
  return params
}
