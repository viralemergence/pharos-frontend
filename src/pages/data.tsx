import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { isNormalObject } from 'utilities/data'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import MapView, { MapProjection } from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View, isView } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'

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
  const [viewAndMapProjection, setViewAndMapProjection] = useState<{
    /* The 'view' is controlled by the three radio buttons */
    view: View
    /* This variable controls the state of the map. If the user clicks the
     * 'Globe' radio button, then the 'Table' radio button, the view will be
     * 'table' and the map projection will be 'globe' */
    mapProjection: MapProjection
  }>({ view: View.map, mapProjection: 'naturalEarth' })
  const { view, mapProjection } = viewAndMapProjection
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  const [fields, setFields] = useState<Record<string, Field>>({})

  /** Filters that will be applied to the published records */
  const [filters, setFilters] = useState<Filter[]>([])

  /** Filters that have been successfully applied to the published
   * records. That is, these filters have been sent to the server, and it
   * responded with an appropriate subset of the records. This is used for
   * color-coding the filtered columns. */
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([])

  /** Update the view and, depending on what the view is, update the map
   * projection view */
  const changeView = useCallback((newView: View, setHash = true) => {
    if (setHash) window.location.hash = newView
    setViewAndMapProjection(prev => {
      let newMapProjection = prev.mapProjection
      if (newView === View.globe) newMapProjection = 'globe'
      if (newView === View.map) newMapProjection = 'naturalEarth'
      return { view: newView, mapProjection: newMapProjection }
    })
  }, [])

  const fetchMetadata = useCallback(async () => {
    const response = await fetch(METADATA_URL)
    const data = await response.json()
    if (!isValidMetadataResponse(data)) {
      console.log(`GET ${METADATA_URL}: malformed response`)
      return
    }
    setFields(data.fields)
  }, [setFields])

  const updateFilter: UpdateFilterFunction = (
    indexOfFilterToUpdate,
    newValues
  ) => {
    setFilters(prev =>
      prev.map(({ fieldId, values }, index) =>
        index == indexOfFilterToUpdate
          ? { fieldId, values: newValues }
          : { fieldId, values }
      )
    )
  }

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
              filters={filters}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
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
