import React from 'react'
import styled from 'styled-components'

import DataGrid, { Column } from 'react-data-grid'

import usePublishedRecords, {
  PublishedRecordsLoadingState,
} from './DatasetPage/usePublishedRecords'
import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'

interface Row {
  [key: string]: string | number
}

interface FilteredPublishedRecordsDataGridProps {
  filters: {
    [key: string]: string[]
  }
  pageSize?: number
}

const TableContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const LoadingMessage = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
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
  color: ${({ theme }) => theme.white};
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: 100%;
`

const rowKeyGetter = (row: Row) => row.pharosID

const FilteredPublishedRecordsDataGrid = ({
  filters,
  pageSize = 50,
}: FilteredPublishedRecordsDataGridProps) => {
  const [publishedRecordsData, loadMore] = usePublishedRecords({
    filters,
    pageSize,
  })

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
  }

  if (publishedRecordsData.status === PublishedRecordsLoadingState.ERROR) {
    return (
      <div>
        <p>Failed to load published records</p>
        <pre>{publishedRecordsData.error.message}</pre>
      </div>
    )
  }

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(publishedRecordsData.data.publishedRecords[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber'].includes(key))
      .map(key => ({
        key: key,
        name: key,
        width: key.length * 7.5 + 15 + 'px',
        resizable: true,
      })),
  ]

  const handleScroll = ({ currentTarget }: React.UIEvent<HTMLDivElement>) => {
    if (
      currentTarget.scrollTop + 10 >=
      currentTarget.scrollHeight - currentTarget.clientHeight
    )
      loadMore()
  }

  return (
    <TableContainer>
      {publishedRecordsData.data.publishedRecords.length > 1 && (
        // @ts-expect-error: I'm copying this from the docs,
        // but it doesn't look like their type definitions work
        <FillDatasetGrid
          className={'rdg-dark'}
          style={{ fontFamily: 'Inconsolata' }}
          columns={columns}
          rows={publishedRecordsData.data.publishedRecords}
          onScroll={handleScroll}
          rowKeyGetter={rowKeyGetter}
        />
      )}
      {publishedRecordsData.status === PublishedRecordsLoadingState.LOADING && (
        <LoadingMessage>
          <LoadingSpinner /> Loading
        </LoadingMessage>
      )}
      {publishedRecordsData.status ===
        PublishedRecordsLoadingState.LOADING_MORE && (
        <LoadingMessage>
          <LoadingSpinner /> Loading more rows
        </LoadingMessage>
      )}
    </TableContainer>
  )
}

export default FilteredPublishedRecordsDataGrid
