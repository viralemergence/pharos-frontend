import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import DataGrid, { Column, DataGridHandle } from 'react-data-grid'

import LoadingSpinner from './LoadingSpinner'
import type { Filter } from 'pages/data'
import { load, loadDebounced, countPages } from './utilities/load'
import {
  formatters,
  Row,
} from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'

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
  --rdg-border-color: rgba(216, 218, 220, 0.3);
  --rdg-background-color: ${({ theme }) => theme.mutedPurple1};
  --rdg-header-background-color: ${({ theme }) => theme.mutedPurple3};
  --rdg-row-hover-background-color: ${({ theme }) => theme.mutedPurple2};

  ${({ theme }) => theme.gridText};
  font-size: 14px; // TODO: Change to 16px once cell padding issues are resolved

  color-scheme: only dark;
  border: 0;
  flex-grow: 1;
  block-size: 100px;
  background-color: var(--rdg-background-color);

  .rdg-cell {
    &[aria-colindex='1'] {
      text-align: center;
      background-color: var(--rdg-header-background-color);
    }
    &.in-filtered-column {
      background-color: ${({ theme }) => theme.tableContentHighlight};
    }
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

  // When records finish loading, remove the 'Loading...' indicator
  useEffect(() => {
    setLoading(false)

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
        {!loading && records.length === 0 && appliedFilters.length > 0 && (
          <NoRecordsFound role="status">
            No matching records found.
          </NoRecordsFound>
        )}
        {records.length > 0 && (
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
