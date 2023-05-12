import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'
import FilterDrawer from './FilterDrawer'
import './dataGrid.css'

// After user finishes typing, how long to wait before applying a filter, in
// milliseconds
const FILTER_DELAY = 300

export interface TableViewOptions {
  appendResults: boolean
  filters?: Record<string, string>
}
type Timeout = ReturnType<typeof setTimeout> | null
type TimeoutsType = Record<string, Timeout>
type Filter = { description: string; dataGridKey: string; value: string }

const TableViewContainer = styled.div`
  position: relative;
  background-color: rgba(51, 51, 51, 0.25);
  backdrop-filter: blur(20px);
  width: 100%;
  height: calc(100vh - 87px);
  z-index: 3;
  display: grid;
  grid-template-columns: auto 1fr;
`
const TableContaier = styled.div`
  position: relative;
  height: 100%;
  padding: 15px;
  padding-top: 73px;
  overflow-x: hidden;
`
const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: 100%;
`
const LoadingMessage = styled.div`
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
  style?: React.CSSProperties
}

interface Row {
  [key: string]: string | number
}

interface PublishedRecordsResponse {
  publishedRecords: Row[]
  isLastPage: boolean
}

function dataIsPublishedRecordsResponse(
  data: unknown
): data is PublishedRecordsResponse {
  if (!data || typeof data !== 'object') return false
  if (!('publishedRecords' in data)) return false
  if (!Array.isArray(data.publishedRecords)) return false
  if (!data.publishedRecords.every(row => typeof row === 'object')) return false
  return true
}

const divIsAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>) =>
  currentTarget.scrollTop + 10 >=
  currentTarget.scrollHeight - currentTarget.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

export type FilterData = Map<string, Filter>

const TableView = ({ style = {} }: TableViewProps) => {
  const [loading, setLoading] = useState(true)
  const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
  const [reachedLastPage, setReachedLastPage] = useState(false)

  const initialFilterData = new Map([
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
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData)

  /** Ids of filters that have been successfully applied to the published
   * records. That is, these filter ids have been sent to the server, and it
   * responded with an appropriate subset of the records. This is used for
   * color-coding the filtered columns. */
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])

  const page = useRef(1)
  const filterTimeouts = useRef<TimeoutsType>({})

  const loadPublishedRecords = useCallback(
    async ({ appendResults = true } = {}) => {
      setLoading(true)
      const params: Record<string, string> = {
        page: page.current.toString(),
        pageSize: '50',
      }
      const pendingFilters = []
      for (const [filterId, { value }] of filterData) {
        if (!value) continue
        params[filterId] = value
        pendingFilters.push(filterId)
      }
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/published-records?` +
          new URLSearchParams(params)
      )

      if (!response.ok) {
        console.log('GET /published-records: error')
        setLoading(false)
        return
      }
      const data = await response.json()
      if (!dataIsPublishedRecordsResponse(data)) {
        console.log('GET /published-records: malformed response')
        setLoading(false)
        return
      }
      setPublishedRecords(previousRecords => [
        ...(appendResults ? previousRecords : []),
        ...data.publishedRecords,
      ])
      setReachedLastPage(data.isLastPage)
      setAppliedFilters(pendingFilters)
      setLoading(false)
    },
    [filterData, setPublishedRecords, setReachedLastPage, setLoading]
  )

  useEffect(() => {
    loadPublishedRecords()
  }, [loadPublishedRecords])

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
  }


  const dataGridKeysForFilteredColumns = Array.from(filterData)
    .filter(([filterId, _]) => appliedFilters.includes(filterId))
    .map(([_, { dataGridKey }]) => dataGridKey)

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(publishedRecords?.[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber'].includes(key))
      .map(key => ({
        key: key,
        name: key,
        width: key.length * 7.5 + 15 + 'px',
        resizable: true,
        cellClass: dataGridKeysForFilteredColumns.includes(key)
          ? 'in-filtered-column'
          : undefined,
      })),
  ]

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (loading || reachedLastPage || !divIsAtBottom(event)) return
    page.current += 1
    loadPublishedRecords()
  }

  const areFiltersUsed = Array.from(filterData).some(
    ([_filterId, { value }]) => value
  )

  const onFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterId = ''
  ) => {
    const newFilterValue = e.target.value
    setFilterData(filterData => {
      const filter = filterData.get(filterId)
      if (filter) filter.value = newFilterValue
      else console.error(`Filter not found: ${filterId}`)
      return filterData
    })
    clearTimeout(filterTimeouts.current?.[filterId] ?? undefined)
    const timeout = setTimeout(
      () => loadPublishedRecords({ appendResults: false }),
      FILTER_DELAY
    )

    // Store timeout so we can restart it if the user types again
    filterTimeouts.current[filterId] = timeout
  }

  return (
    <TableViewContainer style={style}>
      <FilterDrawer filterData={filterData} onFilterInput={onFilterInput} />
      <TableContaier>
        {!loading && publishedRecords?.length === 0 ? (
          <NoRecordsFound>
            {areFiltersUsed
              ? 'No matching records found'
              : 'No records published'}
          </NoRecordsFound>
        ) : (
          // @ts-expect-error: I'm copying this from the docs,
          // but it doesn't look like their type definitions work
          <FillDatasetGrid
            className={'rdg-dark'}
            style={{ fontFamily: 'Inconsolata' }}
            columns={columns}
            rows={publishedRecords}
            onScroll={handleScroll}
            rowKeyGetter={rowKeyGetter}
          />
        )}
        {loading && (
          <LoadingMessage>
            <LoadingSpinner />{' '}
            {page.current > 1 ? 'Loading more rows' : 'Loading'}
          </LoadingMessage>
        )}
      </TableContaier>
    </TableViewContainer>
  )
}

export default TableView
