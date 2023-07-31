import React from 'react'
import styled from 'styled-components'

import DataGrid, { Column, FormatterProps } from 'react-data-grid'

import usePublishedRecords, {
  PublishedRecordsLoadingState,
} from './DatasetPage/usePublishedRecords'
import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'
import { darken } from 'polished'
import { Link } from 'gatsby'

interface Row {
  [key: string]: string | number
}

interface FilteredPublishedRecordsDataGridProps {
  filters: {
    [key: string]: string[]
  }
  pageSize?: number
  hideColumns?: string[]
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
  background-color: ${({ theme }) => darken(0.05, theme.mutedPurple1)};
  border-top-left-radius: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.white};
`
const InitialLoadingMessage = styled(LoadingMessage)`
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.15);
  justify-content: center;
`
const ErrorMessageContainer = styled.div`
  color: ${({ theme }) => theme.white};
  padding: 15px 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: 100%;
  border: 0;

  --rdg-border-color: rgba(216, 218, 220, 0.3);
  --rdg-background-color: ${({ theme }) => theme.mutedPurple1};
  --rdg-header-background-color: ${({ theme }) => theme.mutedPurple3};
  --rdg-row-hover-background-color: ${({ theme }) => theme.mutedPurple2};
`
const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  padding: 0 8px;
`

const RowNumberContainer = styled(CellContainer)`
  background-color: ${({ theme }) => theme.mutedPurple3};
  display: flex;
  justify-content: center;
  align-items: center;
`

const RowNumber = ({ row: { rowNumber } }: FormatterProps<Row>) => (
  <RowNumberContainer>
    <span>{Number(rowNumber) + 1}</span>
  </RowNumberContainer>
)

const ProjectNameContainer = styled(CellContainer)`
  background-color: ${({ theme }) => theme.mutedPurple1};

  a {
    color: ${({ theme }) => theme.white};
  }
`
const ProjectName = ({ row }: FormatterProps<Row>) => {
  const projectName = row['Project name']
  const pharosID = row.pharosID
  return (
    <ProjectNameContainer>
      <Link to={`/projects/#/${pharosID.toString().split('-')[0]}`}>
        {projectName}
      </Link>
    </ProjectNameContainer>
  )
}

const rowKeyGetter = (row: Row) => row.pharosID

const formatters = {
  'Project name': ProjectName,
}

const FilteredPublishedRecordsDataGrid = ({
  filters,
  pageSize = 50,
  hideColumns = [],
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
    formatter: RowNumber,
  }

  console.log(publishedRecordsData)

  if (publishedRecordsData.status === PublishedRecordsLoadingState.ERROR) {
    return (
      <ErrorMessageContainer>
        <p>Failed to load published records</p>
        <pre>{publishedRecordsData.error.message}</pre>
      </ErrorMessageContainer>
    )
  }

  const columns: readonly Column<Row>[] = [
    rowNumberColumn,
    ...Object.keys(publishedRecordsData.data.publishedRecords[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber', ...hideColumns].includes(key))
      .map(key => ({
        key: key,
        name: key,
        width: key.length * 7.5 + 15 + 'px',
        resizable: true,
        ...(key in formatters ? { formatter: formatters[key] } : {}),
      })),
  ]

  console.log(columns)

  const handleScroll = ({ currentTarget }: React.UIEvent<HTMLDivElement>) => {
    if (
      currentTarget.scrollTop + 10 >=
      currentTarget.scrollHeight - currentTarget.clientHeight
    )
      loadMore()
  }

  return (
    <TableContainer>
      {publishedRecordsData.data.publishedRecords.length > 0 && (
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
        <InitialLoadingMessage>
          <LoadingSpinner /> Loading
        </InitialLoadingMessage>
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
