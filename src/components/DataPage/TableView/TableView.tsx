import React, { useEffect } from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'
import type { Filter, Field } from '../FilterPanel/constants'
import './dataGrid.css'

const TableViewContainer = styled.div`
  padding: 0 30px;
  z-index: 11;
  flex: 1;
`
const TableContaier = styled.div`
  padding-bottom: 10px;
  overflow-x: hidden;
`
const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: 100%;
  border: 0;
  background-color: rgba(0, 0, 0, 0.7);
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
  appliedFilters: Filter[]
  loadPublishedRecords: (options?: { appendResults: boolean }) => void
  loading: boolean
  page: React.MutableRefObject<number>
  publishedRecords: Row[]
  reachedLastPage: boolean
  style?: React.CSSProperties
  fields: Record<string, Field>
}

export interface Row {
  [key: string]: string | number
}

const divIsAtBottom = ({ currentTarget }: React.UIEvent<HTMLDivElement>) =>
  currentTarget.scrollTop + 10 >=
  currentTarget.scrollHeight - currentTarget.clientHeight

const rowKeyGetter = (row: Row) => row.pharosID

const TableView = ({
  style = {},
  loading,
  page,
  publishedRecords,
  appliedFilters,
  loadPublishedRecords,
  reachedLastPage,
  fields,
}: TableViewProps) => {
  useEffect(() => {
    loadPublishedRecords()
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
    if (loading || reachedLastPage || !divIsAtBottom(event)) return
    page.current += 1
    loadPublishedRecords()
  }

  return (
    <TableViewContainer style={style}>
      <TableContaier>
        {!loading && publishedRecords?.length === 0 ? (
          <NoRecordsFound>
            {appliedFilters.length > 0
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
