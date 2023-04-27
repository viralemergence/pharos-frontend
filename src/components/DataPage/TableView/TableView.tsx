import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import DataGrid, { Column } from 'react-data-grid'

const TableViewContainer = styled.div`
  background-color: ${({ theme }) => theme.lightBlack};
  width: 100%;
  height: calc(100vh - 87px);
  padding-top: 63px;
`

const TableContaier = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: 100%;
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
  return true
}

const rowKeyGetter = (row: Row) => row.pharosID

const TableView = ({ style }: TableViewProps) => {
  const [publishedRecords, setPublishedRecords] = useState<Row[] | null>(null)

  useEffect(() => {
    const loadPublishedRecords = async () => {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/published-records?` +
          new URLSearchParams({
            page: '1',
            pageSize: '50',
          })
      )

      if (response.ok) {
        const data = await response.json()

        if (dataIsPublishedRecordsResponse(data))
          setPublishedRecords(data.publishedRecords)
        else console.log('GET /published-records: malformed response')
      }
    }

    loadPublishedRecords()
  }, [])

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 35,
    width: 35,
  }

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(publishedRecords?.[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber'].includes(key))
      .map(key => ({
        key: key,
        name: key,
        maxWidth: 200,
      })),
  ]

  return (
    <TableViewContainer style={style}>
      <TableContaier>
        {publishedRecords && publishedRecords.length > 1 ? (
          // @ts-expect-error: I'm copying this from the docs,
          // but it doesn't look like their type definitions work
          <FillDatasetGrid
            className={'rdg-dark'}
            columns={columns}
            rows={publishedRecords}
            rowKeyGetter={rowKeyGetter}
          />
        ) : (
          <p style={{ color: 'white', margin: 0 }}>Loading records...</p>
        )}
      </TableContaier>
    </TableViewContainer>
  )
}

export default TableView
