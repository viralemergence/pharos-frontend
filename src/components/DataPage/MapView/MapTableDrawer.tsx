import React from 'react'
import styled from 'styled-components'
import { LngLat } from 'mapbox-gl'

import FilteredPublishedRecordsDataGrid from 'components/PublicViews/FilteredPublishedRecordsDataGrid'
import MintButton from 'components/ui/MintButton'

import usePlaceName from 'hooks/mapbox/usePlaceName'
import LoadingSpinner from '../TableView/LoadingSpinner'

const Container = styled.div<{ drawerOpen: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 400px;
  bottom: 0;
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  padding: 3px;
  z-index: 2;

  transform: ${({ drawerOpen }) =>
    drawerOpen ? 'translateY(0)' : 'translateY(100%)'};

  transition: 250ms ease;

  h1 {
    color: ${({ theme }) => theme.white};
    ${({ theme }) => theme.h1};
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
  margin-left: 30px;
`

interface MapTableDrawerProps {
  pharosIDs: string[]
  clickLngLat: LngLat | null
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MapTableDrawer = ({
  pharosIDs,
  clickLngLat,
  drawerOpen,
  setDrawerOpen,
}: MapTableDrawerProps) => {
  const {
    loading: placeNameLoading,
    error: placeNameError,
    placeName,
  } = usePlaceName({ lngLat: clickLngLat })

  return (
    <Container drawerOpen={drawerOpen}>
      <Topbar>
        <h1>
          <>
            {placeNameLoading && <LoadingSpinner />}
            {placeNameError && placeNameError.message}
            {placeName && `${placeName} `}
          </>
        </h1>
        <MintButton onClick={() => setDrawerOpen(!drawerOpen)}>X</MintButton>
      </Topbar>
      <DrawerTableContainer>
        {drawerOpen && (
          <FilteredPublishedRecordsDataGrid
            filters={{ pharos_id: pharosIDs }}
          />
        )}
      </DrawerTableContainer>
    </Container>
  )
}

export default MapTableDrawer
