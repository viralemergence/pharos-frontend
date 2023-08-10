import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import DataGrid, {
  Column,
  DataGridHandle,
  FormatterProps,
} from 'react-data-grid'

import usePublishedRecords from 'hooks/publishedRecords/usePublishedRecords'

import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'
import { darken } from 'polished'
import { Link } from 'gatsby'
import { PublishedRecordsLoadingState } from 'hooks/publishedRecords/fetchPublishedRecords'

interface PublishedRecordsAuthor {
  name: string
  researcherID: string
}

interface Row {
  [key: string]: string | number | PublishedRecordsAuthor[]
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
  background-color: rgba(76, 79, 98, 0.125);
  justify-content: center;
  border-radius: 0;
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
    <span>{Number(rowNumber)}</span>
  </RowNumberContainer>
)

const LinkContainer = styled(CellContainer)`
  a {
    color: ${({ theme }) => theme.white};

    &:hover {
      color: ${({ theme }) => theme.mint};
    }
  }
`
const ProjectName = ({ row }: FormatterProps<Row>) => {
  const projectName = row['Project name'] as string
  const pharosID = row.pharosID
  return (
    <LinkContainer>
      <Link to={`/projects/#/${pharosID.toString().split('-')[0]}`}>
        {projectName}
      </Link>
    </LinkContainer>
  )
}

const Author = ({ row }: FormatterProps<Row>) => (
  <LinkContainer>
    {(row.Author as PublishedRecordsAuthor[]).map(author => (
      <Link
        key={author.researcherID}
        to={`/researchers/?researcherID=${author.researcherID}`}
      >
        {author.name}
      </Link>
    ))}
  </LinkContainer>
)

const rowKeyGetter = (row: Row) => row.pharosID

const formatters = {
  'Project name': ProjectName,
  Author: Author,
}

const defaultWidthOverride = {
  'Project name': 300,
  Author: 200,
}

interface FilteredPublishedRecordsDataGridProps {
  publishedRecordsData: ReturnType<typeof usePublishedRecords>[0]
  loadMore: ReturnType<typeof usePublishedRecords>[1]
  hideColumns?: string[]
}

const PublishedRecordsDataGrid = ({
  publishedRecordsData,
  loadMore,
  hideColumns = [],
}: FilteredPublishedRecordsDataGridProps) => {
  const gridRef = useRef<DataGridHandle>(null)

  // when we are loading a full new set of records, scroll to the top
  useEffect(() => {
    if (
      gridRef.current &&
      publishedRecordsData.status === PublishedRecordsLoadingState.LOADING
    )
      gridRef.current.scrollToRow(0)
  }, [publishedRecordsData.status])

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    frozen: true,
    resizable: false,
    minWidth: 55,
    width: 55,
    formatter: RowNumber,
  }

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
        width:
          key in defaultWidthOverride
            ? defaultWidthOverride[key as keyof typeof defaultWidthOverride]
            : key.length * 7.5 + 15 + 'px',
        resizable: true,
        ...(key in formatters
          ? { formatter: formatters[key as keyof typeof formatters] }
          : {}),
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
      {publishedRecordsData.data.publishedRecords.length > 0 && (
        // @ts-expect-error: I'm copying this from the docs,
        // but it doesn't look like their type definitions work
        <FillDatasetGrid
          ref={gridRef}
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

export default PublishedRecordsDataGrid
