import React, { useState, useLayoutEffect } from 'react'
import styled from 'styled-components'

import CloseButton from 'components/ui/CloseButton'
import LoadingSpinner from '../TableView/LoadingSpinner'
import MapTableTitlePointIcon from './MapTableTitlePointIcon'
import PublishedRecordsDataGrid from 'components/PublicViews/PublishedRecordsDataGrid'

import usePlaceName from 'hooks/mapbox/usePlaceName'
import usePublishedRecordsByPharosIDs from 'hooks/publishedRecords/usePublishedRecordsByPharosIDs'

// slower transition when opening to make loading state feel faster
// faster transition when closing to make closing feel snappy
const ANIMATION_OPEN_DURATION = 250
const ANIMATION_CLOSE_DURATION = 150
const DRAWER_HEIGHT = 400

const Hider = styled.div<{ drawerOpen: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  bottom: 0;
  height: ${({ drawerOpen }) => (drawerOpen ? DRAWER_HEIGHT : 0)}px;
  transition: ${({ drawerOpen }) =>
    drawerOpen ? ANIMATION_OPEN_DURATION : ANIMATION_CLOSE_DURATION}ms;
`
const Container = styled.div<{ drawerOpen: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.25);
  border-top: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  height: ${DRAWER_HEIGHT}px;

  h1 {
    color: ${({ theme }) => theme.white};
    ${({ theme }) => theme.bigParagraphSemibold};
    display: flex;
    align-items: flex-start;
    margin: 0px;
    margin-top: 10px;
    height: 38px;
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
`

interface MapTableDrawerProps {
  clickedPharosIDs: string[]
  clickLngLat: [number, number] | null
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MapTableDrawer = ({
  clickedPharosIDs,
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

  const [publishedRecordsData, loadMore] = usePublishedRecordsByPharosIDs({
    pharosIDs: clickedPharosIDs,
    pageSize: 50,
  })

  const [renderDrawerContents, setRenderDrawerContents] = useState(drawerOpen)

  // render drawer contents before opening starts but after closing finishes
  useLayoutEffect(() => {
    let closeTimeout: ReturnType<typeof setTimeout>

    if (drawerOpen) setRenderDrawerContents(true)
    else
      closeTimeout = setTimeout(
        () => setRenderDrawerContents(false),
        ANIMATION_CLOSE_DURATION
      )

    return () => clearTimeout(closeTimeout)
  }, [drawerOpen])

  return (
    <Hider drawerOpen={drawerOpen}>
      {renderDrawerContents && (
        <Container drawerOpen={drawerOpen}>
          <Topbar>
            <h1>
              {<MapTableTitlePointIcon />}
              {placeNameLoading && (
                <LoadingSpinner
                  scale={0.6}
                  style={{ top: '-4px', left: '-8px' }}
                />
              )}
              {(placeNameLoading || placeNameError) && <>&nbsp;</>}
              {placeName && `${placeName} `}
            </h1>
            <CloseButton onClick={() => setDrawerOpen(!drawerOpen)} />
          </Topbar>
          <DrawerTableContainer>
            <PublishedRecordsDataGrid
              publishedRecordsData={publishedRecordsData}
              loadMore={loadMore}
            />
          </DrawerTableContainer>
        </Container>
      )}
    </Hider>
  )
}

export default MapTableDrawer
