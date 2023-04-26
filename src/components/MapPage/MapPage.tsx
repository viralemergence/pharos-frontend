import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

const MapContainer = styled.div`
  height: calc(100vh - 87px);
  width: 100vw;
  background: #455868;
  background: #0b103b;
`

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_API_KEY!

interface MapPageProps {
  style?: React.CSSProperties
}

const MapPage = ({ style }: MapPageProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<null | mapboxgl.Map>(null)

  const [mapProjection, setMapProjection] = useState<'naturalEarth' | 'globe'>(
    'naturalEarth'
  )

  // const [lng, setLng] = React.useState(0)
  // const [lat, setLat] = React.useState(0)
  // const [zoom, setZoom] = React.useState(1.7)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/ryan-talus/cl7uqzqjh002215oxyz136ijf/draft',
      // projection: { name: 'mercator' },
      projection: { name: mapProjection },
      maxZoom: 12,
      minZoom: 1.5,
      // bounds,
      center: [0, 0],
      zoom: 1.7,
    })

    map.current.on('click', event => {
      if (!map.current) return

      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ['pharosinitial-5yalgb'],
      })

      console.log(features.length)

      if (!features.length) {
        return
      }

      const feature = features[0] as unknown as {
        properties: {
          Latitude: number
          Longitude: number
          Host_species: string
          Parasite_species: string
          Dataset: string
        }
        geometry: { coordinates: mapboxgl.LngLatLike }
      }

      new mapboxgl.Popup({ offset: [0, -5] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3 style="margin-bottom: 0; margin-top: 0">Host Species</h3>
            <p style="margin-top: 0">${feature.properties.Host_species}</p>
            <h3 style="margin-bottom: 0">Parasite Species</h3>
            <p style="margin-top: 0">${feature.properties.Parasite_species}</p>
            <h3 style="margin-bottom: 0">Dataset</h3>
            <p style="margin-top: 0; margin-bottom: 0">${feature.properties.Dataset}</p>
            `
        )
        .addTo(map.current)
    })
  })

  useEffect(() => {
    if (!map.current) return
    map.current.setProjection({ name: mapProjection })
  }, [mapProjection])

  return (
    <div style={style}>
      <MapContainer ref={mapContainer} />
      <button
        style={{
          position: 'fixed',
          top: '100px',
          right: '10px',
          background: '#050A3733',
          border: '1px solid #050A37',
          borderRadius: '5px',
          color: 'white',
        }}
        onClick={() =>
          setMapProjection(prev => {
            console.log(prev === 'naturalEarth' ? 'globe' : 'naturalEarth')
            return prev === 'naturalEarth' ? 'globe' : 'naturalEarth'
          })
        }
      >
        {mapProjection === 'naturalEarth' ? 'View globe' : 'View flat'}
      </button>
    </div>
  )
}

export default MapPage
