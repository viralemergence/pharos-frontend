import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from 'components/layout/Providers'

import NavBar from 'components/layout/NavBar/NavBar'

const MapPage = (): JSX.Element => (
  <Providers>
    <CMS.SEO />
    <NavBar />
    <h1>Map</h1>
  </Providers>
)

export default MapPage
