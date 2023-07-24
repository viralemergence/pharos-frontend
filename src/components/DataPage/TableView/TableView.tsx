import React, {
  useEffect,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from 'react'
import styled from 'styled-components'

import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'
import type { Filter, Field } from '../FilterPanel/constants'

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
const TableContaier = styled.div`
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
    background-color: ${({ theme }) => theme.lightBlack};
    &[aria-colindex='1'],
    &[role='columnheader'] {
      background-color: ${({ theme }) => theme.medBlack};
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
const NoRecordsFound = styled.div.attrs(({ role }) => ({ role }))`
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
  appliedFilters?: Filter[]
  loadNextPage?: (replaceResults?: boolean) => void
  loading?: boolean
  publishedRecords?: Row[]
  fields?: Record<string, Field>
  isOpen?: boolean
  isFilterPanelOpen?: boolean
  reachedLastPage?: boolean
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells are rendered immediately */
  enableVirtualization?: boolean
}

const divIsAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>) =>
  currentTarget.scrollTop + 10 >=
  currentTarget.scrollHeight - currentTarget.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

const TableView = ({
  loading = false,
  publishedRecords = [],
  appliedFilters = [],
  loadNextPage = () => null,
  fields = {},
  isOpen = true,
  isFilterPanelOpen = false,
  reachedLastPage = false,
  enableVirtualization = true,
}: TableViewProps) => {
  useEffect(() => {
    loadNextPage()
  }, [])

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
  }

  const dataGridKeysForFilteredColumns = appliedFilters
    .filter(({ values }) => values.length > 0)
    .map(({ fieldId }) => fields[fieldId]?.dataGridKey)

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
    if (loading || !divIsAtBottom(event) || reachedLastPage) return
    loadNextPage()
  }

  return (
    <TableViewContainer isOpen={isOpen} isFilterPanelOpen={isFilterPanelOpen}>
      <TableContaier>
        {!loading && publishedRecords?.length === 0 && (
          <NoRecordsFound role="status">
            {appliedFilters.length > 0
              ? 'No matching records found.'
              : 'No records have been published.'}
          </NoRecordsFound>
        )}
        {publishedRecords && publishedRecords?.length > 0 && (
          // @ts-expect-error: I'm copying this from the docs,
          // but it doesn't look like their type definitions work
          <FillDatasetGrid
            className={'rdg-dark'}
            style={{ fontFamily: 'Inconsolata' }}
            columns={columns}
            rows={publishedRecords}
            onScroll={handleScroll}
            rowKeyGetter={rowKeyGetter}
            enableVirtualization={enableVirtualization}
            role="grid"
            data-testid="datagrid"
          />
        )}
        {loading && (
          <LoadingMessage>
            <LoadingSpinner /> Loading{' '}
            {publishedRecords.length > 0 ? ' more rows' : ''}
          </LoadingMessage>
        )}
      </TableContaier>
    </TableViewContainer>
  )
}

export interface LoadOptions {
  replaceResults?: boolean
  filters: Filter[]
  currentlyLoadedRecords: Row[]
  debouncing: MutableRefObject<Debouncing>
}

export interface Debouncing {
  on: boolean
  timeout: ReturnType<typeof setTimeout> | null
}

export interface Row {
  [key: string]: string | number
}

// TODO: check that these interfaces need to exported
//
export default TableView
