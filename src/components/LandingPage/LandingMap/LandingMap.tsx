import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_API_KEY!

const MapContainer = styled.div`
  height: calc(100vh - 60px);
  width: 100%;
  background: #0b103b;
  filter: brightness(0.7);
`

const LandingMap = (): JSX.Element => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (map.current) return // initialize map only once
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/ryan-talus/cl7uqzqjh002215oxyz136ijf/draft',
      projection: { name: 'globe' },
      maxZoom: 1.8,
      minZoom: 1.8,
      center: [0, 0],
      zoom: 1.8,
    })

    const interactions = [
      'scrollZoom',
      'boxZoom',
      'dragRotate',
      'dragPan',
      'keyboard',
      'doubleClickZoom',
      'touchZoomRotate',
    ] as (keyof typeof map.current)[]

    for (const interaction of interactions) {
      // @ts-expect-error disable does not exist
      map.current[interaction].disable()
    }

    const spinGlobe = () => {
      if (!map.current) return

      // 360 degrees / seconds per rotation
      const degreesPerSecond = 360 / 120
      const center = map.current.getCenter()
      center.lng -= degreesPerSecond

      map.current.easeTo({
        center,
        duration: 1000,
        essential: true,
        easing: n => n,
      })

      setTimeout(() => spinGlobe(), 1000)
    }

    // map.current.on('moveend', () => spinGlobe())
    spinGlobe()
  })

  return <MapContainer ref={mapContainer} />
}

export default LandingMap
