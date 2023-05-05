import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'
import LoadingSpinner from './LoadingSpinner'
import SearchIcon from './SearchIcon'
import Input from '../../ui/Input'
import InputLabel from '../../ui/InputLabel'

// After the user types in a filter input, wait this many milliseconds before filtering.
const filterWait = 3000

// TODO: Fix, should be 432px, with the textfields 350px wide. I don't
// understand why it needs to be set so wide to achieve that textfield width.
const drawerWidth = '750'

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
const FilterInput = styled(Input)`
  background-color: transparent;
  border-color: #fff;
  font-size: 14px;
  font-family: Open Sans;
  padding-right: 36px;
  padding-left: 10px;
  margin-top: 0px;
  color: #fff;
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
  const [filters, setFilters] = useState<Record<string, string>>({})
  const page = useRef(1)

  const loadPublishedRecords = async (page: number, extraSearchParams = {}) => {
    setLoading(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/published-records?` +
        new URLSearchParams({
          page: page.toString(),
          pageSize: '50',
          ...extraSearchParams,
        })
    )

    if (response.ok) {
      const data = await response.json()

      if (dataIsPublishedRecordsResponse(data)) {
        setPublishedRecords(data.publishedRecords)
        const originalParams = data.event.query_string_parameters;
        const filters = {
          hostSpecies: originalParams.filter_by_host_species,
          pathogen: originalParams.filter_by_pathogen,
          detectionTarget: originalParams.filter_by_detection_target,
        };
        setFilters(filters);
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

  // temporary
  if (style.display === 'block') style.display = 'flex'

  type TimeoutsType = Record<string, ReturnType<typeof setTimeout>>
  const timeoutsForFilterInputs = useRef<TimeoutsType>({} as TimeoutsType)

  const handleFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) => {
    clearTimeout(timeoutsForFilterInputs.current[filterName])
    timeoutsForFilterInputs.current[filterName] = setTimeout(
      () => {
        loadPublishedRecords(1, { [filterName]: e.target.value })
      },
      filterWait
    )
  }

  type FilterNameAndChildren = {
    name: string
    children: React.ReactNode | null
  }
  const FilterInputLabel = ({ name, children }: FilterNameAndChildren) => (
    <InputLabel htmlFor={`filter-by-${name}`} style={{ marginBottom: '5px' }}>
      {children}
    </InputLabel>
  )

  const FilterInputWithIcon = ({ name }) => (
    <div style={{ position: 'relative' }}>
      <FilterInput
        id={`filter-by-${name}`}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFilterInput(e, name)
        }
        // value={filters[name] || ''}
      />
      <SearchIcon />
    </div>
  )

  return (
    <TableViewContainer style={style}>
      <FilterDrawer>
        <DrawerHeader>Filters</DrawerHeader>

        <FilterContainer>
          <FilterInputLabel name="hostSpecies">
            Search by host species
          </FilterInputLabel>
          <FilterInputWithIcon name="hostSpecies" />
        </FilterContainer>

        <FilterContainer>
          <FilterInputLabel name="pathogen">
            Search by pathogen
          </FilterInputLabel>
          <FilterInputWithIcon name="pathogen" />
        </FilterContainer>

        <FilterContainer>
          <FilterInputLabel name="detectionTarget">
            Search by detection target
          </FilterInputLabel>
          <FilterInputWithIcon name="detectionTarget" />
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
