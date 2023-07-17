import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView, { Row } from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
  loadDebounceDelay,
  Field,
  Filter,
  FilterValues,
} from 'components/DataPage/FilterPanel/constants'

const PAGE_SIZE = 50

const ViewContainer = styled.main`
  flex: 1;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
  main {
    display: flex;
    flex-flow: row nowrap;
    flex: 1;
  }
  background-color: ${({ theme }) => theme.darkPurple};
`

const ViewMain = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
`

const PageContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  width: 100%;
`
const MapOverlay = styled.div`
  backdrop-filter: blur(30px);
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndexes.dataMapOverlay};
`

const isTruthyObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && !!value

const isValidFieldInMetadataResponse = (data: unknown): data is Field => {
  if (!isTruthyObject(data)) return false
  const {
    label,
    dataGridKey = '',
    type = '',
    options = [],
  } = data as Partial<Field>
  if (typeof label !== 'string') return false
  if (typeof dataGridKey !== 'string') return false
  if (typeof type !== 'string') return false
  if (!options.every?.(option => typeof option === 'string')) return false
  return true
}

const isValidRecordsResponse = (
  data: unknown
): data is PublishedRecordsResponse => {
  if (!isTruthyObject(data)) return false
  const { publishedRecords, isLastPage } =
    data as Partial<PublishedRecordsResponse>
  if (!isTruthyObject(publishedRecords)) return false
  if (typeof isLastPage !== 'boolean') return false
  return publishedRecords.every(row => typeof row === 'object')
}

interface PublishedRecordsResponse {
  publishedRecords: Row[]
  isLastPage: boolean
}

interface Debouncing {
  on: boolean
  timeout: ReturnType<typeof setTimeout> | null
}

interface LoadPublishedRecordsOptions {
  appendResults?: boolean
  filters: Filter[]
  setLoading: Dispatch<SetStateAction<boolean>>
  setPublishedRecords: Dispatch<SetStateAction<Row[]>>
  setAppliedFilters: Dispatch<SetStateAction<Filter[]>>
  setReachedLastPage: Dispatch<SetStateAction<boolean>>
  debouncing: MutableRefObject<Debouncing>
}

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
  if (!isTruthyObject(data)) return false
  const { fields } = data as Partial<MetadataResponse>
  if (!isTruthyObject(fields)) return false
  return Object.values(fields as Record<string, unknown>).every?.(field =>
    isValidFieldInMetadataResponse(field)
  )
}

interface MetadataResponse {
  fields: Record<string, Field>
}

