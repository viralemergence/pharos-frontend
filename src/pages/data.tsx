import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import CMS from '@talus-analytics/library.airtable-cms'

import isNormalObject from 'utilities/isNormalObject'
import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import MapView, { MapProjection } from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View, isView } from 'components/DataPage/Toolbar/Toolbar'
import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'

export type Filter = {
  fieldId: string
  label: string
  type: 'text' | 'date'
  dataGridKey: string
  options: string[]
  addedToPanel?: boolean
  values?: string[]
  applied?: boolean
  /* Determines the order of the filters in the panel */
  panelIndex?: number
}

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

  /** Update the view, and update the map projection view accordingly */
  const changeView = useCallback((newView: View, setHash = true) => {
    if (setHash) window.location.hash = newView
    setView(newView)
    if (newView === View.globe) setMapProjection('globe')
    if (newView === View.map) setMapProjection('naturalEarth')
  }, [])

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

const isValidFieldInMetadataResponse = (data: unknown): data is Filter => {
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
    isValidFieldInMetadataResponse(field)
  )
}

export default DataPage
