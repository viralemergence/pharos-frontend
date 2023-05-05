import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'
import FilterDrawer from './FilterDrawer'

// TODO: Fix, should be 432px, with the textfields 350px wide. I don't
// understand why it needs to be set so wide to achieve that textfield width.
const drawerWidth = '750'

export type TableViewOptions = {
  append: boolean
  extraSearchParams?: Record<string, string>
}

const TableViewContainer = styled.div`
  position: relative;
  background-color: rgba(51, 51, 51, 0.25);
  backdrop-filter: blur(20px);
  width: 100%;
  height: calc(100vh - 87px);
  z-index: 3;
  display: flex;
  flex-flow: row nowrap;
`
const TableContaier = styled.div`
  position: relative;
  width: calc(100vw - ${drawerWidth}px);
  height: 100%;
  padding: 15px;
  padding-top: 73px;
  flex-grow: 1;
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
  totalRowCount: number
}

function dataIsPublishedRecordsResponse(
  data: unknown
): data is PublishedRecordsResponse {
  if (!data || typeof data !== 'object') return false
  if (!('publishedRecords' in data)) return false
  if (!('totalRowCount' in data)) return false
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
  const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
  const [options, setOptions] = useState<TableViewOptions>({ append: true })
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const page = useRef(1)

  const loadPublishedRecords = async (page: number) => {
    console.log('loading published records')
    setLoading(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/published-records?` +
        new URLSearchParams({
          page: page.toString(),
          pageSize: '50',
          ...options.extraSearchParams,
        })
    )

    if (response.ok) {
      const data = await response.json()

      if (dataIsPublishedRecordsResponse(data)) {
        if (options.append) {
          setPublishedRecords(prev =>
            prev ? [...prev, ...data.publishedRecords] : data.publishedRecords
          )
        } else {
          setPublishedRecords(data.publishedRecords)
          setOptions(options => ({ ...options, append: true }))
        }
        console.log('data.totalRowCount', data.totalRowCount)
        setTotalRowCount(data.totalRowCount)
        setLoading(false)
      } else console.log('GET /published-records: malformed response')
    }
  }

  useEffect(() => {
    loadPublishedRecords(1)
  }, [JSON.stringify(options.extraSearchParams)])

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
    if (publishedRecords?.length === totalRowCount) return
    console.log('grabbing next page')
    page.current += 1
    loadPublishedRecords(page.current)
  }

  const EmptyRowsRenderer = () => {
    const areSearchParamsUsed = Object.keys(
      options.extraSearchParams ?? {}
    ).length > 0
    return (
      areSearchParamsUsed && (
        <div style={{ width: 600, padding: 10 }}>No matching rows</div>
      )
    )
  }

  // temporary
  style ||= {}
  if (style.display === 'block') style.display = 'flex'

  return (
    <TableViewContainer style={style}>
      <FilterDrawer setOptions={setOptions} />
      <TableContaier>
        {
          // @ts-expect-error: I'm copying this from the docs,
          // but it doesn't look like their type definitions work
        }
        <FillDatasetGrid
          className={'rdg-dark'}
          style={{ fontFamily: 'Inconsolata' }}
          columns={columns}
          rows={publishedRecords}
          onScroll={handleScroll}
          rowKeyGetter={rowKeyGetter}
          renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
        />
        {loading && (
          <LoadingMessage>
            <LoadingSpinner /> Loading
          </LoadingMessage>
        )}
      </TableContaier>
    </TableViewContainer>
  )
}

export default TableView
