import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'

import DataGrid, {
  Column,
  DataGridHandle,
  FormatterProps,
  HeaderRendererProps,
} from 'react-data-grid'

import { darken, transparentize } from 'polished'

import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'

import RowNumber from './formatters/RowNumber'
import Researcher from './formatters/Researcher'
import ProjectName from './formatters/ProjectName'

import { PublishedRecordsLoadingState } from 'hooks/publishedRecords/fetchPublishedRecords'
import usePublishedRecords from 'hooks/publishedRecords/usePublishedRecords'

import ColumnHeader from 'components/PublicViews/PublishedRecordsDataGrid/ColumnHeader'
import type { SortStatus } from '../../PublicViews/PublishedRecordsDataGrid/SortIcon'

export interface PublishedRecordsResearcher {
  name: string
  researcherID: string
}

export interface Row {
  [key: string]: string | number | PublishedRecordsResearcher[]
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

export const DataGridStyled = styled(DataGrid).attrs(
  ({ rowHeight, className }) => ({
    className: className ?? 'rdg-dark',
    rowHeight: rowHeight ?? 41,
  })
)<{ isFilterPanelOpen?: boolean }>`
  --rdg-border-color: ${({ theme }) => transparentize(0.7, theme.medGray)};
  --rdg-background-color: ${({ theme }) => theme.mutedPurple1};
  --rdg-header-background-color: ${({ theme }) => theme.mutedPurple3};
  --rdg-row-hover-background-color: ${({ theme }) => theme.mutedPurple2};

  ${({ theme }) => theme.gridText};

  color-scheme: only dark;
  border: 0;
  flex-grow: 1;
  block-size: 100px;
  background-color: var(--rdg-background-color);

  .rdg-cell {
    padding-inline: 10px;
    &[aria-colindex='1'] {
      text-align: center;
      background-color: var(--rdg-header-background-color);
    }
    &.in-filtered-column {
      background-color: ${({ theme }) => theme.tableContentHighlight};
    }
    &[role='columnheader'] {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding-right: 0;
      &::after {
        width: 9px;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    // On mobiles and tablets, hide the table when the filter panel is open
    ${({ isFilterPanelOpen }) =>
      isFilterPanelOpen ? 'display: none ! important;' : ''}
  }
`

const TallDataGridStyled = styled(DataGridStyled)`
  height: 100%;
`

const rowKeyGetter = (row: Row) => row.pharosID

type DataGridFormatter = (params: FormatterProps<Row>) => JSX.Element

export const formatters: Record<string, DataGridFormatter> = {
  Project: ProjectName,
  Researcher: Researcher,
}

interface PublishedRecordsDataGridProps {
  publishedRecordsData: ReturnType<typeof usePublishedRecords>[0]
  loadMore: ReturnType<typeof usePublishedRecords>[1]
  hiddenFields?: string[]
  sortableFields?: string[]
  sorts?: Sort[]
  setSorts?: Dispatch<SetStateAction<Sort[]>>
  columnWidths?: Record<string, number>
}

const rowNumberColumn = {
  key: 'rowNumber',
  name: '',
  frozen: true,
  resizable: false,
  minWidth: 55,
  width: 55,
  formatter: RowNumber,
}

export type Sort = {
  dataGridKey: string
  status: SortStatus
}

const PublishedRecordsDataGrid = ({
  publishedRecordsData,
  loadMore,
  hiddenFields = [],
  sortableFields = [],
  sorts = [],
  setSorts = () => {},
  columnWidths = {},
}: PublishedRecordsDataGridProps) => {
  const gridRef = useRef<DataGridHandle>(null)

  // when we are loading a full new set of records, scroll to the top
  useEffect(() => {
    if (
      gridRef.current &&
      publishedRecordsData.status === PublishedRecordsLoadingState.LOADING
    )
      gridRef.current.scrollToRow(0)
  }, [publishedRecordsData.status])

  if (publishedRecordsData.status === PublishedRecordsLoadingState.ERROR) {
    return (
      <ErrorMessageContainer>
        <p>Failed to load published records</p>
        <pre>{publishedRecordsData.error.message}</pre>
      </ErrorMessageContainer>
    )
  }

  const columns = getColumns({
    records: publishedRecordsData.data.publishedRecords,
    sortableFields,
    sorts,
    setSorts,
    hiddenFields,
    columnWidths,
  })

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
        <TallDataGridStyled
          ref={gridRef}
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

export const getColumns = ({
  records,
  sortableFields = [],
  sorts = [],
  setSorts = () => null,
  filteredFields = [],
  hiddenFields = [],
  columnWidths = {},
}: {
  records: Row[]
  sortableFields: string[]
  sorts?: Sort[]
  setSorts?: Dispatch<SetStateAction<Sort[]>>
  filteredFields?: string[]
  hiddenFields?: string[]
  columnWidths?: Record<string, number>
}): readonly Column<Row>[] => {
  return [
    rowNumberColumn,
    ...Object.keys(records?.[0] ?? {})
      .filter(key => !['pharosID', 'rowNumber', ...hiddenFields].includes(key))
      .map(key => {
        const sortable = sortableFields.includes(key)
        return {
          key: key,
          name: key,
          headerRenderer: (_props: HeaderRendererProps<Row>) => (
            <ColumnHeader
              dataGridKey={key}
              sorts={sorts}
              setSorts={setSorts}
              sortable={sortable}
            />
          ),
          width:
            columnWidths[key] ?? key.length * 8 + (sortable ? 50 : 30) + 'px',
          resizable: true,
          cellClass: filteredFields.includes(key)
            ? 'in-filtered-column'
            : undefined,
          formatter: formatters[key],
        }
      }),
  ]
}

export default PublishedRecordsDataGrid
