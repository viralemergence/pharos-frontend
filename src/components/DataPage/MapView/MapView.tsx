import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import MapTableDrawer from './MapTableDrawer'

export type MapProjection = 'globe' | 'naturalEarth'

const MapContainer = styled.div<{ drawerOpen: boolean }>`
  width: 100vw;
  background-color: ${({ theme }) => theme.darkPurple};
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  ${({ drawerOpen }) =>
    drawerOpen &&
    `.mapboxgl-ctrl-bottom-left { display: none ! important; };
     .mapboxgl-ctrl-bottom-right { display: none ! important; };
    `}
`

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_API_KEY!

interface MapPageProps {
  style?: React.CSSProperties
  projection?: 'naturalEarth' | 'globe'
}

const MapViewDiv = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`

const MapView = ({ style, projection = 'naturalEarth' }: MapPageProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<null | mapboxgl.Map>(null)
  const [mapDrawerFilters, setMapDrawerFilters] = React.useState<{
    [key: string]: string[]
  }>({})
  const [clickLngLat, setClickLngLat] = React.useState<[number, number] | null>(
    null
  )

  const [drawerOpen, setDrawerOpen] = React.useState(false)

  // const [lng, setLng] = React.useState(0)
  // const [lat, setLat] = React.useState(0)
  // const [zoom, setZoom] = React.useState(1.7)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/ryan-talus/cl7uqzqjh002215oxyz136ijf/draft',
      style: 'mapbox://styles/ryan-talus/clgzr609k00c901qr07gy1303/draft',
      // projection: { name: 'naturalEarth' },
      projection: { name: projection },
      // maxZoom: 12,
      maxZoom: 15,
      minZoom: 1.5,
      // bounds,
      center: [0, 0],
      zoom: 1.7,
    })

    map.current.on('load', () => {
      if (!map.current) return

      map.current.addSource('pharos-points', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: `${process.env.GATSBY_API_URL}/map/0/0/0.pbf`,
      })

      map.current.addLayer({
        id: 'pharos-points-layer',
        type: 'circle',
        source: 'pharos-points',
        paint: {
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-color': 'hsl(170, 56%, 79%)',
          'circle-stroke-color': 'black',
        },
      })

      // map.current.addLayer({
      //   id: 'pharos-polygon-layer',
      //   type: 'fill',
      //   source: 'pharos-points',
      //   paint: {
      //     // 'fill-extrusion-color': 'hsl(170, 56%, 79%)',
      //     'fill-color': 'hsl(170, 56%, 79%)',
      //     'fill-opacity': ['/', ['get', 'count'], 155],
      //   },
      // })
    })

    map.current.on('click', event => {
      if (!map.current) return

      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ['pharos-points-layer'],
      })

      if (!features.length) {
        return
      }

      const pharosIDs = features
        .map(feature => feature?.properties?.pharos_id as string)
        .slice(0, 150)

      const feature = features[0] as unknown as {
        geometry: { coordinates: [number, number] }
        properties: {
          [key: string]: string
        }
      }

      setDrawerOpen(true)
      setMapDrawerFilters({ pharos_id: pharosIDs })
      setClickLngLat(feature.geometry.coordinates)

      new mapboxgl.Popup({ offset: [0, -5] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          Object.entries(feature.properties)
            .filter(([key, _]) => !['pharos_id', 'dataset_id'].includes(key))
            .map(
              ([key, value]) =>
                `<h3 style="margin-bottom: 0; margin-top: 0; font-size: 12px;">${(key =>
                  key[0].toUpperCase() + key.slice(1).replace(/_/g, ' '))(
                  key
                )}</h3>
             <p style="margin-top: 0; margin-bottom: 5px; font-size: 10px; line-height: 13px;">${value}</p>`
            )
            .join('')
        )
        .addTo(map.current)
    })
  })

  useEffect(() => {
    if (!map.current) return
    map.current.setProjection({ name: projection })
  }, [projection])

  return (
    <MapViewDiv style={style}>
      <MapContainer drawerOpen={drawerOpen} ref={mapContainer} />
      <MapTableDrawer
        {...{
          clickLngLat,
          drawerOpen,
          setDrawerOpen,
          mapDrawerFilters,
        }}
      />
    </MapViewDiv>
  )
}

export default MapView
