import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapView from 'components/DataPage/MapView/MapView'
import TableView from 'components/DataPage/TableView/TableView'
import DataToolbar, { View } from 'components/DataPage/Toolbar/Toolbar'

import FilterPanel from 'components/DataPage/FilterPanel/FilterPanel'

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
  z-index: ${({ theme }) => theme.zIndexes.dataMapOverlay};
`

const DataPage = (): JSX.Element => {
  const [view, setView] = useState<View>(View.map)
  const [mapProjection, setMapProjection] = useState<'globe' | 'naturalEarth'>(
    'naturalEarth'
  )
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

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
  }, [])

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
          />
          <MapView projection={mapProjection} />
          {view === View.table && <MapOverlay />}
          <ViewMain>
            <FilterPanel isFilterPanelOpen={isFilterPanelOpen} />
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

export default DataPage
