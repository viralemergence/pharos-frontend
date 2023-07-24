import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView, { MapProjection } from 'components/DataPage/MapView/MapView'
import TableView, {
  Row,
  LoadOptions,
} from 'components/DataPage/TableView/TableView'
import DataToolbar, { View, isView } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
  loadDebounceDelay,
  Field,
  Filter,
  FilterValues,
} from 'components/DataPage/FilterPanel/constants'

const PAGE_SIZE = 50
const RECORDS_URL = `${process.env.GATSBY_API_URL}/published-records`
const METADATA_URL = `${process.env.GATSBY_API_URL}/metadata-for-published-records`

const ViewContainer = styled.main<{
  shouldBlurMap: boolean
  isFilterPanelOpen: boolean
}>`
  flex: 1;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    gap: 0px;
  }
  main {
    display: flex;
    flex-flow: row nowrap;
    flex: 1;
  }
  background-color: ${({ theme }) => theme.darkPurple};

  ${({ shouldBlurMap }) =>
    shouldBlurMap &&
    `.mapboxgl-control-container { display: none ! important; }`}
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    ${({ isFilterPanelOpen }) =>
      isFilterPanelOpen &&
      `.mapboxgl-control-container { display: none ! important; }`}
  }
`

const ViewMain = styled.div<{ isFilterPanelOpen: boolean }>`
  pointer-events: none;
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  padding-bottom: 35px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding-bottom: 10px;
  }
  ${({ isFilterPanelOpen, theme }) =>
    isFilterPanelOpen &&
    `
    @media (max-width: ${theme.breakpoints.tabletMaxWidth}) {
      padding-bottom: unset;
    }
  `}
`

const PageContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    // On mobile and tablet, accommodate the browser UI.
    height: 100svh;
  }
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
`

const isValidRecordsResponse = (data: unknown): data is RecordsResponse => {
  if (!isNormalObject(data)) return false
  const { publishedRecords, isLastPage } = data as Partial<RecordsResponse>
  if (!Array.isArray(publishedRecords)) return false
  if (typeof isLastPage !== 'boolean') return false
  return publishedRecords.every(
    row => typeof row === 'object' && typeof row.rowNumber === 'number'
  )
}

interface RecordsResponse {
  publishedRecords: Row[]
  isLastPage: boolean
}

const DataPage = ({
  enableTableVirtualization = true,
}: {
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells in the table are rendered immediately */
  enableTableVirtualization?: boolean
}): JSX.Element => {
  const [records, setRecords] = useState<Row[]>([])
  const [reachedLastPage, setReachedLastPage] = useState(false)

  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<{
    /* The 'view' is controlled by the three radio buttons */
    view: View
    /* This variable controls the state of the map. If the user clicks the
     * 'Globe' radio button, then the 'Table' radio button, the view will be
     * 'table' and the map projection will be 'globe' */
    mapProjection: MapProjection
  }>({ view: View.map, mapProjection: 'naturalEarth' })
  const { view, mapProjection } = mode
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  const [fields, setFields] = useState<Record<string, Field>>({})

  /** Filters that will be applied to the published records */
  const [filters, setFilters] = useState<Filter[]>([])
  const lastFilters = useRef<Filter[]>([])

  /** Filters that have been successfully applied to the published
   * records. That is, these filters have been sent to the server, and it
   * responded with an appropriate subset of the records. This is used for
   * color-coding the filtered columns. */
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([])

  /** Update the view and, depending on what the view is, update the map
   * projection view */
  const changeView = useCallback((newView: View, setHash = true) => {
    if (setHash) window.location.hash = newView
    setMode(prev => {
      let newMapProjection = prev.mapProjection
      if (newView === View.globe) newMapProjection = 'globe'
      if (newView === View.map) newMapProjection = 'naturalEarth'
      return { view: newView, mapProjection: newMapProjection }
    })
  }, [])

  /** Load published records. This function prepares the query string and calls
   * `fetchRecords` to retrieve records from the server. */
  const load = useCallback(
    async (options: LoadOptions = {}) => {
      const { replaceRecords = false } = options
      let { shouldDebounce = false } = options

      // When clearing filters, don't debounce
      if (!filters.length) shouldDebounce = false

      if (shouldDebounce) {
        // Use the debounced version of the load() function
        loadDebounced({
          ...options,
          // Prevents an infinite loop
          shouldDebounce: false,
        })
        return
      }

      setLoading(true)

      const pageToLoad = replaceRecords
        ? 1
        : // If we're not replacing the current set of records, load the next
          // page. For example, if there are 100 records, load page 3 (i.e., the
          // records numbered from 101 to 150)
          Math.floor(records.length / PAGE_SIZE) + 1

      const params = new URLSearchParams()
      const filtersToApply: Filter[] = []

      for (const filter of filters) {
        const { fieldId, values } = filter
        let shouldApplyFilter = false
        for (const value of values) {
          if (value) {
            params.append(fieldId, value)
            shouldApplyFilter = true
          }
        }
        // Filters with only blank values should not be applied
        if (shouldApplyFilter) filtersToApply.push(filter)
      }
      params.append('page', pageToLoad.toString())
      params.append('pageSize', PAGE_SIZE.toString())
      const success = await fetchRecords(params, replaceRecords)
      if (success) {
        // TODO: See if setTimeout is still needed
        setTimeout(() => {
          setAppliedFilters(filtersToApply)
        })
      }
      setLoading(false)
    },
    [filters, records]
  )

  const fetchRecords = useCallback(
    async (
      params: URLSearchParams,
      replaceRecords: boolean
    ): Promise<boolean> => {
      const url = `${RECORDS_URL}?${params}`
      const response = await fetch(url)
      if (!response.ok) {
        console.log(`GET ${url}: error`)
        return false
      }
      const data = await response.json()
      if (!isValidRecordsResponse(data)) {
        console.log(`GET ${url}: malformed response`)
        return false
      }
      setRecords(prev => {
        let records = data.publishedRecords
        if (!replaceRecords) {
          // Ensure that no two records have the same id
          const existingPharosIds = new Set(prev.map(row => row.pharosID))
          const newRecords = records.filter(
            record => !existingPharosIds.has(record.pharosID)
          )
          records = [...prev, ...newRecords]
        }
        // Sort records by row number, just in case pages come back from the
        // server in the wrong order
        records.sort((a, b) => Number(a.rowNumber) - Number(b.rowNumber))
        return records
      })
      setReachedLastPage(data.isLastPage)
      return true
    },
    []
  )

  const fetchMetadata = useCallback(async () => {
    const response = await fetch(METADATA_URL)
    const data = await response.json()
    if (!isValidMetadataResponse(data)) {
      console.log(`GET ${METADATA_URL}: malformed response`)
      return
    }
    setFields(data.fields)
  }, [setFields])

  const loadDebounced = debounce(load, loadDebounceDelay)

  const updateFilter = (
    indexOfFilterToUpdate: number,
    newValues: FilterValues
  ) => {
    setFilters(prev =>
      prev.map(({ fieldId, values }, index) =>
        index == indexOfFilterToUpdate
          ? { fieldId, values: newValues }
          : { fieldId, values }
      )
    )
  }

  // When the filters change, load the first page of results
  useEffect(() => {
    const lastFiltersWithValues = lastFilters.current?.filter(
      filter => filter.values.length > 0
    )
    const currentFiltersWithValues = filters.filter(
      filter => filter.values.length > 0
    )
    if (
      JSON.stringify(lastFiltersWithValues) ===
      JSON.stringify(currentFiltersWithValues)
    ) {
      return
    }
    load({
      shouldDebounce: true,
      replaceRecords: true,
    })
    lastFilters.current = filters
  }, [filters])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (isView(hash)) changeView(hash, false)
    fetchMetadata()
  }, [changeView, fetchMetadata])

  const shouldBlurMap = view === View.table

  return (
    <Providers>
      <CMS.SEO />
      <PageContainer>
        <NavBar />
        <ViewContainer
          shouldBlurMap={shouldBlurMap}
          isFilterPanelOpen={isFilterPanelOpen}
        >
          <MapView projection={mapProjection} />
          {shouldBlurMap && <MapOverlay />}
          <DataToolbar
            view={view}
            changeView={changeView}
            isFilterPanelOpen={isFilterPanelOpen}
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            appliedFilters={appliedFilters}
          />
          <ViewMain isFilterPanelOpen={isFilterPanelOpen}>
            <FilterPanel
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
              fields={fields}
              filters={filters}
              updateFilter={updateFilter}
              setFilters={setFilters}
            />
            <TableView
              isFilterPanelOpen={isFilterPanelOpen}
              isOpen={view === View.table}
              fields={fields}
              appliedFilters={appliedFilters}
              loadNextPage={load}
              reachedLastPage={reachedLastPage}
              loading={loading}
              publishedRecords={records}
              enableVirtualization={enableTableVirtualization}
            />
          </ViewMain>
        </ViewContainer>
      </PageContainer>
    </Providers>
  )
}

interface MetadataResponse {
  fields: Record<string, Field>
}

const isNormalObject = (value: unknown): value is Record<string, unknown> =>
  !!value &&
  typeof value === 'object' &&
  typeof value !== 'function' &&
  !Array.isArray(value)

const isValidFieldInMetadataResponse = (data: unknown): data is Field => {
  if (!isNormalObject(data)) return false
  const { label, dataGridKey = '', type = '', options = [] } = data
  return (
    typeof label === 'string' &&
    typeof dataGridKey === 'string' &&
    typeof type === 'string' &&
    Array.isArray(options) &&
    options.every?.(option => typeof option === 'string')
  )
}

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
  if (!isNormalObject(data)) return false
  const { fields } = data
  if (!isNormalObject(fields)) return false
  return Object.values(fields).every?.(field =>
    isValidFieldInMetadataResponse(field)
  )
}

interface MetadataResponse {
  fields: Record<string, Field>
}

export default DataPage