const DataPage = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [publishedRecords, setPublishedRecords] = useState<Row[]>([])
  const [reachedLastPage, setReachedLastPage] = useState(false)
  const [view, setView] = useState<View>(View.map)
  const [mapProjection, setMapProjection] = useState<'globe' | 'naturalEarth'>(
    'naturalEarth'
  )
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [fields, setFields] = useState<Record<string, Field>>({})
  const debouncing = useRef({ on: false, timeout: null })

  /** Filters that will be applied to the published records */
  const [filters, setFilters] = useState<Filter[]>([])

  /** Filters that have been successfully applied to the published
   * records. That is, these filters have been sent to the server, and it
   * responded with an appropriate subset of the records. This is used for
   * color-coding the filtered columns. */
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([])

  useEffect(() => {
    if (view === View.globe && mapProjection !== 'globe')
      setMapProjection('globe')
    if (view === View.map && mapProjection !== 'naturalEarth')
      setMapProjection('naturalEarth')
  }, [view])

  const changeView = (view: View) => {
    window.location.hash = view
    setView(view)
  }

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')

    function hashIsView(hash: string): hash is View {
      return Object.values(View).includes(hash)
    }

    if (hashIsView(hash)) {
      setView(hash)
    }

    const getMetadata = async () => {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/metadata-for-published-records`
      )
      const data = await response.json()
      if (!isValidMetadataResponse(data)) {
        console.error('GET /metadata-for-published-records: malformed response')
        return
      }
      setFields(data.fields)
    }
    getMetadata()
  }, [])

  const loadPublishedRecords = async ({
    appendResults = true,
    filters,
    setLoading,
    setPublishedRecords,
    setAppliedFilters,
    setReachedLastPage,
    debouncing,
  }: LoadPublishedRecordsOptions) => {
    // Switch debouncing on for 3 seconds
    const debounceTimeout = 3000
    debouncing.current.on = true
    if (debouncing.current.timeout) clearTimeout(debouncing.current.timeout)
    debouncing.current.timeout = setTimeout(() => {
      debouncing.current.on = false
    }, debounceTimeout)

    // For example, if there are 100 records, load page 3 (i.e., the records
    // numbered from 101 to 150)
    let page = Math.floor(publishedRecords.length / PAGE_SIZE) + 1

    if (!appendResults) page = 1
    setLoading(true)
    const params = new URLSearchParams()
    const filtersToApply: Filter[] = []
    for (const filter of filters) {
      const { fieldId, values } = filter
      values.forEach(value => {
        params.append(fieldId, value)
      })
      if (values.length > 0) filtersToApply.push(filter)
    }
    params.append('page', page.toString())
    params.append('pageSize', PAGE_SIZE.toString())
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/published-records?` + params
    )
    if (!response.ok) {
      console.log('GET /published-records: error')
      setLoading(false)
      return
    }
    const data = await response.json()
    if (!isValidRecordsResponse(data)) {
      console.log('GET /published-records: malformed response')
      setLoading(false)
      return
    }
    setPublishedRecords(prev => {
      // Ensure that no two records have the same id
      const existingPharosIds = new Set(prev.map(row => row.pharosID))
      const newRecords = data.publishedRecords.filter(
        record => !existingPharosIds.has(record.pharosID)
      )
      const publishedRecords = appendResults
        ? [...prev, ...newRecords]
        : newRecords
      // Sort records by row number, just in case pages come back from the
      // server in the wrong order
      publishedRecords.sort((a, b) => Number(a.rowNumber) - Number(b.rowNumber))
      return publishedRecords
    })

    setReachedLastPage(data.isLastPage)
    setTimeout(() => {
      setAppliedFilters(filtersToApply)
      setLoading(false)
    }, 0)
  }

  const loadPublishedRecordsDebounced = debounce(
    loadPublishedRecords,
    loadDebounceDelay
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')

    function hashIsView(hash: string): hash is View {
      return Object.values(View).includes(hash)
    }

    if (hashIsView(hash)) {
      setView(hash)
    }

    const getMetadata = async () => {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/metadata-for-published-records`
      )
      const data = await response.json()
      if (!isValidMetadataResponse(data)) {
        console.error('GET /metadata-for-published-records: malformed response')
        return
      }
      setFields(data.fields)
    }
    getMetadata()
  }, [])

  const loadFilteredRecords = (filters: Filter[], shouldDebounce = true) => {
    const options = {
      appendResults: false,
      filters,
      setLoading,
      setPublishedRecords,
      setAppliedFilters,
      setReachedLastPage,
      debouncing,
    }
    if (shouldDebounce && debouncing.current.on) {
      loadPublishedRecordsDebounced(options)
    } else {
      loadPublishedRecords(options)
    }
  }

  const updateFilter = (
    indexOfFilterToUpdate: number,
    newValues: FilterValues
  ) => {
    const newFilters = [...filters]
    newFilters[indexOfFilterToUpdate].values = newValues
    setFilters(newFilters)
    loadFilteredRecords(newFilters)
  }

  const clearFilters = () => {
    setFilters([])
    if (filters.some(({ values }) => values.length > 0)) {
      // Don't debounce when clearing filters
      loadFilteredRecords([], false)
    }
  }

  return (
    <Providers>
      <CMS.SEO />
      <PageContainer>
        <NavBar />
        <ViewContainer>
          <DataToolbar
            view={view}
            changeView={changeView}
            isFilterPanelOpen={isFilterPanelOpen}
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            appliedFilters={appliedFilters}
          />
          <MapView projection={mapProjection} />
          {view === View.table && <MapOverlay />}
          <ViewMain>
            <FilterPanel
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
              fields={fields}
              filters={filters}
              updateFilter={updateFilter}
              setFilters={setFilters}
              clearFilters={clearFilters}
            />
            <TableView
              isFilterPanelOpen={isFilterPanelOpen}
              isOpen={view === View.table}
              fields={fields}
              appliedFilters={appliedFilters}
              loadPublishedRecords={() => {
                loadFilteredRecords(filters, false)
                debouncing.current.on = false
              }}
              loading={loading}
              publishedRecords={publishedRecords}
              reachedLastPage={reachedLastPage}
            />
          </ViewMain>
        </ViewContainer>
      </PageContainer>
    </Providers>
  )
}

export default DataPage
