import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import DataGrid, { Column, DataGridHandle } from 'react-data-grid'
import { transparentize } from 'polished'

import LoadingSpinner from './LoadingSpinner'
import type { Filter } from 'pages/data'
import { load, loadDebounced, countPages } from './utilities/load'
import {
  formatters,
  Row,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'

const TableViewContainer = styled.div<{
  isFilterPanelOpen: boolean
}>`
  pointer-events: auto;
  display: grid;
  padding: 0 30px;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 0 10px;
  }
`
const TableContainer = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-flow: column nowrap;
`
const FillDatasetGrid = styled(DataGrid)<{ isFilterPanelOpen: boolean }>`
  --rdg-border-color: ${({ theme }) => transparentize(0.7, theme.medGray)};
  --rdg-background-color: ${({ theme }) => theme.mutedPurple1};
  --rdg-header-background-color: ${({ theme }) => theme.mutedPurple3};
  --rdg-row-hover-background-color: ${({ theme }) => theme.mutedPurple2};

  ${({ theme }) => theme.gridText};

  color-scheme: only dark;
  border: 0;
  flex-grow: 1;
  block-size: 100px;
  background-color: var(--rdg-background-color);

  .rdg-cell {
    padding-inline: 10px;
    &[aria-colindex='1'] {
      text-align: center;
      background-color: var(--rdg-header-background-color);
    }
    &.in-filtered-column {
      background-color: ${({ theme }) => theme.tableContentHighlight};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    // On mobiles and tablets, hide the table when the filter panel is open
    ${({ isFilterPanelOpen }) =>
      isFilterPanelOpen ? 'display: none ! important;' : ''}
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
const NoRecordsFound = styled.div`
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
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells are rendered immediately */
  enableVirtualization?: boolean
}

const divIsScrolledToBottom = (div: HTMLDivElement) =>
  div.scrollTop + 10 >= div.scrollHeight - div.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

export type LoadingState = false | 'appending' | 'replacing'

const TableView = ({
  filters,
  setFilters,
  isOpen = true,
  isFilterPanelOpen = false,
  enableVirtualization = true,
}: TableViewProps) => {
  const [loading, setLoading] = useState<LoadingState>('replacing')
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
      .map(({ id, values }) => ({ id, values }))
  )

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
    latestRecordsRequestIdRef,
    records,
    setFilters,
    setLoading,
    setReachedLastPage,
    setRecords,
  }

  // Load the first page of results when TableView mounts or when the filters'
  // values have changed
  useEffect(() => {
    loadDebounced({ ...loadOptions, replaceRecords: true })
  }, [stringifiedFiltersWithValues])

  useEffect(() => {
    return () => {
      loadDebounced.cancel()
    }
  }, [])

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
        formatter: formatters[key],
      })),
  ]

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    if (
      !loading &&
      !reachedLastPage &&
      divIsScrolledToBottom(event.currentTarget)
    )
      load({ ...loadOptions, replaceRecords: false })
  }

  const initialLoadHasOccurredRef = useRef(false)
  // When records finish loading, remove the 'Loading...' indicator
  useEffect(() => {
    if (initialLoadHasOccurredRef.current || records.length > 0) {
      setLoading(false)
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
    <TableViewContainer isFilterPanelOpen={isFilterPanelOpen}>
      <TableContainer>
        {isOpen &&
          !loading &&
          records.length === 0 &&
          appliedFilters.length > 0 && (
            <NoRecordsFound role="status">
              No matching records found.
            </NoRecordsFound>
          )}
        {isOpen && records.length > 0 && (
          // @ts-expect-error: I'm copying this from the docs, but it doesn't
          // look like their type definitions work
          <FillDatasetGrid
            className={'rdg-dark'}
            columns={columns}
            rows={records}
            onScroll={handleScroll}
            rowKeyGetter={rowKeyGetter}
            enableVirtualization={enableVirtualization}
            role="grid"
            data-testid="datagrid"
            ref={dataGridHandle}
            rowHeight={41}
            isFilterPanelOpen={isFilterPanelOpen}
          />
        )}
        {loading && (
          <LoadingMessage>
            <LoadingSpinner /> Loading {loading === 'appending' && ' more rows'}
          </LoadingMessage>
        )}
      </TableContainer>
    </TableViewContainer>
  )
}

export default TableView
