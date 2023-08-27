import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import DataGrid, {
  Column,
  DataGridHandle,
  FormatterProps,
} from 'react-data-grid'

import { darken } from 'polished'

import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'

import RowNumber from './formatters/RowNumber'
import Researcher from './formatters/Researcher'
import ProjectName from './formatters/ProjectName'

import { PublishedRecordsLoadingState } from 'hooks/publishedRecords/fetchPublishedRecords'
import usePublishedRecords from 'hooks/publishedRecords/usePublishedRecords'

export interface PublishedRecordsResearcher {
  name: string
  researcherID: string
}

export interface Row {
  [key: string]: string | number | PublishedRecordsResearcher[]
}

export interface SummaryOfRecords {
  /** Has the user scrolled to the last page of records? */
  isLastPage: boolean
  /** The total number of records in the database */
  recordCount?: number
  /** THe number of records that match the current filters */
  matchingRecordCount?: number
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
  ${({ theme }) => theme.gridText};
  block-size: 100%;
  height: 100%;
  border: 0;

  --rdg-border-color: rgba(216, 218, 220, 0.3);
  --rdg-background-color: ${({ theme }) => theme.mutedPurple1};
  --rdg-header-background-color: ${({ theme }) => theme.mutedPurple3};
  --rdg-row-hover-background-color: ${({ theme }) => theme.mutedPurple2};
`

const rowKeyGetter = (row: Row) => row.pharosID

type DataGridFormatter = (params: FormatterProps<Row>) => JSX.Element

export const formatters: Record<string, DataGridFormatter> = {
  Project: ProjectName,
  Researcher: Researcher,
}

const defaultWidthOverride = {
  Project: 300,
  Researcher: 200,
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
