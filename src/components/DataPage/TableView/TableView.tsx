import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Input from '../../ui/Input'
import InputLabel from '../../ui/InputLabel'

const dummyData = {
  publishedRecords: [
    {
      pharosID: 'prjhYdBAyzZkM-setrYHn1bUq9e-recJEgdeMnq20',
      rowNumber: 1,
      'Project name': 'test',
      Authors: 'Raphael Krut-Landau',
      'Collection date': '2020-01-01',
      Latitude: 51.605671213229094,
      Longitude: -0.1836275557121708,
      'Sample ID': '1',
      'Animal ID': '01',
      'Host species': 'Vicugna pacos',
      'Host species NCBI tax ID': 0,
      'Collection method or tissue': null,
      'Detection method': null,
      'Primer sequence': null,
      'Primer citation': null,
      'Detection target': null,
      'Detection target NCBI tax ID': null,
      'Detection outcome': 'positive',
      'Detection measurement': null,
      'Detection measurement units': null,
      Pathogen: null,
      'Pathogen NCBI tax ID': null,
      'GenBank accession': null,
      'Detection comments': null,
      'Organism sex': null,
      'Dead or alive': null,
      'Health notes': null,
      'Life stage': null,
      Age: null,
      Mass: null,
      Length: null,
      'Spatial uncertainty': null,
    },
  ],
}

import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'

// TODO: Fix, should be 432px, with the textfields 350px wide. I don't
// understand why it needs to be set so wide to achieve that textfield width.
const drawerWidth = "750";

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
const FilterDrawer = styled.div`
  padding: 34px 40px;
  width: ${drawerWidth}px;
  flex: 1;
  background-color: rgba(51, 51, 51, 0.5);
  color: #fff;
`
const DrawerHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
`
const FilterContainer = styled.div`
  margin-top: 20px;
`
const TableContaier = styled.div`
  position: relative;
  width: calc( 100vw - ${drawerWidth}px );
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
}

function dataIsPublishedRecordsResponse(
  data: unknown
): data is PublishedRecordsResponse {
  if (!data || typeof data !== 'object') {
    console.log(1)
    return false
  }
  if (!('publishedRecords' in data)) {
    console.log(2)
    return false
  }

  if (!Array.isArray(data.publishedRecords)) {
    console.log(3)
    return false
  }
  if (!data.publishedRecords.every(row => typeof row === 'object')) {
    console.log(4)
    return false
  }
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

  console.log('publishedRecords', publishedRecords)

  const loadPublishedRecords = async (page: number) => {
    setLoading(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/published-records?` +
        new URLSearchParams({
          // add filters here
          page: page.toString(),
          pageSize: '50',
        })
    )

    if (response.ok) {
      let data = await response.json()

      // temporary measure
      if (!data?.publishedRecords?.length) data = dummyData

      // TODO: Discuss with Ryan: why append and not overwrite? I'm seeing
      // multiple copies of the same data when I refresh.
      if (dataIsPublishedRecordsResponse(data)) {
        setPublishedRecords(prev =>
          prev ? [...prev, ...data.publishedRecords] : data.publishedRecords
        )
        setLoading(true)
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

  // temporary
  if (style.display === 'block') style.display = 'flex'

  const SearchIcon = () => (
    <div
      style={{
        position: 'absolute',
        right: '10px',
        width: '18px',
        top: '12px',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
          fill="white"
        />
      </svg>
    </div>
  )

  const FilterInputLabel = ({ htmlFor, children }) => (
    <InputLabel htmlFor={htmlFor} style={{ 'margin-bottom': '5px' }}>
      {children}
    </InputLabel>
  )
  const FilterInput = ({ id, children = null }) => (
    <div style={{ position: 'relative' }}>
      <Input
        id={id}
        style={{
          'background-color': 'transparent',
          'border-color': '#fff',
          'font-size': '14px',
          'font-family': 'Open Sans',
          'padding-right': '36px',
          'padding-left': '10px',
          // 'padding-top': '8px',
          // 'padding-bottom': '8px',
          'margin-top': '0px',
          color: '#fff',
        }}
      >
        {children}
      </Input>
      <SearchIcon />
    </div>
  )

  return (
    <TableViewContainer style={style}>
      <FilterDrawer>
        <DrawerHeader>Filters</DrawerHeader>

        <FilterContainer>
          <FilterInputLabel htmlFor="search-by-host-species">
            Search by host species
          </FilterInputLabel>
          <FilterInput id="search-by-host-species" />
        </FilterContainer>

        <FilterContainer>
          <FilterInputLabel htmlFor="search-by-pathogen">Search by pathogen</FilterInputLabel>
          <FilterInput id="search-by-pathogen" />
        </FilterContainer>

        <FilterContainer>
          <FilterInputLabel htmlFor="search-by-detection-target">Search by detection target</FilterInputLabel>
          <FilterInput id="search-by-detection-target" />
        </FilterContainer>
      </FilterDrawer>
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
