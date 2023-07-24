import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'
import { Field } from 'components/DataPage/FilterPanel/constants'

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

const DataPage = (): JSX.Element => {
  const [view, setView] = useState<View>(View.map)
  const [mapProjection, setMapProjection] = useState<'globe' | 'naturalEarth'>(
    'naturalEarth'
  )
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [fields, setFields] = useState<Record<string, Field>>({})

  const updateView = (view: View) => {
    setView(view)
    if (view === View.globe && mapProjection !== 'globe')
      setMapProjection('globe')
    if (view === View.map && mapProjection !== 'naturalEarth')
      setMapProjection('naturalEarth')
  }

  const changeView = (view: View) => {
    window.location.hash = view
    updateView(view)
  }
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')

    function hashIsView(hash: string): hash is View {
      return Object.values(View).includes(hash)
    }

    if (hashIsView(hash)) {
      updateView(hash)
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
          />
          <ViewMain isFilterPanelOpen={isFilterPanelOpen}>
            <FilterPanel
              isFilterPanelOpen={isFilterPanelOpen}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
              fields={fields}
            />
            <TableView
              isFilterPanelOpen={isFilterPanelOpen}
              isOpen={view === View.table}
            />
          </ViewMain>
        </ViewContainer>
      </PageContainer>
    </Providers>
  )
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
