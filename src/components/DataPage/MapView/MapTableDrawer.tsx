import React from 'react'
import styled from 'styled-components'

import FilteredPublishedRecordsDataGrid from 'components/PublicViews/FilteredPublishedRecordsDataGrid'

import usePlaceName from 'hooks/mapbox/usePlaceName'
import LoadingSpinner from '../TableView/LoadingSpinner'
import CloseButton from 'components/ui/CloseButton'
import MapTableTitlePointIcon from './MapTableTitlePointIcon'

const Container = styled.div<{ drawerOpen: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 400px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.25);
  border-top: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  padding: 10px 10px 0px 10px;

  transform: ${({ drawerOpen }) =>
    drawerOpen ? 'translateY(0)' : 'translateY(100%)'};

  // slower transition when opening to make loading state feel faster
  // faster transition when closing to make closing feel snappy
  transition: ${({ drawerOpen }) => (drawerOpen ? '250ms' : '150ms')};

  h1 {
    color: ${({ theme }) => theme.white};
    ${({ theme }) => theme.bigParagraphSemibold};
    display: flex;
    align-items: flex-start;
    margin: 0px;
  }
`
const DrawerTableContainer = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  height: 200px;
`
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 10px;
`

interface MapTableDrawerProps {
  mapDrawerFilters: { [key: string]: string[] }
  clickLngLat: [number, number] | null
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MapTableDrawer = ({
  mapDrawerFilters,
  clickLngLat,
  drawerOpen,
  setDrawerOpen,
}: MapTableDrawerProps) => {
  const {
    loading: placeNameLoading,
    error: placeNameError,
    placeName,
  } = usePlaceName({
    lngLat: clickLngLat,
  })

  return (
    <Container drawerOpen={drawerOpen}>
      <Topbar>
        {placeNameLoading && <LoadingSpinner scale={0.4} />}
        <h1>
          <MapTableTitlePointIcon />
          {(placeNameLoading || placeNameError) && <>&nbsp;</>}
          {placeName && `${placeName} `}
        </h1>
        <CloseButton onClick={() => setDrawerOpen(!drawerOpen)} />
      </Topbar>
      <DrawerTableContainer>
        {drawerOpen && (
          <FilteredPublishedRecordsDataGrid filters={mapDrawerFilters} />
        )}
      </DrawerTableContainer>
    </Container>
  )
}

export default MapTableDrawer
