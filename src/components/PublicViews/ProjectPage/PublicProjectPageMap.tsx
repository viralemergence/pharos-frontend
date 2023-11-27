import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Map as ReactMap, Layer, Source, MapRef } from 'react-map-gl'

const mapboxAccessToken = process.env.GATSBY_MAPBOX_API_KEY!

const MapContainer = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.mutedPurple1};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top: none;
  color: ${({ theme }) => theme.white};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  > h2 {
    color: ${({ theme }) => theme.medDarkGray};
  }

  &:before {
    z-index: 2;
    background-color: ${({ theme }) => theme.mint};
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  aspect-ratio: 6/2.5;
  padding: 0;
`

const pharosPointsLayerStyle = {
  id: 'pharos-points-layer',
  type: 'circle' as const,
  source: 'pharos-points',
  'source-layer': 'pharos-points',
  paint: {
    'circle-radius': 5,
    'circle-stroke-width': 1,
    'circle-color': 'hsl(170, 56%, 79%)',
    'circle-stroke-color': 'black',
  },
}

interface PublicProjectPageMapProps {
  projectID: string
  boundingBox: string | undefined
}

const PublicProjectPageMap = ({
  projectID,
  boundingBox,
}: PublicProjectPageMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<MapRef | null>()

  useEffect(() => {
    if (boundingBox && mapRef.current && mapLoaded) {
      const coords = boundingBox.replace(/[BOX\(\)]/g, '')
      const [top, bottom] = coords.split(',')
      const bbox = [
        top.split(' ').map(s => Number(s)),
        bottom.split(' ').map(s => Number(s)),
      ] as [[number, number], [number, number]]

      // single-point projects return a bounding box with
      // matching corners, which seems to break mapbox.
      if (bbox[0][0] === bbox[1][0]) {
        bbox[0][0] = bbox[0][0] * 0.999
        bbox[1][0] = bbox[1][0] * 1.001
      }
      if (bbox[0][1] === bbox[1][1]) {
        bbox[0][1] = bbox[0][1] * 0.999
        bbox[1][1] = bbox[1][1] * 1.001
      }

      mapRef.current.fitBounds(bbox, {
        padding: { top: 100, right: 50, bottom: 100, left: 50 },
      })
    }
  }, [boundingBox, mapRef.current, mapLoaded])

  return (
    <MapContainer>
      <ReactMap
        ref={ref => {
          mapRef.current = ref
        }}
        mapStyle="mapbox://styles/ryan-talus/clgzr609k00c901qr07gy1303/draft"
        mapboxAccessToken={mapboxAccessToken}
        projection={{ name: 'globe' }}
        onLoad={() => {
          setMapLoaded(true)
        }}
      >
        <Source
          id="pharos-points"
          type="vector"
          tiles={[
            `${process.env.GATSBY_MAPPING_API_URL}/map/{z}/{x}/{y}.pbf/?project_id=${projectID}`,
          ]}
          maxzoom={1}
        >
          <Layer {...pharosPointsLayerStyle} />
        </Source>
      </ReactMap>
    </MapContainer>
  )
}

export default PublicProjectPageMap
