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
  padding-bottom: 35px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding-bottom: unset;
  }
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
`

const DataPage = (): JSX.Element => {
  const [view, setView] = useState<View>(View.map)
  const [mapProjection, setMapProjection] = useState<'globe' | 'naturalEarth'>(
    'naturalEarth'
  )
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [fields, setFields] = useState<Record<string, Field>>({})

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

  return (
    <Providers>
      <CMS.SEO />
      <PageContainer>
        <NavBar />
        <ViewContainer>
          <MapView projection={mapProjection} />
          {view === View.table && <MapOverlay />}
          <DataToolbar
            view={view}
            changeView={changeView}
            isFilterPanelOpen={isFilterPanelOpen}
            setIsFilterPanelOpen={setIsFilterPanelOpen}
          />
          <ViewMain>
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

export default DataPage
