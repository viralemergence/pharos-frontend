import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'
import MapPage from 'components/MapPage/MapPage'

const Map = (): JSX.Element => (
  <Providers>
    <CMS.SEO />
    <NavBar />
    <MapPage />
  </Providers>
)

export default Map
