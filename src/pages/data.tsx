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
  PageContainer,
  ViewContainer,
  ViewMain,
  MapOverlay,
  ScreenReaderOnly,
} from 'components/DataPage/DisplayComponents'

export type Filter = {
  fieldId: string
  label: string
  type: 'text' | 'date'
  dataGridKey: string
  options: string[]
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
    (newView: View, setHash = true) => {
      if (setHash) window.location.hash = newView
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
      ...filter,
    }))
    setFilters(filters)
  }, [setFilters])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (isView(hash)) changeView(hash, false)
    fetchMetadata()
  }, [changeView, fetchMetadata])

  const shouldBlurMap = view === View.table

  useEffect(() => {
    if (isFilterPanelOpen) {
      setScreenReaderAnnouncement(
        prev =>
          'Filters panel opened' +
          // Alternate adding and removing a period to ensure that the screen
          // reader reads the announcement
          (prev.endsWith('.') ? '' : '.')
      )
    }
  }, [isFilterPanelOpen])

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
          />
          <ViewMain isFilterPanelOpen={isFilterPanelOpen}>
            <FilterPanel
              filters={filters}
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
            />
            <TableView
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

const isValidFilterInMetadataResponsee = (data: unknown): data is Filter => {
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
    isValidFilterInMetadataResponsee(field)
  )
}

export default DataPage
