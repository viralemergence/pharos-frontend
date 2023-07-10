import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'

const TableViewContainer = styled.div`
  padding: 0 30px;
  z-index: ${({ theme }) => theme.zIndexes.dataTable};
  flex: 1;
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
  style?: React.CSSProperties
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells are rendered immediately */
  enableVirtualization?: boolean
}

interface Row {
  [key: string]: string | number
}

interface PublishedRecordsResponse {
  publishedRecords: Row[]
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

interface LoadPublishedRecordsOptions {
  page: number
  appendResults?: boolean
}

const TableView = ({ style, enableVirtualization = true }: TableViewProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
  const pageRef = useRef(1)

  const loadPublishedRecords = async ({
    page,
    appendResults = false,
  }: LoadPublishedRecordsOptions) => {
    setLoading(true)
    console.log('loading published records for page', page)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/published-records?` +
        new URLSearchParams({
          page: page.toString(),
          pageSize: '50',
        })
    )

    if (response.ok) {
      const data = await response.json()

      if (dataIsPublishedRecordsResponse(data)) {
        setPublishedRecords(prev => [
          ...(appendResults ? prev : []),
          ...data.publishedRecords,
        ])
        setLoading(false)
      } else console.log('GET /published-records: malformed response')
    }
  }

  useEffect(() => {
    loadPublishedRecords({ page: 1 })
  }, [])

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
  }

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(publishedRecords?.[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber'].includes(key))
      .map(key => ({
        key: key,
        name: key,
        width: key.length * 7.5 + 15 + 'px',
        resizable: true,
      })),
  ]

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    console.log('handling scroll event')
    if (loading || !divIsAtBottom(event)) return
    pageRef.current += 1
    loadPublishedRecords({ page: pageRef.current, appendResults: true })
  }

  return (
    <TableViewContainer style={style}>
      <TableContaier>
        {!loading && publishedRecords?.length === 0 && (
          <NoRecordsFound role="status">
            No records have been published.
          </NoRecordsFound>
        )}
        {publishedRecords && publishedRecords.length > 1 && (
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
          />
        )}
        {loading && (
          <LoadingMessage>
            <LoadingSpinner /> Loading more rows
          </LoadingMessage>
        )}
      </TableContaier>
    </TableViewContainer>
  )
}

export default TableView
