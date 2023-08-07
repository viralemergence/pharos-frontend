import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import LoadingSpinner from './LoadingSpinner'
import type { Filter } from 'pages/data'
import isNormalObject from 'utilities/isNormalObject'

const loadDebounceDelay = 300

const PAGE_SIZE = 50
const RECORDS_URL = `${process.env.GATSBY_API_URL}/published-records`

const TableViewContainer = styled.div<{
  isOpen: boolean
  isFilterPanelOpen: boolean
}>`
  pointer-events: auto;
  display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
  padding: 0 30px;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 0 10px;
    // On mobiles and tablets, hide the table when the filter panel is open
    ${({ isFilterPanelOpen }) =>
      isFilterPanelOpen ? 'display: none ! important;' : ''}
  }
`
const TableContainer = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-flow: column nowrap;
`
const FillDatasetGrid = styled(DataGrid)`
  color-scheme: only dark;
  border: 0;
  flex-grow: 1;
  block-size: 100px;
  .rdg-cell {
    background-color: ${({ theme }) => theme.mutedPurple1};
    // TODO: Put these colors in the figma color file
    border-top-color: rgba(216, 218, 220, 0.3);
    border-bottom-color: rgba(216, 218, 220, 0.3);
    border-right-color: rgba(216, 218, 220, 0.08);
    border-left-color: rgba(216, 218, 220, 0.08);
    &[aria-colindex='1'],
    &[role='columnheader'] {
      background-color: ${({ theme }) => theme.mutedPurple3};
    }
    &[role='columnheader'] {
      border-bottom-color: ${({ theme }) => theme.medGray};
    }
    &[aria-colindex='1'] {
      text-align: center;
      border-right-color: rgba(216, 218, 220, 0.3);
    }
    &.in-filtered-column {
      background-color: ${({ theme }) => theme.tableContentHighlight};
    }
  }
  [aria-rowindex='1'] [aria-colindex='1'] {
    border-bottom-color: ${({ theme }) => theme.white10PercentOpacity};
  }
`
const LoadingMessage = styled.div`
  ${({ theme }) => theme.gridText}
  position: absolute;
  bottom: 0;
  right: 0;
  color: ${({ theme }) => theme.white};
  margin: 0;
  padding: 15px 30px;
  text-align: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  border-top-left-radius: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
`
const NoRecordsFound = styled.div`
  ${({ theme }) => theme.bigParagraphSemibold};
  margin: 30px auto;
  color: ${({ theme }) => theme.white};
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 30px;
  width: 90%;
  display: flex;
  justify-content: center;
