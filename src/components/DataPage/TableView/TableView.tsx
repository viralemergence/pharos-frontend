import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'

const TableViewContainer = styled.div`
  position: relative;
  background-color: rgba(51, 51, 51, 0.25);
  backdrop-filter: blur(20px);
  width: 100%;
  height: calc(100vh - 87px);
  padding-top: 63px;
  z-index: 3;
`
const TableContaier = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
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

interface TableViewProps {
  style?: React.CSSProperties
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

const TableView = ({ style }: TableViewProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [publishedRecords, setPublishedRecords] = useState<Row[] | null>(null)
  const page = useRef(1)

  const loadPublishedRecords = async (page: number) => {
    setLoading(true)
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
        setPublishedRecords(prev =>
          prev ? [...prev, ...data.publishedRecords] : data.publishedRecords
        )
        setLoading(false)
      } else console.log('GET /published-records: malformed response')
    }
  }

  useEffect(() => {
    loadPublishedRecords(1)
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
    if (loading || !divIsAtBottom(event)) return
    page.current += 1
    loadPublishedRecords(page.current)
  }

  return (
    <TableViewContainer style={style}>
      <TableContaier>
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
