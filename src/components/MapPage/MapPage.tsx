import React, { useRef, useEffect } from 'react'
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

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<null | mapboxgl.Map>(null)

  const [lng, setLng] = React.useState(0)
  const [lat, setLat] = React.useState(0)
  const [zoom, setZoom] = React.useState(1.7)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/ryan-talus/cl7uqzqjh002215oxyz136ijf/draft',
      // projection: { name: 'mercator' },
      projection: { name: 'naturalEarth' },
      maxZoom: 12,
      minZoom: 1.5,
      // bounds,
      center: [lng, lat],
      zoom: zoom,
    })

    map.current.on('click', event => {
      if (!map.current) return

      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ['pharosinitial-5yalgb'],
      })

      if (!features.length) {
        return
      }

      const feature = features[0] as unknown as {
        properties: {
          Latitude: number
          Longitude: number
          Host_species: string
          Parasite_species: string
        }
        geometry: { coordinates: mapboxgl.LngLatLike }
      }

      new mapboxgl.Popup({ offset: [0, -5] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3>Host Species: ${feature.properties.Host_species}</h3><p>Parasite Species: ${feature.properties.Parasite_species}</p>`
        )
        .addTo(map.current)
    })
  })

  return <MapContainer ref={mapContainer} />
}

export default MapPage