`

interface TableViewProps {
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  isOpen?: boolean
  isFilterPanelOpen?: boolean
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells are rendered immediately */
  enableVirtualization?: boolean
}

const divIsAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>) =>
  currentTarget.scrollTop + 10 >=
  currentTarget.scrollHeight - currentTarget.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

const TableView = ({
  filters,
  setFilters,
  isOpen = true,
  isFilterPanelOpen = false,
  enableVirtualization = true,
}: TableViewProps) => {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<Row[]>([])
  const [reachedLastPage, setReachedLastPage] = useState(false)

  /** Filters that have been added to the panel */
  const addedFilters = filters.filter(f => f.addedToPanel)

  /** Filters that have been applied to the table */
  const appliedFilters = filters.filter(f => f.applied)

  // This is used as a dependency in a useEffect hook below
  const stringifiedFiltersWithValues = JSON.stringify(
    addedFilters
      .filter(f => f.values?.length)
      .map(({ fieldId, values }) => ({ fieldId, values }))
  )

  /** This ref ensures that if the GET request that just finished is not the
   * latest GET request for published records, then the response is discarded.
   * (Why this matters: Suppose a user sets a value for a filter and then
   * changes it a second later. Then two GET requests will be made. But suppose
   * that the first request takes a while and finishes after the second request
   * does. In this case, we should ignore the response to the first request,
   * since it is not the latest request.)  */
  const latestRecordsRequestId = useRef(0)

  /** Load published records. This function prepares the query string and calls
   * fetchRecords() to retrieve records from the API. */
  const load = useCallback(
    async (
      options: {
        replaceRecords?: boolean
        shouldDebounce?: boolean
        filters?: Filter[]
      } = {}
    ) => {
      // Set default values
      options.replaceRecords ??= false
      options.shouldDebounce ??= false
      options.filters ??= []

      // When clearing filters, don't debounce
      if (!addedFilters.length) options.shouldDebounce = false

      if (options.shouldDebounce) {
        // Use the debounced version of the load() function. The function
        // that the debouncer runs should not itself be debounced - this would
        // create an infinite loop. So we must set shouldDebounce to false.
        loadDebounced({ ...options, shouldDebounce: false })
        return
      }

      setLoading(true)

      const queryStringParameters = new URLSearchParams()

      const fieldIdsOfAppliedFilters: string[] = []
      for (const filter of options.filters) {
        if (!filter.addedToPanel) continue
        if (!filter.values) continue
        const validValues = filter.values.filter(
          (value: string) =>
            value !== null && value !== undefined && value !== ''
        )
        for (const value of validValues) {
          queryStringParameters.append(filter.fieldId, value)
        }
        if (validValues.length > 0)
          fieldIdsOfAppliedFilters.push(filter.fieldId)
      }

      let pageToLoad
      if (options.replaceRecords) {
        pageToLoad = 1
      } else {
        // If we're not replacing the current set of records, load the next
        // page. For example, if there are 100 records, load page 3 (i.e., the
        // records numbered from 101 to 150)
        pageToLoad = Math.floor(records.length / PAGE_SIZE) + 1
      }
      queryStringParameters.append('page', pageToLoad.toString())
      queryStringParameters.append('pageSize', PAGE_SIZE.toString())

      const success = await fetchRecords(
        queryStringParameters,
        options.replaceRecords ?? false
      )

      if (success) {
        setFilters(prev =>
          prev.map(filter => ({
            ...filter,
            applied: fieldIdsOfAppliedFilters.includes(filter.fieldId),
          }))
        )
      }

      setLoading(false)
    },
    []
  )

  const loadDebounced = debounce(load, loadDebounceDelay, {
    leading: true,
    trailing: true,
  })

  // Load the first page of results when TableView mounts and when the filters' values have changed
  useEffect(() => {
    load({
      shouldDebounce: true,
      replaceRecords: true,
      filters,
    })
  }, [stringifiedFiltersWithValues])

  /**
   * Fetch published records from the API
   * @returns {boolean} Whether the records were successfully fetched
   */
  const fetchRecords = useCallback(
    async (
      queryStringParameters: URLSearchParams,
      replaceRecords: boolean
    ): Promise<boolean> => {
      latestRecordsRequestId.current += 1
      const currentRecordsRequestId = latestRecordsRequestId.current

      const url = `${RECORDS_URL}?${queryStringParameters}`
      const response = await fetch(url)

      const isLatestRecordsRequest =
        currentRecordsRequestId === latestRecordsRequestId.current
      if (!isLatestRecordsRequest) return false

      if (!response.ok) {
        console.log(`GET ${url}: error`)
        return false
      }
      const data = await response.json()

      if (!isValidRecordsResponse(data)) {
        console.log(`GET ${url}: malformed response`)
        return false
      }
      setRecords(prev => {
        let records = data.publishedRecords
        if (!replaceRecords) {
          // Ensure that no two records have the same id
          const existingPharosIds = new Set(prev.map(row => row.pharosID))
          const newRecords = records.filter(
            record => !existingPharosIds.has(record.pharosID)
          )
          records = [...prev, ...newRecords]
        }
        // Sort records by row number, just in case pages come back from the
        // server in the wrong order
        records.sort((a, b) => Number(a.rowNumber) - Number(b.rowNumber))
        return records
      })
      setReachedLastPage(data.isLastPage)
      return true
    },
    []
  )

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
  }

  const keysOfFilteredColumns = addedFilters.reduce<string[]>(
    (keys, { applied, dataGridKey }) =>
      applied ? [...keys, dataGridKey] : keys,
    []
  )

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(records?.[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber'].includes(key))
      .map(key => ({
        key: key,
        name: key,
        width: key.length * 7.5 + 15 + 'px',
        resizable: true,
        cellClass: keysOfFilteredColumns.includes(key)
          ? 'in-filtered-column'
          : undefined,
      })),
  ]

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (!loading && !reachedLastPage && divIsAtBottom(event)) load({ filters })
  }

  return (
    <TableViewContainer isOpen={isOpen} isFilterPanelOpen={isFilterPanelOpen}>
      <TableContainer>
        {!loading && records.length === 0 && (
          <NoRecordsFound role="status">
            {appliedFilters.length
              ? 'No matching records found.'
              : 'No records have been published.'}
          </NoRecordsFound>
        )}
        {records.length > 0 && (
          // @ts-expect-error: I'm copying this from the docs, but it doesn't
          // look like their type definitions work
          <FillDatasetGrid
            className={'rdg-dark'}
            style={{ fontFamily: 'Inconsolata' }}
            columns={columns}
            rows={records}
            onScroll={handleScroll}
            rowKeyGetter={rowKeyGetter}
            enableVirtualization={enableVirtualization}
            role="grid"
            data-testid="datagrid"
          />
        )}
        {loading && (
          <LoadingMessage>
            <LoadingSpinner /> Loading {records.length > 0 && ' more rows'}
          </LoadingMessage>
        )}
      </TableContainer>
    </TableViewContainer>
  )
}

export interface Row {
  [key: string]: string | number
}

const isValidRecordsResponse = (data: unknown): data is RecordsResponse => {
  if (!isNormalObject(data)) return false
  const { publishedRecords, isLastPage } = data as Partial<RecordsResponse>
  if (!Array.isArray(publishedRecords)) return false
  if (typeof isLastPage !== 'boolean') return false
  return publishedRecords.every(
    row => typeof row === 'object' && typeof row.rowNumber === 'number'
  )
}

interface RecordsResponse {
  publishedRecords: Row[]
  isLastPage: boolean
}

export default TableView
