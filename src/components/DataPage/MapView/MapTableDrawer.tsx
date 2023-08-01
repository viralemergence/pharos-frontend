import FilteredPublishedRecordsDataGrid from 'components/PublicViews/FilteredPublishedRecordsDataGrid'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 400px;
  bottom: 0;
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  // padding: 30px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  padding: 3px;

  > h1 {
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

interface MapTableDrawerProps {
  pharosIDs: string[]
  clickLngLat: { x: number; y: number } | null
}

const MapTableDrawer = ({ pharosIDs, clickLngLat }: MapTableDrawerProps) => {
  return (
    <Container>
      {
        // <h1>{`${clickLngLat?.x}, ${clickLngLat?.y}`}</h1>
      }
      <DrawerTableContainer>
        <FilteredPublishedRecordsDataGrid filters={{ pharos_id: pharosIDs }} />
      </DrawerTableContainer>
    </Container>
  )
}

export default MapTableDrawer
