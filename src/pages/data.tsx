import React, { useCallback, useEffect, useState } from 'react'
import CMS from '@talus-analytics/library.airtable-cms'

import isNormalObject from 'utilities/isNormalObject'
import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import MapView, { MapProjection } from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View, isView } from 'components/DataPage/Toolbar/Toolbar'
import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import {
  MapOverlay,
  PageContainer,
  ScreenReaderOnly,
  ViewContainer,
  ViewMain,
} from 'components/DataPage/DisplayComponents'

export type Filter = {
  fieldId: string
  label: string
  type: 'text' | 'date'
  /** In the table (a.k.a. 'data grid') each column has a distinct id a.k.a.
   * 'key'. The dataGridKey of a Filter is the key of its associated column. */
  dataGridKey: string
  /** The different possible values for a filter - relevant for typeahead fields. */
  options: string[]
  /** A filter has been 'added to the panel' when the panel contains an input
   * (such as a date input or a typeahead) for setting the filter's values. */
  addedToPanel?: boolean
  /** To filter on a specific field, the user sets values for the filter. For
   * example, the host_species filter could receive the value "Bear". */
  values?: string[]
  /** If a filter has been 'applied', this means that it has been applied to
   * the list of records shown in the table, so that only records matching the
   * filter are shown in the table. For example, if the user sets host_species
   * to ['Bear'], then, once the table has been populated with bears and bears
   * only, the host_species filter's 'applied' property will be set to true. */
  applied?: boolean
  /* This number determines the order of the filters in the panel. */
  panelIndex: number
  /** The historically earliest collection date that appears among the
   * published records. Only date filters have this property. */
  earliestDateUsed?: string
  /** The historically latest, furthest-into-the-future collection date that
   * appears among the published records. Only date filters have this property.
   * */
  latestDateUsed?: string
  inputIsValid?: boolean
  tooltipOrientation?: 'bottom' | 'top'
}

const METADATA_URL = `${process.env.GATSBY_API_URL}/metadata-for-published-records`

const DataPage = ({
  enableTableVirtualization = true,
}: {
  /** Virtualization should be disabled in tests via this prop, so that all the
   * cells in the table are rendered immediately */
  enableTableVirtualization?: boolean
}): JSX.Element => {
  /* The 'view' is controlled by the three radio buttons */
  const [view, setView] = useState<View>(View.map)
  /* This variable controls the state of the map. If the user clicks the
   * 'Globe' radio button, then the 'Table' radio button, the view will be
   * 'table' and the map projection will be 'globe' */
  const [mapProjection, setMapProjection] =
    useState<MapProjection>('naturalEarth')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [filters, setFilters] = useState<Filter[]>([])

  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('')

  /** Update the view, and update the map projection view accordingly */
  const changeView = useCallback(
    (newView: View, shouldSetHash = true) => {
      if (shouldSetHash) window.location.hash = newView
      setView(newView)
      if (newView === View.globe && mapProjection !== 'globe') {
        setMapProjection('globe')
      }
      if (newView === View.map && mapProjection !== 'naturalEarth') {
        setMapProjection('naturalEarth')
      }
    },
    [mapProjection]
  )

  const fetchMetadata = useCallback(async () => {
    const response = await fetch(METADATA_URL)
    const data = await response.json()
    if (!isValidMetadataResponse(data)) {
      console.log(`GET ${METADATA_URL}: malformed response`)
      return
    }
    const filters = Object.entries(data.fields).map(([fieldId, filter]) => ({
      fieldId,
      type: filter.type || 'text',
      // When a filter is added to the panel, it will receive a new panelIndex,
      // indicating its order in the panel
      panelIndex: -1,
      ...filter,
    }))
    setFilters(filters)
  }, [setFilters])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (isView(hash)) changeView(hash, false)
  }, [changeView])

  useEffect(() => {
    fetchMetadata()
  }, [])

  useEffect(() => {
    if (isFilterPanelOpen) {
      setScreenReaderAnnouncement(
        prev =>
          'Filters panel opened' +
          // Alternate adding and removing a period to make the screen
          // reader read the announcement
          (prev.endsWith('.') ? '' : '.')
      )
    }
  }, [isFilterPanelOpen])

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
            filters={filters}
          />
          <ViewMain isFilterPanelOpen={isFilterPanelOpen}>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
            />
            <TableView
              filters={filters}
              setFilters={setFilters}
              isOpen={view === View.table}
              isFilterPanelOpen={isFilterPanelOpen}
              enableVirtualization={enableTableVirtualization}
            />
          </ViewMain>
        </ViewContainer>
        <ScreenReaderOnly aria-live="assertive">
          {screenReaderAnnouncement}
        </ScreenReaderOnly>
      </PageContainer>
    </Providers>
  )
}

interface MetadataResponse {
  fields: Record<string, FilterInMetadata>
}

interface FilterInMetadata {
  label: string
  type?: 'text' | 'date'
  dataGridKey: string
  options: string[]
}

const isValidFilterInMetadataResponse = (data: unknown): data is Filter => {
  if (!isNormalObject(data)) return false
  const { label, dataGridKey = '', type = 'text', options = [] } = data
  return (
    typeof label === 'string' &&
    typeof dataGridKey === 'string' &&
    typeof type === 'string' &&
    ['text', 'date'].includes(type) &&
    Array.isArray(options) &&
    options.every?.(option => typeof option === 'string')
  )
}

const isValidMetadataResponse = (data: unknown): data is MetadataResponse => {
  if (!isNormalObject(data)) return false
  const { fields } = data
  if (!isNormalObject(fields)) return false
  return Object.values(fields).every?.(field =>
    isValidFilterInMetadataResponse(field)
  )
}

export default DataPage
