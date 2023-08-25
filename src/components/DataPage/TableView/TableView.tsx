import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { DataGridHandle } from 'react-data-grid'
import { transparentize } from 'polished'
import LoadingSpinner from './LoadingSpinner'
import type { Filter } from 'pages/data'
import { load, loadDebounced, countPages } from './utilities/load'
import {
  DataGridStyled,
  Row,
  Sort,
  getColumns,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'

const TableViewContainer = styled.div<{
  isOpen: boolean
  isFilterPanelOpen: boolean
}>`
  display: ${({ isOpen }) => (isOpen ? 'grid' : 'none')};
  flex: 1;
  padding: 0 30px;
  pointer-events: auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 0 10px;
  }
`
const TableContainer = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-flow: column nowrap;
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
  background-color: ${({ theme }) => transparentize(0.5, theme.black)};
  border-top-left-radius: 5px;
  border-top: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-left: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  box-shadow: 0 0 10px ${({ theme }) => transparentize(0.5, theme.black)};
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100; // Above filter panel
`
const NoRecordsFoundMessage = styled.div`
  ${({ theme }) => theme.bigParagraphSemibold};
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => transparentize(0.6, theme.black)};
  border-radius: 5px;
  padding: 30px;
  display: flex;
  width: min(400px, 100%);
  margin: auto;
  height: 100px;
  justify-content: center;
  align-items: center;
`

interface TableViewProps {
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  isOpen?: boolean
  isFilterPanelOpen?: boolean
  sortableFields?: string[]
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells are rendered immediately */
  enableVirtualization?: boolean
}

const divIsScrolledToBottom = (div: HTMLDivElement) =>
  div.scrollTop + 10 >= div.scrollHeight - div.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

export type LoadingState = 'done' | 'appending' | 'replacing'

const filterHasRealValues = (filter: Filter) =>
  filter.valid &&
  filter.values.filter(value => value !== null && value !== undefined).length >
    0

const TableView = ({
  filters,
  setFilters,
  isOpen = true,
  isFilterPanelOpen = false,
  sortableFields = [],
  enableVirtualization = true,
}: TableViewProps) => {
  const [loading, setLoading] = useState<LoadingState>('replacing')
  const [records, setRecords] = useState<Row[]>([])
  const [reachedLastPage, setReachedLastPage] = useState(false)

  /** Filters that have been added to the panel */
  const addedFilters = filters.filter(f => f.addedToPanel)

  /** Filters that have been applied to the table */
  const appliedFilters = filters.filter(f => f.applied)

  /** Sorts applied to the table. For example, if the sorts are
   *  [
   *    [{dataGridKey: 'Project', status: SortStatus.selected}],
   *    [{dataGridKey: 'Collection date', status: SortStatus.reverse}],
   *  ]
   * then the table will be sorted primarily on project name (descending) and
   * secondarily on collection date (ascending).
   **/
  const [sorts, setSorts] = useState<Sort[]>([])

  /** This ref ensures that if the GET request that just finished is not the
   * latest GET request for published records, then the response is discarded.
   * (Why this matters: Suppose a user sets a value for a filter and then
   * changes it a second later. Then two GET requests will be sent. But suppose
   * that the first request takes a while and finishes after the second request
   * does. In this case, we should ignore the response to the first request,
   * since it is not the latest request.)  */
  const latestRecordsRequestIdRef = useRef(0)

  /** This ref will be set to a handle exposed by DataGrid, which allows access
   * to the underlying div */
  const dataGridHandle = useRef<DataGridHandle>(null)

  const loadOptions = {
    filters,
    sorts,
    latestRecordsRequestIdRef,
    records,
    setFilters,
    setLoading,
    setReachedLastPage,
    setRecords,
  }

  // This is used as a dependency in a useEffect hook below
  const filtersWithRealValuesAsString = JSON.stringify(
    addedFilters
      .filter(filterHasRealValues)
      .map(({ id, values }) => ({ id, values }))
  )
  const sortsAsString = JSON.stringify(sorts)

  // When the TableView mounts, when the filters' values have been changed, and
  // when the sorts have changed, load the first page of results
  useEffect(() => {
    loadDebounced({ ...loadOptions, replaceRecords: true })
  }, [filtersWithRealValuesAsString, sortsAsString])

  useEffect(() => {
    return () => {
      loadDebounced.cancel()
    }
  }, [])

  const filteredFields = addedFilters.reduce<string[]>(
    (keys, { applied, dataGridKey }) =>
      applied ? [...keys, dataGridKey] : keys,
    []
  )

  const columns = getColumns({
    records,
    sortableFields,
    sorts,
    setSorts,
    filteredFields,
  })

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (
      loading == 'done' &&
      !reachedLastPage &&
      divIsScrolledToBottom(event.currentTarget)
    )
      load({ ...loadOptions, replaceRecords: false })
  }

  const initialLoadHasOccurredRef = useRef(false)
  // When records finish loading, remove the 'Loading...' indicator
  useEffect(() => {
    if (initialLoadHasOccurredRef.current || records.length > 0) {
      setLoading('done')
    }

    if (records.length > 0) {
      initialLoadHasOccurredRef.current = true
    }

    // If the table just loaded the first page of records and the grid is
    // scrolled to the bottom, scroll to the top to avoid loading another page.
    // ".element" comes from react-data-grid.
    const dataGrid = dataGridHandle.current?.element
    if (
      dataGrid &&
      countPages(records) === 1 &&
      divIsScrolledToBottom(dataGrid)
    ) {
      dataGrid.scrollTop = 0
    }
  }, [records])

  return (
    <TableViewContainer isOpen={isOpen} isFilterPanelOpen={isFilterPanelOpen}>
      <TableContainer>
        {loading == 'done' &&
          records.length === 0 &&
          appliedFilters.length > 0 && (
            <NoRecordsFoundMessage role="status">
              No matching records found.
            </NoRecordsFoundMessage>
          )}
        {records.length > 0 && (
          // @ts-expect-error: I'm copying this from the docs, but it doesn't
          // look like their type definitions work
          <DataGridStyled
            columns={columns}
            rows={records}
            onScroll={handleScroll}
            rowKeyGetter={rowKeyGetter}
            enableVirtualization={enableVirtualization}
            role="grid"
            data-testid="datagrid"
            ref={dataGridHandle}
            isFilterPanelOpen={isFilterPanelOpen}
          />
        )}
        {loading !== 'done' && (
          <LoadingMessage>
            <LoadingSpinner /> Loading {loading === 'appending' && ' more rows'}
          </LoadingMessage>
        )}
      </TableContainer>
    </TableViewContainer>
  )
}

export default TableView
